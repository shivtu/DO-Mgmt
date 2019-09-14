const express = require("express");
const router = express.Router();
const Counters = require("../model/countersmodel");

router.get("/all", (req, res, next) => {
  Counters.find().then(result => {
    res.status(200).json({
      result: result
    });
  });
});

module.exports = router;
