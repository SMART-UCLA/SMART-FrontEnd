import { withAuthenticationRequired } from "@auth0/auth0-react";
import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Home from "../components/Home";
import { Navigate } from "react-router-dom";

const AuthGuard = ({ component: Component, ...args  }) => {
  console.log('Component:', Component);
  // const { isAuthenticated } = useAuth0();
  const AuthenticatedComponent = withAuthenticationRequired(() => (
    <Component {...args} />
  ), {
    onRedirecting: () => <Navigate to="/" />,
  });

  /*
  const AuthenticatedComponent = withAuthenticationRequired(Component, {
    onRedirecting: () => (
      <Navigate to="/"/>
    ),
  });
  */

  return <AuthenticatedComponent />;
  //return isAuthenticated ? <AuthenticatedComponent /> : <Home/>
};

export default AuthGuard;


