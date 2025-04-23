import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SideNavbar from '../components/Side-nav/SideNavbar';
import TopNavbar from '../components/Top-nav/TopNavbar';
import getProductDetails from '../api/image';
import './ProductPage.css';

function highlightMatch(text, term) {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.split(regex).map((part, i) =>
        part.toLowerCase() === term.toLowerCase() ? (
            <span key={i} className="highlight">{part}</span>
        ) : (
            part
        )
    );
}


function ProductPage({ onLogout }) {
    const { productName } = useParams();
    const [images, setImages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedRows, setExpandedRows] = useState({});

    const toggleRow = (idx) => {
        setExpandedRows((prev) => ({
            ...prev,
            [idx]: !prev[idx],
        }));
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProductDetails(`products/${productName}`);
                if (data && Array.isArray(data.images)) {
                    const filteredImages = data.images.filter((img) =>
                        img.build_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        img.ot2_pass.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                    setImages(filteredImages);
                } else {
                    setImages([]);
                }
            } catch (err) {
                console.error('Error fetching images for product:', err);
                setImages([]);
            }
        };
        fetchData();
    }, [productName, searchTerm]);

    return (
        <div className="dashboard-container">
            <SideNavbar />
            <div className="dashboard-content">
                <TopNavbar onSearch={setSearchTerm} onLogout={onLogout} />
                <div className="dashboard-main">
                    <h2>Images for Product: {productName}</h2>
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Image URL</th>
                                <th>Build Number</th>
                                <th>Release Date</th>
                                <th>OT2 Pass</th>
                                <th>Twistlock Report</th>
                                <th>More Details</th> {/* Dropdown toggle column */}

                            </tr>
                        </thead>
                        <tbody>
                            {images.map((img, idx) => (
                                <React.Fragment key={idx}>
                                    <tr>

                                        <td>
                                            <img
                                                src={img.image_url}
                                                alt={`Build ${img.build_number}`}
                                                style={{ width: '80px', height: 'auto', borderRadius: '4px' }}
                                            />
                                        </td>
                                        <td>{highlightMatch(img.build_number, searchTerm)}</td>
                                        <td>{new Date(img.release_date).toLocaleDateString()}</td>
                                        <td>{highlightMatch(img.ot2_pass, searchTerm)}</td>
                                        <td>
                                            <a
                                                href={img.twistlock_report_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                View Report
                                            </a>
                                        </td>
                                        <td>
                                            <a
                                                href={img.image_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {img.image_url}
                                            </a>
                                        </td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            <button onClick={() => toggleRow(idx)}>
                                                {expandedRows[idx] ? '▲' : '▼'}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedRows[idx] && (
                                        <tr>
                                            <td colSpan="7">
                                                <div className="expanded-content">
                                                    <p style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                                        <span>
                                                            <strong>Twistlock Report Clean:</strong> {img.twistlock_report_clean ? 'Yes' : 'No'}
                                                        </span>
                                                        <span>
                                                            <strong>Created At:</strong> {new Date(img.created_at).toLocaleString()}
                                                        </span>
                                                    </p>
                                                    {/* <p><strong>Security Issues:</strong> {img.security_issues.length > 0 ? img.security_issues.join(', ') : 'None'}</p> */}
                                                    
                                                    <div style={{ marginTop: '12px' }}>
                                                      <strong>Security Issues:</strong>
                                                      {img.security_issues.length > 0 ? (
                                                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
                                                          <thead>
                                                            <tr>
                                                              <th>CVE ID</th>
                                                              <th>CVSS Score</th>
                                                              <th>Severity</th>
                                                              <th>Affected Libraries</th>
                                                              <th>Library Path</th>
                                                              <th>Description</th>
                                                              <th>Created At</th>
                                                            </tr>
                                                          </thead>
                                                          <tbody>
                                                            {img.security_issues.map((issue, index) => (
                                                              <tr key={index}>
                                                                <td>{issue.cve_id}</td>
                                                                <td>{issue.cvss_score}</td>
                                                                <td>{issue.severity}</td>
                                                                <td>{issue.affected_libraries}</td>
                                                                <td>{issue.library_path}</td>
                                                                <td>{issue.description}</td>
                                                                <td>{new Date(issue.created_at).toLocaleString()}</td>
                                                              </tr>
                                                            ))}
                                                          </tbody>
                                                        </table>
                                                      ) : (
                                                        <p>None</p>
                                                      )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                            {images.length === 0 && (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '1rem' }}>
                                        No images found for this product.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    );
}

export default ProductPage;
