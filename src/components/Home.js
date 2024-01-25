import React from 'react';
import smartImg from './smart.png';
import { useNavigate } from 'react-router-dom';
import LiveDataMQTT from './LiveDataMQTT';
import './styles.css'; // Adjust the path based on your project structure
import Navbar from './Navbar';  // Import the Navbar component


function Home() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    // Use navigate to navigate to the "/LiveDataMQTT" route
    navigate('/LiveDataMQTT');
  };

  return (
    <div className="text-center">
        <Navbar />
      <h1 className="text-4xl font-bold mb-6">Welcome to SMART</h1>
      <div className="w-1/2 mx-auto">
        <div className="border p-4 my-8 text-left">
          This site is a web display of all lunar magnetic field data collected from the Apollo 12, 15, and Apollo 16 missions. It is open to the general public, and all are welcome to use it for whatever purposes at no cost.
        </div>
        <button
          onClick={handleButtonClick}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
        >
          Click me to navigate to MQTT
        </button>
      </div>
      <div className="mb-4">
        <img src={smartImg} alt="SMART" className="w-3/4 h-auto mx-auto" />
      </div>
    </div>
  );
}

export default Home;