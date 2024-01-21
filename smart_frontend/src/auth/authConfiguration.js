/*
const { auth } = require('express-openid-connect');

export const config = {
  authRequired: false,
  auth0Logout: true,
  secret: '86a8359a39e968f21cdd43b8897967f013f06bc21ed29904ee1b9885a9939622',
  baseURL: 'http://localhost:3000/SMART-FrontEnd',
  clientID: 'OVs6wasqgkibgaaY58XxY5bSlktODzhQ',
  issuerBaseURL: 'https://dev-xdx10w8664v1a2yz.us.auth0.com',
  domain: 'dev-xdx10w8664v1a2yz.us.auth0.com',
  clientID: 'OVs6wasqgkibgaaY58XxY5bSlktODzhQ',
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});
*/

import { Auth0Provider } from '@auth0/auth0-react';

const AuthProvider = ({ children }) => {
    const domain = 'dev-xdx10w8664v1a2yz.us.auth0.com';
    const clientId = 'OVs6wasqgkibgaaY58XxY5bSlktODzhQ';
  
    return (
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        redirectUri={window.location.origin}
      >
        {children}
      </Auth0Provider>
    );
  };
  
export default AuthProvider;