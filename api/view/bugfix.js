const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Bugfix = require('../model/bugfixmodel');


router.post('/create', (req, res, next) =>{
    const BFR = new Bugfix({
        _id: new mongoose.Types.ObjectId(),
        SRID: 'BFR'+Date.now(),
        CustomerName: req.body.CustomerName,
        ServiceType: 'Bug Fix Request',
        Priority: req.body.Priority,
        CreatedOn: req.body.CreatedOn,
        CreatedBy: req.body.CreatedBy
    });
    BFR.save().then((result) =>{
        res.status(201).json({
            ServiceRequest: BFR
        });
    }).catch((e) =>{
        console.log(e.message);
    });
    
});

module.exports = router;