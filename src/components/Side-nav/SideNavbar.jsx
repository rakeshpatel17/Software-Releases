
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
import React, { useState, useEffect } from 'react';
import Heading from './Heading/Heading';
import Subheading from './Menu/SubHeading';
import MenuItem from './Menu/MenuItem';
import './SideNavbar.css';
import logo from '../../assets/logo.png';
import get_release from '../../api/release';

function SideNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [releaseNames, setReleaseNames] = useState([]);

  useEffect(() => {
    const fetchReleases = async () => {
      const data = await get_release();

      if (data && Array.isArray(data)) {
        const names = data.map((item) => ({
          iconClass: "", // Leaving iconClass as empty
          name: item.name, // name from backend
          hyperlink: `/${item.name}`, // sample formatting for URL
        }));
        setReleaseNames(names);
        console.log("Release names:", names);
      }
    };

    fetchReleases();
  }, []);

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
            name="Releases"
            // data={[
            //   { iconClass: 'bi bi-person-fill', name: 'Release 1.1', hyperlink: '/Release 1.1' },
            //   { iconClass: 'bi bi-shield-lock-fill', name: 'Release 2.1', hyperlink: '/Release 1.2' },
            // ]}
            data = {releaseNames}
          />
        </nav>
      </aside>
    </>
  );
}

export default SideNavbar;
