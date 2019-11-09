const Users = require('../model/usermodel');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');

authUtilMethods = {
    /**Generate a random password */
    generatePassword: (req, res, next) =>{
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        req.body['initPwd'] = retVal;
        next();
    },


    /** Generate random security questions for new user */
    generateSecurityQues: (req, res, next) =>{
        // Get random questions from the file
        let securityQues = fs.readFileSync(process.env.HOME + '\\desktop' + '\\securityques.json'); // Replace this path with whichever path you save your security.json file
        let parsedQues = JSON.parse(securityQues);
        let quesLength = parsedQues.length;
        let userQuesArray = [];
        for (let i = 0; i < 3; i++) { // Choose three random questions
            const quesNo = Math.floor((Math.random() * quesLength) + 0);
            const randQues = parsedQues[quesNo];
            userQuesArray.push({[randQues]: ''});
            parsedQues.splice(quesNo, 1); // Remove the question from array already selected
            quesLength--; // Make random number selection from the remaining array length
        }
        req.body['security'] = userQuesArray;
        next();
    },


    /*Encrypt user data*/
    encryptData: (req, res, next) =>{
            const originalUrlContent = req.originalUrl.split('/');
            switch (originalUrlContent[4]) {
                case 'create':
                    bcrypt.hash(req.body.initPwd, 2).then((encryptedData) =>{
                        req.body['initPwd'] = encryptedData;
                        next();
                    }).catch((bcryptErr) =>{
                        console.log(req.body.userId, ' hash error ', bcryptErr);
                        res.status(500).json({
                            result: 'Internal server error'
                        });
                    });
                break;
                
                case 'firstLogin':
                    // In the below DB query we do not give the Object {new: true} within the update query so that foundUser.initPwd can be preserved for bcrypt comparison
                    Users.findOneAndUpdate({'userId': req.body.userId}, {'initPwd': ''}).exec() // Destroy the initial password (initPwd)
                    .then((foundUser) =>{
                        if (foundUser.status === "Active") { // If user status is inactive, user is trying to setup creds after admin has deactivated the user
                            // console.log(foundUser.initPwd);
                            bcrypt.compare(req.body.initPwd, foundUser.initPwd).then((comparedResult) =>{
                                if (comparedResult) { // initPwd is correct, 
                                    bcrypt.hash(req.body.newPassword, 2).then((encryptedPassword) =>{ // hash user's new password
                                        req.body['newPassword'] = encryptedPassword;
                                        req.body['phone'] = foundUser.phone;
                                        req.body['email'] = foundUser.email;
                                        req.body['group'] = foundUser.group;
                                        req.body['userId'] = foundUser.userId;
                                        req.body['role'] = foundUser.role;
                                        req.body['status'] = foundUser.status;
                                        next();
                                    }).catch((encryptionErr) =>{
                                        res.status(500).json({
                                            result: 'Internal server error'
                                        });
                                        console.log(Date.now(), 'bcrypt encryption error', encryptionErr);
                                    });
                                } else {
                                    res.status(403).json({
                                        result: 'authentication failed'
                                    });
                                }
                            });
                        } else {
                            res.status(403).json({
                                result: 'User ' + foundUser.userId + ' In-Active'
                            });
                        }
                    })
                    .catch((userSearchErr) => { // user was not found on DB
                        res.status(404).json({
                            result: 'Cannot find user ' + req.body.userId
                        });
                    });
                break;

                case 'securityAnswers':
                        const _security = req.body.security;
                        let newArr = [];
                        for (let i = 0; i < 3; i++) {
                            let userQues = Object.keys(_security[i])[0];
                            let userAns = Object.values(_security[i])[0];
                            let encryptedAns = bcrypt.hashSync(Object.values(_security[i])[0], 2);
                            if (userQues !== null && typeof userQues !== 'undefined' && userAns !== null && typeof userAns !== 'undefined') {
                                let newObj = {};
                                newObj[userQues] = encryptedAns;
                                newArr.push(newObj); // Create a new object for req.body.security
                            } else {
                                console.log('Something wrong');
                            }
                        }
                        req.body['security'] = newArr; // Asign the encrypted Q and A to req.body.security
                        next();
                    break;

                case 'passwordUpdate':
                    /* No need to check for undefined on newPassword as that validation is bieng performed within Validate.js */
                        bcrypt.hash(req.body.newPassword, 2).then((encryptedData) =>{
                            req.body['newPassword'] = encryptedData;
                            next();
                        }).catch((bcryptErr) =>{
                            res.status(500).json({
                                result: 'Internal server error'
                            });
                            console.log(req.body.userId, ' hash error in authutil ', bcryptErr);
                        });
                    break;

                case 'setTempPassword':
                        bcrypt.hash(req.body.newPassword, 2).then((encryptedData) =>{
                            req.body['newPassword'] = encryptedData;
                            next();
                        }).catch((bcryptErr) =>{
                            res.status(500).json({
                                result: 'Internal server error'
                            });
                            console.log(req.body.userId, ' hash error in authutil ', bcryptErr);
                        });
                    break;

                case 'passwordReset':
                    // No need to validate newPassword as that is being checked on Validate.js page with isUpdatingPassword method
                    Users.findOne({'userId': req.body.userId}, ).exec()
                    .then((foundUser) =>{
                        if (foundUser.status === "Active") {
                            bcrypt.hash(req.body.newPassword, 2)
                            .then((encryptedPassword) =>{
                                req.body['newPassword'] = encryptedPassword;
                                next();
                            })
                            .catch((encryptionErr) =>{
                                res.status(500).json({
                                    result: 'Internal server error'
                                });
                                console.log('encryptionErr', encryptionErr);
                            });
                        } else {
                            res.status(404).json({
                                result: 'User not fount'
                            });
                        }
                    })
                    .catch((err) =>{
                        res.status(404).json({
                            result: 'User not found'
                        });
                        console.log(err);
                    })
                    break;

                default:
                    res.status(500).json({
                        result: 'something just broke',
                        message: 'was the web service recently upgraded?'
                    });
                    console.log(Date.now(), 'Hit default in switch statement - authutil');
                    break;
            }
    },

    /* Validate security questions */
  checkUserAns: (req, res, next) =>{
    _user = (req.body.userId).toUpperCase();
    Users.findOne({'userId': _user}).exec()
    .then((foundUser) =>{
        foundAns = foundUser.security;
        let userAns = req.body.security;
        for (let i=0; i<3; i++) {
            if (bcrypt.compareSync(Object.values(userAns[i])[0], Object.values(foundAns[i])[0])) {
                console.log('All good');
            } else {
                res.status(403).end({
                    result: 'Match not found'
                });
            }
        }
        next();
    })
    .catch((err) =>{
       res.status(403).json({
        result: 'Invalid security answers'
       });
       console.log(err);
    });
  },

    verifyToken: (req, res, next) =>{
        token = req.headers.authorization;
        if (typeof token !== 'undefined') {
            jwt.verify(token, 'secretKey', (jwtErr, decode) =>{
                if (typeof decode !== 'undefined' && !jwtErr) {
                    // /* Evaluate user's authorization within the switch statement */
                    // switch (req.originalUrl) {
                    //     case '/api/v1/newproject/create':
                    //         if (decode.role === 'product-owner') {
                    //             req.body['currentUser'] = {
                    //                 'userId': decode.userId,
                    //                 'email': decode.email,
                    //                 'group': decode.group
                    //             }; //paste current user properties to request body
                    //             Object.freeze(req.body.currentUser); // Freeze verified token to avoid any manipulation by the user
                    //             req.body['userRole'] = decode.role;
                    //             Object.freeze(req.body.userRole);
                    //             next();
                    //         } else {
                    //             res.status(403).json({
                    //                 result: 'Unauthorized request',
                    //                 message: 'Only product owners must create a new project request'
                    //             });
                    //         }
                    //     break;

                    //     default:
                    //         res.status(403).json({'bhosdi': 'choot mara'});
                    //     break;
                    // }
                    // /* End Authorization block */

                    req.body['currentUser'] = {
                        'userId': decode.userId,
                        'email': decode.email,
                        'group': decode.group
                    }; //paste current user properties to request body
                    Object.freeze(req.body.currentUser); // Freeze verified token to avoid any manipulation by the user
                    req.body['userRole'] = decode.role;
                    Object.freeze(req.body.userRole);
                    next();
                } else {
                    res.status(403).json({
                        result: 'Authentication failed'
                    });
                }
            });
        } else {
            console.log('hh');
            res.status(403).json({
                result: 'Unauthenticated request'
            });
        }
    }
};

exports.authUtilMethod = authUtilMethods;