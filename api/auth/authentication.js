// Dummy module for authentication and authorization
// return array with authentication and autherization role

 const authCheck = new Promise((resolve, reject)=>{
      setTimeout(function() {
            resolve([true, 'user']);
          }, 5000);
 });


module.exports = authCheck;