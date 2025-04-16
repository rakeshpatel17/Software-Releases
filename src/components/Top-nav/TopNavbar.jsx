import React, { useState, useRef, useEffect } from 'react';

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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => onSearch(e.target.value)}
        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '250px' }}
      />

      <div ref={dropdownRef} style={{ position: 'relative' }}>
        <div onClick={toggleDropdown} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>Profile ▼</span>
          <img
            src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
            alt="Profile"
            style={{ width: '32px', height: '32px', borderRadius: '50%' }}
          />
        </div>

        {dropdownOpen && (
          <div style={{
            position: 'absolute',
            top: '40px',
            right: 0,
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            padding: '10px',
            borderRadius: '6px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            zIndex: 10
          }}>
            <p style={{ margin: '4px 0' }}>Welcome, rakesh!</p>
            <p style={{ margin: '4px 0' }}>Email: rakesh@gmail.com</p>
            <hr />
            <button onClick={onLogout} style={{
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%',
              marginTop: '8px'
            }}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopNavbar;
