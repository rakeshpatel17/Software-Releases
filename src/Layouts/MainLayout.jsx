import { Outlet } from "react-router-dom";
import SideNavbar from "../components/Side-nav/SideNavbar";
import TopNavbar from "../components/Top-nav/TopNavbar";
import "./MainLayout.css";
import { useState } from "react";

const MainLayout = ({ onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="dashboard-container">
      <SideNavbar />
      <div className="dashboard-content">
        <TopNavbar onSearch={setSearchTerm} onLogout={onLogout} />
        <div className="dashboard-main">
          <Outlet context={{ searchTerm }} />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
