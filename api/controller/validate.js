const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Newproject = require("../model/newrprojectmodel");
const Bugfix = require("../model/bugfixmodel");


/* Check if the user exists in the record or not */
validateMethods = {
  isAssigningRequest: (req, res, next) => {
    setTimeout(function(){ console.log('in 5 secs'); next() }, 5000);
  }
  
}


// const validateArray = [shouldStatusUpdate, someFunction];

exports.validationMethod = validateMethods;