import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom marker icon setup
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

// Dummy data
const dummyVehicles = [
  { _id: '1', registration: 'ABC123', model: 'Toyota Van' },
  { _id: '2', registration: 'XYZ789', model: 'Ford Transit' }, 
];

const dummyDrivers = [
  { _id: '1', name: 'John Doe', phoneNumber: '555-0123' },
  { _id: '2', name: 'Jane Smith', phoneNumber: '555-0124' },
];

const dummyRoutes = [
  {
    _id: '1',
    name: 'City Center Route',
    stops: [
      { stop: 'Central Station', lng: 13.404954, lat: 52.520008 },
      { stop: 'Mall Plaza', lng: 13.414954, lat: 52.520508 },
      { stop: 'Business Park', lng: 13.424954, lat: 52.521008 },
      { stop: 'Tech Hub', lng: 13.434954, lat: 52.521508 },
    ]
  },
  {
    _id: '2',
    name: 'Suburban Route',
    stops: [
      { stop: 'Suburb Station', lng: 13.444954, lat: 52.522008 },
      { stop: 'Park & Ride', lng: 13.454954, lat: 52.522508 },
      { stop: 'Shopping Center', lng: 13.464954, lat: 52.523008 },
    ]
  },
];

const VehicleTrackingPage = () => {
  const [vehicleHistory, setVehicleHistory] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  // Simulate adding new vehicle history
  const handleAddHistory = (e) => {
    e.preventDefault();
    setLoading(true);
    
    const selectedRouteData = dummyRoutes.find(route => route._id === selectedRoute);
    
    // Create dummy history with initial status
    const newHistory = {
      _id: Math.random().toString(36).substr(2, 9),
      vehicle: dummyVehicles.find(v => v._id === selectedVehicle),
      driver: dummyDrivers.find(d => d._id === selectedDriver),
      route: selectedRouteData,
      date: new Date(date),
      stops: selectedRouteData.stops.map((stop, index) => ({
        ...stop,
        reached: index === 0 ? 'Next' : 'Pending',
        arrivalTime: null
      })),
      completed: false
    };

    setTimeout(() => {
      setVehicleHistory(newHistory);
      setLoading(false);
    }, 500);
  };

  // Simulate updating stop status
  const handleUpdateStop = (historyId, stopName) => {
    setVehicleHistory(prev => {
      const updatedStops = prev.stops.map((stop, index) => {
        if (stop.stop === stopName) {
          return { ...stop, reached: 'Reached', arrivalTime: new Date() };
        }
        if (stop.reached === 'Next') {
          return { ...stop, reached: 'Left' };
        }
        if (index === prev.stops.findIndex(s => s.stop === stopName) + 1) {
          return { ...stop, reached: 'Next' };
        }
        return stop;
      });

      const isLastStop = stopName === prev.stops[prev.stops.length - 1].stop;

      return {
        ...prev,
        stops: updatedStops,
        completed: isLastStop
      };
    });
  };

  const MapComponent = ({ vehicleHistory }) => {
    if (!vehicleHistory) return null;

    const routeCoordinates = vehicleHistory.stops.map(stop => [stop.lat, stop.lng]);
    const currentStop = vehicleHistory.stops.find(stop => stop.reached === 'Next');
    
    return (
      <MapContainer
        center={currentStop ? [currentStop.lat, currentStop.lng] : [52.520008, 13.404954]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Polyline
          positions={routeCoordinates}
          color="blue"
          weight={3}
          opacity={0.7}
        />
        {vehicleHistory.stops.map((stop, index) => (
          <Marker
            key={index}
            position={[stop.lat, stop.lng]}
            icon={L.divIcon({
              className: 'custom-marker',
              html: `
                <div style="
                  width: 12px;
                  height: 12px;
                  border-radius: 50%;
                  background-color: ${
                    stop.reached === 'Reached' ? '#10B981' :
                    stop.reached === 'Next' ? '#3B82F6' :
                    stop.reached === 'Left' ? '#6B7280' :
                    '#EF4444'
                  };
                "></div>
              `,
            })}
          />
        ))}
      </MapContainer>
    );
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-white p-4 shadow-lg overflow-y-auto">
        {!vehicleHistory ? (
          <form onSubmit={handleAddHistory} className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Add Vehicle History</h2>
            <div>
              <label className="block mb-2">Vehicle</label>
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Vehicle</option>
                {dummyVehicles.map(vehicle => (
                  <option key={vehicle._id} value={vehicle._id}>
                    {vehicle.registration} - {vehicle.model}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Driver</label>
              <select
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Driver</option>
                {dummyDrivers.map(driver => (
                  <option key={driver._id} value={driver._id}>
                    {driver.name} - {driver.phoneNumber}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Route</label>
              <select
                value={selectedRoute}
                onChange={(e) => setSelectedRoute(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Route</option>
                {dummyRoutes.map(route => (
                  <option key={route._id} value={route._id}>
                    {route.name} ({route.stops.length} stops)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Date</label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              {loading ? 'Creating...' : 'Create History'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Route Progress</h2>
            <div className="mb-4">
              <div className="font-bold">{vehicleHistory.vehicle.registration}</div>
              <div className="text-sm text-gray-500">Driver: {vehicleHistory.driver.name}</div>
            </div>
            {vehicleHistory.stops.map((stop, index) => (
              <div
                key={index}
                className="p-4 border rounded flex items-center justify-between"
              >
                <div>
                  <div className="font-bold">{stop.stop}</div>
                  <div className="text-sm text-gray-500">
                    {stop.arrivalTime
                      ? new Date(stop.arrivalTime).toLocaleTimeString()
                      : 'Not arrived'}
                  </div>
                </div>
                {stop.reached === 'Next' && !vehicleHistory.completed && (
                  <button
                    onClick={() => handleUpdateStop(vehicleHistory._id, stop.stop)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Mark Reached
                  </button>
                )}
                <div
                  className={`w-3 h-3 rounded-full ${
                    stop.reached === 'Reached' ? 'bg-green-500' :
                    stop.reached === 'Next' ? 'bg-blue-500' :
                    stop.reached === 'Left' ? 'bg-gray-500' :
                    'bg-red-500'
                  }`}
                />
              </div>
            ))}
            {vehicleHistory.completed && (
              <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
                Route Completed!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="w-3/4 relative">
        <MapComponent vehicleHistory={vehicleHistory} />
      </div>
    </div>
  );
};

export default VehicleTrackingPage;