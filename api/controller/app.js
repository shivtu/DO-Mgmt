const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const services = require("../response/services");
const bugfix = require("../response/bugfix");
const failfix = require("../response/failfix");
const users = require("../response/users");
const newproject = require("../response/newproject");
const counters = require("../response/counters");
const epic = require("../response/epics");

/*Connect to mongoDB using Mongoose*/
mongoose.connect(
  "mongodb://localhost:27017/TicketingDB",
  { useNewUrlParser: true, useFindAndModify: false },
  err => {
    if (!err) {
      console.log("Connected to DB");
    } else {
      console.log(err.message);
    }
  }
);

mongoose.set(
  "useCreateIndex",
  true
); /**This is to supress the warning - 
"DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead." 
See the documentation here : https://mongoosejs.com/docs/deprecations.html
GitHub issue : https://github.com/Automattic/mongoose/issues/6890*/

/*Morgan for server logs*/
app.use(morgan("dev"));

/* Body parser to parse request body/payload **/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Allow CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Method", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  // Continue with request
  next();
});

//Handle routes
app.use("/api/v1/services", services);
app.use("/api/v1/bugfix", bugfix);
app.use("/api/v1/failfix", failfix);
app.use("/api/v1/users", users);
app.use("/api/v1/newproject", newproject);
app.use("/api/v1/epic", epic);
app.use("/api/v1/counters", counters);

// Handle all errors
app.use((req, res, next) => {
  const error = new Error("Not Found!");
  res.status(404);
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
