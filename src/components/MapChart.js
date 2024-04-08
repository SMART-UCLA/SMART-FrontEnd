import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

import React, { useState, useEffect } from "react";
import Axios from "axios";

const HEATMAP_MIN = -0.005;
const HEATMAP_MAX = 0.005

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
  { name: "BOU", location: "Boulder", coordinates: [-105.237, 40.137] },
  { name: "BSL", location: "Stennis Space Center", coordinates: [-89.635, 30.35] },
  { name: "FRD", location: "Fredericksburg", coordinates: [-77.373, 38.205] },
  { name: "FRN", location: "Fresno", coordinates: [-119.718, 37.091] },
  { name: "NEW", location: "Newport",coordinates: [-117.122, 48.265] },
  { name: "TUC", location: "Tucson",coordinates: [-110.733, 32.174] },
];

const DASI = [
  { name: "DASI_Hennepin", location: "Hennepin", coordinates: [-93.734691, 44.89785] },
  { name: "DASI_Sugarhills", location: "Sugarhills", coordinates: [-93.657343, 47.132816] },
  { name: "DASI_Bluesky", location: "Bluesky", coordinates: [-84.16711, 41.577602] },
  { name: "DASI_Odessa", location: "Odessa", coordinates: [-102.32045, 31.842142] },
  { name: "DASI_Boulder", location: "Boulder", coordinates: [-105.243205, 40.013563] },
  { name: "DASI_Virginia", location: "Virginia", coordinates: [-77.78404, 38.683352] },
];

function heatMapColorforValue(value, min, max){
  if (value === null) {
    return "hsl(197, 10%, 87%)";
  }
  const avg = (min + max) / 2
  const adj_val = (value / (max - min)) + 0.5 - avg;
  var h = (1.0 - adj_val) * 240
  return "hsl(" + h + ", 100%, 50%)";
}

const MapChart = ({valueID}) => {
  const [clickedMarkerData, setClickedMarkerData] = useState(null);
  const [derivatives, setDerivatives] = useState({});

  // Function to handle clicks outside of the marker
  const handleClickOutsideMarker = (event) => {
    if (!event.target.closest('circle')) {
      setClickedMarkerData(null); 
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideMarker);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMarker); // Remove event listener when component unmounts
    };
  }, []);

  function getRelevantValue(name, id) {
    switch (id) {
      case 1: return ["X First Derivative", derivatives[name.toLowerCase()][0].firstDerivatives[0].x, "[nT/(10m)]"]
      case 2: return ["Y First Derivative", derivatives[name.toLowerCase()][0].firstDerivatives[1].y, "[nT/(10m)]"]
      case 3: return ["Z First Derivative", derivatives[name.toLowerCase()][0].firstDerivatives[2].z, "[nT/(10m)]"]
      case 4: return ["X Second Derivative", derivatives[name.toLowerCase()][1].secondDerivatives[0].x, "[nT/(10m)^2]"]
      case 5: return ["Y Second Derivative", derivatives[name.toLowerCase()][1].secondDerivatives[1].y, "[nT/(10m)^2]"]
      case 6: return ["Z Second Derivative", derivatives[name.toLowerCase()][1].secondDerivatives[2].z, "[nT/(10m)^2]"]
    }
  }

  const fetchData = async () => {
    if (true) {
      try {
        // TODO change get request to deployment url
        // const response = await Axios.get(`http://localhost:8080/mqtt/get5-10minmovingAverages/${hoveredPoint.name.toLowerCase()}`);
        // console.log(`http://localhost:8080/mqtt/get5-10minmovingAverages/${hoveredPoint.name.toLowerCase()}`)
        const response = await Axios.get(`http://localhost:8080/mqtt/getAllDerivatives`);
        console.log(`http://localhost:8080/mqtt/getAllDerivatives`);
        
        const derivatives = response.data;
        console.log(derivatives);

        setDerivatives(derivatives);
        setTimeout(fetchData, 30000); // fetch data every 30 seconds
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []);
  // fetchData(); // fetch new data every minute
  
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
            onClick={() => setClickedMarkerData({ name, location })}
          >
            <circle r={10} fill={heatMapColorforValue(derivatives.hasOwnProperty(name.toLowerCase()) ? getRelevantValue(name, valueID)[1] : null, HEATMAP_MIN, HEATMAP_MAX)} stroke="#008000" strokeWidth={3} />
          </Marker>
        ))}
        {/* Render markers for USGS */}
        {USGS.map(({ name, coordinates }) => (
          <Marker key={name} coordinates={coordinates}>
            <circle r={7} fill="#E42A1D" stroke="#E42A1D" strokeWidth={3} />
          </Marker>
        ))}
        {/* Render markers for DASI */}
        {DASI.map(({ name, coordinates }) => (
          <Marker key={name} coordinates={coordinates}>
            <circle r={7} fill="#1E90FF" stroke="#1E90FF" strokeWidth={3} />
          </Marker>
        ))}
      </ComposableMap>
      {clickedMarkerData && (
        <div style={{ position: "absolute", backgroundColor: "white", padding: "10px", borderRadius: "5px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)" }}>
          <h3>{clickedMarkerData.name}</h3>
          <p>{clickedMarkerData.location}</p>
          {/* Displaying first derivatives */}
          {Object.keys(derivatives).length > 0 && (
            <>
              {/* <h4>First Derivatives</h4>
                <span>X: {derivatives[hoveredPoint.name.toLowerCase()][0].firstDerivatives[0].x} ,</span>
                <span> Y: {derivatives[hoveredPoint.name.toLowerCase()][0].firstDerivatives[1].y} ,</span>
                <span> Z: {derivatives[hoveredPoint.name.toLowerCase()][0].firstDerivatives[2].z}</span>
              <h4>Second Derivatives</h4>
                <span>X: {derivatives[hoveredPoint.name.toLowerCase()][1].secondDerivatives[0].x} ,</span>
                <span> Y: {derivatives[hoveredPoint.name.toLowerCase()][1].secondDerivatives[1].y} ,</span>
                <span> Z: {derivatives[hoveredPoint.name.toLowerCase()][1].secondDerivatives[2].z}</span> */}
              <h4>{getRelevantValue(clickedMarkerData.name, valueID)[0]}</h4>
              <span>{getRelevantValue(clickedMarkerData.name, valueID)[1]} {getRelevantValue(clickedMarkerData.name, valueID)[2]}</span>
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
