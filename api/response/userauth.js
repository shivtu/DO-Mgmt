const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Users = require('../model/usermodel');
const UserAuth = require("../model/userauthmodel");
const jwt = require('jsonwebtoken');

/**User provides initial password */
router.post('/firstLogin', (req, res, next) =>{
   /**Save user creds in new table */
   Users.findOne({"userId":req.body.userId}).exec()
   .then((user) =>{ //If user is found save user creds in separate table
      user_auth = new UserAuth({
         _id: new mongoose.Types.ObjectId(),
         phone: user.phone,
         email: user.email,
         group: user.group,
         userId: user.userId,
         password: req.body.password,
         role: user.role
      });
      user_auth.save()
      .then((result) =>{
         res.status(201).json({
            result: 'Update success for ' + result.userId,
            login: 'http://localhost:5000/api/v1/userauth/getToken'
         });
      })
      .catch((err) =>{
         res.status(500).json({
            result: 'Cannot create user'
         });
      });
   })
   .catch((searchErr) =>{
      res.status(404).json({
         result: 'User not found'
      });
   });
});


/**User requests for access token */
router.post('/getToken', (req, res, next) =>{
    /**Generate JWT token */
 });

module.exports = router;