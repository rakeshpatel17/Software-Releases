
import React, { useState, useRef, useEffect } from 'react';
import './TopNavbar.css';

function TopNavbar({ onSearch, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="top-navbar">
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => onSearch(e.target.value)}
      />

      <div ref={dropdownRef} className="profile-container">
        <div onClick={toggleDropdown} className="profile-toggle">
          <span>Profile</span>
          <img
            src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
            alt="Profile"
          />
        </div>

        {dropdownOpen && (
          <div className="dropdown">
            <p>Welcome, rakesh!</p>
            <p>Email: rakesh@gmail.com</p>
            <hr />
            <button onClick={onLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopNavbar;

