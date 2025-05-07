import React, { useState, useEffect } from 'react';
import SideNavbar from '../components/Side-nav/SideNavbar';
import TopNavbar from '../components/Top-nav/TopNavbar';
import './Dashboard.css';
import Card from '../components/Card/Card';
import Form from '../components/Form/Form';
import get_patches from '../api/patches';
import PatchPage from './PatchPage';



function Dashboard({ onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [fetchedPatches, setFetchedPatches] = useState([]);
  const [selectedPatch, setSelectedPatch] = useState(null);

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
            <h2 className="dashboard-title">Overview</h2>
            {!showForm && !selectedPatch && (
              <button
                className="add-patch-button"
                onClick={() => setShowForm(true)}
              >
                ➕ Add Patch
              </button>
            )}
          </div>          {showForm ? (
            <Form onCancel={() => setShowForm(false)} />
          ) : selectedPatch ? (
            <PatchPage patchName ={selectedPatch.title} patch={selectedPatch} onBack={() => setSelectedPatch(null)} />
          ):
          (displayGroups.map((group, idx) => (
            group.items.length > 0 && (
              <div key={idx}>
                <div className="card-scrollable">
                  <div className="card-grid">
                    {group.items.map((patch, index) => (
                      // <Card key={index} info={patch} />
                      <Card key={index} info={patch} onClick={() => setSelectedPatch(patch)} />
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
