const VehicleHistory = require('../models/VehicleHistoryModels');
const Vehicle = require('../models/vehicleModels');
const Route = require('../models/RouteModels');

// Helper function to check if user is authorized
const isAuthorized = (user, vehicle) => {
    return user.role === 'admin' ||
        (vehicle.driver.includes(user._id));
};

// Add new vehicle history entry
exports.addVehicleHistory = async (req, res) => {
    try {
        const { vehicleId, routeId, date } = req.body;

        // Check if vehicle exists
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Verify user authorization
        if (!isAuthorized(req.user, vehicle)) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Get route details
        const route = await Route.findById(routeId);
        if (!route) {
            return res.status(404).json({ message: 'Route not found' });
        }

        // Create stops array with initial status
        const stops = route.stops.map((stop, index) => ({
            stop: stop.stop,
            lng: stop.lng,
            lat: stop.lat,
            reached: index === 0 ? 'Next' : 'Pending',
            arrivalTime: null
        }));

        // Create new vehicle history entry
        const vehicleHistory = new VehicleHistory({
            vehicle: vehicleId,
            route: routeId,
            date,
            stops,
            completed: false
        });

        await vehicleHistory.save();

        res.status(201).json({
            success: true,
            data: vehicleHistory
        });

    } catch (error) {
        res.status(500).json({
            error: 'Error creating vehicle history'
        });
    }
}

// Update vehicle history when stop is reached
exports.updateVehicleHistoryStop = async (req, res) => {
    try {
        const { historyId, stopName } = req.body;

        // Find vehicle history entry
        const history = await VehicleHistory.findById(historyId);
        if (!history) {
            return res.status(404).json({ message: 'Vehicle history not found' });
        }

        // Check vehicle and authorization
        const vehicle = await Vehicle.findById(history.vehicle);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        if (!isAuthorized(req.user, vehicle)) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Find the current stop index
        const currentStopIndex = history.stops.findIndex(stop => stop.stop === stopName);
        if (currentStopIndex === -1) {
            return res.status(404).json({ message: 'Stop not found in route' });
        }

        // Update current stop status and arrival time
        history.stops[currentStopIndex].reached = 'Reached';
        history.stops[currentStopIndex].arrivalTime = new Date();

        // Update previous stop to 'Left' if exists
        if (currentStopIndex > 0) {
            history.stops[currentStopIndex - 1].reached = 'Left';
        }

        // Set next stop as 'Next' if exists
        if (currentStopIndex < history.stops.length - 1) {
            history.stops[currentStopIndex + 1].reached = 'Next';
        }

        // Check if this is the last stop
        if (currentStopIndex === history.stops.length - 1) {
            history.completed = true;
        }

        await history.save();

        res.status(200).json({
            success: true,
            data: history
        });

    } catch (error) {
        res.status(500).json({
            error: 'Error updating vehicle history'
        });
    }
}