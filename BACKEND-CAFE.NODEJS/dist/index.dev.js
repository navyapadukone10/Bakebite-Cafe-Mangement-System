"use strict";

var express = require('express');

var cors = require('cors');

var connection = require('./connection');

var userRoute = require('./routes/user');

var categoryRoute = require('./routes/category');

var productRoute = require('./routes/product');

var billRoute = require('./routes/bill');

var dashboardRoute = require('./routes/dashboard');

var app = express();
app.use(cors());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use('/user', userRoute);
app.use('/category', categoryRoute);
app.use('/product', productRoute);
app.use('/bill', billRoute);
app.use('/dashboard', dashboardRoute);
module.exports = app;
//# sourceMappingURL=index.dev.js.map
