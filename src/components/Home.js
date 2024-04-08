import React from 'react';
import smartImg from './smart.png';
import Box from '@mui/material/Box';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';
import Profile from './Profile';
import MapChart from './MapChart';

function Home() {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const navigate = useNavigate();

  const handleButtonClick = () => {
    // Use navigate to navigate to the "/LiveDataMQTT" route
    navigate('LiveDataMQTT/testTopic/s');
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to SMART</h1>
      {isAuthenticated ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '30%', margin: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
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
                This site is a web display of all lunar magnetic field data collected from the Apollo 12, 15, and Apollo 16 missions. It is open to the general public, and all are welcome to use it for whatever purposes at no cost.
              </Box>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: '30%', margin: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
              <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginTop: '30px' }}>X: First Derivative</div>
              <MapChart valueID={1}/>
            </div>
            <div style={{ width: '30%', margin: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
              <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginTop: '30px' }}>Y: First Derivative</div>
              <MapChart valueID={2}/>
            </div>
            <div style={{ width: '30%', margin: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
              <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginTop: '30px' }}>Z: First Derivative</div>
              <MapChart valueID={3}/>
            </div>
            <div style={{ width: '30%', margin: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
              <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginTop: '30px' }}>X: Second Derivative</div>
              <MapChart valueID={4}/>
            </div>
            <div style={{ width: '30%', margin: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
              <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginTop: '30px' }}>Y: Second Derivative</div>
              <MapChart valueID={5}/>
            </div>
            <div style={{ width: '30%', margin: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
              <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginTop: '30px' }}>Z: Second Derivative</div>
              <MapChart valueID={6}/>
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
        <img src={smartImg} width="75%" height="60%" alt="SMART Image" className="mx-auto" />
      </span>
    </div>
  );
}

export default Home;
