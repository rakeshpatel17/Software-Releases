import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SideNavbar from '../components/Side-nav/SideNavbar';
import TopNavbar from '../components/Top-nav/TopNavbar';
import Card from '../components/Card/Card';
import './Dashboard.css'; // reusing styling 
import get_patches from '../api/patches'


function ReleasePatches({ onLogout }) {
  const { id } = useParams();
  const [patches, setPatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatches = async () => {
        const data = await get_patches(id); // pass id if needed
        console.log("fetched specific patches for releases : ", data);
        // Transforming into desired structure
    const mappedData = (data || []).map((patch) => ({
        title: patch.name || "Untitled Patch",
        description: patch.description || "No description available",
        badge: patch.patch_state, // You can customize or derive this from patch data
        footer: patch.release_date, // Human-readable format
      }));
    // Filtering the mapped data based on title (patch name)
    const filtered = mappedData.filter(patch =>
        patch.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    setPatches(filtered || []);
    };
    
    fetchPatches();
  }, [id, searchTerm]);

  return (
    <div className="dashboard-container">
      <SideNavbar />
      <div className="dashboard-content">
      <TopNavbar onSearch={setSearchTerm} onLogout={onLogout} />
        <div className="dashboard-main">
          <h2>Patches for {id}</h2>
          <div className="card-scrollable">
            <div className="card-grid">
              {patches.map((patch, index) => (
                <Card key={index} info={patch} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReleasePatches;
