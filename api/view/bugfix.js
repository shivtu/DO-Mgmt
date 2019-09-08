const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Bugfix = require('../model/bugfixmodel');

router.get('/record', (req, res, next) =>{
    Bugfix.findOne({_id: '5d74da467032d51e54d5363b'}).then((result) =>{
        res.status(200).json({status: result.SRID});
    }).catch((e) => res.status(200).json({status: e.message}));
    // res.status(200).json({status: 'success'});
});

router.post('/create', (req, res, next) =>{
    const utcDate = new Date();
    const BFR = new Bugfix({
        _id: new mongoose.Types.ObjectId(),
        SRID: 'BFR'+Date.now(),
        CustomerName: req.body.CustomerName,
        serviceType: 'Bug Fix Request',
        priority: req.body.Priority,
        createdOn: utcDate.toUTCString(),
        CreatedBy: req.body.CreatedBy,
        summary: req.body.summary,
        description: req.body.description,
        status: 'created',
        endDate: req.body.endDate,
        NPRId: req.body.NPRId,
        files: req.body.files
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