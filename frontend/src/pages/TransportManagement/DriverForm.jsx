import React, { useState, useEffect } from "react";
import "./DriversTab.css";
import DriverService from "../../services/DriverService";
import { toast } from "react-hot-toast";

const DriverForm = ({ onClose, onSave, driverId }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    email: "",
    phoneNo: "",
    address: "",
    govId: "",

    // Professional Information
    licenseNumber: "",
    experience: "",
    dateOfBirth: "",
    licenseExpiryDate: "",
    salary: "",

    // Photo
    img: null,
  });

  useEffect(() => {
    if (driverId) {
      fetchDriverData();
    }
  }, [driverId]);

  const fetchDriverData = async () => {
    try {
      setLoading(true);
      const response = await DriverService.getDriver(driverId);
      const driver = response.data;
      console.log("driver:", driver);

      const formatDate = (date) =>
        date ? new Date(date).toISOString().split("T")[0] : "";

      setFormData({
        name: driver.staffId.name || "",
        email: driver.staffId.email || "",
        phoneNo: driver.staffId.phoneNo || "",
        address: driver.staffId.address || "",
        govId: driver.staffId.govId || "",
        licenseNumber: driver.licenseNumber || "",
        experience: driver.experience || "",
        dateOfBirth: formatDate(driver.dateOfBirth) || "",
        licenseExpiryDate: formatDate(driver.licenseExpiryDate) || "",
        salary: driver.staffId.salary || "",
        img: driver?.img.url || null,
      });
    } catch (error) {
      toast.error("Failed to fetch driver details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
        console.log("key:", formData[key]);
        data.append(key, formData[key]);
      });

      let response;
      if (driverId) {
        response = await DriverService.updateDriver(driverId, data);
      } else {
        response = await DriverService.addDriver(data);
      }

      toast.success(
        driverId ? "Driver updated successfully" : "Driver added successfully"
      );
      onSave(response.data);
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to save driver");
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
      <h2>{driverId ? "Edit Driver" : "Add New Driver"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-main">
          {/* Personal Information */}
          <h3>Personal Information</h3>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Phone Number
            <input
              type="text"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Address
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Government ID
            <input
              type="text"
              name="govId"
              value={formData.govId}
              onChange={handleChange}
              required
            />
          </label>

          {/* Professional Information */}
          <h3>Professional Information</h3>
          <label>
            License Number
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Experience (in years)
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Date of Birth
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            License Expiry Date
            <input
              type="date"
              name="licenseExpiryDate"
              value={formData.licenseExpiryDate}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Salary
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              required
            />
          </label>

          {/* Upload Photo */}
          <h3>Photo</h3>
          <label>
            Upload Photo
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
          {formData?.img && (
            <div className="photo-preview">
              {formData?.img instanceof File ? (
                <img
                  src={URL.createObjectURL(formData?.img)}
                  alt="Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <img
                  src={formData?.img}
                  alt="Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                  }}
                />
              )}
            </div>
          )}
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

export default DriverForm;
