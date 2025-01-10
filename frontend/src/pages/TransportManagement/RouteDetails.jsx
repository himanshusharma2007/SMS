import React from "react";
import "./RouteDetails.css";
import Transport from "./Transport/Transport";

const RouteDetails = ({ route, onClose }) => {
  return (
    <div className="route-details">
      <button onClick={onClose} className="close-btn">X</button>
      <h2>Route Details</h2>
      <p><strong>Bus No:</strong> {route.busNo}</p>
      <p><strong>Total Km:</strong> {route.totalKm} km</p>

      {/* ✅ Added the Transport Component */}
      <Transport />
    </div>
  );
};

export default RouteDetails;
