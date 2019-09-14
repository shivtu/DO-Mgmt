const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Bugfix = require("../model/bugfixmodel");
const authCheck = require("../auth/authentication");

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
  const utcDate = new Date();
  const BFR = new Bugfix({
    _id: new mongoose.Types.ObjectId(),
    SRID: "BFR" + Date.now(),
    customerName: req.body.CustomerName,
    serviceType: "Bug Fix Request",
    priority: req.body.Priority,
    createdOn: utcDate.toUTCString(),
    CreatedBy: req.body.CreatedBy,
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
    .catch(e => {
      console.log(e.message);
    });
});

module.exports = router;
