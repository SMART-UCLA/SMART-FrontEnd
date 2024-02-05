import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);
  const domain = "dev-xdx10w8664v1a2yz.us.auth0.com";
  const [userName, setUserName] = useState("");
  const [userPicture, setUserPicture] = useState("");
  const [selectedStation, setSelectedStation] = useState("");

  const getUserMetadata = async () => {
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: `https://${domain}/api/v2/`,
          scope: "read:current_user",
        },
      });

      const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;
      const metadataResponse = await fetch(userDetailsByIdUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseData = await metadataResponse.json();
      const userMetadata = responseData.user_metadata;
      setUserMetadata(userMetadata);
      const userName = responseData.name;
      setUserName(userName);
      const userPicture = responseData.picture;
      setUserPicture(userPicture);
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    getUserMetadata();

  }, [getAccessTokenSilently, user?.sub]);


  const updateStationNumber = async (newStationNumber) => {
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: `https://${domain}/api/v2/`,
          scope: "update:current_user_metadata",
        }
      });
      const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;
      const metadataResponse = await fetch(userDetailsByIdUrl, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_metadata: {
            station_number: newStationNumber
          }
        }),
      });

      if (metadataResponse.ok) {
        console.log("Station number updated successfully.");
        getUserMetadata();
      } else {
        console.log("Error updating station number");
      }
    } catch (e) {
      console.log(e);
    }
  }
  
  const handleStationChange = (e) => {
    setSelectedStation(e.target.value);
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
      <div className="flex flex-col items-center mt-8">
        <img
          src={userPicture}
          alt="Profile"
          className="rounded-full w-24 h-24"
        />
        <h2 className="mt-4 text-xl font-semibold">{userName}</h2>
      </div>
      <div className="mt-8 w-96">
        {userMetadata ? (
          <pre className="text-center">Station Number: {userMetadata.station_number}</pre>
        ) : (
          <p className="text-center">No user metadata defined</p>
        )}
      </div>
      <div className="mt-8 text-center">
        <select
          className="block w-48 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
          value={selectedStation}
          onChange={handleStationChange}
        >
          <option value="">Select Station Number</option>
          {[...Array(15).keys()].map((station) => (
            <option key={station} value={station}>
              {station}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4">
        <button
          className="px-6 py-2 text-white bg-blue-500 rounded-md shadow-sm focus:outline-none hover:bg-blue-600"
          onClick={() => updateStationNumber(selectedStation)}
        >
          Update Station Number
        </button>
      </div>
    </div>
  );
};

export default Profile;

