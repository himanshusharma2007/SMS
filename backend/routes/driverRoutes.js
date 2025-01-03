const express = require('express');
const { addDriver, updateDriver, getDriver, getAllDrivers } = require('../controllers/driverController');
const router = express.Router();

router.post('/', addDriver);
router.put('/:id', updateDriver);
router.get('/:id', getDriver);
router.get('/', getAllDrivers);

module.exports = router;