const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const services = require('../response/services');
const bugfix = require('../response/bugfix');
const users = require('../response/users');
const newproject = require('../response/newproject');

// Connect to mongoDB
mongoose.connect('mongodb://localhost:27017/TicketingDB', {useNewUrlParser: true, useFindAndModify: false}, (err) =>{
    if(!err){
        console.log('Connected to DB');
    }else{
        console.log(err.message);
    }
});

// Morgan for server logs
app.use(morgan('dev'));

// Body parser to parse request body/ payload
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Allow CORS
app.use((req,res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Method', 'PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    // Continue with request
    next();
});

//Handle routes
app.use('/api/v1/services', services);
app.use('/api/v1/bugfix', bugfix);
app.use('/api/v1/users', users);
app.use('/api/v1/newproject', newproject);

// Handle all errors
app.use((req, res, next) =>{
    const error = new Error('Not Found!');
    res.status(404);
    next(error);
});

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
});

module.exports = app;