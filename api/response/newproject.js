const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Newproject = require('../model/newrprojectmodel');

router.get('/:serviceId', (req, res, next) =>{
    const serviceId = req.params.serviceId.toUpperCase();
    Newproject.findOne({SRID: serviceId}).then((result) =>{
        res.status(200).json({status: result});
    }).catch((e) => res.status(200).json({status: e.message}));
    // res.status(200).json({status: 'success'});
});

router.post('/create', (req, res, next) =>{
    const utcDate = new Date();
    const NPR = new Newproject({
        _id: new mongoose.Types.ObjectId(),
        SRID: 'NPR'+Date.now(),
        customerName: req.body.customerName,
        serviceType: 'New Project Request',
        priority: req.body.priority,
        createdOn: utcDate.toUTCString(),
        createdBy: req.body.createdBy,
        summary: req.body.summary,
        description: req.body.description,
        status: 'created',
        repoLink: req.body.repoLink,
        childTask: {},
        file: req.body.file
    });
    NPR.save().then((result) =>{
        res.status(201).json({
            ServiceRequest: NPR
        });
    }).catch((e) =>{
        console.log(e.message);
    });
    
});

module.exports = router;