

import React, { useState, useEffect } from 'react';
import ProductImageSelector from '../components/ProductImageSelector';
import JarSelector from '../components/JarSelector';
import ProgressBar from '../components/ProgressBar';
import HighLevelScopeComponent from '../components/HighLevelScope';
import './PatchPage.css';
import getAllProducts from '../api/product';
import { getPatchById } from '../api/getPatchById';
import BackButtonComponent from '../components/BackButtonComponent';

function PatchPage({ patchName }) {
    const [isEditing, setIsEditing] = useState(false);
    const [patchData, setPatchData] = useState({});
    const [selectedJars, setSelectedJars] = useState([
        { name: 'log4j', version: '2.1', remarks: 'Major upgrade' },
        { name: 'commons-io', version: '2.2', remarks: 'Minor upgrade' },
        { name: 'guava', version: '3.1', remarks: 'Security patch applied' },
        { name: 'slf4j', version: '1.7', remarks: 'No change' }
    ]);
    const [highLevelScope, setHighLevelScope] = useState([
        { label: 'Base OS', value: '' },
        { label: 'Tomcat', value: '' },
        { label: 'JDK', value: '' },
        { label: 'OTDS', value: '' },
        { label: 'New Relic', value: '' }
    ]);

    const [tempPatchData, setTempPatchData] = useState({});
    const [tempSelectedJars, setTempSelectedJars] = useState([]);
    const [tempHighLevelScope, setTempHighLevelScope] = useState([]);

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

    useEffect(() => {
        const fetchPatch = async () => {
            const data = await getPatchById(patchName);
            if (data && data.length > 0) {
                setPatchData(data[0]);
                setTempPatchData(data[0]);
            } else {
                setPatchData({});
                setTempPatchData({});
            }
        };
        fetchPatch();
    }, [patchName]);

    useEffect(() => {
        setTempSelectedJars(selectedJars);
        setTempHighLevelScope(highLevelScope);
    }, [selectedJars, highLevelScope]);

    useEffect(() => {
        const fetchProducts = async () => {

            const data = await getAllProducts();
            if (data && data.length > 0) {
                setProductData(data);
            }
        };
        fetchProducts();
    }, []);

    const toggleEdit = () => {
        if (isEditing) {
            // If exiting edit mode, discard changes and reset to original state
            setTempPatchData(patchData);
            setTempSelectedJars(selectedJars);
            setTempHighLevelScope(highLevelScope);
        }
        setIsEditing(!isEditing);
    };

    const handleScopeChange = (index, newValue) => {
        const updatedScope = [...tempHighLevelScope];
        updatedScope[index].value = newValue;
        setTempHighLevelScope(updatedScope);
    };

    const handleJarChange = (index, field, value) => {
        const updatedJars = [...tempSelectedJars];
        updatedJars[index][field] = value;
        setTempSelectedJars(updatedJars);
    };

    const getProgressValue = (state) => {
        switch (state) {
            case 'new': return 30;
            case 'verified': return 50;
            case 'released': return 100;
            default: return 0;
        }
    };

    const handleSave = () => {
        setPatchData(tempPatchData);
        setSelectedJars(tempSelectedJars);
        setHighLevelScope(tempHighLevelScope);
        setIsEditing(false);
    };

    return (
        <> 
        <div className='back_button'>
        <BackButtonComponent  fallback={0}/>
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
                            <label>Release</label>
                            <input
                                type="text"
                                value={tempPatchData.release || ''}
                                disabled={!isEditing}
                                onChange={e => setTempPatchData({ ...tempPatchData, release: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Version</label>
                            <input
                                type="text"
                                value={tempPatchData.name || ''}
                                disabled={!isEditing}
                                onChange={e => setTempPatchData({ ...tempPatchData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Release Date</label>
                            <input
                                type="date"
                                value={tempPatchData.release_date || ''}
                                disabled={!isEditing}
                                onChange={e => setTempPatchData({ ...tempPatchData, release_date: e.target.value })}
                                min={new Date().toISOString().split("T")[0]}
                            />
                        </div>
                        <div className="form-group">
                            <label>Code Freeze Date</label>
                            <input
                                type="date"
                                value={tempPatchData.release_date || ''}
                                disabled={!isEditing}
                                onChange={e => setTempPatchData({ ...tempPatchData, release_date: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Platform QA Build</label>
                            <input
                                type="date"
                                value={tempPatchData.release_date || ''}
                                disabled={!isEditing}
                                onChange={e => setTempPatchData({ ...tempPatchData, release_date: e.target.value })}
                            />
                        </div>
                    </div>

                    <HighLevelScopeComponent
                        highLevelScope={tempHighLevelScope}
                        onScopeChange={handleScopeChange}
                        isEditing={isEditing}
                    />

                    <JarSelector
                        mode="edit"
                        selectedJars={selectedJars}
                        setSelectedJars={setSelectedJars}
                        isEditing={isEditing}
                    />

                <div className="progress-container">
                            <ProgressBar value={getProgressValue(patchData.patch_state)} label="Patch Progress" redirectTo={`/progress/${patchName}`} />
                        </div>
                    <div className="form-group">
                        <label>Patch State</label>
                        <select
                            value={tempPatchData.patch_state || 'New'}
                            disabled={!isEditing}
                            onChange={e => setTempPatchData({ ...tempPatchData, patch_state: e.target.value })}
                        >
                            <option value="new">New</option>
                            <option value="rejected">Rejected</option>
                            <option value="verified">Verified</option>
                            <option value="released">Released</option>
                        </select>
                    </div>

                    <label>Description</label>
                    <textarea
                        value={tempPatchData.description || ''}
                        disabled={!isEditing}
                        onChange={e => setTempPatchData({ ...tempPatchData, description: e.target.value })}
                    />

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

                    {isEditing && (
                        <button type="button" className="save-btn" onClick={handleSave}>
                            Save
                        </button>
                    )}
                </form>
            </div>
        </>
    );

    
}

export default PatchPage;


