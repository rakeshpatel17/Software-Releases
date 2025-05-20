import { useNavigate } from 'react-router-dom';

function CancelButton() {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1); 
    
  };

  return (
    <button type="button" className="cancel-button" onClick={handleCancel}
    style={{
        padding: '10px 18px',
        backgroundColor: '#dfe4f7',
        color: '#20338b',
        border: 'none',
        borderRadius: '6px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
      }}
      onMouseOver={(e) => e.target.style.backgroundColor = '#c1c8e3'}  
      onMouseOut={(e) => e.target.style.backgroundColor = '#dfe4f7'} >
      Cancel
    </button>
  );
}

export default CancelButton;

