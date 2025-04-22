import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SideNavbar from '../components/Side-nav/SideNavbar';
import TopNavbar from '../components/Top-nav/TopNavbar';
import Card from '../components/Card/Card';
import './Dashboard.css';

function ProductPage({ onLogout }) {
    const { productName } = useParams(); 
      const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dummy data
        const data = {
          images: [
            {
              build_number: '12345',
              twistlock_report_url: 'https://example.com/report1',
              ot2_pass: 'Yes',
              release_date: '2025-04-20',
              image_url: 'https://via.placeholder.com/150'
            },
            {
              build_number: '12346',
              twistlock_report_url: 'https://example.com/report2',
              ot2_pass: 'No',
              release_date: '2025-04-19',
              image_url: 'https://via.placeholder.com/150'
            }
          ]
        };

        if (data && Array.isArray(data.images)) {
          //console.log("✅ Only image details:", data.images); 

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
        } else {
          console.log(" No images found for product:", productName);
          setImages([]);
        }
      } catch (err) {
        console.error("Error fetching images for product:", err);
        setImages([]);
      }
    };

    fetchData();
  }, [productName]);

  return (
    <div className="dashboard-container">
      <SideNavbar />
      <div className="dashboard-content">
        <TopNavbar onLogout={onLogout} />
        <div className="dashboard-main">
          <h2>Images for Product: {productName}</h2>
          <div className="card-scrollable">
            <div className="card-grid">
              {images.map((img, i) => (
                <Card key={i} info={img} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
