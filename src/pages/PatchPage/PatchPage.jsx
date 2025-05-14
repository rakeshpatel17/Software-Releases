

import React, { useState, useEffect, version } from 'react';
import ProductImageSelector from '../../components/ProductImageSelector/ProductImageSelector';
import JarSelector from '../../components/JarSelector/JarSelector';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import HighLevelScopeComponent from '../../components/HighLevelScope/HighLevelScope';
import './PatchPage.css';
import getAllProducts from '../../api/product';
import { getPatchById } from '../../api/getPatchById';
import { useOutletContext } from "react-router-dom";
import { useParams } from 'react-router-dom';
import CancelButton from '../../components/Button/CancelButton';
import SaveButton from '../../components/Button/SaveButton';

function PatchPage() {
    const { patchName } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [patchData, setPatchData] = useState({});
    const [tempPatchData, setTempPatchData] = useState({});

    //products
    const [productSearchTerm, setProductSearchTerm] = useState('');
    const [expandedProduct, setExpandedProduct] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [productData, setProductData] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    //scope
    const [highLevelScope, setHighLevelScope] = useState([]);
    //  const [tempHighLevelScope, setTempHighLevelScope] = useState([]);

    //jars
    const [selectedJars, setSelectedJars] = useState([
        // { name: 'log4j', version: '2.1', remarks: 'Major upgrade' },
        // { name: 'commons-io', version: '2.2', remarks: 'Minor upgrade' },
        // { name: 'guava', version: '3.1', remarks: 'Security patch applied' },
        // { name: 'slf4j', version: '1.7', remarks: 'No change' }
    ]);
    const [tempSelectedJars, setTempSelectedJars] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            const products = await getAllProducts();
            if (products && products.length > 0) {
                setProductData(products);

                const patchData = await getPatchById(patchName);
                if (patchData && patchData.length > 0) {
                    const patch = patchData[0];
                    setPatchData(patch);
                    setTempPatchData(patch);

                    const selectedProds = patch.related_products || [];
                    const selectedImgs = patch.product_images || [];
                    const highLevelScopes = patch.high_level_scope || [];
                    const selectedJars = patch.third_party_jars || [];

                    setSelectedProducts(
                        selectedProds.map(prodName => ({
                            name: prodName,
                            images: products.find(p => p.name === prodName)?.images || []
                        }))
                    );
                    setSelectedImages(selectedImgs);

                    //  Set high level scope labels
                    const HighLevelScope = highLevelScopes.map(scope => ({
                        label: scope.name,
                        value: scope.version
                    }));
                    setHighLevelScope(HighLevelScope);

                    //set jars
                    setSelectedJars(selectedJars.map(jar => ({
                        name: jar.name,
                        version: jar.version,
                        remarks: jar.version
                    })));
                }
            }
        };
        fetchData();
    }, [patchName]);




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

    useEffect(() => {
        const fetchProducts = async () => {

            const data = await getAllProducts();
            if (data && data.length > 0) {
                setProductData(data);
            }
        };
        fetchProducts();
    }, []);

    // const filteredProducts = productData.filter((product) =>
    //     product.name.toLowerCase().includes(productSearchTerm.toLowerCase())
    // );



    useEffect(() => {
        setTempSelectedJars(selectedJars);
        // setTempHighLevelScope(highLevelScope);
    }, [selectedJars, highLevelScope]);



    const toggleEdit = () => {
        if (isEditing) {
            // If exiting edit mode, discard changes and reset to original state
            setTempPatchData(patchData);
            setTempSelectedJars(selectedJars);
            // setTempHighLevelScope(highLevelScope);
        }
        setIsEditing(!isEditing);
    };

    // const handleScopeChange = (index, newValue) => {
    //     const updatedScope = [...tempHighLevelScope];
    //     updatedScope[index].value = newValue;
    //     setTempHighLevelScope(updatedScope);
    // };

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
        setHighLevelScope(highLevelScope);
        setIsEditing(false);
    };

    /* asks for qba while changing state to released */
    const handleStateChange = (e) => {
        const newState = e.target.value;

        // If changing to "released" from a different state
        if (newState === 'released' && tempPatchData.patch_state !== 'released') {
            const desc = window.prompt('Enter a description for the released patch:');
            if (desc !== null && desc.trim() !== '') {
                setTempPatchData({
                    ...tempPatchData,
                    patch_state: newState,
                    description: desc.trim(),
                });
            } else {
                // Cancel the selection back to original state
                alert('Release description is required.');
            }
        } else {
            // For other state transitions
            setTempPatchData({
                ...tempPatchData,
                patch_state: newState,
            });
        }
    };

    const { setTitle } = useOutletContext();

    useEffect(() => {
        if (tempPatchData.name) {
            setTitle(`Patch Details Of ${tempPatchData.name}`);
        }
    }, [tempPatchData.name, setTitle]);


    return (
        <>

            <div className="patch-page">
                <div className="patch-header">
                    <h2>Patch Details</h2>
                    {patchData.patch_state !== 'released' && (
                        <button className="edit-btn" onClick={toggleEdit}>
                            {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                    )}
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
                        highLevelScope={highLevelScope}
                        // onScopeChange={handleScopeChange}
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
                            disabled={!isEditing || tempPatchData.patch_state === 'released'}
                            // onChange={e => setTempPatchData({ ...tempPatchData, patch_state: e.target.value })}
                            onChange={handleStateChange}
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
                        disabled={!isEditing || tempPatchData.patch_state === 'released'}
                        onChange={e => setTempPatchData({ ...tempPatchData, description: e.target.value })}
                    />

                    {!isEditing ? (
                        <>
                            <label>Products</label>
                            <div className="read-only-products">
                                {selectedProducts.length === 0 ? (
                                    <p>No products under this patch.</p>
                                ) : (
                                    <ul>
                                        {selectedProducts.map((product, index) => (
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
                                )}
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
                        <div className='form-actions'>
                            <CancelButton />
                            <SaveButton onClick={handleSave} />
                        </div>
                    )}
                </form>
            </div>
        </>
    );


}

export default PatchPage;


