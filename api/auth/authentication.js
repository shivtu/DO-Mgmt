const jwt = require('jsonwebtoken');

const exec = require('child_process').exec;
/* Dummy module for authentication and authorization
 call next() after third party auth,
 setTimeout function mocks the delay created in calling a third party authentication service */

authMethods = {
  /**Example of promises within auth module */
  promise2 :new Promise((resolve, reject) =>{
  setTimeout(() => {
      resolve({auth: true, role: 'admin'});
  }, 3000);
}),

/**Experimental
 * Execute an external process to verify user auth
*/
exlcludedAuthProcess: (res, req, next) =>{
  exec(process.env.HOME + '\\hello.bat', (err, stdout, stderr) =>{
    if(err) {
        console.log(err);
    } else {
      console.log(stdout);
      }
  });
},

dummyAuth: (req, res, next) =>{
  console.log('auth success');
  // execute function to authenticate/authorize the user
  req.body['currentUser'] = "SuperMan"; /**Add current user to request body */
  req.body['currentUserRole'] = "CRUD"; /**Add current user role to request body */
  next();
  }
  
};

exports.authenticationMethod = authMethods;
