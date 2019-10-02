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
  req.body['currentUser'] = "Super Man";
  next();
},

authCheck: (req, res, next) => {
  const promise1 = new Promise((resolve, reject) => {
    setTimeout(() => {
      if(req.headers.authorization === 'admin') {
        resolve({auth: true, role: 'admin'});
      }else {
        reject('non-admin');
      }
    }, 3000);
  });

  promise1.then(value => {
    console.log(value);
    next();
    }).catch((err) => {
      res.status(500).json({
        result: 'Could not resolve authentiaction',
        message: err.message
      });
    })
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
