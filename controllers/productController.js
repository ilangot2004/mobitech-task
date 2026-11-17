const { readData } = require("../utils/dataStore");

function getNeverOrderedProducts(req, res, next) {
  try {
    const data = readData();
    const orderedProductIds = new Set(
      data.order_items.map((item) => item.product_id)
    );
    const products = data.products.filter(
      (product) => !orderedProductIds.has(product.id)
    );
    return res.json(products);
  } catch (error) {
    return next(error);
  }
}

function isValidDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function getProductsOrderedInRange(req, res, next) {
  const { from, to } = req.query;
  if (!isValidDate(from) || !isValidDate(to) || from > to) {
    return res.status(400).json({
      error: "Valid from and to dates are required in YYYY-MM-DD format"
    });
  }

  try {
    const data = readData();
    const orderIds = new Set(
      data.orders
        .filter((order) => {
          const orderDate = order.created_at.slice(0, 10);
          return order.status !== "CANCELLED" && orderDate >= from && orderDate <= to;
        })
        .map((order) => order.id)
    );
    const productIds = new Set(
      data.order_items
        .filter((item) => orderIds.has(item.order_id))
        .map((item) => item.product_id)
    );

    return res.json(data.products.filter((product) => productIds.has(product.id)));
  } catch (error) {
    return next(error);
  }
}

module.exports = { getNeverOrderedProducts, getProductsOrderedInRange };
