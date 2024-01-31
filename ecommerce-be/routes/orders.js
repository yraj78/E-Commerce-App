const express = require('express');
const router = express.Router();
const Order = require('../models/order');

// Get All Orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Order by ID
router.get('/orders/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to add a new order
router.post('/orders', async (req, res) => {
  try {
    const { user, products, totalPrice, shippingAddress, paymentMethod } = req.body;

    // Create a new order instance
    const newOrder = new Order({
      user,
      products,
      totalPrice,
      shippingAddress,
      paymentMethod,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error adding order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;