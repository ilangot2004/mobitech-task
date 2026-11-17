const { readData, writeData } = require("../utils/dataStore");

function getOrdersForCustomer(req, res, next) {
  try {
    const customerId = Number(req.params.id);
    const orders = readData().orders
      .filter((order) => order.customer_id === customerId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return res.json(orders);
  } catch (error) {
    return next(error);
  }
}

function getOldPendingOrders(req, res, next) {
  try {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const orders = readData().orders.filter(
      (order) =>
        order.status === "PENDING" &&
        new Date(order.created_at).getTime() < cutoff
    );
    return res.json(orders);
  } catch (error) {
    return next(error);
  }
}

function getMostOrderedProduct(req, res, next) {
  try {
    const data = readData();
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentOrderIds = new Set(
      data.orders
        .filter(
          (order) =>
            order.status !== "CANCELLED" &&
            new Date(order.created_at).getTime() >= cutoff
        )
        .map((order) => order.id)
    );
    const orderCounts = new Map();

    for (const item of data.order_items) {
      if (recentOrderIds.has(item.order_id)) {
        orderCounts.set(
          item.product_id,
          (orderCounts.get(item.product_id) || 0) + 1
        );
      }
    }

    const winner = [...orderCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0] - b[0])[0];
    if (!winner) {
      return res.json(null);
    }

    const product = data.products.find((item) => item.id === winner[0]);
    return res.json({ ...product, order_count: winner[1] });
  } catch (error) {
    return next(error);
  }
}

function cancelOrder(req, res, next) {
  try {
    const data = readData();
    const order = data.orders.find((item) => item.id === Number(req.params.id));

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (order.status === "CANCELLED") {
      return res.status(409).json({ error: "Order already cancelled" });
    }

    const items = data.order_items.filter((item) => item.order_id === order.id);
    const stockUpdates = [];

    for (const item of items) {
      const product = data.products.find(
        (candidate) => candidate.id === item.product_id
      );
      if (!product) {
        return res.status(500).json({
          error: `Cannot restore stock: product ${item.product_id} was not found`
        });
      }
      stockUpdates.push({ product, quantity: item.quantity });
    }

    for (const update of stockUpdates) {
      update.product.stock += update.quantity;
    }
    order.status = "CANCELLED";
    writeData(data);

    return res.json(order);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getOrdersForCustomer,
  getOldPendingOrders,
  getMostOrderedProduct,
  cancelOrder
};
