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
        let securityQues = fs.readFileSync('C:\\Users\\fit\\Desktop\\NodeJs\\DO-Mgmt\\api\\auth\\securityques.json');
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
        try {
            // console.log(req.originalUrl.split('/'));
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
                    Users.findOne({'userId': req.body.userId}).exec()
                    .then((foundUser) =>{
                        if (foundUser.status === "Active") { // If user status is inactive, user is trying to setup creds after admin has deactivated the user
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
                                        console.log(Date.now(), 'bcrypt encryption error', encryptionErr);
                                        res.status(500).json({
                                            result: 'Internal server error'
                                        });
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

                case 'passwordUpdate':
                    /** No need to check for undefined on newPassword as that validation is bieng performed within Validate.js */
                        bcrypt.hash(req.body.newPassword, 2).then((encryptedData) =>{
                            req.body['newPassword'] = encryptedData;
                            next();
                        }).catch((bcryptErr) =>{
                            console.log(req.body.userId, ' hash error in authutil ', bcryptErr);
                            res.status(500).json({
                                result: 'Internal server error'
                            });
                        });
                    break;

                default:
                    console.log(Date.now(), 'Hit default in switch statement - authutil');
                    res.status(500).json({
                        result: 'something just broke',
                        message: 'was the web service recently upgraded?'
                    });
            }
        } catch {
            console.log(Date.now(), 'catch block in try statement - authutil');
            res.status(500).json({
                result: 'Could not process request'
            });
        }
        
    },

    verifyToken: (req, res, next) =>{
        token = req.headers.authorization;
        if (typeof token !== 'undefined') {
            jwt.verify(token, 'secretKey', (jwtErr, decode) =>{
                if (typeof decode !== 'undefined' && !jwtErr) {
                    req.body['currentUser'] = {
                        'userId': decode.userId,
                        'email': decode.email,
                        'group': decode.group
                    }; //paste current user properties to request body
                    next();
                } else {
                    res.status(403).json({
                        result: 'Cannot verify token'
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