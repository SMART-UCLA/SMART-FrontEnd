// Navbar.js
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import smartLogo from './logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavLinkClick = (path) => {
    navigate(path);
  };

  return (
    <nav className="bg-white p-4 border-b border-gray-300 fixed w-full top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src={smartLogo} alt="SMART Logo" className="h-12" />
          <div className="text-black font-bold text-xl">SMART Project</div>
        </div>
        <div className="space-x-4">
          <NavLink to="/" currentPath={location.pathname} onClick={() => handleNavLinkClick('/')}>
            Home
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, currentPath, onClick, children }) => {
  const isActive = to === currentPath;
  const activeClassName = isActive ? 'text-blue-500' : 'text-black';

  return (
    <Link to={to} className={`text-black ${activeClassName}`} onClick={onClick}>
      {children}
    </Link>
  );
};

export default Navbar;