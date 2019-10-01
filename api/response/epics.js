const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const NewEpic = require("../model/epicsmodel");
const Validate = require("../controller/validate");
const Counters = require("../model/countersmodel");
const auth = require("../auth/authentication");

router.post("/create/:SRID", Validate.validationMethod.doesNPRExist, (req, res, next) =>{
    // console.log(typeof (req.body.backLogs));
    EPCSequence.exec().then((seq) => {
        const utcDate = new Date();
        const EPC = new NewEpic({
            _id: new mongoose.Types.ObjectId(),
            SRID: "EPC" + seq.sequence_value,
            NPRID: req.params.SRID,
            serviceType: 'Epic',
            createdOn: utcDate.toUTCString(),
            createdBy: req.body.createdBy,
            summary: req.body.summary,
            backLogs: req.body.backLogs,
            files: [],
            sprints: []
        });
        EPC.save()
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

/**Find Epic using SRID */
router.get("/find/SRID/:SRID", (req, res, next) =>{
    NewEpic.findOne({SRID: req.params.SRID})
    .then((result) =>{
        console.log(result)
        if(result === null) {
            res.status(404).json({ result: 'no records found' });
        } else {
            res.status(200).json({ result: result });
        }
    })
    .catch((error) => {
        res.status(500).json({
            result: 'internal server error'
        });
    });
});

/* Find all instances*/
router.get("/find/findAll", (req, res, next) => {
    NewEpic.find()
      .then(result => {
        if(result.length < 1) {
            res.status(404).json({ result: 'no records found' });
        } else {
            res.status(200).json({ result: result });
        }
      })
      .catch(e => res.status(500).json({ result: e.message }));
  });

/* Find all instances conditionally*/
router.get("/find/filter", (req, res, next) => {
    NewEpic.find(req.query)
      .then(result => {
        if(result.length < 1) {
            res.status(404).json({ result: 'no records found' });
        } else {
            res.status(200).json({ result: result });
        }
      })
      .catch(e => res.status(500).json({ result: e.message }));
  });


/**Update sequence number to create NPRID */
const EPCSequence = Counters.findOneAndUpdate(
    { modelType: "EPC" },
    { $inc: { sequence_value: 1 } },
    { new: true }
  );

module.exports = router;