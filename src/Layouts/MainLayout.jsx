import { Outlet } from "react-router-dom";
import SideNavbar from "../components/Side-nav/SideNavbar";
import TopNavbar from "../components/Top-nav/TopNavbar";
import "./MainLayout.css";
import { useState } from "react";
import Form from "../components/Form/Form";


const MainLayout = ({ onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [title, setTitle] = useState('Dashboard');
  const [patchVersion, setPatchVersion] = useState('');
  // const [showForm, setShowForm] = useState(false);

  // const onAddPatch = () => {
  //   setShowForm(true); // This opens the form
  // };

  return (
    <div className="dashboard-container">
      <SideNavbar />
      <div className="dashboard-content">
      <TopNavbar onSearch={setSearchTerm} onLogout={onLogout} title={title} patchVersion={patchVersion} />
        <div className="dashboard-main">
   
          <Outlet context={{ searchTerm,setTitle,setPatchVersion  }} />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
