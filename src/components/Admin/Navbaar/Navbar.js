import React from 'react';
import "./Navbar.css";
import logo from '../../images/ocp.jpg';
import {  useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage and navigate to login page
    localStorage.removeItem('secretaire');
    navigate('/login');  // Redirect to login page
  };

  return (
    <nav className='nav'>
      <div>
        <img src="https://www.ocpgroup.ma/themes/custom/ocp_child/img/logo.svg" alt="Welcome" className="logo" />
      </div>
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        {/* Dropdown Menu */}
        <li className='dropdown'>
          <a href="#">Planning</a>
          <div className='dropdown-menu'>
            <a href="/manual-planningg">Manual</a>
            <a href="/auto-planningg">Automatic</a>
          </div>
        </li>
        <li>
          <a href="/agents-admin">Agents</a>
        </li>
        <li>
          <a href="/SecretairesList">Secretaires</a>
        </li>
        <li>
          <a href="/serviceslist">Services</a>
        </li>
        <li>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" viewBox="0 0 24 24">
              <path d="M16 13v-2h-6v-3h5v-4h-9v14h9v-4h-5v-3h6zm7-1l-5-5v3h-4v4h4v3l5-5z"/>
            </svg>
          </button>
        </li>
        
      </ul>
    </nav>
  );
}

export default Navbar;
