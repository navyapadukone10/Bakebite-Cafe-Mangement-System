"use strict";

require('dotenv').config();

var jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  var authHeader = req.headers['authorization'];
  var token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, response) {
    if (err) return res.sendStatus(403);
    res.locals = response;
    next();
  });
}

module.exports = {
  authenticateToken: authenticateToken
};
//# sourceMappingURL=authentication.dev.js.map
