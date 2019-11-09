const express = require('express');
const router = express.Router();
const Users = require('../model/usermodel');
const UserAuth = require('../model/userauthmodel');
const Counters = require("../model/countersmodel");
const mongoose = require("mongoose");
const authUtil = require("../auth/authutil");

router.post('/create',
authUtil.authUtilMethod.generateSecurityQues,
authUtil.authUtilMethod.encryptData, (req, res, next) =>{
    UserSequence.exec() /**wrap post request with user counter increament */
    .then((seq) =>{
        const utcDate = new Date();
        const User = new Users({
            _id: new mongoose.Types.ObjectId(),
            userId: "USR"+seq.sequence_value,
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            email: req.body.email,
            group: req.body.group,
            initPwd: req.body.initPwd,
            role: req.body.role,
            status: req.body.status,
            security: req.body.security,
            gender: req.body.gender,
            bio: req.body.bio, //This may contain user's attributes such as language, region, locale etc
            createdBy: req.body.currentUser, //This will contain an object with userId, email, role and group props assigned by the accessToken
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
            },
            setup: 'http://localhost:5000/api/v1/userauth/firstLogin',
            security: 'http://localhost:5000/api/v1/userauth/security/questions'
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

/* Find all users */
router.get('/find/findAll', (req, res, next) =>{
  Users.find().exec()
  .then((result) =>{
      res.status(200).json({
        result:result
      });
  }).catch((e) => res.status(404).json({status: e.message}));
});

/* Find user using userId */
router.get('/find/:userId', (req, res, next) =>{
  Users.findOne({'userId': req.params.userId}).exec()
  .then((result) =>{
    res.status(200).json({
      result: {
        'userId': result.userId,
        firstName: result.firstName,
        middleName: result.middleName,
        lastName: result.lastName,
        email: result.email,
        phone: result.phone,
        bio: result.bio,
        status: result.status,
        group: result.group,
        role: result.role,
        _id: result._id
      }
    });
  })
  .catch();
});

/* Find user by _id */
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

/* Find all users with a limit */
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

/* Find users using Filter */
router.get('/find/filter', (req, res, next) =>{
    Users.find(req.query).exec()
    .then((result) =>{
        res.status(200).json({result: result});
    }).catch((e) => res.status(404).json({status: e.message}));
});

/* Find users using filter with limit */
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


router.delete('/delete/:_id/keepFootprints', (req, res, next) =>{
  Users.findByIdAndUpdate({ '_id': req.params._id }, { 'status': 'In-Active' }, { new: true }).exec()
  .then((foundUser) =>{
    UserAuth.findOneAndDelete({'userId': foundUser.userId}).exec()
    .then((userDeleted) =>{
      res.status(200).json({
        result: foundUser.userId + ' deleted',
        footprints: 'http://localhost:5000/api/v1/users/find/_id/'+req.params._id
      });
    })
    .catch(userDelError =>{
      res.status(500).json({
        result: 'Could not delete user'
      });
    });
  }).catch((userSearchErr) =>{
    res.status(404).json({
      result: req.params._id + ' not found'
    });
  });
});


router.delete('/delete/:_id', (req, res, next) =>{
  Users.findByIdAndDelete({ '_id': req.params._id }).exec()
  .then((deletedUser) =>{
    userToDel = deletedUser.userId;
    if (deletedUser.status === "Active") {
      UserAuth.findOneAndDelete({'userId': userToDel}).exec()
      .then((wipeOut) =>{
        res.send(200).json({
          result: userToDel + ' deleted permanently'
        });
        console.log(userToDel + ' deleted permanently');
      })
      .catch((wipeOutErr) =>{
        res.status(500).json({
          result: 'Cannot delete user',
          message: wipeOutErr.message
        });
      });
    } else {
      res.status(200).json({
        result: userToDel + ' deleted permanently'
      });
      console.log(userToDel + ' deleted permanently');
    }
  }).catch((userSearchErr) =>{
    res.status(404).json({
      result: req.params._id + ' not found'
    });
  });
});


/**Update sequence number to create USRID */
const UserSequence = Counters.findOneAndUpdate(
    { modelType: "USR" },
    { $inc: { sequence_value: 1 } },
    { new: true }
  );

module.exports = router;