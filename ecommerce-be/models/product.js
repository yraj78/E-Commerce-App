const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  imageUrl: { type: String },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;