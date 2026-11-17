const { readData, writeData } = require("../utils/dataStore");

function getCategories(req, res, next) {
  try {
    const data = readData();
    const categories = data.categories.map((category) => ({
      ...category,
      product_count: data.products.filter(
        (product) => product.category_id === category.id
      ).length
    }));
    return res.json(categories);
  } catch (error) {
    return next(error);
  }
}

function deleteCategory(req, res, next) {
  try {
    const data = readData();
    const categoryId = Number(req.params.id);
    const categoryIndex = data.categories.findIndex(
      (category) => category.id === categoryId
    );

    if (categoryIndex === -1) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (data.products.some((product) => product.category_id === categoryId)) {
      return res.status(409).json({
        error: "Category has associated products"
      });
    }

    data.categories.splice(categoryIndex, 1);
    writeData(data);
    return res.json({ message: "Category deleted" });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getCategories, deleteCategory };
