const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const NewEpic = require("../model/epicsmodel");
const NewProject = require("../model/newrprojectmodel");
const Validate = require("../controller/validate");
const Counters = require("../model/countersmodel");

router.post(
  "/create/:SRID",
  Validate.validationMethod.doesNPRExist,
  Validate.validationMethod.isEpicBackLogOk,
  Validate.validationMethod.isUploadingfile,
  (req, res, next) => {
    EPCSequence.exec()
      .then(seq => {
        const utcDate = new Date();
        const EPC = new NewEpic({
          _id: new mongoose.Types.ObjectId(),
          SRID: "EPC" + seq.sequence_value,
          productVersion: req.body.productVersion,
          NPRID: req.params.SRID,
          serviceType: "Epic",
          createdOn: utcDate.toUTCString(),
          createdBy: req.body.currentUser, //This will contain an object with userId, email, role and group props assigned by the accessToken
          summary: req.body.summary,
          backLogs: req.body.backLogs,
          files: req.body.files,
          sprints: []
        });
        EPC.save()
          .then(result => {
            
            (req.body.currentNPREpicsArray).push(result.SRID);
            const newNPREpicsArray = req.body.currentNPREpicsArray;

            NewProject.findOneAndUpdate({'SRID': req.params.SRID}, {epics: newNPREpicsArray}, {new:true})
            .then((NPRUpdatedResult) =>{
                res.status(201).json({
                    result: result
                });
            })
            .catch((err) =>{
                res.status(500).json({
                    result: 'Could not update epics in NPR with new EPIC'
                });
                console.log(err);
            });
          })
          .catch(error => {
            res.status(400).json({
              result: "Could not create an epic",
              message: 'https://github.com/shivtu/DO-Mgmt'
            });
          });
      })
      .catch((e) => {
        res.status(500).json({
          result: 'Internal server error'
        });
        console.log("cannot create sequence", e);
      });
  }
);


/* Update epic */
router.patch('/update/:_id',
Validate.validationMethod.getRecordById,
Validate.validationMethod.isUploadingfile,
Validate.validationMethod.isUpdatingEPCExceptions,
(req, res, next) =>{
  NewEpic.findOneAndUpdate({'_id': req.params._id}, req.body, {new: true}).exec()
  .then((result) =>{
    res.status(200).json({
      result: result
    });
  })
  .catch((e) =>{
    res.status(500).json({
      result: 'Could not update EPIC'
    });
    console.log(e);
  });
});

/* Find all instances*/
router.get("/find/findAll", (req, res, next) => {
  NewEpic.find().exec()
    .then(result => {
      if (result.length < 1) {
        res.status(404).json({ result: "no records found" });
      } else {
        res.status(200).json({ result: result });
      }
    })
    .catch(e => res.status(500).json({ result: e.message }));
});

/* Find all instances using a limit */
router.get("/find/findAll/:_limit", (req, res, next) => {
  NewEpic.find().limit(req.params._limit|0).exec()
    .then(result => {
      if (result.length < 1) {
        res.status(404).json({ result: "no records found" });
      } else {
        res.status(200).json({ result: result });
      }
    })
    .catch(e => res.status(500).json({ result: e.message }));
});

/* Find all instances conditionally*/
router.get("/find/filter", (req, res, next) => {
  NewEpic.find(req.query).exec()
    .then(result => {
      if (result.length < 1) {
        res.status(404).json({ result: "no records found" });
      } else {
        res.status(200).json({ result: result });
      }
    })
    .catch(e => res.status(500).json({ result: e.message }));
});

router.get("/find/filter/:_limit", (req, res, next) => {
  NewEpic.find(req.query).limit(req.params._limit|0).exec()
    .then(result => {
      if (result.length < 1) {
        res.status(404).json({ result: "no records found" });
      } else {
        res.status(200).json({ result: result });
      }
    })
    .catch(e => res.status(500).json({ result: e.message }));
});

/**Find Epic using SRID */
router.get("/find/SRID/:SRID", (req, res, next) => {
  NewEpic.findOne({ "SRID": req.params.SRID }).exec()
    .then(result => {
      console.log(result);
      if (result === null) {
        res.status(404).json({ result: "no records found" });
      } else {
        res.status(200).json({ result: result });
      }
    })
    .catch(error => {
      res.status(500).json({
        result: "internal server error"
      });
    });
});



// /* Delete an Epic */
// router.delete('/delete/:_id', (req, res, next) =>{
//   NewEpic.findByIdAndDelete({'_id': req.params._id}).exec()
//   .then((deletedEpic) =>{
//     res.status(200).json({
//       result: deletedEpic.SRID + ' Delted successfully'
//     });
//   })
//   .catch((err) =>{
//     console.log(Date.now(), err);
//     res.status(404).json({
//       result: 'Record not found'
//     });
//   });
// });


// /* Delete all Epics, **You will never want this in production*** */
// router.delete('/deleteAll', (req, res, next) =>{
//   NewEpic.deleteMany({})
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

/**Update sequence number to create NPRID */
const EPCSequence = Counters.findOneAndUpdate(
  { modelType: "EPC" },
  { $inc: { sequence_value: 1 } },
  { new: true }
);

module.exports = router;
