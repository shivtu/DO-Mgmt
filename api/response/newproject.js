const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Newproject = require("../model/newrprojectmodel");
const Validate = require("../controller/validate");
const Counters = require("../model/countersmodel");
const auth = require("../auth/authentication");

/*Find instance using service ID*/
router.get("/find/srid/:serviceId", (req, res, next) => {
  const serviceId = req.params.serviceId.toUpperCase();
  Newproject.findOne({ SRID: serviceId }).exec()
    .then(result => {
      res.status(200).json({ result: result });
    })
    .catch(e => res.status(200).json({ data: e.message }));
});

/*Find instance using service ID*/
router.get("/find/_id/:_Id", (req, res, next) => {
  const objectID = req.params._id.toUpperCase();
  Newproject.findById({ _id: objectID }).exec()
    .then(result => {
      res.status(200).json({ result: result });
    })
    .catch(e => res.status(200).json({ data: e.message }));
});

/* Find all instances*/
router.get("/find/findAll", (req, res, next) => {
  Newproject.find()
    .then(result => {
      res.status(200).json({ result: result });
    })
    .catch(e => res.status(500).json({ result: e.message }));
});

/* Find all instances conditionally*/
router.get("/find/filter", (req, res, next) => {
  // console.log('params',req.query);
  Newproject.find(req.query)
    .then(result => {
      res.status(200).json({ result: result });
    })
    .catch(e => res.status(500).json({ result: e.message }));
});

/**Create a NPR - New Project Request */
router.post(
  "/create",
  Validate.validationMethod.isUploadingfile,
  Validate.validationMethod.isProvidingUpdates,
  Validate.validationMethod.isClosingRequest,
  (req, res, next) => {
    // if(!productVersion.isArray() || productVersion[0] === undefined) {
    //   res.status(400).json({
    //     result: 'Product version is required'
    //   });
    //   return;
    // }
    NPRSequence.exec() /**Increament NPR sequence number */
      .then(seq => {
        const utcDate = new Date();
        const NPR = new Newproject({
          _id: new mongoose.Types.ObjectId(),
          SRID: "NPR" + seq.sequence_value,
          customerName: req.body.customerName,
          serviceType: "New Project Request",
          priority: req.body.priority,
          createdOn: utcDate.toUTCString(),
          createdBy: req.body.currentUser,
          summary: req.body.summary,
          description: req.body.description,
          assignedTo: req.body.assignedTo,
          phase: "created",
          repoLink: req.body.repoLink,
          childTasks: [],
          files: req.body.files,
          lifeCycle: [
            {
              assignedTo: req.body.assignedTo,
              assignedOn: utcDate.toUTCString()
            }
          ]
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
      .catch(seqErr => {
        res.status(500).json({
          result: seqErr
        });
      });
  }
);

/**Experimental route */
router.delete("/experiment/:_id", auth.authenticationMethod.authCheck, (req, res, next) => {

  res.status(200).json({
    auth: 'auth success'
  });
  
});

/**Delete request IDs */
router.delete("/delete/:_id", (req, res, next) =>{
  Newproject.findByIdAndRemove({ _id: req.params._id })
    .then(result => {
      res.status(200).json({
        result: result
      });
    })
    .catch(err => {
      next();
    });
});

/**update NPR, request body to be plain JSON object (Nested JSON not allowed) */
router.patch(
  "/update/:_id",
  Validate.validationMethod.isProvidingUpdates,
  Validate.validationMethod.isAssigningRequest,
  Validate.validationMethod.isUploadingfile,
  (req, res, next) => {
    Newproject.findByIdAndUpdate({ _id: req.params._id }, req.body, {
      new: true
    })
      .then(result => {
        res.status(200).json({
          result: result
        });
      })
      .catch(err => {
        result: err.message;
      });
  }
);

/**Update sequence number to create NPRID */
const NPRSequence = Counters.findOneAndUpdate(
  { modelType: "NPR" },
  { $inc: { sequence_value: 1 } },
  { new: true }
);

module.exports = router;
