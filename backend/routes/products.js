const express = require("express");
const router = express.Router();
const { authMiddleware, requireRole } = require("../middleware/authJwt");

let products = require("../data/products");

// GET /products — доступно всем авторизованным (user/admin)
router.get("/", authMiddleware, (req, res) => {
  res.json(products);
});

// GET /products/:id — доступно всем авторизованным
router.get("/:id", authMiddleware, (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "ID must be a number" });
  }

  const product = products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  
  res.json(product);
});

// POST /products — только admin
router.post("/", authMiddleware, requireRole(["admin"]), (req, res) => {
  const { title, price, category, description, stock } = req.body;

  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "title is required" });
  }
  
  const numPrice = Number(price);
  if (Number.isNaN(numPrice) || numPrice < 0) {
    return res.status(400).json({ error: "price must be >= 0" });
  }

  const nextId = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
  
  const newProduct = { 
    id: nextId, 
    title: title.trim(), 
    price: numPrice,
    category: category || "Общее",
    description: description || "",
    stock: stock || 0
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /products/:id — только admin
router.put("/:id", authMiddleware, requireRole(["admin"]), (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "ID must be a number" });
  }

  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  const { title, price, category, description, stock } = req.body;

  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "title is required" });
  }

  const numPrice = Number(price);
  if (Number.isNaN(numPrice) || numPrice < 0) {
    return res.status(400).json({ error: "price must be a number >= 0" });
  }

  const updatedProduct = {
    id: id,
    title: title.trim(),
    price: numPrice,
    category: category || "Общее",
    description: description || "",
    stock: stock !== undefined ? Number(stock) : 0
  };

  products[index] = updatedProduct;
  res.json(updatedProduct);
});

// DELETE /products/:id — только admin
router.delete("/:id", authMiddleware, requireRole(["admin"]), (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "ID must be a number" });
  }

  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  products.splice(index, 1);
  res.json({ ok: true });
});

module.exports = router;