import { useNavigate } from 'react-router-dom';

function AddPatchButton({ release }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (release) {
      navigate('/addpatch', { state: { lockedRelease: release } });
    } else {
      navigate('/addpatch');
    }
  };

  return (
    <button className="add-patch-button" onClick={handleClick}>
      ➕ Add Patch
    </button>
  );
}

export default AddPatchButton;
