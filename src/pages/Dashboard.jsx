import React, { useState } from 'react';
import SideNavbar from '../components/Side-nav/SideNavbar';
import TopNavbar from '../components/Top-nav/TopNavbar';
import './Dashboard.css';

const sampleData = [
  'alpha',
  'beta',
  'gamma',
  'delta'
];

function Dashboard({ onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = sampleData.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <SideNavbar />
      <div className="dashboard-content">
        <TopNavbar onSearch={setSearchTerm} onLogout={onLogout} />
        <div className="dashboard-main">
          <h2>Dashboard</h2>
          {filteredData.length > 0 ? (
            filteredData.map((item, idx) => <p key={idx}>{item}</p>)
          ) : (
            <p>No results found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
