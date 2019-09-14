const https = require("https");

/* Dummy module for authentication and authorization
 call next() after third party auth,
 setTimeout function mocks the delay created in calling a third party service */

 authCheck = (req, res, next) => {
  var promise1 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 5000);
  });

  promise1.then(value => {
    console.log(value);
    next();
  });
};

module.exports = authCheck
