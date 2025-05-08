import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SideNavbar from '../components/Side-nav/SideNavbar';
import TopNavbar from '../components/Top-nav/TopNavbar';
import getProductDetails from '../api/image';
import ImageTable from '../components/ProductTable/ImageTable';
import './ProductPage.css';
import EditableFieldComponent from '../components/EditableFieldComponent';


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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProductDetails(`${productName}`);
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
                    {/* {console.log("prop images : ",images)}; */}
                    <ImageTable images={images} searchTerm={searchTerm} />
                </div>
            </div>
        </div>
    );
}

export default ProductPage;
