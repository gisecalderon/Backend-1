const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const CARTS_FILE = './data/carts.json';
const PRODUCTS_FILE = './data/products.json';

// Helper to read and write files
const readCartsFile = () => {
  return JSON.parse(fs.readFileSync(CARTS_FILE, 'utf8'));
};

const writeCartsFile = (data) => {
  fs.writeFileSync(CARTS_FILE, JSON.stringify(data, null, 2));
};

const readProductsFile = () => {
  return JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
};

// Ruta POST /
router.post('/', (req, res) => {
  const carts = readCartsFile();

  const newCart = {
    id: uuidv4(),
    products: []
  };

  carts.push(newCart);
  writeCartsFile(carts);

  res.status(201).json(newCart);
});

// Ruta GET /:cid
router.get('/:cid', (req, res) => {
  const carts = readCartsFile();
  const cart = carts.find((c) => c.id === req.params.cid);

  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ message: 'Cart not found' });
  }
});

// Ruta POST /:cid/product/:pid
router.post('/:cid/product/:pid', (req, res) => {
  const carts = readCartsFile();
  const products = readProductsFile();
  const cart = carts.find((c) => c.id === req.params.cid);
  const product = products.find((p) => p.id === req.params.pid);

  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const cartProduct = cart.products.find((p) => p.product === req.params.pid);

  if (cartProduct) {
    cartProduct.quantity += 1;
  } else {
    cart.products.push({ product: req.params.pid, quantity: 1 });
  }

  writeCartsFile(carts);

  res.status(201).json(cart);
});

module.exports = router;
