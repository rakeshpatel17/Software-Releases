import { Outlet } from "react-router-dom";
import SideNavbar from "../components/Side-nav/SideNavbar";
import TopNavbar from "../components/Top-nav/TopNavbar";
import "./MainLayout.css";
import { useState } from "react";

const MainLayout = ({ onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [title, setTitle] = useState('');

  return (
    <div className="dashboard-container">
      <SideNavbar />
      <div className="dashboard-content">
      <TopNavbar onSearch={setSearchTerm} onLogout={onLogout} title={title} />
        <div className="dashboard-main">
          <Outlet context={{ searchTerm, setTitle}} />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
