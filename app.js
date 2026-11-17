const express = require("express");
const categoryRoutes = require("./routes/categoryRoutes");
const customerRoutes = require("./routes/customerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(express.json());
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  console.error(error);
  return res.status(500).json({ error: "Internal server error" });
});

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, "127.0.0.1", () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

module.exports = app;
