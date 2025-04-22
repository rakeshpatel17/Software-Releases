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
    //image: 'https://th.bing.com/th/id/OIP.VhbwgZr6U_AEr2dwDABvIAHaDu?w=349&h=176&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
    badge: 'Verified',
    footer: 'Last updated 7 days ago'
  },
  {
    title: 'Patch 3',
    description: 'Products and images in patch 3',
    //image: 'https://th.bing.com/th/id/OIP.VhbwgZr6U_AEr2dwDABvIAHaDu?w=349&h=176&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
    badge: 'Rejected',
    footer: 'Last updated 3 days ago'
  },
  {
    title: 'Patch 4',
    description: 'Products and images in patch 4',
    //image: 'https://th.bing.com/th/id/OIP.VhbwgZr6U_AEr2dwDABvIAHaDu?w=349&h=176&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
    badge: 'New',
    footer: 'Last updated 4 days ago'
  },
  {
    title: 'Patch 5',
    description: 'Products and images in patch 4',
    //image: 'https://th.bing.com/th/id/OIP.VhbwgZr6U_AEr2dwDABvIAHaDu?w=349&h=176&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
    badge: 'New',
    footer: 'Last updated 5 days ago'
  },
  {
    title: 'Patch 1',
    description: 'Products and images in patch 1',
    badge: 'New',
    footer: 'Last updated 2 days ago'
  },
  {
    title: 'Patch 2',
    description: 'Products and images in patch 2',
    //image: 'https://th.bing.com/th/id/OIP.VhbwgZr6U_AEr2dwDABvIAHaDu?w=349&h=176&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
    badge: 'Verified',
    footer: 'Last updated 7 days ago'
  },
  {
    title: 'Patch 3',
    description: 'Products and images in patch 3',
    //image: 'https://th.bing.com/th/id/OIP.VhbwgZr6U_AEr2dwDABvIAHaDu?w=349&h=176&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
    badge: 'Rejected',
    footer: 'Last updated 3 days ago'
  },
  {
    title: 'Patch 4',
    description: 'Products and images in patch 4',
    //image: 'https://th.bing.com/th/id/OIP.VhbwgZr6U_AEr2dwDABvIAHaDu?w=349&h=176&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
    badge: 'New',
    footer: 'Last updated 4 days ago'
  },
  {
    title: 'Patch 5',
    description: 'Products and images in patch 4',
    //image: 'https://th.bing.com/th/id/OIP.VhbwgZr6U_AEr2dwDABvIAHaDu?w=349&h=176&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
    badge: 'New',
    footer: 'Last updated 5 days ago'
  },
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
  const [patches, setPatches] = useState(fetchedPatches);
  
  const filteredPatches = patches.filter(release =>
    release.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by badge status and order manually
  const groupByBadge = (badgeName) =>
    filteredPatches.filter(patch => patch.badge === badgeName);
 
  const groupedPatches = [
    { title: 'New Patches', items: groupByBadge('New') },
    { title: 'Verified Patches', items: groupByBadge('Verified') },
    { title: 'Rejected Patches', items: groupByBadge('Rejected') },
  ];
  
  console.log(filteredPatches);

  return (
    <div className="dashboard-container">
      <SideNavbar />
      <div className="dashboard-content">
        <TopNavbar onSearch={setSearchTerm} onLogout={onLogout} />
        <div className="dashboard-main">
          <h2>Dashboard</h2>
          {/* <div className="card-scrollable">
            <div className="card-grid">
              {filteredpatches.map((release, index) => (
                <Card key={index} info={release} />
              ))}
            </div>  
          </div> */}
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
