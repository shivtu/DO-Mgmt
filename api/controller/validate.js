const Newproject = require("../model/newrprojectmodel");
const NewEpic = require("../model/epicsmodel");
const Users = require('../model/usermodel');
const Bugfix = require("../model/bugfixmodel");
const Sprints = require('../model/sprintsmodel');

const fs = require("fs");
const bcrypt = require('bcryptjs');

validateMethods = {

  // extractedResults__id: '',
  // extractedResults_SRID: '',

  /* Find the records and assing the result to extractedResults__id for consumption by other methods */
  getRecordById: (req, res, next) => {
    const originalUrlContent = req.originalUrl.split('/');
    switch (originalUrlContent[3]) {
      case 'newproject':
        Newproject.findById({ '_id': req.params._id }).exec()
          .then((result) => {
            if (result !== null) {
              req.body['extractedResults__id'] = result;
              next();
            } else {
              res.status(404).json({
                result: 'Record not found'
              });
            }
          })
          .catch((err) => {
            res.status(404).json({
              result: 'Record not found'
            });
            console.log(Date.now(), 'getRecordById', err);
          });
        break;

      case 'bugfix':
        Bugfix.findById({ '_id': req.params._id }).exec()
          .then((result) => {
            if (result !== null) {
              req.body['extractedResults__id'] = result;
              next();
            } else {
              res.status(404).json({
                result: 'Record not found'
              });
            }
          })
          .catch((err) => {
            res.status(404).json({
              result: 'Record not found'
            });
            console.log(err);
          });
        break;

      case 'epic':
        NewEpic.findById({ '_id': req.params._id }).exec()
        .then((result) => {
          req.body['extractedResults__id'] = result;
          next();
        })
        .catch((err) =>{
          res.status(404).json({
            result: 'Record not found'
          });
          console.log(err);
        });
        break;

      case 'sprint':
        Sprints.findById({ '_id': req.params._id }).exec()
          .then((result) => {
            req.body['extractedResults__id'] = result;
            next();
          })
          .catch((err) =>{
            res.status(404).json({
              result: 'Record not found'
            });
            console.log(err);
          });
          break;

      case 'users':
        Users.findById({ '_id': req.params._id }).exec()
          .then((result) => {
            req.body['extractedResults__id'] = result;
            next();
          })
          .catch((err) =>{
            res.status(404).json({
              result: 'Record not found'
            });
            console.log(err);
          });
          break;

      default:
        res.status(500).json({
          result: 'Internal server error'
        });
        console.log(originalUrlContent[3]);
      break;
    }
  },


  /* Find the records and assing the result to extractedResults_SRID for consumption by other methods */
  getRecordBySRID: (req, res, next) =>{
    const originalUrlContent = req.originalUrl.split('/');
    // console.log(originalUrlContent[3]);
    switch (originalUrlContent[3]) {
      case 'newproject':
        Newproject.findOne({'SRID': req.params.SRID}).exec()
        .then((result) =>{
          if (result !== null) {
            req.body['extractedResults_SRID'] = result;
            next();
          } else {
            res.status(404).json({
              result: 'Record not found'
            });
          }
        })
        .catch((err) =>{
          res.status(404).json({
            result: 'Record not found'
          });
        });
        break;

      case 'sprint':
        Sprints.findOne({'SRID': req.params.SRID}).exec()
        .then((result) =>{
          if (result !== null) {
            req.body['extractedResults_SRID'] = result;
            console.log(req.body.extractedResults_SRID);
            next();
          } else {
            res.status(404).json({
              result: 'Record not found'
            });
          }
        })
        .catch((err) =>{
          res.status(404).json({
            result: 'Record not found'
          });
        });
        break;

      default:
        res.status(500).json({
          result: 'Internal server error'
        });
      break;
    }
  },



  /* Check to see if project is completed and entering release/support/maintenance phase */
  isReleasingProject: (req, res, next) =>{
    const _phase = req.body.phase;
    if(_phase === 'delivered' || _phase === 'maintenance' || _phase === 'support' 
    || _phase === 'release') {

      const _productVersion = req.body.productVersion;
      if(typeof _productVersion !== 'undefined' && Array.isArray(_productVersion) && _productVersion.length > 0) { /**If product version number is not provided by user throw error */
        const utcDate = new Date();
        req.body.extractedResults__id.releases.push({
          releaseUpdatedBy: req.body.currentUser,
          releaseUpdatedOn: utcDate.toUTCString(),
          latestVersion: _productVersion
        });
        req.body['releases'] = req.body.extractedResults__id.releases;
        _productVersion.forEach((item) =>{
          req.body.extractedResults__id.productVersion.push(item);
        });
        req.body['productVersion'] = req.body.extractedResults__id.productVersion;
        next();
      } else {
        res.status(400).json({
          result: 'product version is required'
        });
      }
    } else {
      next();
    }
  },


    /* Check if user is updating product version */
    isUpdatingProductVersion: (req, res, next) =>{
      const _phase = req.body.phase;

      if (typeof req.body.productVersion === 'undefined') {
        next();
      } else {
        if (typeof req.body.productVersion !== 'undefined' && (_phase === 'delivered' || _phase === 'maintenance' || _phase === 'support' 
        || _phase === 'release')) {
          next();
        } else {
          res.status(400).json({
            result: 'Product version can be updated only with a release'
          });
        }
      }
    },



  /**Restrict user updating certain fields */
  isUpdatingNPRExceptions: (req, res, next) => {
    if (typeof req.body.updatedOn !== 'undefined' || typeof req.body.SRID !== 'undefined'
      || typeof req.body._id !== 'undefined' || typeof req.body.epics !== 'undefined'
      || typeof req.body.createdOn !== 'undefined' || typeof req.body.serviceType !== 'undefined'
      || typeof req.body.sprints !== 'undefined'
      || typeof req.body.releases !== 'undefined' || typeof req.body.lifeCycle !== 'undefined') {
        
      res.status(400).json({
        result: "Some of the values in the request body cannot be updated",
        message: "https://github.com/shivtu/DO-Mgmt"
      });
    } else {
      /* Since reques.body.createdBy is an object we overide this to avoid possible conflicts */
      req.body['createdBy'] = req.body.extractedResults__id.createdBy;
      next();
    }
  },


  /* Restrict user updating certain fields */
  isUpdatingEPCExceptions: (req, res, next) =>{
    if (typeof req.body.sprints !== 'undefined' || typeof req.body.NPRID !== 'undefined'
    || typeof req.body.createdBy !== 'undefined' || typeof req.body.serviceType !== 'undefined'
    || typeof req.body.createdOn !== 'undefined') {
      res.status(400).json({
        result: "Some of the values in the request body cannot be updated",
        message: "https://github.com/shivtu/DO-Mgmt"
      });
      console.log(req.body);
    } else {
       /* Since reques.body.createdBy is an object we overide this to avoid possible conflicts */
       req.body['createdBy'] = req.body.extractedResults__id.createdBy;
       next();
    }
  },


  /**Restrict user updating certain fields */
  isUpdatingSPRExceptions: (req, res, next) =>{
    if (typeof req.body.sprints !== 'undefined' || typeof req.body.NPRID !== 'undefined'
    || typeof req.body.createdBy !== 'undefined' || typeof req.body.serviceType !== 'undefined'
    || typeof req.body.createdOn !== 'undefined') {
      res.status(400).json({
        result: "Some of the values in the request body cannot be updated",
        message: "https://github.com/shivtu/DO-Mgmt"
      });
      console.log(req.body);
    } else {
       /* Since reques.body.createdBy is an object we overide this to avoid possible conflicts */
       req.body['createdBy'] = req.body.extractedResults__id.createdBy;
       next();
    }
  },


  /* Validate SPR memberList */
  validateSPRMemberList: (req, res, next) =>{
    const originalUrlContent = req.originalUrl.split('/');
    let _memberList = req.body.memberList;
    let currentMembers = req.body.extractedResults_SRID.memberList;

    let validateFlag = true;
        if (typeof _memberList !== 'undefined' && Array.isArray(_memberList) && _memberList.length > 0) {
          _memberList.forEach((eachMember) =>{
            if (typeof eachMember !== 'string' || eachMember === "") {
              validateFlag = false;
            }
          });
          if (validateFlag) {
            switch (originalUrlContent[4]) {

              case 'create':
                next();
              break;
        
              case 'update':
              /* nested switch */
                switch(originalUrlContent[6]) {
                  case 'add':
                    _memberList.forEach((member) =>{
                    currentMembers.push(member);
                    });
                    req.body['memberList'] = currentMembers;
                    next();
                  break;
        
                case 'remove':
                    _memberList.forEach((member) =>{
                      if (currentMembers.includes(member)) {
                        index = currentMembers.indexOf(member);
                        currentMembers.splice(index, 1);
                      }
                    });
                    req.body['memberList'] = currentMembers;
                    next();
                  break;

                case 'new':
                  req.body['memberList'] = _memberList;
                  next();
                  break;

                default:
                  res.status(500).json({
                    result: 'Internal server error',
                    message: 'Was the web service upgraded recently'
                  });
                break;
                }
              /* Nested switch */
              break;

            default:
                res.status(500).json({
                  result: 'Internal server error',
                  message: 'Was the web service upgraded recently'
                });
              break;
            }
          } else {
            res.status(400).json({
              result: 'Ill formated requested body',
              message: 'https://github.com/shivtu/DO-Mgmt'
            });
          }
        } else {
          res.status(400).json({
            result: 'Ill formated requested body',
            message: 'https://github.com/shivtu/DO-Mgmt'
          });
        }
  },


  getEpicSprints: (req, res, next) => { /**Get Epic then find the existing sprints field in the Epic
                                        and pass it to original request with sprint array attached to req body */
    const _toDo = req.body.toDo;
    if (typeof _toDo === 'undefined' || !Array.isArray(_toDo) || _toDo.length === 0) {
      console.log(typeof req.body._toDo);
      res.status(400).json({
        result: 'Sprints should have atleast one toDo item'
      });
    } else {
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
        console.log(error);
      });
    }
  },


  isEpicBackLogOk: (req, res, next) => {
    const _backLogs = req.body.backLogs;
    let validateFlag = true;
    if (_backLogs !== undefined && Array.isArray(_backLogs) && _backLogs.length > 0) {
      (_backLogs).forEach(eachBackLog => {
        Object.keys(eachBackLog).forEach(key => {
          if (key === "feature" || key === "points") { // Do nothing
          } else {
            validateFlag = false;
          }
        });
      });
      if (validateFlag) {
        next();
      } else {
        res.status(400).json({
          result: "Ill formated request body",
          message: "https://github.com/shivtu/DO-Mgmt"
        });
      }
    } else if (_backLogs !== undefined && !Array.isArray(_backLogs)) {
      res.status(400).json({
        result: "Ill formated request body",
        message: "https://github.com/shivtu/DO-Mgmt"
      });
    }
  },


  /* Check if the NPR exists */
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
        console.log(Date.now(), 'doesNPRExist', err);
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
    const _assignedTo = req.body.assignedTo;
    const _typeOfRequest = originalUrlContent[4];

    if (typeof _assignedTo !== 'undefined') {
      switch(_typeOfRequest) {
        case 'update':
          /* Always put request to in-progress phase if the request is being assigned to another user */
          req.body.phase = "in-progress";

          req.body.extractedResults__id.lifeCycle.push({ /**Update the lifeCycle */
            assignedTo: _assignedTo,
            assignedBy: req.body.currentUser,
            assignedOn: utcDate.toUTCString()
          });
          req.body["lifeCycle"] = req.body.extractedResults__id.lifeCycle;
          next();
          break;

        case 'create':
             /* Always put request to in-progress phase if the request is being assigned to another user */
            req.body['phase'] = "in-progress";

            let lifeCycle = [];
            lifeCycle.push({
              assignedTo: _assignedTo,
              assignedBy: req.body.currentUser,
              assignedOn: utcDate.toUTCString()
            });
            req.body['lifeCycle'] = lifeCycle;
            next();
          break;
      }
    } else {
      next();
    }

    // if (typeof _assignedTo !== 'undefined' && (originalUrlContent[4] === 'update')) { /**User is assigning an existing record  */

    //   /**Always put request to in-progress state if the request is being assigned to another user*/
    //   req.body.phase = "in-progress";

    //   req.body.extractedResults__id.lifeCycle.push({ /**Update the lifeCycle */
    //     assignedTo: _assignedTo,
    //     assignedBy: req.body.currentUser,
    //     assignedOn: utcDate.toUTCString()
    //   });
    //   req.body["lifeCycle"] = req.body.extractedResults__id.lifeCycle;
    //   next();
    // } else if (typeof _assignedTo !== 'undefined' && (originalUrlContent[4] === 'create')) { /**If user is creating new reecord 
    //                                                                                           and assign it simoultaneously */
    //   let lifeCycle = [];
    //   lifeCycle.push({
    //     assignedTo: _assignedTo,
    //     assignedBy: req.body.currentUser,
    //     assignedOn: utcDate.toUTCString()
    //   });
    //   req.body['lifeCycle'] = lifeCycle;
    //   next();
    // } else if (typeof _assignedTo === 'undefined') { /**User is not assigning record to anyone, continue with request */
    //   next();
    // }
  },



  /* Check if user is assigning BFR */
  isAssigningBFR: (req, res, next) =>{

    const utcDate = new Date();
    const originalUrlContent = req.originalUrl.split('/');
    const _assignedTo = req.body.assignedTo;
    
    if (typeof _assignedTo !== 'undefined') { /* Check if user is assigning BFR to someone else */
      requestPath = originalUrlContent[4];

      switch (requestPath) {
        case 'create':
          req.body['status'] = 'in-progress';
          let lifeCycle = [];
          lifeCycle.push({
            assignedTo: _assignedTo,
            assignedBy: req.body.currentUser,
            assignedOn: utcDate.toUTCString()
          });
          req.body['lifeCycle'] = lifeCycle;
          next();
        break;

        case 'update':
            req.body['status'] = 'in-progress';
            let lifeCycle2 = [];
            lifeCycle2.push({
              assignedTo: _assignedTo,
              assignedBy: req.body.currentUser,
              assignedOn: utcDate.toUTCString()
            });
            req.body['lifeCycle'] = lifeCycle2;
            next();
          break;

        default:
          console.log('isAssigningBFR break block of switch statement');
          res.status(500).json({
            result: 'Unexpected server error'
          });
      }
    } else { /* user is not assigning request to anyone, continue with request */
      next();
    }
  },



  /* Check if user is closing/canceling the request */
  isClosingRequest: (req, res, next) => {
    if (req.body.status === 'completed' || req.body.status === 'canceled') {
      const utcDate = new Date();
      req.body['closedOn'] = utcDate.toUTCString();
    }
    next();
  },



  /* Check if user is providing update notes */
  isProvidingUpdates: (req, res, next) => {

    const originalUrlContent = req.originalUrl.split('/');
    const _updateNotes = req.body.updateNotes;
    const _originalUrlContent = originalUrlContent[4];

    if (_originalUrlContent === 'create' && typeof _updateNotes !== 'undefined') { /**User is trying to provide update to a new request */
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
    } else if ((_originalUrlContent === 'update')
      && (typeof _updateNotes !== 'undefined')
      && (Array.isArray(_updateNotes))) {
      console.log("User is trying to insert updateNotes on existing record");

      /* Check if update notes is of length 2 or not (summary and description) */
      if ((_updateNotes).length !== 2) {
        console.log("User is trying to insert ill formatted updateNotes on existing record");
        res.status(400).json({
          result: "updateNotes can be of length 2 only",
          message: "readme file: https://github.com/shivtu/DO-Mgmt"
        });
      }

      /**Format updateNotes field with fields : "summary", "description", "updatedBy"
       * field: "updatedBy" is managed @authentication.js
       */
      const newNote = { summary: _updateNotes[0], description: _updateNotes[1], updatedBy: req.body.currentUser }
      /**Push the newly formated updateNotes field to existing array */
      req.body.extractedResults__id.updateNotes.push(newNote);
      req.body['updateNotes'] = req.body.extractedResults__id.updateNotes;
      next();

    } else if ((_originalUrlContent !== 'update') && (typeof _updateNotes === 'undefined')) {
      console.log("User is trying to update new record without inserting updateNotes");
      next();
    } else if ((_originalUrlContent === 'update') && (typeof _updateNotes !== 'undefined') && (!Array.isArray(_updateNotes))) {
        res.status(400).json({
          result: 'Ill formated request body',
          message: 'https://github.com/shivtu/DO-Mgmt'
        });
    } else {
      next();
    }
  },



  /* Check if user is trying to upload file */
  isUploadingfile: (req, res, next) => {
    const _files = req.body.files;
    const _id = req.params._id;
    
    if (typeof _files === 'undefined' && typeof _id === 'undefined') {
      /**check if user is trying to upload file to new NPR */
      req.body.files = []; /**always set initial state of files to empty array */
      next();
    } else if (typeof _files !== 'undefined' && typeof _id === 'undefined') {
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
    } else if (typeof _files !== 'undefined' && typeof _id !== 'undefined') {
      /**user is trying to upload file
      to existing ticket, find existing 
      array of file field and push new JSON 
      object to existing array of file field */

      this.validationMethod
        .saveFile(req, res, next)
        .then(savedFilePaths => {
          req.body.extractedResults__id.files.push(
            savedFilePaths
          ); /**search for existing files array 
                  in the record and push the new files 
                  object into the retrieved array */
          req.body.files = req.body.extractedResults__id.files;
          next();
        })
        .catch(err => {
          res.status(500).json({
            result: err.message
          });
        });

    } else if (typeof _files === 'undefined' && typeof _id !== 'undefined') {
      next();
    }
  },



  /* isFileSaved promise wrapped in saveFile function that returns the promise for cunsmption by other methods  */
  saveFile: (req, res, next) => {
    const _files = req.body.files;
    
    if (Array.isArray(req.body.files) && _files.length !== 2) {
      res.status(400).json({
        result: "request body files array can be of length 2 only"
      });
      return;
    }
    isFileSaved = new Promise((resolve, reject) => {
      const originalFileName = _files[0];
      const fileContent = _files[1];
      const rand = Math.floor(Math.random() * Math.floor(10));
      const newFileName = Date.now().toString() + rand + originalFileName;
      const uploadFolder = process.env.HOME + "\\desktop\\"; // You will want to replace this path with the path of a public folder wihtin the prod env
      const utcDate = new Date();

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
              filePath: uploadFolder + newFileName,
              uploadedBy: req.body.currentUser,
              uploadedOn: utcDate.toUTCString()
            });
          }
        }
      );
    });
    return isFileSaved;
  },



  areSecurityAnsSanitized: (req, res, next) =>{
    const _security = req.body.security;
    if (Array.isArray(_security) && _security.length === 3) {
    Users.findOne({'userId': req.body.userId}).exec()
      .then((foundUser) =>{
        let userQues = req.body.security;
        let foundQues = foundUser.security;
        let flag = true;
        for (let i=0; i<3; i++) {
          let userAns = Object.values(_security[i])[0];
          if ((Object.keys(userQues[i])[0] !== Object.keys(foundQues[i])[0]) || userAns === null || typeof userAns === 'undefined' || userAns === '') {
            res.status(400).json({
              result: 'Ill formated request body',
              message: 'https://github.com/shivtu/DO-Mgmt'
            });
            flag = false;
            break;
          }
        }
        if (flag) {
          next();
        }
      })
      .catch((e) =>{
        res.status(404).end({
          result: 'User not found'
        });
        console.log(e);
      });
    } else {
      res.status(400).end({
        result: 'Ill formated request body',
        message: 'https://github.com/shivtu/DO-Mgmt'
      });
    }
    // next();
    // console.log('_security', _security);
  },


  /* Check for req body if user is changing password */
  isUpdatingPassword: (req, res, next) =>{
    _newPassword = req.body.newPassword;
    if (typeof _newPassword === 'undefined' || _newPassword === null || _newPassword === '') {
      res.status(400).json({
        result: 'Ill formated request body',
        message: 'https://github.com/shivtu/DO-Mgmt/'
      });
    } else {
      next();
    }
  },


  isUpdatingtoDoSprints: (req, res, next) =>{
    const to_do = req.body.toDo;
    if (typeof to_do !== 'undefined' && Array.isArray(to_do) && (to_do).length > 0) {
      Sprints.findOne({'SRID': req.params.SRID}).exec()
      .then((result) =>{
        currentToDoArray = result.toDo;
        toDoArray = req.body.toDo;
        let DuplicateFlag = true;
          currentToDoArray.forEach((currentToDoItem) =>{
            if (toDoArray.includes(currentToDoItem)) {
              DuplicateFlag = false;
            }
          });

          if (DuplicateFlag) {
            toDoArray.forEach((toDoItem) =>{
              currentToDoArray.push(toDoItem);
            });
            req.body['toDo'] = currentToDoArray;
            next();
          } else {
            res.status(400).json({
              result: 'Some to-do items already exist'
            });
          }
      })
      .catch((err) =>{
        res.status(404).json({
          result: 'Cannot find Sprint'
        });
      });
    } else {
      res.status(400).json({
        result: 'Ill formated request body',
        message: 'https://github.com/shivtu/DO-Mgmt/'
      });
    }
  },

  isUpdatingDoingSprints: (req, res, next) =>{
    // Check if user is updating the doing sprints
    const _doing = req.body.doing;
    if (typeof _doing !== 'undefined' && Array.isArray(_doing) && (_doing).length > 0) {
      Sprints.findOne({'SRID': req.params.SRID}).exec()
      .then((foundSprint) =>{
        currentToDoArray = foundSprint.toDo; // toDo array in the record
        currentDoingArray = foundSprint.doing;
        doingArray = req.body.doing; // doing items requested by the user

        // Declare a flag to set to true or false when checking if requested doing array is subset of existing toDo array
        let validateDoingItems = true;
        
        /** Check if req.body.doing Array is a subset of existing toDo array */
        doingArray.forEach((doingArrayItem) =>{
          if (!currentToDoArray.includes(doingArrayItem)) {
            validateDoingItems = false;
          } else { // splice the current toDo array for values existing in req.body.doing array
            index = currentToDoArray.indexOf(doingArrayItem);
            currentToDoArray.splice(index, 1);
          }
        });

        if (validateDoingItems) { // req.body.doing array is a subset of current toDo array

          // push req.body.doing to current doing array
          doingArray.forEach((doingItem) =>{
            currentDoingArray.push(doingItem);
          });
    
          /* Update the request body with newly formed toDo and doing array */
          req.body['doing'] = currentDoingArray;
          req.body['toDo'] = currentToDoArray;
          next();
        } else {
          res.status(400).json({
            result: 'doing items must be from toDo list'
          });
        }
      })
      .catch((err) =>{
        console.log(err);
        res.status(404).json({
          result: 'Sprint not found'
        });
      });
    } else {
      res.status(400).json({
        result: 'Ill formated request body',
        message: 'https://github.com/shivtu/DO-Mgmt/'
      });
    }
    
  },

  isUpdatingDoneSprints: (req, res, next) =>{
    const _done = req.body.done;

    if (typeof _done !== 'undefined' && Array.isArray(_done) && _done.length > 0) {
      Sprints.findOne({'SRID': req.params.SRID}).exec()
      .then((foundSprint) =>{
        currentDoneArray = foundSprint.done; // Done array in the record
        currentDoingArray = foundSprint.doing;
        doneArray = req.body.done; // done items requested by the user

        let validateDoneItems = true;

        /** Check if req.body.done Array is a subset of existing toDo array */
        doneArray.forEach((eachDoneItem) =>{
          if (!currentDoingArray.includes(eachDoneItem)) {
            validateDoneItems = false;
          } else {
            index = currentDoingArray.indexOf(eachDoneItem);
            currentDoingArray.splice(index, 1);
          }
        });

        if (validateDoneItems) {
          // push req.body.done to current done array
          doneArray.forEach((eachItem) =>{
            currentDoneArray.push(eachItem);
          });
          req.body['done'] = currentDoneArray;
          req.body['doing'] = currentDoingArray;
          next();
        } else {
          res.status(400).json({
            result: 'done items must be from doing list'
          });
        }
      })
      .catch();
    } else {
      res.status(400).json({
        result: 'Ill formated request body',
        message: 'https://github.com/shivtu/DO-Mgmt/'
      });
    }
  },




};

exports.validationMethod = validateMethods;
