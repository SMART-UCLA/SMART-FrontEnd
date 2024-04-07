import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

import React, { useState, useEffect } from "react";
import Axios from "axios";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const threeDayMag = [
  { name: "Arkansas1", location: "Searcy, AR", coordinates: [-91.7, 35.2], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/arkansas1/m" },
  { name: "Indiana1", location: "Kendallville, IN", coordinates: [-85.3, 41.4], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/indiana1/m" },
  { name: "New-hampshire1", location: "Lisbon, NH", coordinates: [-71.9, 44.2], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/new-hampshire1/m" },
  { name: "Oklahoma1", location: "Jay, OK", coordinates: [-94.8, 36.4], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/oklahoma1/m" },
  { name: "Oklahoma2", location: "Broken Bow, OK", coordinates: [-94.7, 34.0], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/oklahoma2/m" },
  { name: "Texas1", location: "Palacios, TX", coordinates: [-96.3, 28.7], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/texas1/m" },
  { name: "Arkansas2", location: "Ozark, AR", coordinates: [-93.8, 35.5], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/arkansas2/m" },
  { name: "Indiana2", location: "Campbellsburg, IN", coordinates: [-86.3, 38.7], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/indiana2/m" },
  { name: "Maine1", location: "Madison, ME", coordinates: [-69.9, 44.8], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/maine1/m" },
  { name: "New-york1", location: "Red Creek, NY", coordinates: [-76.7, 43.2], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/new-york1/m" },
  { name: "Maine2", location: "Bingham, ME", coordinates: [-69.9, 45.1], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/maine2/m" },
  { name: "New-york2", location: "Andover, NY", coordinates: [-77.8, 42.2], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/new-york2/m" },
  { name: "Topic13", location: "Cleveland, OH", coordinates: [-81.7, 41.5], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/topic13/m" },
  { name: "Topic14", location: "Urbana, IL", coordinates: [-88.2, 40.1], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/topic14/m" },
  { name: "Topic15", location: "San Antonio, TX", coordinates: [-98.5, 29.4], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/topic15/m" },
  { name: "Topic16", location: "Dardanelle, AR", coordinates: [-93.2, 35.2], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/topic16/m" },
  { name: "Topic17", location: "Rangeley, ME", coordinates: [-70.6, 45.0], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/topic17/m" },
  { name: "Topic18", location: "Columbus, IN", coordinates: [-85.9, 39.2], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/topic18/m" },
  { name: "Topic19", location: "St. Louis, MO", coordinates: [-90.2, 38.6], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/topic19/m" },
  { name: "Topic20", location: "Oxford, OH", coordinates: [-84.7, 39.5], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/topic20/m" },
];
  

const USGS = [
  { name: "BOU", coordinates: [-105.237, 40.137] },
  { name: "BSL", coordinates: [-89.635, 30.35] },
  { name: "FRD", coordinates: [-77.373, 38.205] },
  { name: "FRN", coordinates: [-119.718, 37.091] },
  { name: "NEW", coordinates: [-117.122, 48.265] },
  { name: "TUC", coordinates: [-110.733, 32.174] },
];

const DASI = [
  { name: "DASI_Hennepin", location: "Hennepin", coordinates: [-93.734691, 44.89785] },
  { name: "DASI_Sugarhills", location: "Sugarhills", coordinates: [-93.657343, 47.132816] },
  { name: "DASI_Bluesky", location: "Bluesky", coordinates: [-84.16711, 41.577602] },
  { name: "DASI_Odessa", location: "Odessa", coordinates: [-102.32045, 31.842142] },
  { name: "DASI_Boulder", location: "Boulder", coordinates: [-105.243205, 40.013563] },
  { name: "DASI_Virginia", location: "Virginia", coordinates: [-77.78404, 38.683352] },
];

const MapChart = () => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [markerClickUrl, setMarkerClickUrl] = useState(null);
  const [derivatives, setDerivatives] = useState([]);

  useEffect(() => {
    if (markerClickUrl) {
      window.open(markerClickUrl, "_blank");
      setMarkerClickUrl(null);
    }
  }, [markerClickUrl]);

  useEffect(() => {
    const fetchData = async () => {
      if (hoveredPoint) {
        try {
          const response = await Axios.get(`http://localhost:8080/mqtt/get5-10minmovingAverages/${hoveredPoint.name.toLowerCase()}`);
          console.log(`http://localhost:8080/mqtt/get5-10minmovingAverages/${hoveredPoint.name.toLowerCase()}`)
          
          const derivatives = response.data;

          setDerivatives(derivatives);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
  
    fetchData();
  }, [hoveredPoint]);
  
  return (
    <div>
      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies, outline, borders }) => (
            <>
              <Geography geography={outline} fill="#E9E3DA" />
              <Geography geography={borders} fill="none" stroke="#FFF" />
            </>
          )}
        </Geographies>
        {/* Render markers for threeDayMag */}
        {threeDayMag.map(({ name, location, coordinates, url }) => (
          <Marker
            key={name}
            coordinates={coordinates}
            onMouseEnter={() => setHoveredPoint({ name, location })}
            onMouseLeave={() => setHoveredPoint(null)}
            onClick={() => setMarkerClickUrl(url)}
          >
            <circle r={10} fill="#008000" stroke="#fff" strokeWidth={2} />
          </Marker>
        ))}
        {/* Render markers for USGS */}
        {USGS.map(({ name, coordinates }) => (
          <Marker key={name} coordinates={coordinates}>
            <circle r={7} fill="#E42A1D" stroke="#fff" strokeWidth={2} />
          </Marker>
        ))}
        {/* Render markers for DASI */}
        {DASI.map(({ name, coordinates }) => (
          <Marker key={name} coordinates={coordinates}>
            <circle r={7} fill="#1E90FF" stroke="#fff" strokeWidth={2} />
          </Marker>
        ))}
      </ComposableMap>
      {hoveredPoint && (
      <div style={{ position: "absolute", backgroundColor: "white", padding: "10px", borderRadius: "5px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)" }}>
        <h3>{hoveredPoint.name}</h3>
        <p>{hoveredPoint.location}</p>
        {/* Displaying first derivatives */}
        {derivatives.length > 0 && (
          <>
            <h4>First Derivatives</h4>
              <span>X: {derivatives[0].firstDerivatives[0].x} ,</span>
              <span> Y: {derivatives[0].firstDerivatives[1].y} ,</span>
              <span> Z: {derivatives[0].firstDerivatives[2].z}</span>
            <h4>Second Derivatives</h4>
              <span>X: {derivatives[1].secondDerivatives[0].x} ,</span>
              <span> Y: {derivatives[1].secondDerivatives[1].y} ,</span>
              <span> Z: {derivatives[1].secondDerivatives[2].z}</span>
          </>
      )}
      </div>
      )}
      {/* Legend */}
      <div style={{ margin: "10px", textAlign: "center" }}>
        <div>
          <span style={{ display: "inline-block", width: "15px", height: "15px", backgroundColor: "#008000", marginRight: "5px" }}></span>
          <span>Three Day Mag</span>
        </div>
        <div>
          <span style={{ display: "inline-block", width: "15px", height: "15px", backgroundColor: "#E42A1D", marginRight: "5px" }}></span>
          <span>USGS</span>
        </div>
        <div>
          <span style={{ display: "inline-block", width: "15px", height: "15px", backgroundColor: "#1E90FF", marginRight: "5px" }}></span>
          <span>DASI</span>
        </div>
      </div>
    </div>
  );
};

export default MapChart;
