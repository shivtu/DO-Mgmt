const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Newproject = require("../model/newrprojectmodel");
const Validate = require("../controller/validate");
const Counters = require("../model/countersmodel");
const fs = require("fs");

/*Find instance using service ID*/
router.get("/find/srid/:serviceId", (req, res, next) => {
  const serviceId = req.params.serviceId.toUpperCase();
  Newproject.findOne({ 'SRID': serviceId }).exec()
    .then(result => {
      res.status(200).json({ result: result });
    })
    .catch(e => res.status(200).json({ data: e.message }));
});

/*Find instance using service ID*/
router.get("/find/_id/:_id", (req, res, next) => {
  Newproject.findById({ '_id': req.params._id }).exec()
    .then(result => {
      res.status(200).json({ result: result });
    })
    .catch(e => res.status(200).json({ data: e.message }));
});

/* Find all instances*/
router.get("/find/findAll", (req, res, next) => {
  Newproject.find().exec()
    .then(result => {
      res.status(200).json({ result: result });
    })
    .catch(e => res.status(500).json({ result: e.message }));
});

/* Find all instances with a limit to response*/
router.get("/find/findAll/limit/:_limit", (req, res, next) => {
  Newproject.find().limit(req.params._limit|0).exec()
    .then(result => {
      res.status(200).json({ result: result });
    })
    .catch(e => res.status(500).json({ result: e.message }));
});

/* Find all instances conditionally*/
router.get("/find/filter", (req, res, next) => {
  // console.log('params',req.query);
  Newproject.find(req.query)
    .then(result => {
      res.status(200).json({ result: result });
    })
    .catch(e => res.status(500).json({ result: e.message }));
});

/* Find all instances conditionally*/
router.get("/find/filter/limit/:_limit", (req, res, next) => {
  // console.log('params',req.query);
  Newproject.find(req.query).limit(req.params.limit|0).exec()
    .then(result => {
      res.status(200).json({ result: result });
    })
    .catch(e => res.status(500).json({ result: e.message }));
});

/**Create a NPR - New Project Request */
router.post(
  "/create",
  Validate.validationMethod.isUploadingfile,
  Validate.validationMethod.isProvidingUpdates,
  Validate.validationMethod.isClosingRequest,
  Validate.validationMethod.isAssigningRequest,
  (req, res, next) => {
    NPRSequence.exec() /**Increament NPR sequence number */
      .then(seq => {
        const utcDate = new Date();
        const NPR = new Newproject({
          _id: new mongoose.Types.ObjectId(),
          SRID: "NPR" + seq.sequence_value,
          customerName: req.body.customerName,
          product: req.body.product,
          productVersion: req.body.productVersion,
          releases: req.body.releases,
          serviceType: "New Project Request",
          priority: req.body.priority,
          createdOn: utcDate.toUTCString(),
          createdBy: req.body.currentUser, //This will contain an object with userId, email, role and group props assigned by the accessToken
          summary: req.body.summary,
          description: req.body.description,
          assignedTo: req.body.assignedTo,
          phase: "created",
          repoLink: req.body.repoLink,
          childTasks: [],
          files: req.body.files,
          lifeCycle: req.body.lifeCycle
        });
        NPR.save()
          .then(result => {
            res.status(201).json({
              result: result
            });
          })
          .catch(e => {
            res.status(400).json({
              result: e.message
            });
          });
      })
      .catch(seqErr => {
        res.status(500).json({
          result: seqErr
        });
      });
  }
);

/**Delete request IDs */
router.delete("/delete/:_id", (req, res, next) =>{
  Newproject.findByIdAndDelete({ _id: req.params._id })
    .then(result => {
      res.status(200).json({
        result: result
      });
    })
    .catch(err => {
      next();
    });
});

