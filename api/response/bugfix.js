const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Bugfix = require("../model/bugfixmodel");
const authCheck = require("../auth/authentication");
const Counters = require("../model/countersmodel");

// find a BFR
router.get("/find/:serviceId", authCheck, (req, res, next) => {
  const serviceId = req.params.serviceId.toUpperCase();
  Bugfix.findOne({ SRID: serviceId })
    .then(result => {
      res.status(200).json({
        result: result
      });
    })
    .catch(e =>
      res.status(200).json({
        result: e.message
      })
    );
});

// Create a BFR
router.post("/create", (req, res, next) => {
  BFRSequence.exec()
  .then((seq) =>{
  const utcDate = new Date();
  const BFR = new Bugfix({
    _id: new mongoose.Types.ObjectId(),
    SRID: "BFR" + seq.sequence_value,
    customerName: req.body.customerName,
    serviceType: "Bug Fix Request",
    priority: req.body.Priority,
    createdOn: new Date().toUTCString(),
    createdBy: req.body.createdBy,
    summary: req.body.summary,
    description: req.body.description,
    status: "created",
    endDate: req.body.endDate,
    NPRId: req.body.NPRId,
    files: req.body.files
  });
  BFR.save()
    .then(result => {
      res.status(201).json({
        result: result
      });
    })
    .catch(err => {
      res.status(400).json({
        result: err.message
      });
    });
  })
  .catch((seqErr) =>{
    res.status(500).json({
      result: seqErr.message
    });
  });
});

/**Update sequence number to create BFRID */
const BFRSequence = Counters.findOneAndUpdate(
  { modelType: "BFR" },
  { $inc: { sequence_value: 1 } },
  { new: true }
);

module.exports = router;
