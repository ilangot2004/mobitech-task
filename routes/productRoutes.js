const express = require("express");
const {
  getNeverOrderedProducts,
  getProductsOrderedInRange
} = require("../controllers/productController");

const router = express.Router();

router.get("/never-ordered", getNeverOrderedProducts);
router.get("/ordered", getProductsOrderedInRange);

module.exports = router;
