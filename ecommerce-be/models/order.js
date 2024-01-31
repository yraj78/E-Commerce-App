const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  shippingAddress: { type: String, required: true },
  orderDate: { type: Date, default: Date.now },
  isPaid: { type: Boolean, default: false },
  paymentMethod: { type: String },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;