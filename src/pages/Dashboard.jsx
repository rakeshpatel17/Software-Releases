import React, { useState } from 'react';
import SideNavbar from '../components/Side-nav/SideNavbar';
import TopNavbar from '../components/Top-nav/TopNavbar';
import './Dashboard.css';
import Card from '../components/Card/Card';

const fetchedPatches = [
  {
    title: 'Patch 1',
    description: 'Products and images in patch 1',
    badge: 'New',
    footer: 'Last updated 2 days ago'
  },
  {
    title: 'Patch 2',
    description: 'Products and images in patch 2',
    badge: 'Verified',
    footer: 'Last updated 7 days ago'
  },
  {
    title: 'Patch 3',
    description: 'Products and images in patch 3',
    badge: 'Rejected',
    footer: 'Last updated 3 days ago'
  },
  {
    title: 'Patch 4',
    description: 'Products and images in patch 4',
    badge: 'New',
    footer: 'Last updated 4 days ago'
  },
  {
    title: 'Patch 5',
    description: 'Products and images in patch 4',
    badge: 'New',
    footer: 'Last updated 5 days ago'
  },
];

function Dashboard({ onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter patches based on search term
  const filteredPatches = fetchedPatches.filter(patch =>
    patch.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by badge status and order manually
  const groupByBadge = (badgeName) =>
    filteredPatches.filter(patch => patch.badge === badgeName);

  const groupedPatches = [
    { title: 'New Patches', items: groupByBadge('New') },
    { title: 'Verified Patches', items: groupByBadge('Verified') },
    { title: 'Rejected Patches', items: groupByBadge('Rejected') },
  ];

  return (
    <div className="dashboard-container">
      <SideNavbar />
      <div className="dashboard-content">
        <TopNavbar onSearch={setSearchTerm} onLogout={onLogout} />
        <div className="dashboard-main">
          <h2>Dashboard</h2>

          {groupedPatches.map((group, idx) => (
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
