const https = require('https');

/* Dummy module for authentication and authorization
 return array with authentication and autherization role */

const authCheck = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve([true, "admin"]);
  }, 5000);
});

module.exports = authCheck;
