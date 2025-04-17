
// import React from 'react';
// import Heading from './Heading/Heading';
// import Subheading from './Menu/SubHeading';
// import MenuItem from './Menu/MenuItem';
// import './SideNavbar.css';

// import logo from '../../assets/logo.png';

// function SideNavbar() {
//   return (
//     <aside className="side-navbar">
//       {/* Heading with logo */}
//       <div className="side-navbar-header">
//         <Heading icon={logo} name="OpenText" />
//       </div>

//       <div className="side-navbar-content">
//         <Subheading name="Menu" />

//         <nav className="menu">
//           <MenuItem
//             iconClass="bi bi-house-door-fill"
//             name="Home"
//             hyperlink="/home"
//             active
//           />

//           <MenuItem
//             iconClass="bi bi-gear-fill"
//             name="Settings"
//             data={[
//               { icon: 'https://cdn-icons-png.flaticon.com/512/847/847969.png', name: 'Profile', hyperlink: '/profile' },
//               { icon: 'https://cdn-icons-png.flaticon.com/512/3064/3064197.png', name: 'Security', hyperlink: '/security' },
//             ]}
//           />
//         </nav>
//       </div>
//     </aside>
//   );
// }

// export default SideNavbar;
import React, { useState } from 'react';
import Heading from './Heading/Heading';
import Subheading from './Menu/SubHeading';
import MenuItem from './Menu/MenuItem';
import './SideNavbar.css';
import logo from '../../assets/logo.png';

function SideNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className={`hamburger ${isOpen ? 'sidebar-open' : ''}`} onClick={toggleSidebar}>

        <i className="bi bi-list"></i>
      </button>


      <aside className={`side-navbar ${isOpen ? 'open' : ''}`}>
        <Heading link={logo} name="OpenText" />
        <Subheading name="Menu" />
        <nav className="menu">
          <MenuItem
            iconClass="bi bi-house-door-fill"
            name="Home"
            hyperlink="/home"
          />
          <MenuItem
            iconClass="bi bi-gear-fill"
            name="Settings"
            data={[
              { iconClass: 'bi bi-person-fill', name: 'Profile', hyperlink: '/profile' },
              { iconClass: 'bi bi-shield-lock-fill', name: 'Security', hyperlink: '/security' },
            ]}
          />
        </nav>
      </aside>
    </>
  );
}

export default SideNavbar;
