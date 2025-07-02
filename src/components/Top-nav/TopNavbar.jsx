import { useState, useRef, useEffect } from 'react';
import './TopNavbar.css';
import SearchBar from '../Search/SearchBar';
import BackButtonComponent from '../Button/BackButtonComponent';
import ForwardButtonComponent from '../Button/ForwardButtonComponent';
import Heading from '../Side-nav/Heading/Heading';
import AddPatchButton from '../Button/AddPatchButton';


function TopNavbar({ onSearch, onLogout,title,  patchVersion,searchTerm,searchPlaceholder }) {
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
    <div className="left-controls">
      <BackButtonComponent />
      <ForwardButtonComponent />
    </div>
  
    <div className="center-controls">
      <Heading name={title} />
    </div>
  
    <div className="right-controls">
      <AddPatchButton className="add-patch-button" release={patchVersion} />
      {/* <SearchBar onSearch={onSearch}  value={searchTerm} /> */}
      <SearchBar onSearch={onSearch} value={searchTerm} placeholder={searchPlaceholder} />
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
            <p>Welcome, Admin!</p>
            <p>Email: admin@opentext.com</p>
            <hr />
            <button onClick={onLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  </div>
  
  
  );
}

export default TopNavbar;

