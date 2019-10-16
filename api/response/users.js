const express = require('express');
const router = express.Router();
const Users = require('../model/usermodel');

router.get('/find/findAll', (req, res, next) =>{
    Users.find().then((result) =>{
        res.status(200).json({status: result._id});
    }).catch((e) => res.status(404).json({status: e.message}));
    // res.status(200).json({status: 'success'});
});

module.exports = router;