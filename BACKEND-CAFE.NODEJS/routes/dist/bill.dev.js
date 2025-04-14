"use strict";

var express = require('express');

var connection = require('../connection');

var router = express.Router();

var ejs = require('ejs');

var pdf = require('html-pdf');

var path = require('path');

var fs = require('fs');

var uuid = require('uuid');

var auth = require('../services/authentication');

var _require = require('stream/consumers'),
    json = _require.json;

router.post('/generateReport', auth.authenticateToken, function (req, res) {
  var generateuuid = uuid.v1();
  var orderDetails = req.body;
  var productDetailsReport = JSON.parse(orderDetails.productDetails);
  var query = "insert into bill (name,uuid,email,contactNumber,paymentMethod,total,productDetails,createdBy) values(?,?,?,?,?,?,?,?)";
  connection.query(query, [orderDetails.name, generateuuid, orderDetails.email, orderDetails.contactNumber, orderDetails.paymentMethod, orderDetails.totalAmount, orderDetails.productDetails, res.locals.email], function (err, results) {
    if (!err) {
      ejs.renderFile(path.join(__dirname, '', "report.ejs"), {
        productDetails: productDetailsReport,
        name: orderDetails.name,
        email: orderDetails.email,
        contactNumber: orderDetails.contactNumber,
        paymentMethod: orderDetails.paymentMethod,
        totalAmount: orderDetails.totalAmount
      }, function (err, results) {
        if (err) {
          return res.status(500).json(err);
        } else {
          pdf.create(results).toFile('./generate_pdf/' + generateuuid + ".pdf", function (err, data) {
            if (err) {
              console.log(err);
              return res.status(500).json(err);
            } else {
              return res.status(200).json({
                uuid: generateuuid
              });
            }
          });
        }
      });
    } else {
      return res.status(500).json(err);
    }
  });
});
router.post('/getPdf', auth.authenticateToken, function (req, res) {
  var orderDetails = req.body;
  var pdfPath = './generate_pdf/' + orderDetails.uuid + '.pdf';

  if (fs.existsSync(pdfPath)) {
    res.contentType("application/pdf");
    fs.createReadStream(pdfPath).pipe(res);
  } else {
    var productDetailsReport = JSON.parse(orderDetails.productDetails);
    ejs.renderFile(path.join(__dirname, '', "report.ejs"), {
      productDetails: productDetailsReport,
      name: orderDetails.name,
      email: orderDetails.email,
      contactNumber: orderDetails.contactNumber,
      paymentMethod: orderDetails.paymentMethod,
      totalAmount: orderDetails.totalAmount
    }, function (err, results) {
      if (err) {
        return res.status(500).json(err);
      } else {
        pdf.create(results).toFile('./generate_pdf/' + orderDetails.uuid + ".pdf", function (err, results) {
          if (err) {
            console.log(err);
            return res.status(500).json(err);
          } else {
            res.contentType("application/pdf");
            fs.createReadStream(pdfPath).pipe(res);
          }
        });
      }
    });
  }
});
router.get('/getBills', auth.authenticateToken, function (req, res, next) {
  var query = "select * from bill order by id DESC";
  connection.query(query, function (err, results) {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});
router["delete"]('/delete/:id', auth.authenticateToken, function (req, res, next) {
  var id = req.params.id;
  var query = "delete from bill where id=?";
  connection.query(query, [id], function (err, results) {
    if (!err) {
      if (results.affectedRows == 0) {
        return res.status(404).json({
          message: "Bill id does not found"
        });
      }

      return res.status(200).json({
        message: "Bill Deleted Successfully"
      });
    } else {
      return res.status(500).json(err);
    }
  });
});
module.exports = router;
//# sourceMappingURL=bill.dev.js.map
