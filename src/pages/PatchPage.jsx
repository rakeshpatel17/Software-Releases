import React, { useState, useEffect } from 'react';
import ProductImageSelector from '../components/ProductImageSelector';
import JarSelector from '../components/JarSelector';
import ProgressBar from '../components/ProgressBar';
import './PatchPage.css';
import getAllProducts from '../api/product';
import { getPatchById } from '../api/getPatchById';
 
function PatchPage({ patchName }) {
    const [isEditing, setIsEditing] = useState(false);
    const [patchData, setPatchData] = useState({});
   
    useEffect(() => {
        const fetchPatch = async () => {
            const data = await getPatchById(patchName);
            if (data && data.length > 0) {
                setPatchData(data[0]);
            } else {
                setPatchData({});
            }
        };
        fetchPatch();
    }, [patchName]);
 
    // Jar-related state
    const [jarSearchTerm, setJarSearchTerm] = useState('');
    const [filteredJars, setFilteredJars] = useState([]);
    const [selectedJars, setSelectedJars] = useState([]);
    const [expandedJar, setExpandedJar] = useState(null);
    const selectedJarRead = [
        { name: 'log4j', version: '2.1' },
        { name: 'commons-io', version: '2.2' },
        { name: 'guava', version: '3.1' },
        { name: 'slf4j', version: '1.7' }
    ];
 
    const allJars = [
        { name: 'commons-cli' },
        { name: 'commons-codec' },
        { name: 'commons-io' },
        { name: 'log4j' },
        { name: 'spring-core' },
        { name: 'spring-security' },
        { name: 'xmlsec' },
    ];
 
    // Product-related state
    const [productSearchTerm, setProductSearchTerm] = useState('');
    const [expandedProduct, setExpandedProduct] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [productData, setProductData] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
 
    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getAllProducts();
            if (data && data.length > 0) {
                setProductData(data);
            }
        };
        fetchProducts();
    }, []);
 
    const handleImageToggle = (image) => {
        setSelectedImages((prev) =>
            prev.includes(image) ? prev.filter((img) => img !== image) : [...prev, image]
        );
    };
 
    const handleProductSelection = (product, isChecked) => {
        const productImages = product.images || [];
 
        setSelectedImages((prev) => {
            if (isChecked) {
                return [...new Set([...prev, ...productImages.map((img) => img.image_name)])];
            } else {
                return prev.filter((img) => !productImages.some((prodImg) => prodImg.image_name === img));
            }
        });
 
        setSelectedProducts((prev) => {
            if (isChecked) {
                return [...prev, { name: product.name, images: product.images }];
            } else {
                return prev.filter((prod) => prod.name !== product.name);
            }
        });
    };
 
    const filteredProducts = productData.filter((product) =>
        product.name.toLowerCase().includes(productSearchTerm.toLowerCase())
    );
 
    const [highLevelScope, setHighLevelScope] = useState([
        { label: 'Base OS', value: '' },
        { label: 'Tomcat', value: '' },
        { label: 'JDK', value: '' },
        { label: 'OTDS', value: '' },
        { label: 'New Relic', value: '' }
    ]);
 
    const handleHighLevelScopeChange = (index, newValue) => {
        setHighLevelScope(prev => {
            const updated = [...prev];
            updated[index].value = newValue;
            return updated;
        });
    };
 
    useEffect(() => {
        if (jarSearchTerm.trim()) {
            const filtered = allJars.filter(jar =>
                jar.name.toLowerCase().includes(jarSearchTerm.toLowerCase())
            );
            setFilteredJars(filtered);
        } else {
            setFilteredJars([]);
        }
    }, [jarSearchTerm]);
 
    const toggleEdit = () => setIsEditing(prev => !prev);
 
    const getProgressValue = (state) => {
        switch (state) {
            case 'New': return 10;
            case 'In Progress': return 50;
            case 'Completed': return 100;
            default: return 0;
        }
    };
 
    return (
        <>
            <div className="progress-container">
                <ProgressBar value={getProgressValue(patchData.patch_state)} label="Patch Progress" />
            </div>
 
            <div className="patch-page">
                <div className="patch-header">
                    <h2>Patch Details</h2>
                    <button className="edit-btn" onClick={toggleEdit}>
                        {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                </div>
 
                <form className="patch-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={patchData.name || ''}
                                disabled={!isEditing}
                                onChange={e => setPatchData({ ...patchData, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Release</label>
                            <input
                                type="text"
                                value={patchData.release || ''}
                                disabled={!isEditing}
                                onChange={e => setPatchData({ ...patchData, release: e.target.value })}
                            />
                        </div>
                    </div>
 
                    <div className="form-row">
                        <div className="form-group">
                            <label>Release Date</label>
                            <input
                                type="date"
                                value={patchData.release_date || ''}
                                disabled={!isEditing}
                                onChange={e => setPatchData({ ...patchData, release_date: e.target.value })}
                                min={new Date().toISOString().split("T")[0]}
                            />
                        </div>
                        <div className="form-group">
                            <label>Code Freeze Date</label>
                            <input
                                type="date"
                                value={patchData.release_date || ''}
                                disabled={!isEditing}
                                onChange={e => setPatchData({ ...patchData, release_date: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Platform QA Build</label>
                            <input
                                type="date"
                                value={patchData.release_date || ''}
                                disabled={!isEditing}
                                onChange={e => setPatchData({ ...patchData, release_date: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Patch State</label>
                            <select
                                value={patchData.patch_state || 'New'}
                                disabled={!isEditing}
                                onChange={e => setPatchData({ ...patchData, patch_state: e.target.value })}
                            >
                                <option value="new">New</option>
                                <option value="rejected">Rejected</option>
                                <option value="verified">Verified</option>
                                <option value="released">Released</option>
                            </select>
                        </div>
                    </div>
 
                    <label>Description</label>
                    <textarea
                        value={patchData.description || ''}
                        disabled={!isEditing}
                        onChange={e => setPatchData({ ...patchData, description: e.target.value })}
                    />
 
                    <label>High Level Scope</label>
                    {!isEditing ? (
                        <div className="read-only-scope">
                            <ul>
                                {highLevelScope.map((item, index) => (
                                    <li key={index}>
                                        <strong>{item.label}:</strong> {item.value || <em>Not specified</em>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="env-section">
                            {highLevelScope.map((item, index) => (
                                <div className="form-row" key={index}>
                                    <div className="form-group">
                                        <label>{item.label}</label>
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            value={item.value}
                                            onChange={(e) => handleHighLevelScopeChange(index, e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
 
                    {!isEditing ? (
                        <>
                            <label>Products</label>
                            <div className="read-only-products">
                                <ul>
                                    {productData.map((product, index) => (
                                        <li key={index}>
                                            <strong>{product.name}</strong>
                                            <div className="product-images">
                                                {product.images?.map((img, idx) => (
                                                    <span key={idx}>{img.image_name}</span>
                                                ))}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    ) : (
                        <ProductImageSelector
                            productData={productData}
                            selectedImages={selectedImages}
                            searchTerm={productSearchTerm}
                            setSearchTerm={setProductSearchTerm}
                            expandedProduct={expandedProduct}
                            setExpandedProduct={setExpandedProduct}
                            handleProductSelection={handleProductSelection}
                            handleImageToggle={handleImageToggle}
                        />
                    )}
 
                    {!isEditing ? (
                        <>
                            <label>Jars</label>
                            <div className="read-only-jars">
                                {selectedJarRead.map(jar => (
                                    <div key={jar.name}>
                                        {jar.name} - v{jar.version}
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <JarSelector
                            jarSearchTerm={jarSearchTerm}
                            setJarSearchTerm={setJarSearchTerm}
                            filteredJars={filteredJars}
                            expandedJar={expandedJar}
                            setExpandedJar={setExpandedJar}
                            selectedJars={selectedJars}
                            setSelectedJars={setSelectedJars}
                            isEditing={isEditing}
                        />
                    )}
 
                    {isEditing && (
                        <button type="submit" className="save-btn">
                            Save
                        </button>
                    )}
                </form>
            </div>
        </>
    );
}
 
export default PatchPage;