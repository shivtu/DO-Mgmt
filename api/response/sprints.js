const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const NewSprint = require("../model/sprintsmodel");
const NewEpic = require("../model/epicsmodel");
const Validate = require("../controller/validate");
const Counters = require("../model/countersmodel");

router.post("/create/:SRID",
Validate.validationMethod.getEpicSprints,
Validate.validationMethod.validateSPRMemberList,
(req, res, next) =>{
    SPRSequence.exec().then((seq) => {
        const utcDate = new Date();
        const SPR = new NewSprint({
            _id: new mongoose.Types.ObjectId(),
            SRID: "SPR" + seq.sequence_value,
            EPCID: req.params.SRID,
            NPRID: req.body.NPRID,
            serviceType: 'Sprint',
            createdOn: utcDate.toUTCString(),
            createdBy: req.body.currentUser, //This will contain an object with userId, email, role and group props assigned by the accessToken
            summary: req.body.summary,
            toDo: req.body.toDo,
            doing: req.body.doing,
            done: req.body.done,
            memberList: req.body.memberList,
            labels: req.body.labels,
            files: []
        });
        SPR.save()
        .then((result) =>{
            const SPRResult = result;
            req.body.sprintArrayinEpic.push(SPRResult.SRID); /**Push the newly created SPR to existing array of Epic
                                                                sprints received from Validate.js (getEpicSprintsmethod) */
            const newSprintsArrayForEpic = req.body.sprintArrayinEpic;
            sprResult = result;
            /**Update sprints field in Epic */
            NewEpic.findOneAndUpdate({'SRID':req.params.SRID}, {sprints: newSprintsArrayForEpic}, {new: true})
            .then((result) =>{
                res.status(201).json({
                    result: sprResult
                });
            }).catch((error) =>{
                res.status(500).json({
                    result: 'Internal server error',
                    message: error.message
                });
            });
        })
        .catch((error) =>{
            res.status(500).json({
                result: 'Could not create an epic',
                message: error.message
            });
        });
    })
    .catch((e) =>{
        res.status(500).json({
            result: 'Internal server error'
        });
        console.log('cannot create sequence', e);
    });
});

/* Update toDo Items */
router.patch("/update/toDoItems/:SRID",
Validate.validationMethod.isUpdatingtoDoSprints,
(req, res, next) =>{
    NewSprint.findOneAndUpdate({'SRID': req.params.SRID, }, req.body.toDo, { new: true }).exec()
    .then((result) =>{
        res.status(201).json({
            result: result
        });
    })
    .catch((error) =>{
        res.status(500).json({
            result: 'internal server error'
        });
    });
});


/* Update doing Items */
router.patch("/update/doingItems/:SRID",
Validate.validationMethod.isUpdatingDoingSprints,
(req, res, next) =>{
    NewSprint.findOneAndUpdate({'SRID': req.params.SRID, }, req.body, { new: true }).exec()
    .then((result) =>{
        res.status(201).json({
            result: result
        });
    })
    .catch((error) =>{
        console.log(Date.now(), error);
        res.status(500).json({
            result: 'internal server error'
        });
    });
});


/* Update done Items */
router.patch("/update/doneItems/:SRID",
Validate.validationMethod.isUpdatingDoneSprints,
(req, res, next) =>{
    NewSprint.findOneAndUpdate({'SRID': req.params.SRID, }, req.body, { new: true }).exec()
    .then((result) =>{
        res.status(201).json({
            result: result
        });
    })
    .catch((error) =>{
        console.log(Date.now(), error);
        res.status(500).json({
            result: 'internal server error'
        });
    });
});


/*add member to a Sprint */
router.patch("/update/memberList/add/:SRID",
Validate.validationMethod.getRecordBySRID,
Validate.validationMethod.validateSPRMemberList,
(req, res, next) =>{
    NewSprint.findOneAndUpdate({'SRID': req.params.SRID}, req.body, {new: true}).exec()
    .then((result) =>{
        res.status(200).json({
            result: result
        });
    })
    .catch((e) =>{
        res.status(500).json({
            result: 'Could not update the Sprint'
        });
    });
});


/* remove a member from sprint */
router.patch("/update/memberList/remove/:SRID",
Validate.validationMethod.getRecordBySRID,
Validate.validationMethod.validateSPRMemberList,
(req, res, next) =>{
    NewSprint.findOneAndUpdate({'SRID': req.params.SRID}, req.body, {new: true}).exec()
    .then((result) =>{
        res.status(200).json({
            result: result
        });
    })
    .catch((e) =>{
        res.status(500).json({
            result: 'Could not update the Sprint'
        });
    });
});


/* create a new member list in the sprint */
router.patch("/update/memberList/new/:SRID",
Validate.validationMethod.getRecordBySRID,
Validate.validationMethod.validateSPRMemberList,
(req, res, next) =>{
    NewSprint.findOneAndUpdate({'SRID': req.params.SRID}, req.body, {new: true}).exec()
    .then((result) =>{
        res.status(200).json({
            result: result
        });
    })
    .catch((e) =>{
        res.status(500).json({
            result: 'Could not update the Sprint'
        });
    });
});


/* Find all instances*/
router.get("/find/findAll", (req, res, next) => {
    NewSprint.find().exec()
      .then(result => {
        res.status(200).json({ result: result });
      })
      .catch((e) => {
          res.status(404).json({ 
              result: 'No records found' 
            });
        });
  });


  /* Find all sprints with a limit */
  router.get("/find/findAll/:_limit", (req, res, next) => {
    NewSprint.find().limit(req.params._limit | 0).exec()
      .then(result => {
        res.status(200).json({ result: result });
      })
      .catch((e) => {
        res.status(404).json({ 
            result: 'No records found' 
          });
      });
  });


/* Find all instances conditionally*/
router.get("/find/filter", (req, res, next) => {
    NewSprint.find(req.query)
      .then(result => {
        res.status(200).json({ result: result });
      })
      .catch(e => res.status(500).json({ result: e.message }));
  });

  /* Find all sprints using filter with a limit */
  router.get("/find/filter/:_limit", (req, res, next) => {
    NewSprint.find(req.query).limit(req.params._limit).exec()
      .then(result => {
        res.status(200).json({ result: result });
      })
      .catch((e) => {
        res.status(404).json({ 
            result: 'No records found' 
          });
      });
  });


/* Find SPRINT using SRID*/
router.get("/find/srid/:SRID", (req, res, next) => {
    NewSprint.findOne({"SRID":req.params.SRID})
      .then(result => {
        res.status(200).json({ result: result });
      })
      .catch((e) => {
        res.status(404).json({ 
            result: 'No records found' 
          });
      });
  });

router.delete('/delete/:_id', (req, res, next) =>{
    NewSprint.findByIdAndDelete({'_id': req.params._id}).exec()
    .then((result) =>{
        res.status(200).json({
            result: result.SRID + ' Deleted'
        });
    })
    .catch((err) =>{
        console.log(Date.now(), err);
        res.status(404).json({
            result: 'Sprint not found'
        });
    });
});


/**Update sequence number to create NPRID */
const SPRSequence = Counters.findOneAndUpdate(
    { modelType: "SPR" },
    { $inc: { sequence_value: 1 } },
    { new: true }
  );

module.exports = router;