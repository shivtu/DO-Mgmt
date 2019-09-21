const express = require("express");
const router = express.Router();
const Counters = require("../model/countersmodel");
const mongoose = require("mongoose");

router.get("/all", (req, res, next) => {
  Counters.find().then(result => {
    res.status(200).json({
      result: result
    });
  });
});

// router.post("/addCounter", (req, res, next) => {
//   const CTR = new Counters({
//     _id: new mongoose.Types.ObjectId(),
//     modelType: "CTR",
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

module.exports = router;
