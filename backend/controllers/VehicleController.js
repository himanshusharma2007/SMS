const Vehicle = require("../models/vehicleModels")

// Add new vehicle
exports.addVehicle = async (req, res) => {
    try {
        const { registrationNumber, driver, type } = req.body;

        if (!registrationNumber || !type) {
            return res.status(400).json({ error: "registrationNumber or type are required" })
        }

        // Check if vehicle with registration number already exists
        const existingVehicle = await Vehicle.findOne({ registrationNumber });
        if (existingVehicle) {
            return res.status(400).json({
                error: 'Vehicle with this registration number already exists'
            });
        }

        // Create new vehicle
        const vehicle = new Vehicle({
            registrationNumber,
            driver,
            type,
            status: "Active" // Set default status as Active
        });

        await vehicle.save();

        // Populate driver details in response
        const populatedVehicle = await Vehicle.findById(vehicle._id)
            .populate('driver', 'name phoneNumber'); // Assuming these are the fields you want from driver

        res.status(201).json({
            data: populatedVehicle
        });

    } catch (error) {
        res.status(500).json({
            error: 'Error adding vehicle'
        });
    }
}

// Update vehicle
exports.updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // If registration number is being updated, check for duplicates
        if (updateData.registrationNumber) {
            const existingVehicle = await Vehicle.findOne({
                registrationNumber: updateData.registrationNumber,
                _id: { $ne: id } // Exclude current vehicle from check
            });

            if (existingVehicle) {
                return res.status(400).json({
                    error: 'Vehicle with this registration number already exists'
                });
            }
        }

        // Update vehicle
        const vehicle = await Vehicle.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('driver', 'name phoneNumber')
            .populate('currentRoute', 'name');

        if (!vehicle) {
            return res.status(404).json({
                error: 'Vehicle not found'
            });
        }

        res.status(200).json({
            success: true,
            data: vehicle
        });

    } catch (error) {
        res.status(500).json({
            error: 'Error updating vehicle'
        });
    }
}

// Get single vehicle
exports.getVehicle = async (req, res) => {
    try {
        const { id } = req.params;

        const vehicle = await Vehicle.findById(id)
            .populate('driver', 'name phoneNumber')
            .populate('currentRoute', 'name');

        if (!vehicle) {
            return res.status(404).json({
                message: 'Vehicle not found'
            });
        }

        res.status(200).json({
            success: true,
            data: vehicle
        });

    } catch (error) {
        res.status(500).json({
            error: 'Error retrieving vehicle'
        });
    }
}

// Get all vehicles
exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find()
            .populate('driver', 'name phoneNumber')
            .populate('currentRoute', 'name')
            .sort({ createdAt: -1 }); // Sort by newest first

        res.status(200).json({
            success: true,
            count: vehicles.length,
            data: vehicles
        });

    } catch (error) {
        res.status(500).json({
            error: 'Error retrieving vehicles'
        });
    }
}

// Delete vehicle
exports.deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;

        const vehicle = await Vehicle.findByIdAndDelete(id);

        if (!vehicle) {
            return res.status(404).json({
                message: 'Vehicle not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Vehicle deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            error: 'Error deleting vehicle',
        });
    }
}