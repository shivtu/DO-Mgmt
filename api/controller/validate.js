const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Newproject = require("../model/newrprojectmodel");
const Bugfix = require("../model/bugfixmodel");

/*
  Check if the ticket is assigned to a user
  If ticket is not assigned, do not allow update
*/
function shouldStatusUpdate (req, res, next){
  if(req.body.status !== undefined) { /**check if the user is trying to update the status */
    Newproject.findById({ _id: req.params._id})
    .then(result => {
      if(result.assignedTo !== undefined){ /**check if the request is assigned to a user before updating the status */
        next();
      }else {
        res.status(400).json({
          data: 'request must be assigned'
        });
      }
    }).catch((err) =>{
      res.status(404).json({
        data: 'record not found'
      });
    });
  } else{
    next();
  }  
}

/* Check if the user exists in the record or not */
const doesUserExist = new Promise((resolve, reject) =>{
    resolve('user');
});

const validateArray = [shouldStatusUpdate, doesUserExist];

module.exports = validateArray;