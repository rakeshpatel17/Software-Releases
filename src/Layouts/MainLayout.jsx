// import { Outlet,useLocation } from "react-router-dom";
// import SideNavbar from "../components/Side-nav/SideNavbar";
// import TopNavbar from "../components/Top-nav/TopNavbar";
// import "./MainLayout.css";
// import { useState,useEffect } from "react";



// const MainLayout = ({ onLogout }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [title, setTitle] = useState('');
//   const [patchVersion, setPatchVersion] = useState('');
  
//   const location = useLocation(); 
//   console.log("path in mainlayout ",location.pathname)
//   useEffect(() => {
//     setSearchTerm('');
//   }, [location.pathname]);


//   return (
//     <div className="mainlayout-container">
//       <SideNavbar />
//       <div className="mainlayout-content">
//       <TopNavbar onSearch={setSearchTerm} onLogout={onLogout} title={title} patchVersion={patchVersion} searchTerm={searchTerm} />
//         <div className="mainlayout-main">
   
//           <Outlet context={{ searchTerm,setTitle,setPatchVersion  }} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainLayout;


import { Outlet, useLocation } from "react-router-dom";
import SideNavbar from "../components/Side-nav/SideNavbar";
import TopNavbar from "../components/Top-nav/TopNavbar";
import "./MainLayout.css";
import { useState, useEffect,useCallback  } from "react";

const MainLayout = ({ onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [title, setTitle] = useState('');
  const [patchVersion, setPatchVersion] = useState('');
  const [searchPlaceholder, setSearchPlaceholder] = useState('Search...');

  const location = useLocation();
  const path = location.pathname;

  //filter
  const [activeFilters, setActiveFilters] = useState([]);
  const [filterOptions, setFilterOptions] = useState(null)


  useEffect(() => {
    setSearchTerm('');
    setActiveFilters([]); 


    if (path.startsWith('/releases/')) {
      const version = path.split('/')[2];
      setSearchPlaceholder(`Search for patches in ${version}`);
    } else if (path === '/dashboard') {
      setSearchPlaceholder('Search for patches');
    } else if (path.startsWith('/progress/')) {
      const version = path.split('/')[2];
      setSearchPlaceholder(`Search for products ... `);
    } else if(path.startsWith('/products/')) {
      setSearchPlaceholder('Search for release...');
    } else {
      setSearchPlaceholder('Search...');
    }
  }, [path]);

    const handleSearch = useCallback((query) => {
    setSearchTerm(query);
  }, []);

  const handleFilterChange = useCallback((selected) => {
    setActiveFilters(selected);
  }, []);

   return (
    <div className="mainlayout-container">
      <SideNavbar />
      <div className="mainlayout-content">
        <TopNavbar
          onSearch={handleSearch} 
          onFilterChange={handleFilterChange} 
          onLogout={onLogout}
          title={title}
          patchVersion={patchVersion}
          searchTerm={searchTerm}
          searchPlaceholder={searchPlaceholder}
          filterOptions={filterOptions} 
          initialFilters={activeFilters}
        />
        <div className="mainlayout-main">
          <Outlet
            context={{
              searchTerm,
              setTitle,
              setPatchVersion,
              activeFilters,    
              setFilterOptions, 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;