import React, { useState, useEffect } from 'react';
import SideNavbar from '../components/Side-nav/SideNavbar';
import TopNavbar from '../components/Top-nav/TopNavbar';
import './Dashboard.css';
import Card from '../components/Card/Card';
import Form from '../components/Form/Form';
import get_patches from '../api/patches';


// const fetchedPatches = [
//   { title: 'Patch 1', description: 'Products and images in patch 1', badge: 'new', footer: '2025-04-21' },
//   { title: 'Patch 2', description: 'Products and images in patch 2', badge: 'verified', footer: '2025-04-16' },
//   { title: 'Patch 3', description: 'Products and images in patch 3', badge: 'rejected', footer: '2025-04-20' },
//   { title: 'Patch 4', description: 'Products and images in patch 4', badge: 'new', footer: '2025-04-19' },
//   { title: 'Patch 5', description: 'Products and images in patch 5', badge: 'new', footer: '2025-04-18' },
//   { title: 'Patch 6', description: 'Products and images in patch 6', badge: 'new', footer: '2025-04-21' },
//   { title: 'Patch 7', description: 'Products and images in patch 7', badge: 'verified', footer: '2025-04-16' },
//   { title: 'Patch 8', description: 'Products and images in patch 8', badge: 'rejected', footer: '2025-04-20' },
//   { title: 'Patch 9', description: 'Products and images in patch 9', badge: 'new', footer: '2025-04-19' },
//   { title: 'Patch 10', description: 'Products and images in patch 10', badge: 'released', footer: '2025-04-22' }
// ];

function Dashboard({ onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [fetchedPatches, setFetchedPatches] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await get_patches();
      console.log("fetched raw data : ", data);
      const mappedData = (data || []).map((patch) => ({
        title: patch.name || "Untitled Patch",
        description: patch.description || "No description available",
        badge: patch.patch_state || "no patche state",
        footer: patch.release_date || "no release_date",
      }));
      console.log("fetched patches in dashboard : ", mappedData);
      setFetchedPatches(mappedData); 
    };
 
    fetch();
  }, []);
  

  const filteredPatches = fetchedPatches.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Grouping
  const newReleased = filteredPatches
    .filter(p => p.badge.toLowerCase() === 'new' || p.badge.toLowerCase() === 'released')
    .sort((a, b) => new Date(b.footer) - new Date(a.footer));

  const verified = filteredPatches.filter(p => p.badge.toLowerCase() === 'verified');
  const rejected = filteredPatches.filter(p => p.badge.toLowerCase() === 'rejected');

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
          <div className="dashboard-header">
            <h2 className="dashboard-title">Dashboard</h2>
            <button
              className="add-patch-button"
              onClick={() => setShowForm(true)}
            >
              ➕ Add Patch
            </button>
          </div>
          {showForm ? (
            <Form onCancel={() => setShowForm(false)} />
          ):
          (displayGroups.map((group, idx) => (
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
          )))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
