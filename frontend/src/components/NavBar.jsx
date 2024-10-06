import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/NavBar.css'; // Import the CSS file

const NavBar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}
          >
            Map
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            to="/about" 
            className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}
          >
            About
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            to="/resources" 
            className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}
          >
            Resources
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
