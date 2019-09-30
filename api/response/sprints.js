const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const NewSprint = require("../model/sprintsmodel");
const NewEpic = require("../model/epicsmodel");
const Validate = require("../controller/validate");
const Counters = require("../model/countersmodel");
const auth = require("../auth/authentication");

router.post("/create/:SRID", Validate.validationMethod.doesEPCExist,
(req, res, next) =>{
    // console.log(typeof (req.body.backLogs));
    SPRSequence.exec().then((seq) => {
        const utcDate = new Date();
        // console.log(req.body);
        const SPR = new NewSprint({
            _id: new mongoose.Types.ObjectId(),
            SRID: "SPR" + seq.sequence_value,
            EPCID: req.params.SRID,
            NPRID: req.body.NPRID,
            serviceType: 'Sprint',
            createdOn: utcDate.toUTCString(),
            createdBy: req.body.createdBy,
            summary: req.body.summary,
            toDo: req.body.toDo,
            doing: req.body.doing,
            done: req.body.done,
            files: []
        });
        SPR.save()
        .then((result) =>{
            res.status(201).json({
                result: result
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
router.get("/findAll", (req, res, next) => {
    NewSprint.find()
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