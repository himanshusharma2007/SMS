import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DriverForm from "./DriverForm";
import data from "./InitialData.json";

const DriverTab = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { from, search } = location.state || {};
  const [drivers, setDrivers] = useState(data.drivers);
  const [searchTerm, setSearchTerm] = useState(search || "");
  const [showForm, setShowForm] = useState(false);
  const [currentDriver, setCurrentDriver] = useState(null);

  useEffect(() => {
    if (search) {
      setSearchTerm(search);
    }
  }, [search]);

  const handleAdd = () => {
    setCurrentDriver(null);
    setShowForm(true);
  };

  const handleEdit = (driver) => {
    setCurrentDriver(driver);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setDrivers(drivers.filter((driver) => driver.id !== id));
  };

  const handleSave = (driver) => {
    if (currentDriver) {
      setDrivers((prevDrivers) =>
        prevDrivers.map((d) =>
          d.id === currentDriver.id ? { ...driver, id: currentDriver.id } : d
        )
      );
    } else {
      setDrivers((prevDrivers) => [
        ...prevDrivers,
        { ...driver, id: `D${prevDrivers.length + 1}` },
      ]);
    }
    setShowForm(false);
  };

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.license.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'on leave':
        return 'bg-yellow-100 text-yellow-800';
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
            placeholder="Search drivers..."
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
          <span>Add New Driver</span>
        </button>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {filteredDrivers.map((driver) => (
          <div
            key={driver.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-xl font-semibold text-gray-600">
                    {driver.img ? (
                      <img
                        src={driver.img}
                        alt={`${driver.name}'s photo`}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      driver.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{driver.name}</h3>
                    <span className="text-sm text-gray-500">ID: {driver.id}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(driver.status)}`}>
                  {driver.status}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-gray-600">
                  <span className="text-sm">License: {driver.license}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="text-sm">Phone: {driver.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="text-sm">Experience: {driver.experience} years</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => handleEdit(driver)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(driver.id)}
                  className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredDrivers.length === 0 && (
          <div className="col-span-full flex items-center justify-center p-8 text-gray-500">
            No drivers found.
          </div>
        )}
      </div>

      {showForm && (
        <DriverForm
          driver={currentDriver}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default DriverTab;