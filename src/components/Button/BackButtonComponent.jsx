import { useNavigate, useLocation } from 'react-router-dom';

function BackButtonComponent() {
  const navigate = useNavigate();

  // const handleBack = () => {
  //   const currentPath = location.pathname;

  //   const isDashboard = currentPath === '/dashboard';
  //   const isReleaseId = /^\/releases\/\d+(\.\d+)?$/.test(currentPath);
  //   const isSpecificProduct = currentPath.startsWith('/products/'); // handles any /products/* path

  //   if (isDashboard || isReleaseId || isSpecificProduct) {
  //     return; // prevent back navigation
  //   }

  //   if (window.history.length > 1) {
  //     navigate(-1);
  //   } else {
  //     navigate('/dashboard'); // fallback
  //   }
  // };

  return (
    <button 
      // onClick={handleBack}
      onClick={() => navigate(-1)}
      style={{
        padding: '8px 12px',
        borderRadius: '5px',
        backgroundColor: '#e2e8f0',
        border: '1px solid #cbd5e0',
        cursor: 'pointer',
        marginTop: '-20px',
      }}
      className="nav-btn"
    >
      ← 
    </button>
  );
}

export default BackButtonComponent;

