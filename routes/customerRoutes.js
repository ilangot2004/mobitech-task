const express = require("express");
const {
  getCustomersWithOrderCounts,
  searchCustomers
} = require("../controllers/customerController");
const { getOrdersForCustomer } = require("../controllers/orderController");
const { validateId } = require("../utils/validation");

const router = express.Router();

router.get("/", getCustomersWithOrderCounts);
router.get("/search", searchCustomers);
router.get("/:id/orders", validateId("Customer"), getOrdersForCustomer);

module.exports = router;
