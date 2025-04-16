
import React from 'react';
import Heading from './Heading/Heading';
import Subheading from './Menu/SubHeading';
import MenuItem from './Menu/MenuItem';
import './SideNavbar.css';

// Sample icon URLs for static representation
const companyLogo = 'https://th.bing.com/th/id/OIP.25JXp81oE9okGKXUsAA_rgAAAA?w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2';
const homeIcon = 'https://cdn-icons-png.flaticon.com/512/25/25694.png';
const settingsIcon = 'https://cdn-icons-png.flaticon.com/512/2099/2099058.png';
const profileIcon = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
const securityIcon = 'https://cdn-icons-png.flaticon.com/512/3064/3064197.png';

function SideNavbar() {
  return (
    <aside className="side-navbar">
      {/* Heading: company logo and name */}
      <Heading icon={companyLogo} name="OpenText" />
      
      {/* Subheading: group title for the menu */}
      <Subheading text="Menu" />
      
      {/* Navigation menu */}
      <nav className="menu">
        {/* Example of a regular menu item */}
        <MenuItem
          icon={homeIcon}
          name="Home"
          hyperlink="/home"
        />

        {/* Example of a menu item with a dropdown */}
        <MenuItem
          icon={settingsIcon}
          name="Settings"
          data={[
            { icon: profileIcon, name: 'Profile', hyperlink: '/profile' },
            { icon: securityIcon, name: 'Security', hyperlink: '/security' },
          ]}
        />
      </nav>
    </aside>
  );
}

export default SideNavbar;
