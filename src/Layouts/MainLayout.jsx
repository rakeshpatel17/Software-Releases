import { Outlet,useLocation } from "react-router-dom";
import SideNavbar from "../components/Side-nav/SideNavbar";
import TopNavbar from "../components/Top-nav/TopNavbar";
import "./MainLayout.css";
import { useState,useEffect } from "react";



const MainLayout = ({ onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [title, setTitle] = useState('');
  const [patchVersion, setPatchVersion] = useState('');

  const location = useLocation(); 
  
  useEffect(() => {
    setSearchTerm('');
  }, [location.pathname]);


  return (
    <div className="mainlayout-container">
      <SideNavbar />
      <div className="mainlayout-content">
      <TopNavbar onSearch={setSearchTerm} onLogout={onLogout} title={title} patchVersion={patchVersion} searchTerm={searchTerm} />
        <div className="mainlayout-main">
   
          <Outlet context={{ searchTerm,setTitle,setPatchVersion  }} />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
