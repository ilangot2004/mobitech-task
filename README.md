# Store Management API

node app.js

## Endpoints

| Method | URL | Purpose |
| GET | `/api/categories` | Categories with product counts |
| DELETE | `/api/categories/:id` | Delete a category if it has no products |
| GET | `/api/products/never-ordered` | Products that have never been ordered |
| GET | `/api/customers` | Customers with their order counts |
| GET | `/api/customers/search?name=alex` | Search customers by name |
| GET | `/api/customers/:id/orders` | Get a customer's orders |
| GET | `/api/orders/pending-old` | Pending orders older than 7 days |
| GET | `/api/products/ordered?from=2026-11-01&to=2026-11-30` | Products ordered within an inclusive date range |
| GET | `/api/orders/most-ordered-product` | Product in the most orders in the last 30 days |
| POST | `/api/orders/:id/cancel` | Cancel an order and restore its product stock |
