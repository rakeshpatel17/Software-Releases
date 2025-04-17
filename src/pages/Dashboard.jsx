import React, { useState} from 'react';
import SideNavbar from '../components/Side-nav/SideNavbar';
import TopNavbar from '../components/Top-nav/TopNavbar';
import './Dashboard.css';
import Card from '../components/Card/Card';

const fetchedReleases = [
  {
    title: 'Patch 1',
    description: 'Products and images in patch 1',
    //image: 'https://th.bing.com/th/id/OIP.VhbwgZr6U_AEr2dwDABvIAHaDu?w=349&h=176&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
    badge: 'New',
    footer: 'Last updated 2 days ago'
  },
  {
    title: 'Patch 2',
    description: 'Products and images in patch 2',
    //image: 'https://th.bing.com/th/id/OIP.VhbwgZr6U_AEr2dwDABvIAHaDu?w=349&h=176&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
    badge: 'New',
    footer: 'Last updated 7 days ago'
  },
  {
    title: 'Patch 3',
    description: 'Products and images in patch 3',
    //image: 'https://th.bing.com/th/id/OIP.VhbwgZr6U_AEr2dwDABvIAHaDu?w=349&h=176&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
    badge: 'New',
    footer: 'Last updated 3 days ago'
  }
];

function Dashboard({ onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [releases, setReleases] = useState(fetchedReleases);
  
  const filteredReleases = releases.filter(release =>
    release.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(filteredReleases);
  return (
    <div className="dashboard-container">
      <SideNavbar />
      <div className="dashboard-content">
        <TopNavbar onSearch={setSearchTerm} onLogout={onLogout} />
        <div className="dashboard-main">
        <h2>Dashboard</h2>
        <div className="card-grid">
            {filteredReleases.map((release, index) => (
              <Card key={index} info={release} />
            ))}
        </div>
      </div>
      </div>
    </div>
  );
}

export default Dashboard;
