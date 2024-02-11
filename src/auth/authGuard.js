import { withAuthenticationRequired } from "@auth0/auth0-react";
import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Home from "../components/Home";
import { Navigate } from "react-router-dom";

const AuthGuard = ({ component: Component, ...args  }) => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getAccessTokenSilently();
      } catch (e) {
        console.log("Error getting access token", e);
        navigate("/");
      }
    }; 
    // When page refreshes, check auth status
    if(!isAuthenticated) {
      checkAuth();
    }
  }, [isAuthenticated, getAccessTokenSilently, navigate]);


  return isAuthenticated ? <Component {...args}></Component> : <Home/>
};

export default AuthGuard;


