const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Newproject = require("../model/newrprojectmodel");
const Validate = require("../controller/validate");

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
  NPR.save()
    .then(result => {
      res.status(201).json({
        data: result
      });
    })
    .catch(e => {
      console.log(e.message);
    });
});

/**update NPR, request body to be plain JSON object (Nested JSON not allowed) */
router.patch("/update/:_id", (req, res, next) => {
  Newproject.findByIdAndUpdate(
    { _id: req.params._id },
    { $set: req.body },
    { new: true }
  ) /**{new: true} parameter returns the updated object */
    .then(result => {
      res.status(200).json({
        data: result
      });
    })
    .catch(err => {
      res.status(404).json({
        data: "record not found"
      });
    });
});

router.patch("/experiment", Validate.validationMethod.isAssigningRequest, (req, res, next) => {
  res.status(200).json({
    result:'after 5 seconds'
  })
});

module.exports = router;
