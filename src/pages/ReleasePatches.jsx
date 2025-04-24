
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SideNavbar from '../components/Side-nav/SideNavbar';
import TopNavbar from '../components/Top-nav/TopNavbar';
import Card from '../components/Card/Card';
import get_patches from '../api/patches';
import Form from '../components/Form/Form';
import './Dashboard.css';

function ReleasePatches({ onLogout }) {
  const { id } = useParams();
  const [patches, setPatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchPatches = async () => {
      const data = await get_patches(id);
      const mappedData = (data || []).map((patch) => ({
        title: patch.name || "Untitled Patch",
        description: patch.description || "No description available",
        badge: patch.patch_state,
        footer: patch.release_date,
      }));
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
          <div className="dashboard-header">
            <h2 className="dashboard-title">Patches for {id}</h2>
            <button
              className="add-patch-button"
              onClick={() => setShowForm(true)} 
            >
              ➕ Add Patch
            </button>
          </div>

          {showForm ? (
            <>
              <Form />
              <button
                onClick={() => setShowForm(false)}
                style={{
                  marginTop: '1rem',
                  backgroundColor: '#ccc',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <div className="card-scrollable">
              <div className="card-grid">
                {patches.map((patch, index) => (
                  <Card key={index} info={patch} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReleasePatches;
