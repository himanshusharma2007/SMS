const mongoose = require("mongoose")

const vehicleSchema = new mongoose.Schema({
    registrationNumber: { 
        type: String, 
        required: true, 
        unique: true 
    },
    driver: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Driver' 
        }
    ],
    type: { 
        type: String, 
        enum: ['Bus', 'Van'], 
        required: true 
    },
    currentRoute: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Route' 
    }, // Link to the active route
    status: {
        type: String,
        enum: ["Active", "Inactive"]
    }
}, {timestamps: true});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports = Vehicle