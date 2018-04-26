var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");
var Book = require("../models/book");
router.post('/signup', function (req, res) {
    if ((!req.body.username) || (!req.body.password)) {
        res.json({ success: false, msg: "please enter username and password" });
    } else {
        var newUser = new User({
            username: req.body.username,
            password: req.body.password
        })
        newUser.save(function (err) {
            if (err) {
                return res.json({ success: false, msg: "username already existed" });
            }
            res.json({ success: true, msg: "succesfull created new user" });
        });
    }
})

router.post('/signin', function(req, res) {
    User.findOne({
      username: req.body.username
    }, function(err, user) {
      if (err) throw err;
  
      if (!user) {
        res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
      } else {
        // check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            var token = jwt.sign(user.toJSON(), config.secret);
            // return the information including token as JSON
            res.json({success: true, token: 'JWT ' + token});
          } else {
            res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
          }
        });
      }
    });
  });

module.exports = router;