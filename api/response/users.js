const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Users = require('../model/usermodel');
const authCheck = require('../auth/authentication');

router.get('/find/findAll', (req, res, next) =>{
    Users.find().then((result) =>{
        res.status(200).json({status: result._id});
    }).catch((e) => res.status(404).json({status: e.message}));
    // res.status(200).json({status: 'success'});
});

module.exports = router;