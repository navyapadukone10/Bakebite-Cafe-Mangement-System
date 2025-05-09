"use strict";

var express = require('express');

var connection = require('../connection');

var router = express.Router();

var auth = require('../services/authentication');

var checkRole = require('../services/checkRole');

router.post('/add', auth.authenticateToken, checkRole.checkRole, function (req, res) {
  var product = req.body;
  var query = "insert into product (name,categoryId,description,price,status) values(?,?,?,?,'true')";
  connection.query(query, [product.name, product.categoryId, product.description, product.price], function (err, results) {
    if (!err) {
      return res.status(200).json({
        message: "Product added successfully"
      });
    } else {
      return res.status(500).json(err);
    }
  });
});
router.get('/get', auth.authenticateToken, function (req, res, next) {
  var query = "select p.id,p.name,p.description,p.price,p.status,c.id as categoryId,c.name as categoryName from product as p INNER JOIN category as c where p.categoryId=c.id";
  connection.query(query, function (err, results) {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});
router.get('/getByCategory/:id', auth.authenticateToken, function (req, res, next) {
  var id = req.params.id;
  var query = "select id,name from product where categoryId=? and status='true'";
  connection.query(query, [id], function (err, results) {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});
router.get('/getById/:id', auth.authenticateToken, function (req, res, next) {
  var id = req.params.id;
  var query = "select id,name,description,price from product where id=?";
  connection.query(query, [id], function (err, results) {
    if (!err) {
      return res.status(200).json(results[0]);
    } else {
      return res.status(500).json(err);
    }
  });
});
router.patch('/update', auth.authenticateToken, checkRole.checkRole, function (req, res, next) {
  var product = req.body;
  var query = "update product set name=?,categoryId=?,description=?,price=? where id=?";
  connection.query(query, [product.name, product.categoryId, product.description, product.price, product.id], function (err, results) {
    if (!err) {
      if (results.affectedRows == 0) {
        return res.status(404).json({
          message: "Product id does not found"
        });
      }

      return res.status(200).json({
        message: "Product Updated Successfully"
      });
    } else {
      return res.status(500).json(err);
    }
  });
});
router["delete"]('/delete/:id', auth.authenticateToken, checkRole.checkRole, function (req, res, next) {
  var id = req.params.id;
  var query = "delete from product where id=?";
  connection.query(query, [id], function (err, results) {
    if (!err) {
      if (results.affectedRows == 0) {
        return res.status(404).json({
          message: "Product id does not found"
        });
      }

      return res.status(200).json({
        message: "Product Deleted Successfully"
      });
    } else {
      return res.status(500).json(err);
    }
  });
});
router.patch('/updateStatus', auth.authenticateToken, checkRole.checkRole, function (req, res, next) {
  var user = req.body;
  var query = "update product set status=? where id=?";
  connection.query(query, [user.status, user.id], function (err, results) {
    if (!err) {
      if (results.affectedRows == 0) {
        return res.status(404).json({
          message: "Product id does not found"
        });
      }

      return res.status(200).json({
        message: "Product Status Updated Successfully"
      });
    } else {
      return res.status(500).json(err);
    }
  });
});
module.exports = router;
//# sourceMappingURL=product.dev.js.map
