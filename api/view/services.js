const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) =>{
    res.status(200).json({
        message: 'All services'
    });
});

router.get('/:serviceid', (req, res, next) =>{
    const serviceid = req.params.serviceid;
    res.status(200).json({
        message: serviceid
    });
});

router.post('/create', (req, res, next) =>{
    res.status(200).json({
        message: 'create faults'
    });
});

module.exports = router;