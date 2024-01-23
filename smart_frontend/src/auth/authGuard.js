import { withAuthenticationRequired } from "@auth0/auth0-react";
import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Home from "../components/Home";

const AuthGuard = ({ component }) => {
  
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <Home/>
    ),
  });
  
  return <Component />;
};

export default AuthGuard;