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

// router.post("/addCounter", (req, res, next) => {
//   const CTR = new Counters({
//     _id: new mongoose.Types.ObjectId(),
//     modelType: "SPR",
//     sequence_value: 1,
//   });
//   CTR.save().then((result) =>{
//     res.status(201).json({
//       result: result
//     });
//   })
//   .catch((err) =>{
//     res.status(500).json({
//       result: err
//     });
//   });
// });

router.delete("/delete/:_id", (req, res, next) =>{

});

module.exports = router;
