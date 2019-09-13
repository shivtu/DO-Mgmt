const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Newproject = require("../model/newrprojectmodel");
const Validate = require("../controller/validate");

router.get("/find/:serviceId", (req, res, next) => {
  const serviceId = req.params.serviceId.toUpperCase();
  Newproject.findOne({ SRID: serviceId })
    .then(result => {
      res.status(200).json({ status: result });
    })
    .catch(e => res.status(200).json({ status: e.message }));
});

router.post("/create", (req, res, next) => {
  const utcDate = new Date();
  const NPR = new Newproject({
    _id: new mongoose.Types.ObjectId(),
    SRID: "NPR" + Date.now(),
    customerName: req.body.customerName,
    serviceType: "New Project Request",
    priority: req.body.priority,
    createdOn: utcDate.toUTCString(),
    createdBy: req.body.createdBy,
    summary: req.body.summary,
    description: req.body.description,
    assignedTo: req.body.assignedTo,
    status: "created",
    repoLink: req.body.repoLink,
    childTask: {},
    files: req.body.files
  });
  // console.log(req.body.assignedTo);
  NPR.save()
    .then(result => {
      res.status(201).json({
        status: result
      });
    })
    .catch(e => {
      console.log(e.message);
    });
});

router.patch("/update/:_id", (req, res, next) =>{
  Validate[1].then((msg) => {
    console.log(msg)
  });
  const _id = req.params._id;
  var updateData = {
    status: req.body.status
  }
  Newproject.findByIdAndUpdate(_id, updateData, (err, result) =>{
    res.status(200).json({
      status: result
    });
  });
});

module.exports = router;
