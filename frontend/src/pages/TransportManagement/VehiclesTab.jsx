import React, { useState } from "react";
import { Link } from "react-router-dom";
import VehicleForm from "./VehicleForm";
import data from "./InitialData.json";

const VehicleTab = () => {
  const [vehicles, setVehicles] = useState(data.vehicles);
  const availableDrivers = data.drivers;
  const availableRoutes = data.routes;
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);

  const handleAdd = () => {
    setCurrentVehicle(null);
    setShowForm(true);
  };

  const handleSave = (vehicle) => {
    if (currentVehicle) {
      setVehicles(
        vehicles.map((v) =>
          v.id === currentVehicle.id ? { ...vehicle, id: currentVehicle.id } : v
        )
      );
    } else {
      setVehicles([...vehicles, { ...vehicle, id: `V${vehicles.length + 1}` }]);
    }
    setShowForm(false);
  };

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
          <span className="absolute right-3 top-2.5 text-gray-400">
            🔍
          </span>
        </div>
        <button
          onClick={handleAdd}
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {filteredVehicles.map((vehicle) => (
          <Link
            to={`/vehicle/${vehicle.id}`}
            key={vehicle.id}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
          >
            <div className="aspect-video w-full bg-gray-100">
              {vehicle.img ? (
                <img
                  src={vehicle.img}
                  alt={`${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400">
                  {vehicle.model
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()}
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {vehicle.model}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Reg: {vehicle.registration}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(vehicle.status)}`}>
                  {vehicle.status}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Capacity</span>
                  <span className="text-gray-900">{vehicle.capacity} seats</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Fuel Type</span>
                  <span className="text-gray-900">{vehicle.fuelType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Ownership</span>
                  <span className="text-gray-900">{vehicle.ownership}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Driver</span>
                  <span className="text-gray-900 font-medium">
                    {vehicle.driverAssigned || 'Unassigned'}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {filteredVehicles.length === 0 && (
          <div className="col-span-full flex items-center justify-center p-8 text-gray-500">
            No vehicles found.
          </div>
        )}
      </div>

      {showForm && (
        <VehicleForm
          vehicle={currentVehicle}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
          availableDrivers={availableDrivers}
          availableRoutes={availableRoutes}
        />
      )}
    </div>
  );
};

export default VehicleTab;