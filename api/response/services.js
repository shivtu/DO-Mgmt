const express = require("express");
const bcrypt = require('bcryptjs');
const router = express.Router();
const mongoose = require("mongoose");

const Bugfix = require("../model/bugfixmodel");
const Newprojects = require("../model/newrprojectmodel");
const Epics = require("../model/epicsmodel");
const Sprints = require("../model/sprintsmodel");
const Users = require("../model/usermodel");
const UserAuth = require("../model/userauthmodel");

router.get("/search/:ID", (req, res, next) => {
  const ID = req.params.ID.toUpperCase();
  let searchCriteria = '';

  if (ID.includes("NPR")) {
    searchCriteria = "NPR";
  } else if (ID.includes("EPC")) {
    searchCriteria = "EPC";
  } else if (ID.includes("SPR")) {
    searchCriteria = "SPR";
  } else if (ID.includes("BFR")) {
    searchCriteria = "BFR";
  } else if (ID.includes("USR")) {
    searchCriteria = "USR"
  } else {
    res.status(400).json({
      result: 'The search string does not belong to any records'
    });
  }

  switch(searchCriteria) {
    case 'NPR':
      Newprojects.findOne({'SRID': ID}).exec()
      .then((result) =>{
        res.status(200).json({
          result: result
        });
      })
      .catch((e) =>{
        res.status(404).json({
          result: 'Record not found'
        });
        console.log(e);
      });
      break;
    
    case 'EPC':
      Epics.findOne({'SRID': ID}).exec()
        .then((result) =>{
          res.status(200).json({
            result: result
          });
        })
        .catch((e) =>{
          res.status(404).json({
            result: 'Record not found'
          });
          console.log(e);
        });
      break;

    case 'SPR':
      Sprints.findOne({'SRID': ID}).exec()
        .then((result) =>{
          res.status(200).json({
            result: result
          });
        })
        .catch((e) =>{
          res.status(404).json({
            result: 'Record not found'
          });
          console.log(e);
        });
      break;

    case 'BFR':
      Bugfix.findOne({'SRID': ID}).exec()
        .then((result) =>{
          res.status(200).json({
            result: result
          });
        })
        .catch((e) =>{
          res.status(404).json({
            result: 'Record not found'
          });
          console.log(e);
        });
      break;

    case 'USR':
      Users.findOne({'userId': ID}).exec()
        .then((result) =>{
          res.status(200).json({
            result: result
          });
        })
        .catch((e) =>{
          res.status(404).json({
            result: 'Record not found'
          });
          console.log(e);
        });
      break;
  }
});



// router.get('/allUsers', (req, res, next) =>{
//   Users.find().exec()
//   .then(result =>{
//     res.status(200).json({
//       result: result
//     });
//   })
//   .catch()
// });


// router.get('/allUserCreds', (req, res, next) =>{
//   UserAuth.find().exec()
//   .then(result =>{
//     res.status(200).json({
//       result: result
//     });
//   })
//   .catch(err =>{
//     console.log(err);
//   })
// });


// router.delete('/deleteUserProfile/:_id', (req, res, next) =>{
//   Users.findByIdAndDelete({'_id': req.params._id}).exec()
//   .then(result =>{
//     res.send({result});
//   }).catch(err =>{
//     console.log(err);
//   })
// });


// router.delete('/deleteUserCreds/:_id', (req, res, next) =>{
//   UserAuth.findByIdAndDelete({'_id': req.params._id}).exec()
//   .then(result =>{
//     res.send({result});
//   });
// });



// router.post('/createUser', (req, res, next) =>{
//   const utcDate = new Date();
//   bcrypt.hash(req.body.initPwd, 2).then((encryptedPassword) =>{
//     req.body['initPwd'] = encryptedPassword;
//     const User = new Users({
//       _id: new mongoose.Types.ObjectId(),
//       userId: "USR0",
//       firstName: 'Bruce',
//       middleName: 'Kumar',
//       lastName: 'Wayne',
//       phone: '911',
//       email: 'example@example.com',
//       group: 'internal',
//       initPwd: encryptedPassword,
//       role: 'admin',
//       status: "Active",
//       security: [],
//       gender: 'male',
//       bio: {lang: 'en-us', locale: 'IN', region: 'APAC'},
//       createdBy: {user: 'SuperMan'},
//       createdOn: utcDate.toUTCString(),
//       displayPicture: req.body.displayPicture
//   });
//   User.save()
//     .then(result => {
//       res.status(201).json({
//         result: result
//       });
//     }).catch((err) =>{
//       console.log(err);
//     });
//   });
// });


// router.post('/createCreds', (req, res, next) =>{
//   Users.findOne({'userId': 'USR0'}).exec()
//   .then((foundUser) =>{
//     bcrypt.hash(req.body.newPassword, 2).then((encryptedPassword) =>{
//       /**Save user creds in new table */
//      const user_auth = new UserAuth({
//       _id: new mongoose.Types.ObjectId(),
//       phone: foundUser.phone,
//       email: foundUser.email,
//       group: foundUser.group,
//       userId: 'USR0',
//       password: encryptedPassword,
//       role: foundUser.role,
//       status: foundUser.status
//    });
//       user_auth.save()
//       .then((result) =>{
//           res.status(201).json({
//             result: result
//           });
//       }).catch((err) =>{
//         console.log(err);
//       })
//     });
//   }).catch((err) =>{
//     console.log(err);
//   });
// });


module.exports = router;
