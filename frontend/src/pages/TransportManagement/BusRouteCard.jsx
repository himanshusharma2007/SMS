import React from "react";
import "./BusRouteCard.css";

const BusRouteCard = ({ route, onEdit, onDelete, onClick }) => {
  return (
    <div className="bus-route-card" onClick={onClick}> 
      <h3>Bus Info</h3>
      <p><strong>Bus No:</strong> {route.busNo}</p>
      <p><strong>Total Stops:</strong> {route.stops.length}</p>
      <p><strong>Total Distance:</strong> {route.totalKm} km</p>

      <div className="card-buttons">
        <button className="edit-button" onClick={(e) => { e.stopPropagation(); onEdit(); }}>Edit</button>
        <button className="delete-button" onClick={(e) => { e.stopPropagation(); onDelete(); }}>Delete</button>
      </div>
    </div>
  );
};

export default BusRouteCard;
