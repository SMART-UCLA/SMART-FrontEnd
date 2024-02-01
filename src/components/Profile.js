import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {

    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const { name, picture, email } = user;
    const [stationNumber, setStationNumber] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            if(isAuthenticated) {
                try {
                    const token = await getAccessTokenSilently();
                    const response = await fetch(`https://dev-xdx10w8664v1a2yz.us.auth0.com/api/v2/users/${user.sub}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const userData = await response.json();
                    if(userData && userData.user_metadata && userData.user_metadata.stationNumber) {
                        setStationNumber(userData.user_metadata.stationNumber);
                    } else {
                        setStationNumber('');
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        }
        fetchUserProfile();
    }, [getAccessTokenSilently, user.sub]);

    const handleStationNumberChange = async (e) => {
        const newStationNumber = e.target.value;
        setStationNumber(newStationNumber);
        try {
            const token = await getAccessTokenSilently();
            await fetch(`https://dev-xdx10w8664v1a2yz.us.auth0.com/api/v2/users/${user.sub}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_metadata: { stationNumber: newStationNumber } }),
            });
        } catch (e) {
            console.error("Error changing station number: ", e);
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
                    <p className="lead text-muted">{email}</p>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="form-group">
                        <label htmlFor="stationNumber">Station Number</label>
                        <input
                            type="text"
                            className="form-control"
                            id="stationNumber"
                            value={stationNumber}
                            onChange={handleStationNumberChange}
                        />
                        <button className="btn btn-primary" onClick={handleStationNumberChange}>
                        Save Station Number
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );  
}

export default Profile;