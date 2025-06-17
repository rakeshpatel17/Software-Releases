
import { useState, useEffect } from 'react';
import Heading from './Heading/Heading';
import Subheading from './Menu/SubHeading';
import MenuItem from './Menu/MenuItem';
import './SideNavbar.css';
import logo from '../../assets/logo.png';

// API calls
import get_release from '../../api/release';
import get_products from '../../api/get_products';
// import DropdownItem from './Menu/DropdownItem';

function SideNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [releaseNames, setReleaseNames] = useState([]);
  const [productNames, setProductNames] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const releaseData = await get_release();
        const productData = await get_products();
        // console.log("products are : ", productData);

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
            name="Overview"
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
          <MenuItem
            name="Tools"
            data={[
              {
                iconClass: "", // optional
                name: "Comparison",
                hyperlink: "/tools/comparison",
              },
            ]}
          />

        </nav>
      </aside>
    </>
  );
}

export default SideNavbar;
