const express = require('express');
const router = express.Router();
const Users = require('../model/usermodel');
const Counters = require("../model/countersmodel");
const mongoose = require("mongoose");
const Validate = require("../controller/validate");
const authUtil = require("../auth/authutil");

router.post('/create', Validate.validationMethod.areSecurityQuestionsValid, authUtil.authUtilMethod.encryptData, (req, res, next) =>{
    UserSequence.exec() /**wrap post request with user counter increament */
    .then((seq) =>{
        const utcDate = new Date();
        const User = new Users({
            _id: new mongoose.Types.ObjectId(),
            userId: "USR"+seq.sequence_value,
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            email: req.body.email,
            group: req.body.group,
            initPwd: req.body.initPwd,
            role: req.body.role,
            status: req.body.status,
            security: req.body.security,
            gender: req.body.gender,
            bio: req.body.bio,
            createdBy: req.body.currentUser,
            createdOn: utcDate.toUTCString(),
            displayPicture: req.body.displayPicture
        });
        User.save()
        .then(result => {
          res.status(201).json({
            result: {
                _id: result._id,
                userId: result.userId,
                firstName: result.firstName,
                middleName: result.middleName,
                lastName: result.lastName,
                email: result.email,
                group: result.group,
                role: result.role,
                status: result.status,
                gender: result.gender,
                bio: result.bio
            }
          });
        })
        .catch(e => {
          res.status(400).json({
            result: e.message
          });
        });
    }).catch((userCreationErr) =>{
        res.status(500).json({
            result: userCreationErr
        });
    });
});


router.get('/find/findAll', (req, res, next) =>{
  Users.find().exec()
  .then((result) =>{
      res.status(200).json({result: result});
  }).catch((e) => res.status(404).json({status: e.message}));
});


router.get('/find/_id/:_id', (req, res, next) =>{
    Users.findById({ '_id': req.params._id }).exec()
    .then((result) =>{
        res.status(200).json({
          result: [{
            _id: result._id,
            firstName: result.firstName,
            middleName: result.middleName,
            lastName: result.lastName,
            phone: result.phone,
            email: result.email,
            group: result.group,
            userId: result.userId,
            role: result.role,
            status: result.status,
            gender: result.gender,
            bio: result.bio,
            createdBy: result.createdBy,
            createdOn: result.createdOn,
            displayPicture: result.displayPicture
          }]
        });
    }).catch((e) => res.status(404).json({result: e.message}));
});


router.get('/find/findAll/limit/:_limit', (req, res, next) =>{
  Users.find().limit(req.params._limit | 0).exec()
  .then((result) =>{
    let newResult = [];
    result.forEach(eachResult =>{
      newResult.push({
        _id: eachResult._id,
          firstName: eachResult.firstName,
          middleName: eachResult.middleName,
          lastName: eachResult.lastName,
          phone: eachResult.phone,
          email: eachResult.email,
          group: eachResult.group,
          userId: eachResult.userId,
          role: eachResult.role,
          status: eachResult.status,
          gender: eachResult.gender,
          bio: eachResult.bio,
          createdBy: eachResult.createdBy,
          createdOn: eachResult.createdOn,
          displayPicture: eachResult.displayPicture
      });
    });
      res.status(200).json({
        result: newResult
      });
  }).catch((e) => res.status(404).json({status: e.message}));
});


router.get('/find/filter', (req, res, next) =>{
    Users.find(req.query).exec()
    .then((result) =>{
        res.status(200).json({result: result});
    }).catch((e) => res.status(404).json({status: e.message}));
});


router.get('/find/filter/limit/:_limit', (req, res, next) =>{
    Users.find(req.query).limit(req.params._limit | 0).exec()
    .then((result) =>{
      let newResult = [];
      result.forEach(eachResult =>{
        newResult.push({
          _id: eachResult._id,
            firstName: eachResult.firstName,
            middleName: eachResult.middleName,
            lastName: eachResult.lastName,
            phone: eachResult.phone,
            email: eachResult.email,
            group: eachResult.group,
            userId: eachResult.userId,
            role: eachResult.role,
            status: eachResult.status,
            gender: eachResult.gender,
            bio: eachResult.bio,
            createdBy: eachResult.createdBy,
            createdOn: eachResult.createdOn,
            displayPicture: eachResult.displayPicture
        });
      });
      res.status(200).json({
        result: newResult
      });
    }).catch((e) => res.status(404).json({status: e.message}));
});


router.delete('/delte/:_id', (req, res, next) =>{
  Users.findByIdAndDelete({ "_id": req.params._id }, { new: true }).exec()
  .then()
  .catch();
})


/**Update sequence number to create USRID */
const UserSequence = Counters.findOneAndUpdate(
    { modelType: "USR" },
    { $inc: { sequence_value: 1 } },
    { new: true }
  );

module.exports = router;