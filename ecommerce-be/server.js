const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;
const cors = require('cors');
const { MONGODB_URL } = require('./config');

global.__basedir = __dirname;
mongoose.connect(MONGODB_URL);

mongoose.connection.on('connected', () => {
    console.log('DB connected');
});

mongoose.connection.on('error', (error) => {
    console.log('Some error occurred while connecting to DB:', error);
});

require('./models/order');
require('./models/product');
require('./models/user');


app.use(cors());
app.use(express.json());


app.use(require('./routes/orders'));
app.use(require('./routes/products'));
app.use(require('./routes/auth'));


app.listen(PORT, () => {
    console.log('Server started on port:', PORT);
});