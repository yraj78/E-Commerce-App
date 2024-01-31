const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Get All Products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Product by ID
router.get('/products/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a New Product
router.post('/add-products', async (req, res) => {
  try {
    const { name, brand, price, rating, imageUrl } = req.body;
    const product = new Product({ name, brand, price, rating, imageUrl });
    await product.save();
    res.status(201).json({ message: 'Product created successfully' });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});
module.exports = router;