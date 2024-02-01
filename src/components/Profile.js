import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const[userMetadata, setUserMetadata] = useState(null);
  const domain = "dev-xdx10w8664v1a2yz.us.auth0.com";
  const { name, picture } = user;

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

  return (
      <div>
          <div className="row align-items-center profile-header">
              <div className="col-md-2 mb-3">
                  <img
                      src={picture}
                      alt="Profile"
                      className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
                  />
              </div>
              <div className="col-md text-center text-md-left">
                  <h2>{name}</h2>
              </div>
          </div>
          <div className="row">
              <div className="col-md-6 offset-md-3">
              {userMetadata ? (
                  <pre>{userMetadata.station_number}</pre>
                ) : (
                  "No user metadata defined"
                )}
              </div>
              <div>
                <button onClick={() => updateStationNumber("this3")}>Save</button>
              </div>
          </div>
      </div>
  );
};

export default Profile;

