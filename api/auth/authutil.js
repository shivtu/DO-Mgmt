const bcrypt = require('bcryptjs');

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


    /*Encrypt user data*/
    encryptData: (req, res, next) =>{
        try {
            const securityQuestions = req.body.security;
            encryptedSecurityQuestions = [];
            securityQuestions.forEach((securityQuestion) =>{ // check if any of the question or answer is blank
                encryptedAns = bcrypt.hashSync(securityQuestion.answer);
                encryptedSecurityQuestions.push({"question": securityQuestion.question, "answer": encryptedAns});
              });
            req.body['security'] = encryptedSecurityQuestions;
    
            /**Now encrypt initial password */ 
            req.body['initPwd'] = bcrypt.hashSync(req.body.initPwd);

            next();
        } catch {
            res.status(500).json({
                result: 'Could not process request'
            });
        }
        
    }
};

exports.authUtilMethod = authUtilMethods;