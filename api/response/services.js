const express = require("express");
const router = express.Router();
const Bugfix = require("../model/bugfixmodel");
const Newprojects = require("../model/newrprojectmodel");
const Users = require("../model/usermodel");
const UserAuth = require("../model/userauthmodel");

router.get("/find/:serviceid", (req, res, next) => {
  const serviceid = req.params.serviceid.toUpperCase();

  // Check if it is a BFR
  if (serviceid.includes("BFR")) {
    Bugfix.findOne({ SRID: serviceid })
      .then(result => {
        res.status(200).json({
          status: result
        });
      })
      .catch(e =>
        res.status(200).json({
          status: e.message
        })
      );

    // Check if it is NPR
  } else if (serviceid.includes("NPR")) {
    Newprojects.findOne({ SRID: serviceid })
      .then(result => {
        res.status(200).json({ status: result });
      })
      .catch(e => res.status(200).json({ status: e.message }));
  } else if (serviceid.includes("FFR")) {
  } else {
    res.status(404).json({ status: "The search ID has to be BFR, NPR or FFR" });
  }
});


router.get('/allUsers', (req, res, next) =>{
  Users.find().exec()
  .then(result =>{
    res.status(200).json({
      result: result
    });
  })
  .catch()
});


router.get('/allUserCreds', (req, res, next) =>{
  UserAuth.find().exec()
  .then(result =>{
    res.status(200).json({
      result: result
    });
  })
  .catch()
});


router.delete('/deleteUserProfile/:_id', (req, res, next) =>{
  Users.findByIdAndDelete({'_id': req.body._id}).exec()
  .then(result =>{
    res.send({result});
  });
});


router.delete('/deleteUserCreds/:_id', (req, res, next) =>{
  UserAuth.findByIdAndDelete({'_id': req.body._id}).exec()
  .then(result =>{
    res.send({result});
  });
});



router.post("/create", (req, res, next) => {
  res.status(200).json({
    message: "create faults"
  });
});

module.exports = router;
