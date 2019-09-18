const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Newproject = require("../model/newrprojectmodel");
const Validate = require("../controller/validate");
const Counters = require("../model/countersmodel");

/*Find instance using service ID*/
router.get("/find/:serviceId", (req, res, next) => {
  const serviceId = req.params.serviceId.toUpperCase();
  Newproject.findOne({ SRID: serviceId })
    .then(result => {
      res.status(200).json({ data: result });
    })
    .catch(e => res.status(200).json({ data: e.message }));
});

/* Find all instances*/
router.get("/findAll", (req, res, next) => {
  Newproject.find()
    .then(result => {
      res.status(200).json({ data: result });
    })
    .catch(e => res.status(500).json({ data: e.message }));
});

/**Create a NPR - New Project Request */
router.post("/create", Validate.validationMethod.isUploadingfile, (req, res, next) => {
  NPRSequence.exec()
  .then((seq) => {
  const utcDate = new Date();
  const NPR = new Newproject({
    _id: new mongoose.Types.ObjectId(),
    SRID: "NPR" + seq.sequence_value,
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
    files: req.body.files,
    lifeCycle: [{assignedTo: req.body.assignedTo, assignedOn: utcDate.toUTCString()}]
  });
  NPR.save()
    .then(result => {
      res.status(201).json({
        result: result
      });
    })
    .catch(e => {
      res.status(400).json({
        result: e.message
      });
    });
  })
  .catch((seqErr) =>{
    res.status(500).json({
      result: seqErr
    });
  });
});


/**update NPR, request body to be plain JSON object (Nested JSON not allowed) */
router.patch("/experiment/:_id", Validate.validationMethod.isAssigningRequest,
  Validate.validationMethod.isUploadingfile, (req, res, next) =>{
     
});


router.patch("/update/:_id", Validate.validationMethod.isAssigningRequest,
Validate.validationMethod.isUploadingfile, (req, res, next) => {
    Newproject.findByIdAndUpdate({_id: req.params._id}, req.body, {new: true})
    .then((result) =>{
      res.status(200).json({
        result: result
      });
    })
    .catch((err) =>{
      result: err.message
    });
  });


/**Update sequence number to create NPRID */
const NPRSequence = Counters.findOneAndUpdate(
  { modelType: "NPR" },
  { $inc: { sequence_value: 1 } },
  { new: true }
);

module.exports = router;
