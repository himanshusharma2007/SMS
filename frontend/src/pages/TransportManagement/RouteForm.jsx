import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import VehicleService from '../../services/VehicleService';
import RouteService from '../../services/RouteService';
import { useNavigate, useParams } from 'react-router-dom';

const RouteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    vehicle: '',
    stops: []
  });
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [stopName, setStopName] = useState('');
  
  // Map default center (can be adjusted based on your needs)
  const defaultCenter = [51.505, -0.09];
  
  useEffect(() => {
    fetchVehicles();
    if (id) {
      fetchRouteData();
    }
  }, [id]);

  const fetchVehicles = async () => {
    try {
      const response = await VehicleService.getAllVehicles();
      setVehicles(response.data);
    } catch (error) {
      setError('Failed to fetch vehicles');
    }
  };

  const fetchRouteData = async () => {
    try {
      const response = await RouteService.getRoute(id);
      setFormData(response.data);
    } catch (error) {
      setError('Failed to fetch route data');
    }
  };

  const handleMapClick = (e) => {
    setSelectedPosition({
      lat: e.latlng.lat,
      lng: e.latlng.lng
    });
  };

  const handleAddStop = () => {
    if (!selectedPosition || !stopName) {
      setError('Please select a location on map and enter stop name');
      return;
    }

    const newStop = {
      stop: stopName,
      lat: selectedPosition.lat,
      lng: selectedPosition.lng,
      sequence: formData.stops.length + 1
    };

    setFormData(prev => ({
      ...prev,
      stops: [...prev.stops, newStop]
    }));
    setStopName('');
    setSelectedPosition(null);
  };

  const handleRemoveStop = (index) => {
    const updatedStops = formData.stops.filter((_, i) => i !== index)
      .map((stop, i) => ({ ...stop, sequence: i + 1 }));
    
    setFormData(prev => ({
      ...prev,
      stops: updatedStops
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.stops.length === 0) {
        setError('Please add at least one stop');
        return;
      }

      if (id) {
        await RouteService.updateRoute(id, formData);
      } else {
        await RouteService.createRoute(formData);
      }
      navigate('/routes');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">
            {id ? 'Update Route' : 'Create New Route'}
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
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter route name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Vehicle
                </label>
                <select
                  value={formData.vehicle}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicle: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle._id} value={vehicle._id}>
                      {vehicle.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add Stops
                </label>
                <div className="h-[400px] rounded-lg overflow-hidden border border-gray-300">
                  <MapContainer
                    center={defaultCenter}
                    zoom={13}
                    className="h-full w-full"
                    onClick={handleMapClick}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {selectedPosition && (
                      <Marker position={[selectedPosition.lat, selectedPosition.lng]}>
                        <Popup>Selected Location</Popup>
                      </Marker>
                    )}
                    {formData.stops.map((stop, index) => (
                      <Marker key={index} position={[stop.lat, stop.lng]}>
                        <Popup>{stop.stop} (Stop {stop.sequence})</Popup>
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
                      <h3 className="font-medium mb-2">Added Stops:</h3>
                      <ul className="space-y-2">
                        {formData.stops.map((stop, index) => (
                          <li key={index} className="flex justify-between items-center">
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
                  onClick={() => navigate('/routes')}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {id ? 'Update Route' : 'Create Route'}
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