import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import VehicleService from "../../services/VehicleService";
import RouteService from "../../services/RouteService";
import { useNavigate, useParams } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Map Click Handler Component
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e);
    },
  });
  return null;
};

const RouteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    vehicle: "",
    stops: [],
  });
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [stopName, setStopName] = useState("");
  const [mapCenter, setMapCenter] = useState([26.9124, 75.7873]);
  const [mapZoom, setMapZoom] = useState(9.5);
  const [mapRef, setMapRef] = useState(null);

  useEffect(() => {
    const initializeForm = async () => {
      try {
        setLoading(true);
        await fetchVehicles();
        if (id) {
          await fetchRouteData();
        }
      } catch (err) {
        setError(err.message || "Failed to initialize form");
      } finally {
        setLoading(false);
      }
    };

    initializeForm();
  }, [id]);

  const fetchVehicles = async () => {
    try {
      const response = await VehicleService.getAllVehicles();
      setVehicles(response.data || []);
    } catch (error) {
      throw new Error("Failed to fetch vehicles");
    }
  };

  const fetchRouteData = async () => {
    try {
      const response = await RouteService.getRoute(id);
      console.log("RouteData:", response);
      const routeData = response.data;

      setFormData({
        name: routeData.name || "",
        vehicle: routeData.vehicle?._id || routeData.vehicle || "",
        stops: routeData.stops || [],
      });

      // Center map on first stop if available
      if (routeData.stops && routeData.stops.length > 0) {
        const firstStop = routeData.stops[0];
        setMapCenter([firstStop.lat, firstStop.lng]);
        // Adjust map bounds to show all stops
        if (mapRef) {
          const bounds = L.latLngBounds(
            routeData.stops.map((stop) => [stop.lat, stop.lng])
          );
          mapRef.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    } catch (error) {
      throw new Error("Failed to fetch route data");
    }
  };

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setSelectedPosition({ lat, lng });
    setError("");
  };

  const handleAddStop = () => {
    if (!selectedPosition || !stopName.trim()) {
      setError("Please select a location on map and enter stop name");
      return;
    }

    const newStop = {
      stop: stopName.trim(),
      lat: selectedPosition.lat,
      lng: selectedPosition.lng,
      sequence: formData.stops.length + 1,
    };

    setFormData((prev) => ({
      ...prev,
      stops: [...prev.stops, newStop],
    }));
    setStopName("");
    setSelectedPosition(null);
    setError("");
  };

  const handleRemoveStop = (index) => {
    const updatedStops = formData.stops
      .filter((_, i) => i !== index)
      .map((stop, i) => ({ ...stop, sequence: i + 1 }));

    setFormData((prev) => ({
      ...prev,
      stops: updatedStops,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error("Please enter a route name");
      }

      if (!formData.vehicle) {
        throw new Error("Please select a vehicle");
      }

      if (formData.stops.length < 2) {
        throw new Error("Please add at least two stops for the route");
      }

      // Prepare data for submission
      const routeData = {
        ...formData,
        stops: formData.stops.map((stop, index) => ({
          ...stop,
          sequence: index + 1,
        })),
      };

      if (id) {
        await RouteService.updateRoute(id, routeData);
      } else {
        await RouteService.createRoute(routeData);
      }

      navigate(-1);
    } catch (error) {
      setError(error.message || "Failed to save route");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">
            {id ? "Edit Route" : "Create New Route"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Route Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter route name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Vehicle
                </label>
                <select
                  value={formData.vehicle}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      vehicle: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle._id} value={vehicle._id}>
                      {vehicle.model} - {vehicle.registration}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stops (Click on the map to select location)
                </label>
                <div className="h-[400px] rounded-lg overflow-hidden border border-gray-300">
                  <MapContainer
                    center={mapCenter}
                    zoom={mapZoom}
                    className="h-full w-full"
                    ref={setMapRef}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapClickHandler onMapClick={handleMapClick} />

                    {selectedPosition && (
                      <Marker
                        position={[selectedPosition.lat, selectedPosition.lng]}
                      >
                        <Popup>Selected Location</Popup>
                      </Marker>
                    )}

                    {formData.stops.map((stop, index) => (
                      <Marker key={index} position={[stop.lat, stop.lng]}>
                        <Popup>
                          <div>
                            <strong>{stop.stop}</strong>
                            <br />
                            Stop {stop.sequence}
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={stopName}
                      onChange={(e) => setStopName(e.target.value)}
                      placeholder="Enter stop name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddStop}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Add Stop
                    </button>
                  </div>

                  {formData.stops.length > 0 && (
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">Current Stops:</h3>
                      <ul className="space-y-2">
                        {formData.stops.map((stop, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center"
                          >
                            <span>
                              {stop.stop} (Stop {stop.sequence})
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveStop(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {id ? "Update Route" : "Create Route"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RouteForm;
