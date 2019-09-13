const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Newproject = require("../model/newrprojectmodel");

const requestAssignedTo = new Promise((resolve, reject) => {
    resolve('assignedTo');
  });

const doesUserExist = new Promise((resolve, reject) =>{
    resolve('user');
});

const validateArray = [requestAssignedTo, doesUserExist];

module.exports = validateArray;