/**update NPR, request body to be plain JSON object (Nested JSON not allowed) */
router.patch(
  "/update/:_id",
  Validate.validationMethod.getRecordById,
  Validate.validationMethod.isProvidingUpdates,
  Validate.validationMethod.isAssigningRequest,
  Validate.validationMethod.isUploadingfile,
  Validate.validationMethod.isUpdatingNPRExceptions,
  Validate.validationMethod.isReleasingProject,
  (req, res, next) => {
    Newproject.findByIdAndUpdate({ _id: req.params._id }, req.body, {
      new: true
    }).exec()
      .then(result => {
        res.status(200).json({
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          result: err.message
        });
      });
  }
);

/**Update updateNotes */
router.patch("/update/updateNotes/:_id", (req, res, next) => {
  Newproject.findById({ '_id': req.params._id }).exec()
    .then((result) => {
      /**Format updateNotes field with fields : "summary", "description", "updatedBy"
         * field: "updatedBy" is managed @authentication.js
         */
      const newNote = { summary: req.body.updateNotes[0], description: req.body.updateNotes[1], updatedBy: req.body.currentUser }
      /**Push the newly formated updateNotes field to existing array */
      result.updateNotes.push(newNote);
      req.body.updateNotes = result.updateNotes;

      /**Now we can update the record */
      Newproject.findByIdAndUpdate({ '_id': req.params._id }, {'updateNotes': req.body.updateNotes}, { /**update record only with update Notes */
        new: true
      }).exec()
        .then(updatedResult => {
          res.status(200).json({
            result: updatedResult
          });
        })
        .catch(err => {
          res.status(500).json({
            result: err.message
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        result: err.message
      });
    });
});

/**Update files */
router.patch("/update/files/:_id", (req, res, next) => {
  if (req.body.files.length !== 2 && Array.isArray(req.body.files)) {
    res.status(400).json({
      result: "request body files array can be of length 2 only"
    });
    return;
  } else {
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
    }).then((savedFilePaths) =>{
      Newproject.findById({'_id': req.params._id}).exec()
      .then(result =>{
        result.files.push(savedFilePaths);
        req.body.files = result.files;
        /**Now update the record */
        Newproject.findByIdAndUpdate({'_id': req.params._id}, {'files': req.body.files}, {new: true}).exec()
        .then(result2 =>{
          res.status(201).json({
            result: result2
          });
        })
        .catch((result2Err) =>{
          res.status(500).json({
            result: 'Could not update record',
            message: result2Err
          });
        });
      }).catch(err =>{
        res.status(404).json({
          result: req.params._id + ' not found',
          message: err.message
        });
      });
    })
    .catch((fileErr) =>{
      res.status(500).json({
        result: 'Could not save file',
        message: fileErr
      });
    });
  }
});

/**Update files */
router.patch("/update/assignedTo/:_id", (req, res, next) => {
    Newproject.findById({'_id': req.params._id}).exec()
    .then((result) =>{
      const utcDate = new Date();
      result.lifeCycle.push({ /**Update the lifeCycle */
          assignedTo: req.body.assignedTo,
          assignedBy: req.body.currentUser,
          assignedOn: utcDate.toUTCString()
        });
      req.body.lifeCycle = result.lifeCycle;
      req.body = {
        'assignedTo': req.body.assignedTo,
        'phase': 'in-progress',
        'lifeCycle': req.body.lifeCycle
      }
      /**Now we can update the record */
      Newproject.findByIdAndUpdate({'_id': req.params._id},  req.body, {new: true})
      .exec()
      .then((result2) =>{
        res.status(201).json({
          result: result2
        });
      })
      .catch((updateError) =>{
        res.status(500).json({
          result: 'Could not update record',
          message: updateError.message
        });
      });
    })
    .catch((err) =>{
      res.status(404).json({
        result: req.params._id + ' Not found',
        message: err.message
      });
    });
});


/**Update sequence number to create NPRID */
const NPRSequence = Counters.findOneAndUpdate(
  { modelType: "NPR" },
  { $inc: { sequence_value: 1 } },
  { new: true }
);

module.exports = router;
