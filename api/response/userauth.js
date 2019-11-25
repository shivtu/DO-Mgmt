const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Users = require("../model/usermodel");
const UserAuth = require("../model/userauthmodel");
const authUtil = require("../auth/authutil");
const Validate = require("../controller/validate");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* User provides initial password */
router.post(
  "/firstLogin",
  Validate.validationMethod.isUpdatingPassword,
  authUtil.authUtilMethod.encryptData,
  (req, res, next) => {
    /**Save user creds in new table */
    const user_auth = new UserAuth({
      _id: new mongoose.Types.ObjectId(),
      phone: req.body.phone,
      email: req.body.email,
      group: req.body.group,
      userId: req.body.userId,
      password: req.body.newPassword,
      role: req.body.role,
      status: req.body.status
    });
    user_auth
      .save()
      .then(result => {
        res.status(201).json({
          result: result.userId + " setup success",
          accessToken: "http://localhost:5000/api/v1/userauth/getToken",
          security: "http://localhost:5000/api/v1/userauth/security/questions"
        });
      })
      .catch(err => {
        res.status(500).json({
          result: "Could not save user"
        });
        console.log(Date.now(), "Could not save user on firstLogin", err);
      });
  }
);

/* Get user's security questions */
router.post(
  "/securityQuestions",
  authUtil.authUtilMethod.verifyToken,
  (req, res, next) => {
    const _user = req.body.userId.toUpperCase();
    const _userRole = req.body.userRole;
    if (req.body.currentUser === _user || _userRole === "admin") {
      // Evaluate user authorization, check if the request is from the owner of the record
      Users.findOne({ userId: _user })
        .exec()
        .then(foundUser => {
          console.log(foundUser);
          let securityQuestions = [];
          foundUser.security.forEach(securityquestion => {
            securityQuestions.push(Object.keys(securityquestion)[0]);
          });
          res.status(200).json({
            result: securityQuestions
          });
        })
        .catch(err => {
          res.status(404).json({
            result: "Cannot find security questions"
          });
          console.log("Cannot find security questions", err);
        });
    } else {
      // deny displaying the security question
      res.status(403).json({
        result: "Unauthorized request",
        message: "Security questions are viewable only by the owner"
      });
    }
  }
);

/* Set up security answers */
router.patch(
  "/securityAnswers",
  authUtil.authUtilMethod.verifyToken,
  Validate.validationMethod.areSecurityAnsSanitized,
  authUtil.authUtilMethod.encryptData,
  (req, res, next) => {
    if (req.body.currentUser.userId === req.body.userId) {
      Users.findOneAndUpdate(
        { userId: req.body.userId },
        { security: req.body.security },
        { new: true }
      )
        .then(result => {
          res.status(201).json({
            result:
              "Security answers set successfully for user " + result.userId
          });
        })
        .catch(err => {
          res.status(500).json({
            result: "Cannot save security answers"
          });
          console.log(err);
        });
    } else {
      res.status(403).json({
        result: "Unauthorized request",
        message: "Security answers can be set by the owner only"
      });
    }
  }
);

