const express = require("express");
const router = express.Router();
const jwtToken = require("../middlewares/jwtToken");
const { addVehicleHistory,updateVehicleHistoryStop } = require("../controllers/vehicleHistoryController");


router.post("/",jwtToken, addVehicleHistory);
router.put("/",jwtToken, updateVehicleHistoryStop);


module.exports = router;
