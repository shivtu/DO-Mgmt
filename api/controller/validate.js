const express = require("express");
const Newproject = require("../model/newrprojectmodel");
const NewEpic = require("../model/epicsmodel");
const Bugfix = require("../model/bugfixmodel");
const fs = require("fs");

validateMethods = {

  doesEPCExist: (req, res, next) =>{
    NewEpic.findOne({SRID: req.params.SRID})
    .then((result) =>{
      if(result.SRID === req.params.SRID) {
        req.body['NPRID'] = result.NPRID; 
        next();
      } else {
        res.status(400).json({
          result: 'EPIC not found'
        });
      }
    })
    .catch((error) =>{
      res.status(500).json({
        result: 'Could not find EPIC'
      });
    });
  },

  doesNPRExist: (req, res, next) =>{
    Newproject.findOne({ SRID: req.params.SRID })
    .then((result) => {
      if(result.SRID === req.params.SRID) {
        next();
      } else {
        res.status(400).json({
          result: 'NPRID not found',
        });
      }
    })
    .catch(err => {
      res.status(400).json({
        result: 'NPR not found'
      });
    });
  },
  /**Check if user is assigning the request to other user
   * If true, add/overwrite status = in-progress
   */
  isAssigningRequest: (req, res, next) => {
    const utcDate = new Date();
    if (req.body.assignedTo !== undefined) {
      req.body["status"] = "in-progress"; //Always put request to in-progress state if the request is being assigned to another user
      Newproject.findById({ _id: req.params._id })
        .then(result => {
          result.lifeCycle.push({
            assignedTo: req.body.assignedTo,
            assignedOn: utcDate.toUTCString()
          });
          req.body["lifeCycle"] = result.lifeCycle;
          next();
        })
        .catch(err => {
          res.status(500).json({
            result: err.message
          });
        });
      req.body["lifeCycle"] = [
        { assignedTo: req.body.assignedTo, assignedOn: utcDate.toUTCString() }
      ];
    } else {
      next();
    }
  },

  /**Check if user is closing/canceling the request */
  isClosingRequest: (req, res, next) => {
    if(req.body.status === 'completed' || req.body.status === 'canceled') {
      const utcDate = new Date();
      req.body['closedOn'] = utcDate.toUTCString();
    }
    next();
  },

  /**Check if user is providing update notes */
  isProvidingUpdates: (req, res, next) =>{
    const originalUrlContent = req.originalUrl.split('/');
    if(originalUrlContent[4] !== 'update' && req.body.updateNotes !== undefined){ /**User is trying to provide update to a new request */
      switch(originalUrlContent[3]) {
        case 'newproject':
          res.status(400).json({
            result: 'cannot insert update notes without creating NPR'
          });
        case 'bugfix':
          res.status(400).json({
            result: 'cannot insert update notes without creating BFR'
          });
        case 'failfix':
          res.status(400).json({
            result: 'cannot insert update notes without creating FFR'
          });
        default:
          res.status(500).json({
            result: 'something just broke',
            message: 'was the web service recently upgraded?'
          });  
      }
    } else if((req.body.updateNotes).length === 2) {
      const baseUrlContent = req.baseUrl.split("/");
      let requestType = baseUrlContent[baseUrlContent.length - 1];
      
      switch(requestType){
        case 'newproject':
          requestType = Newproject
          break;
        case 'bugfix':
          requestType = Bugfix
          break;
        default:
          break;
      }

      requestType.findById(req.params._id)
      .then((result) =>{
        const newNote = {summary:req.body.updateNotes[0], description: req.body.updateNotes[1]}
        result.updateNotes.push(newNote);
        req.body.updateNotes = result.updateNotes;
        next();
      })
      .catch((error) =>{
        result.status(500).json({
          result: error.message
        });
      });
    } else {
      res.status(400).json({
        result: 'updateNotes can be an array of length 2 only'
      });
    }
  },

  /**Check if user is trying to upload file */
  isUploadingfile: (req, res, next) => {
    if (req.body.files === undefined && req.params._id === undefined) {
      /**check if user is trying to upload file to new NPR */
      req.body.files = []; /**always set initial state of files to empty array */
      next();
    } else if (req.body.files !== undefined && req.params._id === undefined) {
      /**user is trying to upload file to new NPR */
      this.validationMethod
        .saveFile(req, res, next)
        .then(savedFilePaths => {
          /**save the new files object in array returned by the promise wrapped in saveFile method */
          req.body.files = [savedFilePaths];
          next();
        })
        .catch(err => {
          res.status(500).json({
            result: err.message
          });
        });
    } else if (req.body.files !== undefined && req.params._id !== undefined) {
      /**user is trying to upload file
      to existing ticket, find existing 
      array of file field and push new JSON 
      object to existing array of file field */

      const baseUrlContent = req.baseUrl.split("/");
      let requestType = baseUrlContent[baseUrlContent.length - 1];
      switch (
        requestType /**switch between service request type to search existing array of file field
                             depending upon the request made by the user */
      ) {
        case "newproject":
          requestType = Newproject;
          break;
        case "bugfix":
          requestType = Bugfix;
          break;
        default:
          break;
      }
      requestType
        .findById(req.params._id)
        .then(result => {
          this.validationMethod
            .saveFile(req, res, next)
            .then(savedFilePaths => {
              result.files.push(
                savedFilePaths
              ); /**search for existing files array 
                  in the record and push the new files 
                  object into the retrieved array */
              req.body.files = result.files;
              next();
            })
            .catch(err => {
              res.status(500).json({
                result: err.message
              });
            });
        })
        .catch(err => {
          res.status(500).json({
            result: err.message
          });
        });
    } else if (req.body.files === undefined && req.params._id !== undefined) {
      next();
    }
  },

  /**isFileSaved promise wrapped in saveFile function that returns the promise for cunsmption by other methods  */
  saveFile: (req, res, next) => {
    if (req.body.files.length !== 2) {
      res.status(400).json({
        result: "request body files array can be of length 2 only"
      });
    }
    isFileSaved = new Promise((resolve, reject) => {
      const originalFileName = req.body.files[0];
      const fileContent = req.body.files[1];
      const rand = Math.floor(Math.random() * Math.floor(10));
      const newFileName = Date.now().toString() + rand + originalFileName;
      const uploadFolder = process.env.HOME + "\\desktop\\";
      /**NodeJS file system (fs) to write Base64 string to disk as file*/
      fs.writeFile(
        uploadFolder + newFileName,
        new Buffer(fileContent, "base64"),
        err => {
          if (err) {
            res.status(500).json({
              /**If file cannot be saved send response immediately without further routing */
              result: "could not save file"
            });
          } else {
            /**return the saved file details as JSON object */
            resolve({
              originalFileName: originalFileName,
              filePath: uploadFolder + newFileName
            });
          }
        }
      );
    });
    return isFileSaved;
  },

  _promise: new Promise((resolve, reject) => {})
};

exports.validationMethod = validateMethods;
