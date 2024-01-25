import React  from 'react';
import smartImg from './smart.png';
import Box from '@mui/material/Box';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';

function Home() {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const navigate = useNavigate();

  const handleButtonClick = () => {
    // Use navigate to navigate to the "/LiveDataMQTT" route
    navigate('/LiveDataMQTT');
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Welcome to SMART</h1>
      {isAuthenticated ? (
        <div stype={{ textAlign: 'center'}}>
          <Navbar></Navbar>
          <div style={{ width: '50%', margin: 'auto' }}>
            <Box
              sx={{
                textAlign: 'left',
                fontSize: '1.15rem',
                fontWeight: 'medium',
                paddingLeft: 1.75,
                paddingRight: 1.75,
                paddingTop: 1.75,
                paddingBottom: 1.75,
                border: 1,
                marginTop: '2rem',
                marginBottom: '2rem',
              }}
            >
              This site is a web display of all lunar magnetic field data collected from the Apollo 12, 15, and Apollo 16 missions. It is open to the general public, and all are welcome to use it for whatever purposes at no cost.
            </Box>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none" onClick={() => {navigate(`LiveDataMQTT/testTopic/s`);}}>testTopic</button>
            <button
              onClick={handleButtonClick}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
            >
              Click me to navigate to MQTT
            </button>
          </div>
        </div>
      ) : (
        <p>
          Please{' '}
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none" onClick={() => loginWithRedirect()}>
            log in
          </button>{' '}
          to access the content.
        </p>
      )}
      <span
        style={{
          display: 'inline-block',
          margin: 'auto auto',
          marginBottom: '20px',
        }}
      >
        <img style={{textAlign: "center"}} src={smartImg} width="75%" height="60%" alt="SMART Image" />
      </span>
    </div>
  );
}

export default Home;
