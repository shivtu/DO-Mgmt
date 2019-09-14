const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Failfix = require("../model/failsmodel");
const Counters = require("../model/countersmodel");

/* find a FFR (Fail Fix Request) using service ID */
router.get("/find/:serviceId", (req, res, next) => {
  const serviceId = req.params.serviceId.toUpperCase();
  Failfix.findOne({ SRID: serviceId })
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
});

/**Create a new FFR */
router.post("/create", (req, res, next) => {
  const utcDate = new Date();
  FFRSequence.then(seq => { /**Get next sequence number to create SRID */
    const FFR = new Failfix({
      _id: new mongoose.Types.ObjectId(),
      SRID: "FFR" + seq.sequence_value,
      customerName: req.body.CustomerName,
      serviceType: "Fail Fix Request",
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
    FFR.save()
      .then(result => {
        res.status(201).json({
          result: result
        });
      })
      .catch((err) =>{
        res.status(500).json({
            result: 'Internal server error'
        });
      });
  });
});

/**Update sequence number to create FFRID */
const FFRSequence = Counters.findOneAndUpdate(
  { modelType: "FFR" },
  { $inc: { sequence_value: 1 } },
  { new: true }
);

module.exports = router;
