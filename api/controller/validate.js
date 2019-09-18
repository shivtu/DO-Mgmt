const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Newproject = require("../model/newrprojectmodel");
const Bugfix = require("../model/bugfixmodel");
const fs = require("fs");


validateMethods = {
  /**Check if user is assigning the request to other user
   * If true, add/overwrite status = in-progress
   */
  isAssigningRequest: (req, res, next) => {
    const utcDate = new Date();
    if(req.body.assignedTo !== 'undefined') {
      req.body['status'] = 'in-progress';
      Newproject.findById({_id: req.params._id})
      .then((result) =>{
        (result.lifeCycle).push({assignedTo: req.body.assignedTo, assignedOn: utcDate.toUTCString()});
        req.body['lifeCycle'] = result.lifeCycle;
        next();
      })
      .catch((err) =>{
        res.status(500).json({
          result: err.message
        });
      });
      req.body['lifeCycle'] = [{assignedTo: req.body.assignedTo, assignedOn: utcDate.toUTCString()}]
    }
  },


  /**Check if user is trying to upload file */
  isUploadingfile : (req, res, next) => {
    if(req.body.files === undefined && req.params._id === undefined) { /**check if user is trying to upload file to new NPR */
      req.body.files = []; /**always set initial state of files to empty array */
      next();
    } else if(req.body.files !== undefined && req.params._id === undefined) { /**user is trying to upload file to new NPR */
      this.validationMethod.saveFile(req, res, next)
      .then((savedFilePaths) =>{ /**save the new files object in array returned by the promise wrapped in saveFile method */
        req.body.files = [savedFilePaths];
            next();
        })
      .catch((err) => {
        res.status(500).json({
          result: err.message
        });
      });
    } else if( req.body.files !== undefined && req.params._id !== undefined) { /**user is trying to upload file
                                                                                to existing ticket, find existing 
                                                                                array of file field and push new JSON 
                                                                                object to existing array of file field */
      Newproject.findById(req.params._id).then((result) =>{
        
      this.validationMethod.saveFile(req, res, next)
      .then((savedFilePaths) => {
        (result.files).push(savedFilePaths); /**search for existing files array 
                                            in the record and push the new files 
                                            object into the retrieved array */
        req.body.files = result.files;
        next();
      })
      .catch((err) =>{
        res.status(500).json({
          result: err.message
        });
      });
      }).catch((err) =>{
        res.status(500).json({
          result: err.message
        });
      });
    } else if(req.body.files === undefined && req.params._id !== undefined) {
      next();
    }
  },

  /**isFileSaved promise wrapped in saveFile function that returns the promise for cunsmption by other methods  */
  saveFile: (req, res, next) =>{
    isFileSaved= new Promise((resolve, reject) =>{
    const originalFileName = req.body.files[0];
    const fileContent = req.body.files[1];
    const rand = Math.floor(Math.random() * Math.floor(10));
    const newFileName = Date.now().toString() + rand + originalFileName;
    const uploadFolder = process.env.HOME+"\\desktop\\";
    /**NodeJS file system (fs) to write Base64 string to disk as file*/
    fs.writeFile(uploadFolder + newFileName, new Buffer(fileContent, "base64"), (err) =>{
      if(err)
      {
        res.status(500).json({ /**If file cannot be saved send response immediately without further routing */
          result: 'could not save file'
        })
      }
      else{
          /**return the saved file details as JSON object */
          resolve({originalFileName: originalFileName, filePath: uploadFolder + newFileName});
        }
      });
    });
    return isFileSaved;
  },

  _promise: new Promise((resolve, reject) =>{
    
  })
}

exports.validationMethod = validateMethods;