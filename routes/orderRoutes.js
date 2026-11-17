const express = require("express");
const {
  getOldPendingOrders,
  getMostOrderedProduct,
  cancelOrder
} = require("../controllers/orderController");
const { validateId } = require("../utils/validation");

const router = express.Router();

router.get("/pending-old", getOldPendingOrders);
router.get("/most-ordered-product", getMostOrderedProduct);
router.post("/:id/cancel", validateId("Order"), cancelOrder);

module.exports = router;
