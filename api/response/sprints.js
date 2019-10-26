const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const NewSprint = require("../model/sprintsmodel");
const NewEpic = require("../model/epicsmodel");
const Validate = require("../controller/validate");
const Counters = require("../model/countersmodel");
const auth = require("../auth/authentication");

router.post("/create/:SRID", Validate.validationMethod.getEpicSprints,
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
            console.log(req.body.currentSprintArrayinEpic);
        })
        .catch((error) =>{
            res.status(500).json({
                result: 'Could not create an epic',
                message: error.message
            });
        });
    })
    .catch((e) =>{
        console.log('cannot create sequence', e);
    });
});

router.patch("/update/:SRID",(req, res, next) =>{
    NewSprint.findOneAndUpdate({SRID: req.params.SRID, }, req.body, { new: true })
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

/* Find all instances*/
router.get("/find/findAll", (req, res, next) => {
    NewSprint.find()
      .then(result => {
        res.status(200).json({ result: result });
      })
      .catch(e => res.status(500).json({ result: e.message }));
  });

/* Find all instances conditionally*/
router.get("/find/filter", (req, res, next) => {
    NewSprint.find(req.query)
      .then(result => {
        res.status(200).json({ result: result });
      })
      .catch(e => res.status(500).json({ result: e.message }));
  });


/* Find SPRINT using SRID*/
router.get("/find/srid/:SRID", (req, res, next) => {
    NewSprint.findOne({"SRID":req.params.SRID})
      .then(result => {
        res.status(200).json({ result: result });
      })
      .catch(e => res.status(500).json({ result: e.message }));
  });

/* Find all instances conditionally*/
router.get("/find/filter", (req, res, next) => {
    NewSprint.find(req.query)
      .then(result => {
        res.status(200).json({ result: result });
      })
      .catch(e => res.status(500).json({ result: e.message }));
  });


/**Update sequence number to create NPRID */
const SPRSequence = Counters.findOneAndUpdate(
    { modelType: "SPR" },
    { $inc: { sequence_value: 1 } },
    { new: true }
  );

module.exports = router;