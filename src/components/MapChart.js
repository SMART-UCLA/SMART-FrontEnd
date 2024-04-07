import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const geoUrl =
  "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const threeDayMag = [
  { name: "Arkansas1", location: "Searcy, AR", coordinates: [-91.7, 35.2] },
  { name: "Indiana1", location: "Kendallville, IN", coordinates: [-85.3, 41.4] },
  { name: "New-hampshire1", location: "Lisbon, NH", coordinates: [-71.9, 44.2] },
  { name: "Oklahoma1", location: "Jay, OK", coordinates: [-94.8, 36.4] },
  { name: "Oklahoma2", location: "Broken Bow, OK", coordinates: [-94.7, 34.0] },
  { name: "Texas1", location: "Palacios, TX", coordinates: [-96.3, 28.7] },
  { name: "Arkansas2", location: "Ozark, AR", coordinates: [-93.8, 35.5] },
  { name: "Indiana2", location: "Campbellsburg, IN", coordinates: [-86.3, 38.7] },
  { name: "Maine1", location: "Madison, ME", coordinates: [-69.9, 44.8] },
  { name: "New-york1", location: "Red Creek, NY", coordinates: [-76.7, 43.2] },
  { name: "Maine2", location: "Bingham, ME", coordinates: [-69.9, 45.1] },
  { name: "New-york2", location: "Andover, NY", coordinates: [-77.8, 42.2] },
  { name: "Topic13", location: "Cleveland, OH", coordinates: [-81.7, 41.5] },
  { name: "Topic14", location: "Urbana, IL", coordinates: [-88.2, 40.1] },
  { name: "Topic15", location: "San Antonio, TX", coordinates: [-98.5, 29.4] },
  { name: "Topic16", location: "Dardanelle, AR", coordinates: [-93.2, 35.2] },
  { name: "Topic17", location: "Rangeley, ME", coordinates: [-70.6, 45.0] },
  { name: "Topic18", location: "Columbus, IN", coordinates: [-85.9, 39.2] },
  { name: "Topic19", location: "St. Louis, MO", coordinates: [-90.2, 38.6] },
  { name: "Topic20", location: "Oxford, OH", coordinates: [-84.7, 39.5] },
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
        {threeDayMag.map(({ name, coordinates }) => (
          <Marker key={name} coordinates={coordinates}>
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
