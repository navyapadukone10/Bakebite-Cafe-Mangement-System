"use strict";

var express = require('express');

var connection = require('../connection');

var router = express.Router();

var jwt = require('jsonwebtoken');

var nodemailer = require('nodemailer');

require('dotenv').config();

var auth = require('../services/authentication');

var checkRole = require('../services/checkRole');

router.post('/signup', function (req, res) {
  var user = req.body;
  query = "select email,password,role,status from user where email=?";
  connection.query(query, [user.email], function (err, results) {
    if (!err) {
      if (results.length <= 0) {
        query = "insert into user(name,contactNumber,email,password,status,role) values(?,?,?,?,'false','user')";
        connection.query(query, [user.name, user.contactNumber, user.email, user.password], function (err, results) {
          if (!err) {
            return res.status(200).json({
              message: "Successfully Registered"
            });
          } else {
            return res.status(500).json(err);
          }
        });
      } else {
        return res.status(400).json({
          message: "Email Already Exist."
        });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});
router.post('/login', function (req, res) {
  var user = req.body;
  query = "select email,password,role,status from user where email=?";
  connection.query(query, [user.email], function (err, results) {
    if (!err) {
      if (results.length <= 0 || results[0].password != user.password) {
        return res.status(401).json({
          message: "Incorrect Username and password"
        });
      } else if (results[0].status === 'false') {
        return res.status(401).json({
          message: "Wait for admin Approval"
        });
      } else if (results[0].password == user.password) {
        var response = {
          email: results[0].email,
          role: results[0].role
        };
        var accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
          expiresIn: '8h'
        });
        res.status(200).json({
          token: accessToken
        });
      } else {
        return res.status(400).json({
          message: "something went wrong.Please try again later"
        });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});
router.post('/forgotpassword', function (req, res) {
  var user = req.body;
  query = "select email,password from user where email=?";
  connection.query(query, [user.email], function (err, results) {
    if (!err) {
      if (results.length <= 0) {
        return res.status(200).json({
          message: "Password sent successfully to your email."
        });
      } else {
        var mailOptions = {
          from: process.env.EMAIL,
          to: results[0].email,
          subject: 'Password by Cafe mangement System',
          html: '<p><b>Login details for Cafe Management System</b><br><b>Email: </b>' + results[0].email + '<br><b>Password: </b>' + results[0].password + '<br><a href="http://localhost:4200/">Click  here to login</a></p>'
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent:' + info.response);
          }
        });
        return res.status(200).json({
          message: "Password sent successfully to your email."
        });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});
router.get('/get', auth.authenticateToken, checkRole.checkRole, function (req, res) {
  var query = "select id,name,email,contactNumber,status from user where role='user'";
  connection.query(query, function (err, results) {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
}); //update the status ofthe user.create a new API

router.patch('/update', auth.authenticateToken, checkRole.checkRole, function (req, res) {
  var user = req.body;
  var query = "update user  set status=? where id=?";
  connection.query(query, [user.status, user.id], function (err, results) {
    if (!err) {
      if (results.affectedRows == 0) {
        return res.status(404).json({
          message: "User id does not exist"
        });
      }

      return res.status(200).json({
        message: "User updated successfully"
      });
    } else {
      return res.status(500).json(err);
    }
  });
});
router.get('/checkToken', auth.authenticateToken, function (req, res) {
  return res.status(200).json({
    message: "true"
  });
});
router.post('/changePassword', auth.authenticateToken, function (req, res) {
  var user = req.body;
  var email = res.locals.email;
  console.log(email);
  var query = "select * from user where email=? and password=?";
  connection.query(query, [email, user.oldPassword], function (err, results) {
    if (!err) {
      if (results.length <= 0) {
        return res.status(400).json({
          message: "Incorrect Old Password"
        });
      } else if (results[0].password == user.oldPassword) {
        query = "update user set password=? where email=?";
        connection.query(query, [user.newPassword, email], function (err, results) {
          if (!err) {
            return res.status(200).json({
              message: "Password Updated Successfully"
            });
          } else {
            return res.status(500).json(err);
          }
        });
      } else {
        return res.status(400).json({
          message: "Something went wrong.Please try later"
        });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});
module.exports = router;
//# sourceMappingURL=user.dev.js.map
