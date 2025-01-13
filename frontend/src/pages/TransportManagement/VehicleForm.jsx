import React, { useEffect, useState } from "react";
import DriverService from "../../services/DriverService";

const VehicleForm = ({ onClose, onSave, vehicle }) => {
  const [formData, setFormData] = useState({
    model: vehicle?.model || "",
    registration: vehicle?.registration || "",
    status: vehicle?.status || "active",
    driverAssigned: vehicle?.driverAssigned || "Not Assigned",
    img: vehicle?.img || "",
    ownership: vehicle?.ownership || "self-owned",
    yearOfManufacture: vehicle?.yearOfManufacture || "",
    pollutionVaildUntil: vehicle?.pollutionVaildUntil || "",
    lastServiceDate: vehicle?.lastServiceDate || "",
    totalKm: vehicle?.totalKm || "",
    insuranceExpiry: vehicle?.insuranceExpiry || "",
    maintenanceCost: vehicle?.maintenanceCost || "0",
    fuelCharge: vehicle?.fuelCharge || "",
    chassisNumber: vehicle?.chassisNumber || "",
    engineNumber: vehicle?.engineNumber || "",
    color: vehicle?.color || "Yellow",
    // routeAssigned: vehicle?.routeAssigned || "00",
    driverAssigned: vehicle?.driverAssigned || "Not Assigned",
  });

  const [availableDrivers, setAvailableDrivers] = useState([]);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const data = await DriverService.getAllDrivers();
      console.log("Drivers:", data.data);
      setAvailableDrivers(data.data);
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, img: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="modal">
      <h2>{vehicle ? "Edit Vehicle" : "Add New Vehicle"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-main">
          <label>
            Model
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Registration Number
            <input
              type="text"
              name="registration"
              value={formData.registration}
              onChange={handleChange}
              required
            />
          </label>

          {/* <label>Assigned Route</label>
        <select
          name="routeAssigned"
          value={formData.routeAssigned}
          onChange={handleChange}
          required
        >
          {availableRoutes.map((route, index) => (
            <option key={route.busNo} value={route.busNo}>
              {route.busNo}
           </option>
          ))}
        </select> */}

          <label>
            Assigned Driver
            <select
              name="driverAssigned"
              value={formData.driverAssigned}
              onChange={handleChange}
              required
            >
              {availableDrivers.map((driver, index) => ( 
                <option key={index} value={driver._id}>
                  {driver.staffId.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Insurance Expiry
            <input
              type="date"
              name="insuranceExpiry"
              value={formData.insuranceExpiry}
              onChange={handleChange}
            />
          </label>

          <label>
            Capacity
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Fuel Type
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              required
            >
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </label>

          <label>
            Vechile color
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
            />
          </label>

          <label>
            Status
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>

          <label>
            Year Of Manufacture
            <input
              type="date"
              name="yearOfManufacture"
              value={formData.yearOfManufacture}
              onChange={handleChange}
              placeholder="Year Of Manufacture"
            />
          </label>

          <label>
            Ownership
            <select
              name="ownership"
              value={formData.ownership}
              onChange={handleChange}
              required
            >
              <option value="self-owned">Self-Owned</option>
              <option value="leased">Leased</option>
            </select>
          </label>

          <label>
            Pollution Vaild Until
            <input
              type="date"
              name="pollutionVaildUntil"
              value={formData.pollutionVaildUntil}
              onChange={handleChange}
              placeholder="Polluction last date"
            />
          </label>

          <label>
            Last Service
            <input
              type="date"
              name="lastServiceDate"
              value={formData.lastServiceDate}
              onChange={handleChange}
              placeholder="last Service date"
            />
          </label>

          <label>
            Total KM
            <input
              type="number"
              name="totalKm"
              value={formData.totalKm}
              onChange={handleChange}
              placeholder="Last Day KM"
            />
          </label>

          <label>
            Today Maintenance Cost
            <input
              type="number"
              name="maintenanceCost"
              value={formData.maintenanceCost}
              onChange={handleChange}
              placeholder="Today Maintenance Cost"
            />
          </label>

          <label>
            Today Fuel Cost
            <input
              type="number"
              name="fuelCharge"
              value={formData.fuelCharge}
              onChange={handleChange}
              placeholder="Today Fuel Cost"
            />
          </label>

          <label>
            Chassis Number
            <input
              type="text"
              name="chassisNumber"
              value={formData.chassisNumber}
              onChange={handleChange}
            />
          </label>

          <label>
            Engine Number
            <input
              type="text"
              name="engineNumber"
              value={formData.engineNumber}
              onChange={handleChange}
            />
          </label>

          <label>
            Image:
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>
        <div className="form-actions">
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleForm;
