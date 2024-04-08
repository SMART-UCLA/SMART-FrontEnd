import { Auth0Provider, useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';

const AuthProvider = ({ children }) => {
    const domain = 'dev-xdx10w8664v1a2yz.us.auth0.com';
    const clientId = 'OVs6wasqgkibgaaY58XxY5bSlktODzhQ';
    const redirectUri = 'https://justinsheu.github.io/SMART-FrontEnd'
    return (
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{ 
          redirect_uri: redirectUri,
          audience: `https://dev-xdx10w8664v1a2yz.us.auth0.com/api/v2/`,
          scope: "read:current_user update:current_user_metadata"
        }}
        // useRefreshTokens={true}
        useRefreshTokensFallback={true}
        cacheLocation="localstorage"
      >
        {children}
      </Auth0Provider>
    );
};
  
export default AuthProvider;