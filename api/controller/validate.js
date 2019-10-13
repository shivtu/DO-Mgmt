const Newproject = require("../model/newrprojectmodel");
const NewEpic = require("../model/epicsmodel");
const Bugfix = require("../model/bugfixmodel");
const fs = require("fs");

validateMethods = {

  extractedResults__id: '',
  extractedResults_SRID: '',

  /**Find the records and assing the result to extractedResults__id for consumption by other methods */
  getRecordById: (req, res, next) => {
    const originalUrlContent = req.originalUrl.split('/');
    switch (originalUrlContent[3]) {
      case 'newproject':
        Newproject.findById({ '_id': req.params._id }).exec()
          .then((result) => {
            this.extractedResults__id = result;
            // console.log(this.extractedResults__id);
            next();
          })
          .catch((err) => {
            res.status(404).json({
              result: 'Record not found'
            });
            return;
          });
    }
  },


  /**Find the records and assing the result to extractedResults_SRID for consumption by other methods */
  getRecordBySRID: (req, res, next) =>{
    const originalUrlContent = req.originalUrl.split('/');
    switch (originalUrlContent[3]) {
      case 'newproject':
        Newproject.findOne({'SRID': req.params.SRID}).exec()
        .then((result) =>{
          this.extractedResults_SRID = result;
          next();
        })
        .catch((err) =>{
          res.status(404).json({
            result: 'Record not found'
          });
          return;
        })
    }
  },



  /**Check to see if project is completed and entering release/support/maintenance phase */
  isReleasingProject: (req, res, next) =>{
    if(req.body.phase === 'delivered' || req.body.phase === 'maintenance' || req.body.phase === 'support' 
    || req.body.phase === 'updateReleased') {

      if(req.body.productVersion !== undefined) { /**If product version number is not provided by user throw error */
        const utcDate = new Date();
        this.extractedResults__id.releases.push({
          releaseUpdatedBy: req.body.currentUser,
          releaseUpdatedOn: utcDate.toUTCString(),
          latestVersion: req.body.productVersion
        });
        req.body['releases'] = this.extractedResults__id.releases;
        next();
      }
    } else {
      res.status(400).json({
        result: 'product version is required'
      });
      return;
    }
  },



  /**Restrict user updating certain fields */
  isUpdatingNPRExceptions: (req, res, next) => {
    if (req.body.updatedOn !== undefined || req.body.createdBy !== undefined || req.body.SRID !== undefined
      || req.body._id !== undefined || req.body.epics !== undefined
      || req.body.createdOn !== undefined || req.body.serviceType !== undefined) {
      res.status(400).json({
        result: "Some of the field values in the request body cannot be updated",
        message: "https://github.com/shivtu/DO-Mgmt"
      });
    } else {
      next();
    }
  },


  getEpicSprints: (req, res, next) => { /**Get Epic then find the existing sprints field in the Epic
                                        and pass it to original request with sprint array attached to req body */
    NewEpic.findOne({ 'SRID': req.params.SRID })
      .then((result) => {
        if (result.SRID === req.params.SRID) {
          req.body['NPRID'] = result.NPRID;
          req.body['sprintArrayinEpic'] = result.sprints;
          next();
        } else {
          res.status(400).json({
            result: 'EPIC not found'
          });
        }
      })
      .catch((error) => {
        res.status(500).json({
          result: 'Could not find EPIC'
        });
      });
  },


  isEpicBackLogOk: (req, res, next) => {
    if (req.body.backLogs !== undefined && Array.isArray(req.body.backLogs)) {
      (req.body.backLogs).forEach(eachBackLog => {
        Object.keys(eachBackLog).forEach(key => {
          if (key === "feature" || key === "points") {
          } else {
            res.status(400).json({
              result: "Ill formated request body, see docs to format backLogs Array",
              message: "https://github.com/shivtu/DO-Mgmt"
            });
          }
        });
      });
      next();
    } else if (req.body.backLogs !== undefined && !Array.isArray(req.body.backLogs)) {
      res.status(400).json({
        result: "backLogs field must be an array",
        message: "https://github.com/shivtu/DO-Mgmt"
      });
    }
  },


  doesNPRExist: (req, res, next) => {
    Newproject.findOne({ 'SRID': req.params.SRID })
      .then((result) => {
        if (result.SRID === req.params.SRID) {
          req.body['currentNPREpicsArray'] = result.epics;
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
   * If true, add/overwrite phase = in-progress and add/overwrite lifeCycle
   */
  isAssigningRequest: (req, res, next) => {

    const utcDate = new Date();
    const originalUrlContent = req.originalUrl.split('/');

    if (req.body.assignedTo !== undefined && (originalUrlContent[4] === 'update')) { /**User is assigning an existing record  */

      /**Always put request to in-progress state if the request is being assigned to another user*/
      req.body.phase = "in-progress";

      this.extractedResults__id.lifeCycle.push({ /**Update the lifeCycle */
        assignedTo: req.body.assignedTo,
        assignedBy: req.body.currentUser,
        assignedOn: utcDate.toUTCString()
      });
      req.body["lifeCycle"] = this.extractedResults__id.lifeCycle;
      next();
    } else if (req.body.assignedTo !== undefined && (originalUrlContent[4] === 'create')) { /**If user is creating new reecord 
                                                                                              and assign it simoultaneously */
      lifeCycle = [];
      lifeCycle.push({
        assignedTo: req.body.assignedTo,
        assignedBy: req.body.currentUser,
        assignedOn: utcDate.toUTCString()
      });
      req.body['lifeCycle'] = lifeCycle;
      next();
    } else if (req.body.assignedTo === undefined) { /**User is not assigning record to anyone, continue with request */
      next();
    }
  },



  /**Check if user is closing/canceling the request */
  isClosingRequest: (req, res, next) => {
    if (req.body.status === 'completed' || req.body.status === 'canceled') {
      const utcDate = new Date();
      req.body['closedOn'] = utcDate.toUTCString();
    }
    next();
  },



  /**Check if user is providing update notes */
  isProvidingUpdates: (req, res, next) => {

    const originalUrlContent = req.originalUrl.split('/');
    if (originalUrlContent[4] === 'create' && req.body.updateNotes !== undefined) { /**User is trying to provide update to a new request */
      console.log("User is trying to provide update to a new request");
      switch (originalUrlContent[3]) {
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
    } else if ((originalUrlContent[4] === 'update')
      && (req.body.updateNotes !== undefined)
      && (Array.isArray(req.body.updateNotes))) {
      console.log("User is trying to insert updateNotes on existing record");
      if ((req.body.updateNotes).length !== 2) {
        console.log("User is trying to insert ill formatted updateNotes on existing record");
        res.status(400).json({
          result: "updateNotes can be of length 2 only",
          message: "readme file: https://github.com/shivtu/DO-Mgmt"
        });
        return;
      }

      /**Format updateNotes field with fields : "summary", "description", "updatedBy"
       * field: "updatedBy" is managed @authentication.js
       */
      const newNote = { summary: req.body.updateNotes[0], description: req.body.updateNotes[1], updatedBy: req.body.currentUser }
      /**Push the newly formated updateNotes field to existing array */
      this.extractedResults__id.updateNotes.push(newNote);
      req.body.updateNotes = this.extractedResults__id.updateNotes;
      next();

    } else if ((originalUrlContent[4] !== 'update') && (req.body.updateNotes === undefined)) {
      console.log("User is trying to update new record without inserting updateNotes");
      next();
    } else if ((originalUrlContent[4] === 'update') && (req.body.updateNotes !== undefined) && (!Array.isArray(req.body.updateNotes))) {
        res.status(400).json({
          result: 'Ill formated update notes',
          message: 'https://github.com/shivtu/DO-Mgmt'
        });
    } else {
      next();
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

      this.validationMethod
        .saveFile(req, res, next)
        .then(savedFilePaths => {
          this.extractedResults__id.files.push(
            savedFilePaths
          ); /**search for existing files array 
                  in the record and push the new files 
                  object into the retrieved array */
          req.body.files = this.extractedResults__id.files;
          next();
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
    if (req.body.files.length !== 2 && Array.isArray(req.body.files)) {
      res.status(400).json({
        result: "request body files array can be of length 2 only"
      });
      return;
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
};

exports.validationMethod = validateMethods;
