

// import { useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import getProductDetails from '../api/image'; 
// import SideNavbar from '../components/Side-nav/SideNavbar';
// import TopNavbar from '../components/Top-nav/TopNavbar';
// import Card from '../components/Card/Card';
// import './Dashboard.css';

// function ProductPage({ onLogout }) {
//   const { productName } = useParams();
//   const [images, setImages] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data = await getProductDetails(`products/${productName}`);
//         if (data && Array.isArray(data.images)) {
//           const formatted = data.images.map((img) => ({
//             title: `Build: ${img.build_number}`,
//             description: (
//               <a href={img.twistlock_report_url} target="_blank" rel="noopener noreferrer">
//                 Twistlock Report
//               </a>
//             ),
//             badge: img.ot2_pass === 'Yes' ? 'OT2 Pass' : 'OT2 Fail',
//             footer: `Released on: ${new Date(img.release_date).toLocaleDateString()}`,
//             image: img.image_url,
//           }));
//           setImages(formatted);
//         } else {
//           console.log("No images found for product:", productName);
//           setImages([]);
//         }
//       } catch (err) {
//         console.error("Error fetching images for product:", err);
//         setImages([]);
//       }
//     };

//     fetchData();
//   }, [productName]);

//   return (
//     <div className="dashboard-container">
//       <SideNavbar />
//       <div className="dashboard-content">
//         <TopNavbar onLogout={onLogout} />
//         <div className="dashboard-main">
//           <h2>Images for Product: {productName}</h2>
//           <div className="card-scrollable">
//             <div className="card-grid">
//               {images.map((img, i) => (
//                 <Card key={i} info={img} />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProductPage;

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import getProductDetails from '../api/image'; 
import SideNavbar from '../components/Side-nav/SideNavbar';
import TopNavbar from '../components/Top-nav/TopNavbar';
import Card from '../components/Card/Card';
import './Dashboard.css';

function ProductPage({ onLogout }) {
  const { productName } = useParams();
  const [images, setImages] = useState([]);
  const [expandedStates, setExpandedStates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProductDetails(`products/${productName}`);
        if (data && Array.isArray(data.images)) {
          const formatted = data.images.map((img) => ({
            title: `Build: ${img.build_number}`,
            description: (
              <a href={img.twistlock_report_url} target="_blank" rel="noopener noreferrer">
                Twistlock Report
              </a>
            ),
            badge: img.ot2_pass === 'Yes' ? 'OT2 Pass' : 'OT2 Fail',
            footer: `Released on: ${new Date(img.release_date).toLocaleDateString()}`,
            image: img.image_url,
          }));
          setImages(formatted);
          setExpandedStates(Array(formatted.length).fill(false));
        } else {
          console.log("No images found for product:", productName);
          setImages([]);
        }
      } catch (err) {
        console.error("Error fetching images for product:", err);
        setImages([]);
      }
    };

    fetchData();
  }, [productName]);

  const toggleExpand = (index) => {
    const updated = [...expandedStates];
    updated[index] = !updated[index];
    setExpandedStates(updated);
  };

  return (
    <div className="dashboard-container">
      <SideNavbar />
      <div className="dashboard-content">
        <TopNavbar onLogout={onLogout} />
        <div className="dashboard-main">
          <h2>Images for Product: {productName}</h2>
          <div className="card-scrollable">
            <div className="card-grid product-cards-grid">
              {images.map((img, i) => (
                <div key={i} className="product-card-wrapper">
                  <button
                    className="expand-toggle-icon"
                    onClick={() => toggleExpand(i)}
                    title="Show more info"
                  >
                    {expandedStates[i] ? '−' : '+'}
                  </button>
                  <Card info={img} />
                  <div className={`expand-content ${expandedStates[i] ? 'visible' : ''}`}>
                    <p>🔍 Additional information about this build can be shown here.</p>
                    <p>📅 Extra metadata, links, or status logs.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
