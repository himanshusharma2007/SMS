import React, { useState } from "react";
import './DriversTab.css'

const DriverForm = ({ onClose, onSave, driver }) => {
  const [formData, setFormData] = useState({
    name: driver?.name || "",
    license: driver?.license || "",
    phone: driver?.phone || "",
    experience: driver?.experience || "",
    status: driver?.status || "active",
    img: driver?.img || "", // Initialize with driver's photo if editing
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert the file to a data URL for preview and saving
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, img: reader.result }); // Save as base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Pass the updated form data (including the image) to the parent
  };

  return (
    <div className="modal">
      <h2>{driver ? "Edit Driver" : "Add New Driver"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-main">
        <label>Name

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        </label>

        <label>License Number
        <input
          type="text"
          name="license"
          value={formData.license}
          onChange={handleChange}
          required
        />
        </label>
        

        <label>Phone
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        </label>
        

        <label>Experience (in years)
        <input
          type="number"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          required
        />
        </label>
        

        <label>Status
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
        

        <label>Upload Photo
        <input
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
        
        {formData.img && (
          <div className="photo-preview">
            <img
              src={formData.img}
              alt="Preview"
              style={{ width: "100px", height: "100px", borderRadius: "50%" }}
            />
          </div>
        )}
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

export default DriverForm;