/* Get authentication token */
router.post("/getToken", (req, res, next) => {
  user_Id = req.body.userId.toUpperCase(); // Change userId to upper case
  UserAuth.findOne({ userId: user_Id })
    .exec()
    .then(result => {
      try {
        bcrypt.compare(
          req.body.password,
          result.password,
          (compareErr, compareSuccess) => {
            // console.log('result', result);
            if (compareSuccess && result.status === "Active") {
              const accessToken = jwt.sign(
                {
                  userId: result.userId,
                  email: result.email,
                  role: result.role,
                  group: result.group
                },
                "secretKey",
                { expiresIn: "1h" }
              ); //You will want to retrieve the secretKey from an encrypted file on the server instead of hard coding it while in production
              res.status(201).json({
                accessToken: accessToken
              });
            } else {
              res.status(403).json({
                result: "Authentication failed"
              });
              console.log(compareErr);
            }
          }
        );
      } catch {
        res.status(500).json({
          result: "Cannot generate token"
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
});

/* Set temporary password for the user to allow the user to reset password */
router.post(
  "/setTempPassword",
  authUtil.authUtilMethod.verifyToken,
  Validate.validationMethod.isUpdatingPassword,
  authUtil.authUtilMethod.encryptData,
  (req, res, next) => {
    if (req.body.userRole === "admin") {
      Users.findOneAndUpdate(
        { userId: req.body.userId },
        { initPwd: req.body.newPassword },
        { new: true }
      )
        .then(tempPassword => {
          res.status(201).json({
            result: "Temp password set for " + tempPassword.userId
          });
        })
        .catch(e => {
          res.status(400).json({
            result: "Cannot set temp password"
          });
          console.log("userauth.js, line no. 179", e);
        });
    } else {
      res.status(403).json({
        result: "Action forbidden"
      });
    }
  }
);

/* User resets password using the temp password provided by admin */
router.patch(
  "/passwordReset",
  Validate.validationMethod.isUpdatingPassword,
  authUtil.authUtilMethod.verifyTempPassword,
  authUtil.authUtilMethod.encryptData,
  (req, res, next) => {
    const _userId = req.body.userId;
    const _newPassword = req.body.newPassword;
    UserAuth.findOneAndUpdate(
      { userId: _userId },
      { password: _newPassword },
      { new: true }
    )
      .then(newResult => {
        res.status(201).json({
          result: "Password reset success"
        });
        console.log(newResult);
      })
      .catch(e => {
        res.status(500).json({
          result: "Internal server error"
        });
        console.log("auerauth.js, line no. 211", e);
      });
  }
);

/* User password reset */
router.patch(
  "/passwordUpdate",
  authUtil.authUtilMethod.verifyToken,
  Validate.validationMethod.isUpdatingPassword, // check if new password is valid
  authUtil.authUtilMethod.encryptData, // Encrypt the newPassword
  (req, res, next) => {
    if (req.body.currentUser.userId === req.body.userId) {
      // Check if logged in user is changing his/her own password
      UserAuth.findOneAndUpdate(
        { userId: req.body.userId },
        { password: req.body.newPassword },
        { new: true }
      )
        .exec()
        .then(updatedPassword => {
          // Destroy the initPwd
          Users.findOneAndUpdate(
            { userId: updatedPassword.userId },
            { initPwd: "" },
            { new: true }
          )
            .exec()
            .then(destroyedInitPwd => {
              res.status(201).json({
                result: "Password reset success for " + destroyedInitPwd.userId
              });
            })
            .catch(e => {
              res.status(500).json({
                result: "Internal server error"
              });
            });
        })
        .catch(err => {
          res.status(500).json({
            result: "Cannot update password"
          });
        });
    } else {
      res.status(403).json({
        result: "Unauthorized request",
        message: "Only owner of the record can reset password"
      });
    }
  }
);

/* User resets password themselves using security questions */
router.post(
  "/password/selfReset",
  Validate.validationMethod.areSecurityAnsSanitized,
  authUtil.authUtilMethod.checkUserAns,
  (req, res, next) => {
    bcrypt
      .hash(req.body.newPassword, 2)
      .then(encryptedPassword => {
        UserAuth.findOneAndUpdate(
          { userId: req.body.userId },
          { password: encryptedPassword },
          { new: true }
        )
          .exec()
          .then(result => {
            res.status(201).json({
              result: "Password update success for " + result.userId
            });
          })
          .catch(updateErr => {
            res.status(500).json({
              result: "Internal server error"
            });
            console.log(updateErr);
          });
      })
      .catch(encryptErr => {
        res.status(500).json({
          result: "Cannot save new password",
          message: "Internal server error"
        });
        console.log(encryptErr);
      });
  }
);

// router.get('/allusers', (req, res, next) =>{
//    UserAuth.find().then((result) =>{
//       res.status(200).json({
//          result: result
//       });
//    });
// });

module.exports = router;
