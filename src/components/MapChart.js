import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line
} from "react-simple-maps";

import React, { useState, useEffect } from "react";
import Axios from "axios";

const backend_endpoint = "http://35.188.59.177:8080"; //production endpoint
// const backend_endpoint = "http://localhost:8080"; //dev endpoint

const HEATMAP_MIN = -5;
const HEATMAP_MAX = 5;

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const threeDayMag = [
  { name: "arkansas1", location: "Searcy, AR", coordinates: [-91.7, 35.2], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/arkansas1/m" },
  { name: "indiana1", location: "Kendallville, IN", coordinates: [-85.3, 41.4], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/indiana1/m" },
  { name: "new-hampshire1", location: "Lisbon, NH", coordinates: [-71.9, 44.2], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/new-hampshire1/m" },
  { name: "oklahoma1", location: "Jay, OK", coordinates: [-94.8, 36.4], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/oklahoma1/m" },
  { name: "oklahoma2", location: "Broken Bow, OK", coordinates: [-94.7, 34.0], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/oklahoma2/m" },
  { name: "texas1", location: "Palacios, TX", coordinates: [-96.3, 28.7], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/texas1/m" },
  { name: "arkansas2", location: "Ozark, AR", coordinates: [-93.8, 35.5], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/arkansas2/m" },
  { name: "indiana2", location: "Campbellsburg, IN", coordinates: [-86.3, 38.7], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/indiana2/m" },
  { name: "maine1", location: "Madison, ME", coordinates: [-69.9, 44.8], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/maine1/m" },
  { name: "new-york1", location: "Red Creek, NY", coordinates: [-76.7, 43.2], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/new-york1/m" },
  { name: "maine2", location: "Bingham, ME", coordinates: [-69.9, 45.1], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/maine2/m" },
  { name: "new-york2", location: "Andover, NY", coordinates: [-77.8, 42.2], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/new-york2/m" },
  { name: "topic13", location: "Cleveland, OH", coordinates: [-81.7, 41.5], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/topic13/m" },
  { name: "topic14", location: "Urbana, IL", coordinates: [-88.2, 40.1], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/topic14/m" },
  { name: "topic15", location: "San Antonio, TX", coordinates: [-98.5, 29.4], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/topic15/m" },
  { name: "topic16", location: "Dardanelle, AR", coordinates: [-93.2, 35.2], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/topic16/m" },
  { name: "topic17", location: "Rangeley, ME", coordinates: [-70.6, 45.0], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/topic17/m" },
  { name: "topic18", location: "Columbus, IN", coordinates: [-85.9, 39.2], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/topic18/m" },
  { name: "topic19", location: "St. Louis, MO", coordinates: [-90.2, 38.6], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/topic19/m" },
  { name: "topic20", location: "Oxford, OH", coordinates: [-84.7, 39.5], url: "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/topic20/m" },
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
  { name: "DASI_Hennepin", location: "St. Bonifacius, MN", coordinates: [-93.734691, 44.89785], id: 13 },
  { name: "DASI_Sugarhills", location: "Sugarhills, MN", coordinates: [-93.657343, 47.132816], id: 18 },
  { name: "DASI_Bluesky", location: "Wauseon, OH", coordinates: [-84.16711, 41.577602], id: 15 },
  { name: "DASI_Odessa", location: "Odessa, TX", coordinates: [-102.32045, 31.842142], id: 17 },
  { name: "DASI_Boulder", location: "Boulder, CO", coordinates: [-105.243205, 40.013563], id: 14 },
  { name: "DASI_Virginia", location: "Warrenton, VA", coordinates: [-77.78404, 38.683352], id: 12 },
  { name: "DASI_Missouri", location: "Colombus, MO", coordinates: [-92.218160, 38.897148], id: 11 },
  { name: "DASI_Haystack", location: "Westford, MA", coordinates: [-71.485094, 42.611713], id: 23 },
  { name: "DASI_NewBritain", location: "New Britain, CT", coordinates: [-72.721556, 41.649083], id: 21 },
  { name: "DASI_Atlas", location: "Saranac, NY", coordinates: [ -73.56140499999999, 44.3331916670], id: 19 },
  { name: "DASI_Augusta", location: "Augusta, ME", coordinates: [ -69.5614783330,  44.2949383330], id: 24 },
  { name: "DASI_Pawnee", location: "Pawnee Grasslands, CO", coordinates: [ -103.693377, 40.211594], id: 25 },
  { name: "DASI_Grant", location: "Unknown", coordinates: [-117.683535, 47.533114], id: 26 },

];

function heatMapColorforValue(value, min, max) {
  if (value === null) {
    return "hsl(197, 10%, 87%)";
  }
  if (value < min) {
    value = min;
  } else if (value > max) {
    value = max;
  }
  const avg = (min + max) / 2
  const adj_val = (value / (max - min)) + 0.5 - avg;
  var h = (1.0 - adj_val) * 240
  return "hsl(" + h + ", 100%, 50%)";
}

const MapChart = ({valueID}) => {
  const [clickedMarkerData, setClickedMarkerData] = useState(null);
  const [derivatives, setDerivatives] = useState({});
  const [usgsDerivatives, setUSGSDerivatives] = useState({});
  const [magstarDerivatives, setMagStarDerivatives] = useState({});

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

  function getRelevantValue(name, id, der_array) {
    console.log(der_array)
    console.log(name)
    switch (id) {
      case 1: return ["X First Derivative:", der_array[name][0].firstDerivatives[0].x, "[nT/(10m)]"]
      case 2: return ["Y First Derivative:", der_array[name][0].firstDerivatives[1].y, "[nT/(10m)]"]
      case 3: return ["Z First Derivative:", der_array[name][0].firstDerivatives[2].z, "[nT/(10m)]"]
      case 4: return ["X Second Derivative:", der_array[name][1].secondDerivatives[0].x, "[nT/(10m)^2]"]
      case 5: return ["Y Second Derivative:", der_array[name][1].secondDerivatives[1].y, "[nT/(10m)^2]"]
      case 6: return ["Z Second Derivative:", der_array[name][1].secondDerivatives[2].z, "[nT/(10m)^2]"]
    }
  }

  const fetchData = async () => {
    if (true) {
      try {
        // TODO change get request to deployment url
        // const response = await Axios.get(`http://localhost:8080/mqtt/get5-10minmovingAverages/${hoveredPoint.name.toLowerCase()}`);
        // console.log(`http://localhost:8080/mqtt/get5-10minmovingAverages/${hoveredPoint.name.toLowerCase()}`)
        const response = await Axios.get(`${backend_endpoint}/mqtt/getAllDerivatives`);
        console.log(`${backend_endpoint}/mqtt/getAllDerivatives`);
        
        const d = response.data;
        console.log(d);

        setDerivatives(d);
        setTimeout(fetchData, 30000); // fetch data every 30 seconds
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };
  
  const fetchUSGSData = async () => {
    if (true) {
      try {
        // TODO change get request to deployment url
        // const response = await Axios.get(`http://localhost:8080/mqtt/get5-10minmovingAverages/${hoveredPoint.name.toLowerCase()}`);
        // console.log(`http://localhost:8080/mqtt/get5-10minmovingAverages/${hoveredPoint.name.toLowerCase()}`)
        const response = await Axios.get(`${backend_endpoint}/usgs/getallderivatives`);
        console.log(`${backend_endpoint}/usgs/getallderivatives`);
        
        const d = response.data;
        console.log(d);

        setUSGSDerivatives(d);
        setTimeout(fetchUSGSData, 30000); // fetch data every 30 seconds
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const fetchMagStarData = async () => {
    if (true) {
      try {
        // TODO change get request to deployment url
        // const response = await Axios.get(`${backend_endpoint}/mqtt/get5-10minmovingAverages/${hoveredPoint.name.toLowerCase()}`);
        // console.log(`${backend_endpoint}/mqtt/get5-10minmovingAverages/${hoveredPoint.name.toLowerCase()}`)
        const response = await Axios.get(`${backend_endpoint}/magstar/getallderivatives`);
        console.log(`${backend_endpoint}/magstar/getallderivatives`);
        
        const d = response.data;
        console.log(d);

        setMagStarDerivatives(d);
        setTimeout(fetchMagStarData, 30000); // fetch data every 30 seconds
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    fetchUSGSData();
  }, []);
  useEffect(() => {
    fetchMagStarData();
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
        <Line
          from={[-100.6108, 28.8094]}
          to={[-85.9800, 39.5471]}
          strokeWidth={30}
          strokeOpacity={0.15}
        />
        <Line
          from={[-86.0665, 39.5017]}
          to={[-67.7816, 46.2878]}
          strokeWidth={30}
          strokeOpacity={0.15}
        />
        {/* Render markers for threeDayMag */}
        {threeDayMag.map(({ name, location, coordinates, url }) => (
          <Marker
            key={name}
            coordinates={coordinates}
            onClick={() => setClickedMarkerData({ name, location })}
          >
            <circle r={10} fill={heatMapColorforValue(derivatives.hasOwnProperty(name.toLowerCase()) ? getRelevantValue(name, valueID, derivatives)[1] : null, HEATMAP_MIN, HEATMAP_MAX)} stroke="#008000" strokeWidth={3} />
          </Marker>
        ))}
        {/* Render markers for USGS */}
        {USGS.map(({ name, location, coordinates }) => (
          <Marker key={name} coordinates={coordinates} onClick={() => setClickedMarkerData({ name, location })}>
            <circle r={7} fill={heatMapColorforValue(usgsDerivatives.hasOwnProperty(name) ? getRelevantValue(name, valueID, usgsDerivatives)[1] : null, HEATMAP_MIN, HEATMAP_MAX)} stroke="#E42A1D" strokeWidth={3} />
          </Marker>
        ))}
        {/* Render markers for DASI */}
        {DASI.map(({ name, location, coordinates, id }) => (
          <Marker key={name} coordinates={coordinates} onClick={() => setClickedMarkerData({ name, location, id })}>
            <circle r={7} fill={heatMapColorforValue(magstarDerivatives.hasOwnProperty(id) ? getRelevantValue(id, valueID, magstarDerivatives)[1] : null, HEATMAP_MIN, HEATMAP_MAX)} stroke="#1E90FF" strokeWidth={3} />
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
              <h4>{clickedMarkerData.hasOwnProperty("id") ? getRelevantValue(clickedMarkerData.id, valueID, magstarDerivatives)[0] : clickedMarkerData.name === clickedMarkerData.name.toUpperCase() ? getRelevantValue(clickedMarkerData.name, valueID, usgsDerivatives)[0] : getRelevantValue(clickedMarkerData.name, valueID, derivatives)[0]}</h4>
              <span>{clickedMarkerData.hasOwnProperty("id") ? getRelevantValue(clickedMarkerData.id, valueID, magstarDerivatives)[1] : clickedMarkerData.name === clickedMarkerData.name.toUpperCase() ? getRelevantValue(clickedMarkerData.name, valueID, usgsDerivatives)[1] : getRelevantValue(clickedMarkerData.name, valueID, derivatives)[1]} {clickedMarkerData.hasOwnProperty("id") ? getRelevantValue(clickedMarkerData.id, valueID, magstarDerivatives)[2] : clickedMarkerData.name === clickedMarkerData.name.toUpperCase() ? getRelevantValue(clickedMarkerData.name, valueID, usgsDerivatives)[2] : getRelevantValue(clickedMarkerData.name, valueID, derivatives)[2]}</span> {/*refactor code later (bad code)*/}
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
        <div style={{paddingBottom: 20}}>
          <span style={{ display: "inline-block", width: "15px", height: "15px", backgroundColor: "#1E90FF", marginRight: "5px" }}></span>
          <span>DASI</span>
        </div>
        <div>
          <span style={{ display: "inline-block", width: "200px", height: "15px", background: "linear-gradient(.25turn, blue, cyan, lime, yellow, red)", marginRight: "5px" }}></span>
        </div>
        <span>{`Low (<= ${HEATMAP_MIN}) <----> High (>= ${HEATMAP_MAX})`}</span>
      </div>
    </div>
  );
};

export default MapChart;
