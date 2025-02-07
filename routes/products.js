const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const PRODUCTS_FILE = './data/products.json';

// Helper to read and write the file
const readProductsFile = () => {
  return JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
};

const writeProductsFile = (data) => {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2));
};

// Ruta GET /
router.get('/', (req, res) => {
  const products = readProductsFile();
  const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
  res.json(products.slice(0, limit));
});

// Ruta GET /:pid
router.get('/:pid', (req, res) => {
  const products = readProductsFile();
  const product = products.find((p) => p.id === req.params.pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Ruta POST /
router.post('/', (req, res) => {
  const products = readProductsFile();
  const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ message: 'All fields except thumbnails are required' });
  }

  const newProduct = {
    id: uuidv4(),
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  };

  products.push(newProduct);
  writeProductsFile(products);

  res.status(201).json(newProduct);
});

// Ruta PUT /:pid
router.put('/:pid', (req, res) => {
  const products = readProductsFile();
  const index = products.findIndex((p) => p.id === req.params.pid);

  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const updatedProduct = { ...products[index], ...req.body };
  delete updatedProduct.id; // Ensure ID is not modified

  products[index] = updatedProduct;
  writeProductsFile(products);

  res.json(updatedProduct);
});

// Ruta DELETE /:pid
router.delete('/:pid', (req, res) => {
  let products = readProductsFile();
  const initialLength = products.length;

  products = products.filter((p) => p.id !== req.params.pid);

  if (products.length === initialLength) {
    return res.status(404).json({ message: 'Product not found' });
  }

  writeProductsFile(products);

  res.status(204).send();
});

module.exports = router;
