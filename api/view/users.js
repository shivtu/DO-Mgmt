const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Users = require('../model/usermodel');

router.get('/record', (req, res, next) =>{
    Users.findOne({_id: '5d74c5223d57502120ef2d18'}).then((result) =>{
        res.status(200).json({status: result._id});
    }).catch((e) => res.status(404).json({status: e.message}));
    // res.status(200).json({status: 'success'});
});

module.exports = router;