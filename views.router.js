const express = require('express');
const router = express.Router();
const fs = require('fs');
const PRODUCTS_FILE = './data/products.json';

router.get('/home', (req, res) => {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
  res.render('home', { products });
});

router.get('/realtimeproducts', (req, res) => {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
  res.render('realTimeProducts', { products });
});

module.exports = router;