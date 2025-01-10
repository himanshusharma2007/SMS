import React, { useEffect } from 'react'
import {MapContainer, TileLayer, Marker, Polyline, Popup, useMap} from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import './Maplocation.css'
import { Icon } from 'leaflet';
import "leaflet-routing-machine";


function Maplocation(props) {

  const stopdetails = props.stopdetails;
  const buspostion = props.buspostion;

 
  const path = stopdetails.map((marker) => marker.geocode);
  

  const customicon = new Icon({
    iconUrl: "https://www.citypng.com/public/uploads/preview/round-blue-autobus-autocar-bus-station-icon-701751694972515da9abrwr17.png?v=2024122923",
    iconSize: [32, 32],
  });

  function Routing({ stops, coveredStopsCount }) {
    const map = useMap();
  
    useEffect(() => {
      if (!map) return;
  
      // Separate waypoints into covered and uncovered
      const coveredWaypoints = stops.slice(0, coveredStopsCount+1).map((stop) =>
        L.latLng(stop.geocode[0], stop.geocode[1])
      );
      const uncoveredWaypoints = stops.slice(coveredStopsCount).map((stop) =>
        L.latLng(stop.geocode[0], stop.geocode[1])
      );
  
      // Add routing for covered waypoints
      const coveredRoutingControl = L.Routing.control({
        waypoints: coveredWaypoints,
        show: false,
        routeWhileDragging: false,
        addWaypoints: false,
        collapsible: false,
        createMarker: () => null,
        lineOptions: {
          styles: [{ color: "#007BFF", weight: 4 }], // Covered route color
        },
      }).addTo(map);
  
      // Add routing for uncovered waypoints
      const uncoveredRoutingControl = L.Routing.control({
        waypoints: uncoveredWaypoints,
        show: false,
        routeWhileDragging: false,
        addWaypoints: false,
        collapsible: false,
        createMarker: () => null,
        lineOptions: {
          styles: [{ color: "#6C757D", weight: 4 }], // Uncovered route color
        },
      }).addTo(map);
  
      return () => {
        map.removeControl(coveredRoutingControl);
        map.removeControl(uncoveredRoutingControl);
      };
    }, [map, stops, coveredStopsCount]);
  
    return null;
  }
  



  
  return (
    <div className='map'>
      <MapContainer center={[26.9124,75.7873]} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
           url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png"
        />

        {
          stopdetails.map((e)=>{
            return(
              
              <Marker position={e.geocode}>
                <Popup>{e.name}</Popup>
              </Marker>
              
              
            )
            
          })
        }
      

      <Routing stops={stopdetails} coveredStopsCount={buspostion} />
        
      <Marker position={stopdetails[buspostion].geocode} icon={customicon}></Marker>

      </MapContainer>
    </div>
  )
}

export default Maplocation










