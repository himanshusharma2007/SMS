const express = require('express');
const { addDriver, updateDriver, getDriver, getAllDrivers } = require('../controllers/driverController');
const jwtToken = require('../middlewares/jwtToken');
const router = express.Router();
const checkAdmin = require("../middlewares/checkAdmin")

router.post('/',jwtToken,checkAdmin, addDriver);
router.put('/:id',jwtToken,checkAdmin, updateDriver);
router.get('/:id',jwtToken, getDriver);
router.get('/',jwtToken, getAllDrivers);

module.exports = router;