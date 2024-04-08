import React, { useState } from 'react';
import calculationsImg from './calculations.png';
import Box from '@mui/material/Box';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';
import Profile from './Profile';
import MapChart from './MapChart';

function Home() {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const navigate = useNavigate();
  const urls = [
    "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/arkansas1/m",
    "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/indiana1/m",
    "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/new-hampshire1/m",
    "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/oklahoma1/m",
    "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/oklahoma2/m",
    "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/texas1/m",
    "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/arkansas2/m",
    "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/indiana2/m",
    "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/maine1/m",
    "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/new-york1/m",
    "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/maine2/m",
    "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/new-york2/m",
    "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/topic13/m",
    "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/topic14/m",
    "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/topic15/m",
    "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/topic16/m",
    "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/topic17/m",
    "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/topic18/m",
    "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/topic19/m",
    "http://localhost:3000/SMART-FrontEnd#/LiveDataMQTT/topic20/m"
  ];
  const [selectedUrl, setSelectedUrl] = useState('');

  const handleDropdownChange = (event) => {
    setSelectedUrl(event.target.value);
    const url = event.target.value.split('#')[1]
    navigate(url);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 className="text-4xl font-bold text-center mb-8">SMART Three Day Mag Solar Eclipse Campaign</h1>
      {isAuthenticated ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '600px', margin: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
              <Box
                sx={{
                  textAlign: 'left',
                  fontSize: '1.15rem',
                  fontWeight: 'medium',
                  paddingLeft: 1.75,
                  paddingRight: 1.75,
                  paddingTop: 1.75,
                  paddingBottom: 1.75,
                  marginTop: '2rem',
                  marginBottom: '2rem',
                }}
              >
                This site is a web display of magnetometer data from the 3DM, USGS, and CPI/MagStar networks. Click on the points on the maps to view numerical data. To view time-series live data from the 3DM stations, select the station from the dropdown. For the live graph view, it is recommended to view in landscape mode on mobile.
              </Box>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: '600px', margin: '10px' }}>
                <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginTop: '30px' }}>Select your station to view your graphical data</div>
                <select onChange={handleDropdownChange} value={selectedUrl}>
                  <option value="">Select a Station</option>
                  {urls.map((url, index) => {
                    const topic = url.split('/LiveDataMQTT/')[1].split('/')[0];
                    return <option key={index} value={url}>{topic}</option>; // Use the topic as the option value
                  })}
              </select>

            </div>
            <div style={{ width: '100%', maxWidth: '600px', margin: '10px' }}>
              <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginTop: '30px' }}>X: First Derivative</div>
              <MapChart valueID={1}/>
            </div>
            <div style={{ width: '100%', maxWidth: '600px', margin: '10px' }}>
              <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginTop: '30px' }}>Y: First Derivative</div>
              <MapChart valueID={2}/>
            </div>
            <div style={{ width: '100%', maxWidth: '600px', margin: '10px' }}>
              <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginTop: '30px' }}>Z: First Derivative</div>
              <MapChart valueID={3}/>
            </div>
            <div style={{ width: '100%', maxWidth: '600px', margin: '10px' }}>
              <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginTop: '30px' }}>X: Second Derivative</div>
              <MapChart valueID={4}/>
            </div>
            <div style={{ width: '100%', maxWidth: '600px', margin: '10px' }}>
              <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginTop: '30px' }}>Y: Second Derivative</div>
              <MapChart valueID={5}/>
            </div>
            <div style={{ width: '100%', maxWidth: '600px', margin: '10px' }}>
              <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginTop: '30px' }}>Z: Second Derivative</div>
              <MapChart valueID={6}/>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '600px', margin: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
              <Box
                sx={{
                  textAlign: 'left',
                  fontSize: '1.15rem',
                  fontWeight: 'medium',
                  paddingLeft: 1.75,
                  paddingRight: 1.75,
                  paddingTop: 1.75,
                  paddingBottom: 1.75,
                  marginTop: '2rem',
                  marginBottom: '2rem',
                }}
              >
                <div style={{textAlign: 'center', paddingBottom: 10}}><b>How did we calculate the values displayed above?</b></div>
                Calculations were made by calculating the first and second derivatives over the most recent 50 minute window of data, where five sets of consecutive 10-minute moving averages are calculated within that window.
              <img src={calculationsImg} width="75%" height="60%" alt="SMART Image" className="mx-auto" />
              </Box>
            </div>
          </div>
        </div>
      ) : (
        <p>
          Please log in to access the content.
        </p>
      )}
      <span
        style={{
          display: 'inline-block',
          margin: 'auto auto',
          marginBottom: '20px',
        }}
      >
        {/* <img src={smartImg} width="75%" height="60%" alt="SMART Image" className="mx-auto" /> */}
      </span>
    </div>
  );
}

export default Home;
