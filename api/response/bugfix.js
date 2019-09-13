const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Bugfix = require("../model/bugfixmodel");
const authCheck = require("../auth/authentication");

// find a BFR
router.get("/find/:serviceId", (req, res, next) => {
  // Execute authentication
  authCheck
    .then(role => {
      // Check if auth succeeded
      if ((role[1] === "user" || role[1] === "admin") && role[0]) {
        const serviceId = req.params.serviceId.toUpperCase();
        Bugfix.findOne({ SRID: serviceId })
          .then(result => {
            res.status(200).json({
              status: result
            });
          })
          .catch(e =>
            res.status(200).json({
              status: e.message
            })
          );
      } else {
        res.status(401).json({
          status: "unauthorized"
        });
      }
    })
    .catch(err => {
      res.status(500).json({ status: "Could not authorize" });
    });
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
        ServiceRequest: BFR
      });
    })
    .catch(e => {
      console.log(e.message);
    });
});

module.exports = router;
