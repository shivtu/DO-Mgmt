const express = require("express");
const router = express.Router();
const Counters = require("../model/countersmodel");
const mongoose = require("mongoose");

router.get("/all", (req, res, next) => {
  Counters.find().then(result => {
    res.status(200).json({
      result: result
    });
  }).catch((err) =>{
    console.log('cannot get counters', err);
  });
});

router.post("/addCounter/FFR", (req, res, next) => {
  const CTR = new Counters({
    _id: new mongoose.Types.ObjectId(),
    modelType: "FFR",
    sequence_value: 1,
  });
  CTR.save().then((result) =>{
    res.status(201).json({
      result: result,
      warning: "This query must be executed strictly once and only once while initial setup"
    });
  })
  .catch((err) =>{
    res.status(500).json({
      result: err
    });
  });
});

router.post("/addCounter/BFR", (req, res, next) => {
  const BFR = new Counters({
    _id: new mongoose.Types.ObjectId(),
    modelType: "BFR",
    sequence_value: 1,
  });
  BFR.save().then((result) =>{
    res.status(201).json({
      result: result,
      warning: "This query must be executed strictly once and only once while initial setup"
    });
  })
  .catch((err) =>{
    res.status(500).json({
      result: err
    });
  });
});

router.post("/addCounter/NPR", (req, res, next) => {
  const NPR = new Counters({
    _id: new mongoose.Types.ObjectId(),
    modelType: "NPR",
    sequence_value: 1,
  });
  NPR.save().then((result) =>{
    res.status(201).json({
      result: result,
      warning: "This query must be executed strictly once and only once while initial setup"
    });
  })
  .catch((err) =>{
    res.status(500).json({
      result: err
    });
  });
});

router.post("/addCounter/SPR", (req, res, next) => {
  const CTR = new Counters({
    _id: new mongoose.Types.ObjectId(),
    modelType: "SPR",
    sequence_value: 1,
  });
  SPR.save().then((result) =>{
    res.status(201).json({
      result: result,
      warning: "This query must be executed strictly once and only once while initial setup"
    });
  })
  .catch((err) =>{
    res.status(500).json({
      result: err
    });
  });
});


router.post("/addCounter/EPC", (req, res, next) => {
  const EPC = new Counters({
    _id: new mongoose.Types.ObjectId(),
    modelType: "FFR",
    sequence_value: 1,
  });
  EPC.save().then((result) =>{
    res.status(201).json({
      result: result,
      warning: "This query must be executed strictly once and only once while initial setup"
    });
  })
  .catch((err) =>{
    res.status(500).json({
      result: err
    });
  });
});


router.post("/addCounter/USER", (req, res, next) => {
  const USER = new Counters({
    _id: new mongoose.Types.ObjectId(),
    modelType: "FFR",
    sequence_value: 1,
  });
  USER.save().then((result) =>{
    res.status(201).json({
      result: result,
      warning: "This query must be executed strictly once and only once while initial setup"
    });
  })
  .catch((err) =>{
    res.status(500).json({
      result: err
    });
  });
});

router.delete("/delete/:_id", (req, res, next) =>{

});

module.exports = router;
