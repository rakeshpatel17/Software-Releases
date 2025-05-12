// PageWrapper.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import TopNavbar from './Top-nav/TopNavbar';

const routeTitles = {
    dashboard: 'Dashboard',
    releases: 'Releases',
    products: 'Product Details',
    patches: 'Patch Details',
    progress: 'Patch Progress',
  };
  

function PageWrapper({ children, onLogout }) {
  const location = useLocation();
  const title = routeTitles[location.pathname.split('/')[1]] || 'My App'; // Extract the first segment of path as key

  return (
    <div>
      <TopNavbar title={title} onLogout={onLogout} />
      <div className="page-content">
        {children}
      </div>
    </div>
  );
}

export default PageWrapper;
