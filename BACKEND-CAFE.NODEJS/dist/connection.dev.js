"use strict";

var mysql = require('mysql');

require('dotenv').config();

var connection = mysql.createConnection({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
connection.connect(function (err) {
  if (!err) {
    console.log("Connected");
  } else {
    console.log(err);
  }
});
module.exports = connection;
//# sourceMappingURL=connection.dev.js.map
