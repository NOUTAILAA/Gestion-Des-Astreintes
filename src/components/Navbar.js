import React from 'react';
import "./Navbar.css";
import { FaRegUserCircle } from "react-icons/fa";

function Navbar() {
  return (
    <nav className='nav'>
      <div>
        <img src="https://www.ocpgroup.ma/themes/custom/ocp_child/img/logo.svg" alt="Welcome" className="logo" />
      </div>
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/latest">Latest Planning</a>
        </li>
        
        
        <li>
          <a href="/login">
            <FaRegUserCircle className="userr" />
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;