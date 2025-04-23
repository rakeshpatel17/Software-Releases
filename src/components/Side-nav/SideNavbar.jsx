
// import React, { useState, useEffect } from 'react';
// import Heading from './Heading/Heading';
// import Subheading from './Menu/SubHeading';
// import MenuItem from './Menu/MenuItem';
// import './SideNavbar.css';
// import logo from '../../assets/logo.png';
// import get_release from '../../api/release';

// function SideNavbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [releaseNames, setReleaseNames] = useState([]);

//   useEffect(() => {
//     const fetchReleases = async () => {
//       const data = await get_release();

//       if (data && Array.isArray(data)) {
//         const names = data.map((item) => ({
//           iconClass: "", // Leaving iconClass as empty
//           name: item.name, // name from backend
//           hyperlink: `/${item.name}`, // sample formatting for URL
//         }));
//         setReleaseNames(names);
//         console.log("Release names:", names);
//       }
//     };

//     fetchReleases();
//   }, []);

//   const toggleSidebar = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <>
//       <button className={`hamburger ${isOpen ? 'sidebar-open' : ''}`} onClick={toggleSidebar}>

//         <i className="bi bi-list"></i>
//       </button>


//       <aside className={`side-navbar ${isOpen ? 'open' : ''}`}>
//         <Heading link={logo} name="OpenText" />
//         <Subheading name="Menu" />
//         <nav className="menu">
//           <MenuItem
//             iconClass="bi bi-house-door-fill"
//             name="Home"
//             hyperlink="/home"
//           />
//           <MenuItem
//              //iconClass="bi bi-dot"
//             name="Releases"
//             // data={[
//             //   { iconClass: 'bi bi-person-fill', name: 'Release 1.1', hyperlink: '/Release 1.1' },
//             //   { iconClass: 'bi bi-shield-lock-fill', name: 'Release 2.1', hyperlink: '/Release 1.2' },
//             // ]}
//             data={releaseNames}
//           />
//           <MenuItem
//            // iconClass="bi bi-dot	"
//             name="Products"
//             data={[
//               { iconClass: 'bi bi-dot', name: 'Product 1', hyperlink: '/Release 1.1' },
//               { iconClass: 'bi bi-dot', name: 'Product 2', hyperlink: '/Release 1.2' },
//             ]}
//           />


//         </nav>
//       </aside>
//     </>
//   );
// }

// export default SideNavbar;
import React, { useState, useEffect } from 'react';
import Heading from './Heading/Heading';
import Subheading from './Menu/SubHeading';
import MenuItem from './Menu/MenuItem';
import './SideNavbar.css';
import logo from '../../assets/logo.png';

// API calls
import get_release from '../../api/release';
import get_products from '../../api/product'; 

function SideNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [releaseNames, setReleaseNames] = useState([]);
  const [productNames, setProductNames] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const releaseData = await get_release();
        const productData = await get_products();

        if (releaseData && Array.isArray(releaseData)) {
          const releases = releaseData.map((item) => ({
            iconClass: "", // Optional icon class
            name: item.name,
            hyperlink: `/releases/${item.name}`,
          }));
          setReleaseNames(releases);
        }

        if (productData && Array.isArray(productData)) {
          const products = productData.map((item) => ({
            iconClass: "", // Optional icon class
            name: item.name,
            hyperlink: `/products/${item.name}`, 
          }));
          setProductNames(products);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
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
            name="Dashboard"
            hyperlink="/dashboard"
          />
          <MenuItem
            name="Releases"
            data={releaseNames}
          />
          <MenuItem
            name="Products"
            data={productNames}
          />
        </nav>
      </aside>
    </>
  );
}

export default SideNavbar;
