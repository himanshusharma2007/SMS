import React, { useState, useEffect } from "react";
import VehicleService from "../../services/VehicleService";
import { toast } from "react-hot-toast";
import DriverService from "../../services/DriverService";
import RouteService from "../../services/RouteService";

const VehicleForm = ({ onClose, onSave, vehicleId }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    model: "",
    registration: "",
    ownership: "owned",
    yearOfManufacture: "",
    pollutionValidUntil: "",
    lastServiceDate: "",
    totalKm: "0",
    insuranceExpiry: "",
    maintenanceCost: "0",
    fuelCharge: "0",
    chassisNumber: "",
    engineNumber: "",
    color: "Blue",
    routeAssigned: null,
    driverAssigned: [],
    img: null,
  });
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    if (vehicleId) {
      fetchVehicleData();
    }
  }, [vehicleId]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        console.log("fetchDropdownData");
        const driversResponse = await DriverService.getAllDrivers();
        const routesResponse = await RouteService.getRoutesForDropdown();

        console.log("driversResponse", driversResponse);
        console.log("routesResponse", routesResponse);

        // Ensure you're accessing the correct property
        const driversData = Array.isArray(driversResponse.data)
          ? driversResponse.data
          : [];
        const routesData = Array.isArray(routesResponse) ? routesResponse : [];

        setDrivers(driversData);
        setRoutes(routesData);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch form data");
      }
    };

    fetchDropdownData();
  }, []);

  const fetchVehicleData = async () => {
    try {
      setLoading(true);
      const response = await VehicleService.getVehicle(vehicleId);
      const vehicle = response?.data;

      const formatDate = (date) =>
        date ? new Date(date).toISOString().split("T")[0] : "";

      setFormData({
        model: vehicle.model || "",
        registration: vehicle.registration || "",
        ownership: vehicle.ownership || "owned",
        yearOfManufacture: vehicle.yearOfManufacture || "",
        pollutionValidUntil: formatDate(vehicle.pollutionValidUntil),
        lastServiceDate: formatDate(vehicle.lastServiceDate),
        totalKm: vehicle.totalKm || "0",
        insuranceExpiry: formatDate(vehicle.insuranceExpiry),
        maintenanceCost: vehicle.maintenanceCost || "0",
        fuelCharge: vehicle.fuelCharge || "0",
        chassisNumber: vehicle.chassisNumber || "",
        engineNumber: vehicle.engineNumber || "",
        color: vehicle.color || "Blue",
        routeAssigned: vehicle.routeAssigned || null,
        driverAssigned: vehicle.driverAssigned || [],
        img: vehicle.img?.url || null,
      });
    } catch (error) {
      toast.error("Failed to fetch vehicle details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDriverAssignmentChange = (e) => {
    const options = e.target.options;
    const selectedDrivers = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedDrivers.push(options[i].value);
      }
    }
    setFormData({ ...formData, driverAssigned: selectedDrivers });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, img: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        console.log(key)
        if (key === "driverAssigned") {
          data.append(key, JSON.stringify(formData[key]));
        } else if (key === "img" && formData[key] instanceof File) {
          data.append("image",   formData[key]);
        } else if (formData[key] === null) {
            console.log("skip")
        } else if (
          key === "yearOfManufacture" ||
          key === "totalKm" ||
          key === "maintenanceCost" ||
          key === "fuelCharge"
        ) {
          data.append(key, parseInt(formData[key], 10));
        } else {
          data.append(key, formData[key]);
        }
      });

      let response;
      if (vehicleId) {
        response = await VehicleService.updateVehicle(vehicleId, data);
      } else {
        response = await VehicleService.addVehicle(data);
      }

      toast.success(
        vehicleId
          ? "Vehicle updated successfully"
          : "Vehicle added successfully"
      );
      onSave(response.data);
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to save vehicle");
    }
  };

  if (loading) {
    return (
      <div className="modal">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal">
      <h2 className="text-2xl font-bold mb-6">
        {vehicleId ? "Edit Vehicle" : "Add New Vehicle"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-main grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <div className="col-span-2">
            <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Model
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Registration Number
                  <input
                    type="text"
                    name="registration"
                    value={formData.registration}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Color
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Ownership
                  <select
                    name="ownership"
                    value={formData.ownership}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="owned">Owned</option>
                    <option value="leased">Leased</option>
                    <option value="rented">Rented</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          {/* Technical Information */}
          <div className="col-span-2">
            <h3 className="text-xl font-semibold mb-4">
              Technical Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Chassis Number
                  <input
                    type="text"
                    name="chassisNumber"
                    value={formData.chassisNumber}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Engine Number
                  <input
                    type="text"
                    name="engineNumber"
                    value={formData.engineNumber}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Year of Manufacture
                  <input
                    type="number"
                    name="yearOfManufacture"
                    value={formData.yearOfManufacture}
                    onChange={handleChange}
                    min="1900"
                    max={new Date().getFullYear()}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Total Kilometers
                  <input
                    type="number"
                    name="totalKm"
                    value={formData.totalKm}
                    onChange={handleChange}
                    min="0"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Dates and Documentation */}
          <div className="col-span-2">
            <h3 className="text-xl font-semibold mb-4">
              Dates and Documentation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Pollution Valid Until
                  <input
                    type="date"
                    name="pollutionValidUntil"
                    value={formData.pollutionValidUntil}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Service Date
                  <input
                    type="date"
                    name="lastServiceDate"
                    value={formData.lastServiceDate}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Insurance Expiry
                  <input
                    type="date"
                    name="insuranceExpiry"
                    value={formData.insuranceExpiry}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Operational Information */}
          <div className="col-span-2">
            <h3 className="text-xl font-semibold mb-4">
              Operational Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Maintenance Cost
                  <input
                    type="number"
                    name="maintenanceCost"
                    value={formData.maintenanceCost}
                    onChange={handleChange}
                    min="0"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Fuel Charge
                  <input
                    type="number"
                    name="fuelCharge"
                    value={formData.fuelCharge}
                    onChange={handleChange}
                    min="0"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Route Assigned
                  <select
                    name="routeAssigned"
                    value={formData.routeAssigned}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select Route</option>
                    {routes.map((route) => (
                      <option key={route.value} value={route.value}>
                        {route.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Assigned Drivers
                  <select
                    multiple
                    value={formData.driverAssigned}
                    onChange={handleDriverAssignmentChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {drivers.map((driver) => (
                      <option key={driver._id} value={driver._id}>
                        {driver.staffId.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="col-span-2">
            <h3 className="text-xl font-semibold mb-4">Vehicle Photo</h3>
            <div>
              <label className="block text-sm font-medium mb-1">
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full"
                />
              </label>
              {formData.img && (
                <div className="mt-2">
                  <img
                    src={
                      formData.img instanceof File
                        ? URL.createObjectURL(formData.img)
                        : formData.img
                    }
                    alt="Vehicle Preview"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            typetype="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {vehicleId ? "Update Vehicle" : "Add Vehicle"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleForm;
