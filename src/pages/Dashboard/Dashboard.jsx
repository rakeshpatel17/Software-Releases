import { useState, useEffect } from 'react';
import './Dashboard.css';
import Card from '../../components/Card/Card';
import Form from '../../components/Form/Form';
import get_patches from '../../api/patches';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from "react-router-dom";



function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const [fetchedPatches, setFetchedPatches] = useState([]);
  // const [selectedPatch, setSelectedPatch] = useState(null);

  const navigate = useNavigate();

  const { searchTerm, setTitle, setPatchVersion, activeFilters, setFilterOptions } = useOutletContext();

  const patchStateFilters = [
  { value: 'new', label: 'New' },
  { value: 'released', label: 'Released' },
  { value: 'in progress', label: 'In Progress' },
  { value: 'cancelled', label: 'Cancelled' }
];

  useEffect(() => {
    setTitle("Overview");
    setPatchVersion("")
    setFilterOptions(patchStateFilters);
     return () => {
      setFilterOptions(null);
    };
  }, [setTitle, setPatchVersion,setFilterOptions]);


  useEffect(() => {
    const fetch = async () => {
      const data = await get_patches();
      // console.log("fetched raw data : ", data);
      const mappedData = (data || []).map((patch) => ({
        title: patch.name || "Untitled Patch",
        description: patch.description || "No description available",
        badge: patch.patch_state || "no patche state",
        footer: patch.release_date || "no release_date",
        products: patch.products || [],
        kba: patch.kba || "",

      }));
      //console.log("fetched patches in dashboard : ", mappedData);
      setFetchedPatches(mappedData);
    };

    fetch();
  }, []);


   const filteredPatches = fetchedPatches.filter(p => {
    // Condition 1: Must match the text in the search bar
    const searchTermMatch = p.title.toLowerCase().includes(searchTerm.toLowerCase());

    // Condition 2: Must match the selected filters
    // If no filters are active, this is always true.
    // Otherwise, the patch's badge must be in the activeFilters array.
    const filterMatch = activeFilters.length === 0 || activeFilters.includes(p.badge.toLowerCase());

    return searchTermMatch && filterMatch; // Must satisfy both conditions
  });

  // Grouping logic now operates on the already-filtered list, so it works automatically.
  // Let's update it to include the new states you wanted.
  const newReleased = filteredPatches
    .filter(p => ['new', 'released', 'in progress'].includes(p.badge.toLowerCase()))
    .sort((a, b) => new Date(b.footer) - new Date(a.footer));

  const verified = filteredPatches.filter(p => p.badge.toLowerCase() === 'verified');
  const rejected = filteredPatches.filter(p => ['rejected', 'cancelled'].includes(p.badge.toLowerCase()));

  const displayGroups = [
    { title: 'New, Released & In Progress', items: newReleased },
    { title: 'Verified Patches', items: verified },
    { title: 'Rejected & Cancelled Patches', items: rejected }
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
                      products={patch.products}
                      setPatches={setFetchedPatches}
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
