/* Dummy module for authentication and authorization
 call next() after third party auth,
 setTimeout function mocks the delay created in calling a third party authentication service */

authMethods = {

  promise2 :new Promise((resolve, reject) =>{
  setTimeout(() => {
      resolve({auth: true, role: 'admin'});
  }, 3000);
}),

dummyAuth: (req, res, next) =>{
  console.log('auth success');
  // execute function to authenticate/authorize the user
  req.body['currentUser'] = "Super Man"; /**Add current user to request body */
  req.body['currentUserRole'] = "admin"; /**Add current user role to request body */
  next();
},

userRole: (req, res, next) =>{
  setTimeout(() => {
    if(req.headers.authorization === 'admin') {
      next();
    }else {
      return 'non-admin';
      }
    }, 3000);  
  }
};

exports.authenticationMethod = authMethods;
