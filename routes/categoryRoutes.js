const express = require("express");
const {
  getCategories,
  deleteCategory
} = require("../controllers/categoryController");
const { validateId } = require("../utils/validation");

const router = express.Router();

router.get("/", getCategories);
router.delete("/:id", validateId("Category"), deleteCategory);

module.exports = router;
