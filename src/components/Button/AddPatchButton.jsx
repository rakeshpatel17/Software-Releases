import Tooltip from '../../components/ToolTip/ToolTip';
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
    <Tooltip text='add patch' position='down'>
    <button className="add-patch-button" onClick={handleClick}>
      ➕ 
    </button></Tooltip>
  );
}

export default AddPatchButton;
