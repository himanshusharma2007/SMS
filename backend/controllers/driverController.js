const Department = require("../models/departmentModels");
const Driver = require("../models/DriverModel");
const Staff = require("../models/staffModels");
const generateUniqueId = require("../utils/generateId");
const hashPassword = require("../utils/password");


// Add a new driver
exports.addDriver = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const {
            licenseNumber,
            experience,
            dateOfBirth,
            licenseExpiryDate,
            name,
            email,
            phoneNo,
            salary,
            address,
            govId,
        } = req.body;

        if (!licenseNumber || !experience || !dateOfBirth || !licenseExpiryDate || !name || !email || !phoneNo || !salary || !address || !govId) {
            return res.status(400).json({ error: "Please fill all required fields." });
        }

        // Start the transaction
        session.startTransaction();

        // Ensure "Transport" department exists
        let department = await Department.findOne({ name: "Transport" }).session(session);
        if (!department) {
            department = await Department.create({ name: "Transport" }, { session });
            department = department;
        }

        // Create staff record
        const staff = await Staff.create([{
            name,
            email,
            joinDate: Date.now(),
            phoneNo,
            department: department._id,
            salary,
            address,
            govId,
        }], { session });
        const createdStaff = staff;

        // Generate unique registration number and hash the password
        const uniqueId = `D${await generateUniqueId()}`;
        const hashedPassword = await hashPassword(uniqueId);

        // Create driver record
        const newDriver = await Driver.create([{
            licenseNumber,
            experience,
            dateOfBirth,
            licenseExpiryDate,
            staffId: createdStaff._id,
            registrationNumber: uniqueId,
            password: hashedPassword,
        }], { session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({ message: "Driver added successfully.", data: newDriver[0] });
    } catch (error) {
        // Abort the transaction on error
        await session.abortTransaction();
        session.endSession();

        return res.status(500).json({ message: "Failed to add driver.", error: error.message });
    }
};


// Update driver details
exports.updateDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedDriver = await Driver.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!updatedDriver) {
            return res.status(404).json({ message: "Driver not found." });
        }

        res.status(200).json({ message: "Driver updated successfully.", data: updatedDriver });
    } catch (error) {
        res.status(500).json({ message: "Failed to update driver.", error: error.message });
    }
};

// Get driver details
exports.getDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const driver = await Driver.findById(id).populate('staffId assignedVehicle');
        if (!driver) {
            return res.status(404).json({ message: "Driver not found." });
        }

        res.status(200).json({ data: driver });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve driver.", error: error.message });
    }
};

// Get all drivers
exports.getAllDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find().populate('staffId assignedVehicle');
        res.status(200).json({ data: drivers });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve drivers.", error: error.message });
    }
};
