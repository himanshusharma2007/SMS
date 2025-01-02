import React, { useState } from "react";
import { MapContainer, TileLayer, useMapEvents, Polyline, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const BusRoute = () => {
  const [routes, setRoutes] = useState([]);
  const [showAddRouteModal, setShowAddRouteModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [formData, setFormData] = useState({
    busNumber: "",
    routeDistance: "",
    startLocation: "",
    endLocation: "",
  });
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(null);
  const [stopPoints, setStopPoints] = useState([]);
  const [driverLocation, setDriverLocation] = useState({ lat: null, lng: null });

  // ... (keeping all the handler functions same as they manage state) ...

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRoute = () => {
    setShowAddRouteModal(true);
  };

  const handleNextToMap = () => {
    setShowAddRouteModal(false);
    setShowMapModal(true);
  };

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setStopPoints((prev) => [...prev, { lat, lng }]);
  };

  const handleConfirmRoute = () => {
    const newRoute = {
      ...formData,
      stopPoints,
      driverLocation: { lat: null, lng: null },
    };
    setRoutes((prev) => [...prev, newRoute]);
    setShowMapModal(false);
    setFormData({
      busNumber: "",
      routeDistance: "",
      startLocation: "",
      endLocation: "",
    });
    setStopPoints([]);
  };

  const handleViewTracking = (index) => {
    setSelectedRouteIndex(index);
    setShowTrackingModal(true);
  };

  const handleDriverLocationUpdate = (e) => {
    const { name, value } = e.target;
    setDriverLocation((prev) => ({ ...prev, [name]: parseFloat(value) }));
  };

  const confirmDriverLocation = () => {
    if (selectedRouteIndex !== null) {
      const updatedRoutes = [...routes];
      updatedRoutes[selectedRouteIndex].driverLocation = driverLocation;
      setRoutes(updatedRoutes);
      setShowTrackingModal(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Bus Route Management</h1>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          onClick={handleAddRoute}
        >
          <span>Add New Route</span>
        </button>
      </div>

      {/* Route Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map((route, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Route {index + 1}</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Bus {route.busNumber}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Distance</span>
                <span className="font-medium">{route.routeDistance} km</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Start</span>
                <span className="font-medium">{route.startLocation}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">End</span>
                <span className="font-medium">{route.endLocation}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Driver Location</span>
                <span className="font-medium">
                  {route.driverLocation.lat && route.driverLocation.lng
                    ? `(${route.driverLocation.lat.toFixed(4)}, ${route.driverLocation.lng.toFixed(4)})`
                    : "Not updated"}
                </span>
              </div>
            </div>

            <button
              className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              onClick={() => handleViewTracking(index)}
            >
              Update Location
            </button>
          </div>
        ))}
      </div>

      {/* Add Route Modal */}
      {showAddRouteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-6">Add New Route</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="busNumber"
                value={formData.busNumber}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Bus Number"
              />
              <input
                type="text"
                name="routeDistance"
                value={formData.routeDistance}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Route Distance (km)"
              />
              <input
                type="text"
                name="startLocation"
                value={formData.startLocation}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Start Location"
              />
              <input
                type="text"
                name="endLocation"
                value={formData.endLocation}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="End Location"
              />
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                onClick={() => setShowAddRouteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                onClick={handleNextToMap}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-full max-w-4xl m-4 p-6">
            <h2 className="text-xl font-bold mb-4">Select Bus Stops</h2>
            <div className="relative h-[600px] w-full rounded-lg overflow-hidden">
              <MapContainer
                center={[26.9124, 75.7873]}
                zoom={12}
                style={{ height: "100%", width: "100%" }}
                className="rounded-lg"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapClickHandler onClick={handleMapClick} />
                {stopPoints.map((point, index) => (
                  <Marker key={index} position={[point.lat, point.lng]} />
                ))}
                <Polyline positions={stopPoints.map((point) => [point.lat, point.lng])} color="blue" />
              </MapContainer>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                onClick={() => setShowMapModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                onClick={handleConfirmRoute}
              >
                Confirm Route
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bus Tracking Modal */}
      {showTrackingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
            <h2 className="text-xl font-bold mb-6">Update Driver Location</h2>
            <div className="space-y-4">
              <input
                type="number"
                name="lat"
                value={driverLocation.lat || ""}
                onChange={handleDriverLocationUpdate}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Latitude"
              />
              <input
                type="number"
                name="lng"
                value={driverLocation.lng || ""}
                onChange={handleDriverLocationUpdate}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Longitude"
              />
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                onClick={() => setShowTrackingModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                onClick={confirmDriverLocation}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Component for Map Clicks
const MapClickHandler = ({ onClick }) => {
  useMapEvents({
    click: (e) => onClick(e),
  });
  return null;
};

export default BusRoute;