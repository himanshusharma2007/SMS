import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import AddVehicleHistoryForm from "../forms/AddVehicleHistoryForm";

// Custom marker icon setup
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

// Dummy data
const dummyVehicles = [
  { _id: "1", registration: "ABC123", model: "Toyota Van" },
  { _id: "2", registration: "XYZ789", model: "Ford Transit" },
];

const dummyDrivers = [
  { _id: "1", name: "John Doe", phoneNumber: "555-0123" },
  { _id: "2", name: "Jane Smith", phoneNumber: "555-0124" },
];

const dummyRoutes = [
  {
    _id: "1",
    name: "City Center Route",
    stops: [
      { stop: "Central Station", lng: 13.404954, lat: 52.520008 },
      { stop: "Mall Plaza", lng: 13.414954, lat: 52.520508 },
      { stop: "Business Park", lng: 13.424954, lat: 52.521008 },
      { stop: "Tech Hub", lng: 13.434954, lat: 52.521508 },
    ],
  },
  {
    _id: "2",
    name: "Suburban Route",
    stops: [
      { stop: "Suburb Station", lng: 13.444954, lat: 52.522008 },
      { stop: "Park & Ride", lng: 13.454954, lat: 52.522508 },
      { stop: "Shopping Center", lng: 13.464954, lat: 52.523008 },
    ],
  },
];

const VehicleTrackingPage = () => {
  const [vehicleHistory, setVehicleHistory] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddHistory = ({
    selectedVehicle,
    selectedDriver,
    selectedRoute,
    date,
  }) => {
    setLoading(true);
    const selectedRouteData = dummyRoutes.find(
      (route) => route._id === selectedRoute
    );

    // Create dummy history with initial status
    const newHistory = {
      _id: Math.random().toString(36).substr(2, 9),
      vehicle: dummyVehicles.find((v) => v._id === selectedVehicle),
      driver: dummyDrivers.find((d) => d._id === selectedDriver),
      route: selectedRouteData,
      date: new Date(date),
      stops: selectedRouteData.stops.map((stop, index) => ({
        ...stop,
        reached: index === 0 ? "Next" : "Pending",
        arrivalTime: null,
      })),
      completed: false,
    };

    setTimeout(() => {
      setVehicleHistory(newHistory);
      setLoading(false);
    }, 500);
  };

  const MapComponent = ({ vehicleHistory }) => {
    if (!vehicleHistory) return null;

    const routeCoordinates = vehicleHistory.stops.map((stop) => [
      stop.lat,
      stop.lng,
    ]);
    const currentStop = vehicleHistory.stops.find(
      (stop) => stop.reached === "Next"
    );

    return (
      <MapContainer
        center={
          currentStop
            ? [currentStop.lat, currentStop.lng]
            : [52.520008, 13.404954]
        }
        zoom={13}
        style={{ height: "100%", width: "100%" }}
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
              className: "custom-marker",
              html: `
                <div style="
                  width: 12px;
                  height: 12px;
                  border-radius: 50%;
                  background-color: ${
                    stop.reached === "Reached"
                      ? "#10B981"
                      : stop.reached === "Next"
                      ? "#3B82F6"
                      : stop.reached === "Left"
                      ? "#6B7280"
                      : "#EF4444"
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
          <AddVehicleHistoryForm
            vehicles={dummyVehicles}
            drivers={dummyDrivers}
            routes={dummyRoutes}
            onAddHistory={handleAddHistory}
            loading={loading}
          />
        ) : (
          <div className="space-y-4">{/* Vehicle History Details */}</div>
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
