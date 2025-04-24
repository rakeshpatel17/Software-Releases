import React, { useState } from 'react';
import SideNavbar from '../components/Side-nav/SideNavbar';
import TopNavbar from '../components/Top-nav/TopNavbar';
import './Dashboard.css';
import Card from '../components/Card/Card';


const fetchedPatches = [
  { title: 'Patch 1', description: 'Products and images in patch 1', badge: 'New', footer: '2025-04-21' },
  { title: 'Patch 2', description: 'Products and images in patch 2', badge: 'Verified', footer: '2025-04-16' },
  { title: 'Patch 3', description: 'Products and images in patch 3', badge: 'Rejected', footer: '2025-04-20' },
  { title: 'Patch 4', description: 'Products and images in patch 4', badge: 'New', footer: '2025-04-19' },
  { title: 'Patch 5', description: 'Products and images in patch 5', badge: 'New', footer: '2025-04-18' },
  { title: 'Patch 6', description: 'Products and images in patch 6', badge: 'New', footer: '2025-04-21' },
  { title: 'Patch 7', description: 'Products and images in patch 7', badge: 'Verified', footer: '2025-04-16' },
  { title: 'Patch 8', description: 'Products and images in patch 8', badge: 'Rejected', footer: '2025-04-20' },
  { title: 'Patch 9', description: 'Products and images in patch 9', badge: 'New', footer: '2025-04-19' },
  { title: 'Patch 10', description: 'Products and images in patch 10', badge: 'Released', footer: '2025-04-22' }
];

function Dashboard({ onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');

  const parseDate = (dateStr) => {
    const d = new Date(dateStr);
    return isNaN(d) ? null : d;
  };

  const filteredPatches = fetchedPatches.filter(release =>
    release.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Grouping
  const newReleased = filteredPatches
    .filter(p => p.badge === 'New' || p.badge === 'Released')
    .sort((a, b) => new Date(b.footer) - new Date(a.footer));

  const verified = filteredPatches.filter(p => p.badge === 'Verified');
  const rejected = filteredPatches.filter(p => p.badge === 'Rejected');

  const displayGroups = [
    { title: 'New & Released Patches', items: newReleased },
    { title: 'Verified Patches', items: verified },
    { title: 'Rejected Patches', items: rejected }
  ];

  return (
    <div className="dashboard-container">
      <SideNavbar />
      <div className="dashboard-content">
        <TopNavbar onSearch={setSearchTerm} onLogout={onLogout} />
        <div className="dashboard-main">
          <h2>Dashboard</h2>
          {displayGroups.map((group, idx) => (
            group.items.length > 0 && (
              <div key={idx}>
                <div className="card-scrollable">
                  <div className="card-grid">
                    {group.items.map((patch, index) => (
                      <Card key={index} info={patch} />
                    ))}
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
