import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/Card/Card';
import get_patches from '../api/patches';
import Form from '../components/Form/Form';
import './Dashboard/Dashboard.css';
// import PatchPage from './PatchPage/PatchPage';
import { useOutletContext } from 'react-router-dom';

function ReleasePatches() {
  const { id } = useParams();
  const [patches, setPatches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  // const [selectedPatch, setSelectedPatch] = useState(null);

  const { searchTerm, setTitle, setPatchVersion } = useOutletContext();

  useEffect(() => {
    setTitle(`Patches for ${id}`);
    setPatchVersion(id);
  }, [id, setTitle, setPatchVersion]);


  useEffect(() => {
    const fetch = async () => {
      const data = await get_patches(id);
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
      setPatches(mappedData);
    };

    fetch();
  }, [id]);

  const filteredPatches = patches.filter(p =>
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

  const navigate = useNavigate();


  return (
    <div className="dashboard-main">
      {/* <div className="dashboard-header"> */}
      {/* <h2 className="dashboard-title">Patches for {id}</h2> */}
      {/* {!showForm && !selectedPatch && (
          <button
            className="add-patch-button"
            onClick={() => navigate('/addpatch')}
          >
            ➕ Add Patch
          </button>
        )} */}
      {/* </div> */}

      {showForm ? (
        <Form lockedRelease={id} onCancel={() => setShowForm(false)} />
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
                      onClick={() =>
                        navigate(`/patches/${encodeURIComponent(patch.title)}`, {
                          state: { patch, lockedRelease: id }
                        })
                      }
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

export default ReleasePatches;