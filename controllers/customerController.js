const { readData } = require("../utils/dataStore");

function getCustomersWithOrderCounts(req, res, next) {
  try {
    const data = readData();
    const customers = data.customers.map((customer) => ({
      ...customer,
      total_orders: data.orders.filter(
        (order) => order.customer_id === customer.id
      ).length
    }));
    return res.json(customers);
  } catch (error) {
    return next(error);
  }
}

function searchCustomers(req, res, next) {
  const name = typeof req.query.name === "string" ? req.query.name.trim() : "";
  if (!name) {
    return res.status(400).json({ error: "name query parameter is required" });
  }

  try {
    const customers = readData().customers.filter((customer) =>
      customer.name.toLowerCase().includes(name.toLowerCase())
    );
    return res.json(customers);
  } catch (error) {
    return next(error);
  }
}

module.exports = { getCustomersWithOrderCounts, searchCustomers };
