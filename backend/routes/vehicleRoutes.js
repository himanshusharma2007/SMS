const express = require("express");
const router = express.Router();
const jwtToken = require("../middlewares/jwtToken");
const { addVehicle,updateVehicle, getVehicle, getAllVehicles, deleteVehicle } = require("../controllers/VehicleController");
const checkAdmin = require("../middlewares/checkAdmin");


router.post("/",jwtToken, checkAdmin, addVehicle);
router.put("/:id",jwtToken, checkAdmin, updateVehicle);
router.get("/:id",jwtToken, getVehicle);
router.get("/",jwtToken, getAllVehicles);
router.delete("/:id",jwtToken, checkAdmin, deleteVehicle);


module.exports = router;
