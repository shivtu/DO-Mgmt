const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Users = require('../model/usermodel');
const UserAuth = require("../model/userauthmodel");
const authUtil = require("../auth/authutil");
const Validate = require("../controller/validate");

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**User provides initial password */
router.post('/firstLogin',Validate.validationMethod.isUpdatingPassword,
authUtil.authUtilMethod.encryptData, (req, res, next) =>{
   /**Save user creds in new table */
   const user_auth = new UserAuth({
      _id: new mongoose.Types.ObjectId(),
      phone: req.body.phone,
      email: req.body.email,
      group: req.body.group,
      userId: req.body.userId,
      password: req.body.newPassword,
      role: req.body.role,
      status: req.body.status
   });
   user_auth.save()
   .then((result) =>{
      res.status(201).json({
         result: result.userId + ' setup success',
         accessToken: 'http://localhost:5000/api/v1/userauth/getToken',
         security: 'http://localhost:5000/api/v1/userauth/security/questions'
      });
   })
   .catch((err) =>{
      console.log(Date.now(), 'Could not save user on firstLogin', err);
      res.status(500).json({
         result: 'Could not save user'
      });
   })
});


router.post('/getToken', (req, res, next) =>{
   user_Id = (req.body.userId).toUpperCase(); // Change userId to upper case
   UserAuth.findOne({'userId': user_Id}).exec()
   .then((result) =>{
      try {
         bcrypt.compare(req.body.password, result.password, (compareErr, compareSuccess) =>{
            console.log('result', result);
            if (compareSuccess && result.status === "Active") {
               const accessToken = jwt.sign({
                  userId: result.userId,
                  email: result.email,
                  role: result.role,
                  group: result.group
                }, 'secretKey', { expiresIn: '1h' }); //You will want to retrieve the secretKey from an encrypted file on the server instead of hard coding it while in production
                res.status(201).json({
                  accessToken: accessToken
                });
            } else {
               res.status(403).json({
                  result: 'Authentication failed'
               });
            }
         });
      } catch {
         res.status(500).json({
            result: 'Cannot generate token'
         });
      }
   })
   .catch((err) =>{
      console.log(err);
   });
});


router.post('/passwordUpdate', authUtil.authUtilMethod.verifyToken,
Validate.validationMethod.isUpdatingPassword, (req, res, next) =>{
   currentUserId = req.body.currentUser.userId;
   UserAuth.findOne({'userId': currentUserId}).exec()
   .then((result) =>{
      bcrypt.compare(req.body.password, result.password, (compareErr, compareSuccess) =>{
         if (compareSuccess) {
            UserAuth.findOneAndUpdate({ 'userId': currentUserId }, { password: req.body.newPassword }, { new: true }).exec()
            .then((result) =>{
               res.status(201).json({
                  result:  'Password update success for ' + result.userId
               });
            })
            .catch((err) =>{
               res.status(500).json({
                  result: 'Cannot update password'
               });
            });
         } else {
            res.status(403).json({
               result: 'Old password mismatch'
            });
         }
      });
   })
   .catch((err) =>{
      res.status(404).json({
         result: 'User not found'
      });
   });
});


router.get('/security/questions', authUtil.authUtilMethod.verifyToken, (req, res, next) =>{
   _user = (req.body.userId).toUpperCase();
   Users.findOne({'userId': _user}).exec()
   .then((foundUser) =>{
      let securityQuestions = [];
      (foundUser.security).forEach((securityquestion) =>{
         securityQuestions.push(securityquestion);
      });
      res.status(200).json({
         result: securityQuestions
      });
   })
   .catch((err) =>{
      res.status(404).json({
         result: 'Cannot find security questions'
      });
   });
});


router.post('/password/selfReset',
Validate.validationMethod.checkUserAns, (req, res, next) =>{
  if (!req.body.areAnsValid) {
     res.status(403).json({
        result: 'Authentication failed'
     });
  } else if (req.body.areAnsValid) {
     
   UserAuth.findOneAndUpdate({'userId': req.body.userId}, {'password': req.body.newPassword}, {new: true}).exec()
   .then((result) =>{

   })
   .catch()
  }
});

module.exports = router;