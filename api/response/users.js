const express = require('express');
const router = express.Router();
const Users = require('../model/usermodel');
const Counters = require("../model/countersmodel");
const crypto = require('crypto');
const mongoose = require("mongoose");

router.get('/find/findAll', (req, res, next) =>{
    Users.find().then((result) =>{
        res.status(200).json({status: result._id});
    }).catch((e) => res.status(404).json({status: e.message}));
});

router.post('/create', generatePassword, (req, res, next) =>{
    UserSequence.exec() /**wrap post request with user counter increament */
    .then((seq) =>{
        const utcDate = new Date();
        const USR = new Users({
            _id: new mongoose.Types.ObjectId(),
            userId: "USR"+seq.sequence_value,
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            email: req.body.email,
            group: req.body.group,
            userId: "USR" + seq.sequence_value,
            initPwd: req.body.initPwd,
            role: req.body.role,
            gender: req.body.gender,
            bio: req.body.bio,
            createdBy: req.body.currentUser,
            createdOn: utcDate.toUTCString(),
            displayPicture: req.body.displayPicture
        });
        USR.save()
        .then((result) =>{
            res.status(201).json({
                _id: result._id,
                firstName: result.firstName,
                middleName: result.middleName,
                lastName: result.lastName,
                email: result.email,
                group: result.group,
                userId: result.userId,
                role: result.role,
                gender: result.gender,
                bio: result.bio
            });
        })
        .catch((err) =>{
            res.status(500).json({
                result: err.message
            });
        });
    })
    .catch((seqError) =>{
        console.log("Counters.js Sequence Error: " + seqError);
        res.status(500).json({
            result: "Cannot increament user count",
            message: seqError
        });
    })
});

/**Generate a random initial password */
function generatePassword(req, res, next) {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    req.body['initPwd'] = retVal;
    next();
}


/**Update sequence number to create USRID */
const UserSequence = Counters.findOneAndUpdate(
    { modelType: "USR" },
    { $inc: { sequence_value: 1 } },
    { new: true }
  );

module.exports = router;