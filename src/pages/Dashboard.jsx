import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Card from '../components/Card/Card';
import Form from '../components/Form/Form';
import get_patches from '../api/patches';
import PatchPage from './PatchPage/PatchPage';
import { useNavigate } from 'react-router-dom'; 
import { useOutletContext } from "react-router-dom";




function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const [fetchedPatches, setFetchedPatches] = useState([]);
  const [selectedPatch, setSelectedPatch] = useState(null);

  const navigate = useNavigate(); 

  const { searchTerm, setTitle,setPatchVersion } = useOutletContext(); // <-- move this up

  useEffect(() => {
    setTitle("Overview");
    setPatchVersion("")
  }, [setTitle,setPatchVersion]);


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

  const cancelled = filteredPatches.filter(p => p.badge.toLowerCase() === 'cancelled');
  const in_progress = filteredPatches.filter(p => p.badge.toLowerCase() === 'in_progress');

  const displayGroups = [
    { title: 'New & Released Patches', items: newReleased },
    { title: 'In progress Patches', items: in_progress },
    { title: 'Rejected Patches', items: cancelled }
  ];

  



  return (
        <div className="dashboard-main">
        {/* <div className="dashboard-header"> */}
            {/* <h2 className="dashboard-title">Overview</h2> */}
            {/* {!showForm && !selectedPatch && (
              <button
              className="add-patch-button"
              onClick={() => navigate('/addpatch')}
            >
              ➕ Add Patch
            </button>
            )} */}
          {/* </div>      */}
          
          {showForm ? (
        <Form onCancel={() => setShowForm(false)} />
      ) : (
        displayGroups.map((group, idx) => (
          group.items.length > 0 && (
            <div key={idx}>
              {/* <h3>{group.title}</h3> */}
              <div className="card-scrollable">
                <div className="card-grid">
                  {group.items.map((patch, index) => (
                    <Card
                      key={index}
                      info={patch}
                      onClick={() => navigate(`/patches/${encodeURIComponent(patch.title)}`, {
                        state: { patch }
                      })}
                    />
                  ))}
                </div>
              </div>
            </div>
          )
        ))
      )}
        </div>
  );
}

export default Dashboard;
