const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Bugfix = require("../model/bugfixmodel");
const Counters = require("../model/countersmodel");
const Validate = require("../controller/validate");


/* Create a BFR */
router.post("/create",
Validate.validationMethod.getRecordById, // This methods sticks the result from DB to request body for consumption by other methods
Validate.validationMethod.isUploadingfile,
Validate.validationMethod.isAssigningBFR,
(req, res, next) => {
  BFRSequence.exec()
  .then((seq) =>{
    const utcDate = new Date();
    const BFR = new Bugfix({
    _id: new mongoose.Types.ObjectId(),
    SRID: 'BFR' + seq.sequence_value,
    customerName: req.body.customerName,
    product: req.body.product,
    affectedVersions: req.body.affectedVersions,
    serviceType: "Bug Fix Request",
    impact: req.body.impact,
    createdOn: utcDate.toUTCString(),
    priority: req.body.priority,
    tag: req.body.tag,
    createdBy: req.body.currentUser, //This will contain an object with userId, email, role and group props assigned by the accessToken
    assignedTo: req.body.assignedTo,
    summary: req.body.summary,
    description: req.body.description,
    recreationSteps: req.body.recreationSteps,
    status: "created",
    closedOn: "",
    resolutionNotes: req.body.resolutionNotes,
    updateNotes: req.body.updateNotes,
    NPRId: req.body.NPRId,
    files: req.body.files
    });
  BFR.save()
    .then(result => {
      res.status(201).json({
        result: result
      });
    })
    .catch((err) => {
      console.log(Date.now(), 'create BFR', err);
      res.status(400).json({
        result: 'Cannot create bugfix request'
      });
    });
  })
  .catch((seqErr) =>{
    console.log(Date.now(), 'create BFR sequence error', seqErr);
    res.status(500).json({
      result: 'Cannot create bugfix request'
    });
  });
});


/* find a BFR using SRID */
router.get("/find/SRID/:SRID", (req, res, next) => {
  const serviceId = req.params.SRID.toUpperCase();
  Bugfix.findOne({ 'SRID': serviceId }).exec()
    .then(result => {
      res.status(200).json({
        result: result
      });
    })
    .catch((e) =>{
      console.log(Date.now(), 'find a BFR using SRID', e);
      res.status(404).json({
        result: 'Record not found'
      });
    });
  });


/* Find all BFR */
router.get("/find/findAll", (req, res, next) =>{
  Bugfix.find().exec()
  .then((result) =>{
    res.status(200).json({
      result: result
    });
  })
  .catch((e) =>{
    console.log(Date.now(), 'Find all BFR', e);
    res.status(404).json({
      result: 'Record not found'
    });
  });
});


/* Find all BFR using limit */
router.get("/find/findAll/limit/:_limit", (req, res, next) =>{
  Bugfix.find().limit(req.params._limit|0).exec()
  .then(result => {
    res.status(200).json({ result: result });
  })
  .catch((e) => {
    console.log(Date.now(), 'Find all BFR using limit', e);
    res.status(404).json({ 
      result: 'Record not found' 
    });
  });
});


/* Find all BFR using filter */
router.get("/find/filter", (req, res, next) =>{
  Bugfix.find(req.query)
  .then(result => {
    res.status(200).json({ result: result });
  })
  .catch((e) =>{
    console.log(Date.now(), 'Find all BFR using filter', e);
    res.status(404).json({
      result: 'Record not found'
    });
  });
});


/* Find all BFR using filter with limit */
router.get("/find/filter/limit/:_limit", (req, res, next) =>{
  Bugfix.find(req.query).limit(req.params.limit|0).exec()
  .then(result => {
    res.status(200).json({ result: result });
  })
  .catch((e) =>{
    console.log(Date.now(), 'Find all BFR using filter with limit', e);
    res.status(404).json({
      result: 'Record not found'
    });
  });
});


/* Update BFR */
router.patch('/update/:_id',
Validate.validationMethod.isUploadingfile,
Validate.validationMethod.isAssigningBFR,
(req, res, next) =>{
  Bugfix.findByIdAndUpdate({'_id': req.params.SRID}, req.body, {new: true}).exec()
  .then()
  .catch((e) =>{
    console.log(Date.now(), 'Update BFR', e);
    res.status(404).json({
      result: 'Cannot update BFR'
    });
  });
});

/* Delete a BFR */
router.delete('/delete/:_id', (req, res, next) =>{
  Bugfix.findByIdAndDelete(req.params._id).exec()
  .then((result) =>{
    res.status(200).json({
      result: result.SRID + ' Deleted successfully'
    });
  })
  .catch((e) =>{
    console.log(Date.now(), 'Delte BFR', e);
    res.status(404).json({
      result: 'Record not found'
    });
  })
});


// /* Delete all BFRs, **You will never want this in production*** */
// router.delete('/deleteAll', (req, res, next) =>{
//   Bugfix.deleteMany({})
//   .then((deletedRecords) =>{
//     res.status(200).json({
//       result: deletedRecords
//     });
//   }).catch((e) =>{
//     res.status(200).json({
//       result: e
//     });
//   })
// });


/* Update sequence number to create BFRID */
const BFRSequence = Counters.findOneAndUpdate(
  { modelType: "BFR" },
  { $inc: { sequence_value: 1 } },
  { new: true }
);

module.exports = router;
