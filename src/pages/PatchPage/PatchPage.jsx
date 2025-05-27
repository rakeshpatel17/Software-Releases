
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
import exportToExcel from '../../api/exportToExcel';
import post_patches from '../../api/post_patches';
import put_patches from '../../api/put_patches';

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
    const [tempHighLevelScope, setTempHighLevelScope] = useState([]);

    //jars
    const [selectedJars, setSelectedJars] = useState([]);
    const [tempSelectedJars, setTempSelectedJars] = useState([]);

    //for converting object into simple names and images
    function conversion(products) {
            const simplifiedSelectedProducts = {};
                    products.forEach(product => {
                        const imageNames = (product.images || []).map(image => image.image_name);
                        simplifiedSelectedProducts[product.name] = imageNames;
                    });
 
                    console.log("Simplified selected products (object):", simplifiedSelectedProducts);
 
                    // ✅ Convert to expected array format
                    const convertedArray = Object.entries(simplifiedSelectedProducts).map(
                        ([product, images]) => ({ product, images })
                    );
 
                    return convertedArray;
    }
    function conversion_for_backend_posting(products) {
        return products.map(({ product, images }) => ({
            name: product,
            images
        }));
    }

    useEffect(() => {
        const fetchData = async () => {
            const products = await getAllProducts();
            // console.log("all products getting :  ",products);
            if (products && products.length > 0) {
                setProductData(products);

                const patchData = await getPatchById(patchName);
                console.log("The updated backend patch data is : ", patchData);
                if (patchData ) {
                    const patch = patchData;
                    setPatchData(patch);
                    setTempPatchData(patch);
                    

                    // const selectedProds = patch.related_products || [];
                    // const selectedImgs = patch.product_images || [];
                    const productImageMap = patch.products || [];
                    const highLevelScopes = patch.scopes || [];
                    const selectedJars = patch.jars || [];
                    // console.log("patch products : :",patch.products);
                    // setSelectedProducts(
                    //     selectedProds.map(prodName => ({
                    //         name: prodName,
                    //         images: products.find(p => p.name === prodName)?.images || []
                    //     }))
                    // );
                    // setSelectedImages(selectedImgs);

                    setSelectedProducts(conversion(productImageMap));
                    console.log("the current selected products : ", conversion(productImageMap));


                    //  Set high level scope labels
                    const HighLevelScope = highLevelScopes.map(scope => ({
                        name: scope.name,
                        version: scope.version,
                        // remarks : scope.remarks
                    }));
                    setHighLevelScope(HighLevelScope);

                    //set jars
                    setSelectedJars(selectedJars.map(jar => ({
                        name: jar.name,
                        version: jar.version,
                        remarks: jar.remarks
                    })));
                }
            }
        };
        fetchData();
    }, [patchName]);



const handleImageToggle = (productName, imageName) => {
  setSelectedProducts(prev => {
    const productIndex = prev.findIndex(p => p.product === productName);

    if (productIndex === -1) {
      // Product not selected, add new with this image
      return [...prev, { product: productName, images: [imageName] }];
    }

    const product = prev[productIndex];
    const hasImage = product.images.includes(imageName);

    if (hasImage) {
      // Remove image from product
      const newImages = product.images.filter(img => img !== imageName);

      if (newImages.length === 0) {
        // No images left, remove whole product
        return prev.filter((_, i) => i !== productIndex);
      }

      // Update product images
      return prev.map((p, i) =>
        i === productIndex ? { ...p, images: newImages } : p
      );
    } else {
      // Add image to product
      return prev.map((p, i) =>
        i === productIndex ? { ...p, images: [...p.images, imageName] } : p
      );
    }
  });
};
const handleProductSelection = (product, checked) => {
  setSelectedProducts(prev => {
    if (checked) {
      // Add or replace product with all its images
      const filtered = prev.filter(p => p.product !== product.name);
      return [...filtered, { product: product.name, images: product.images.map(img => img.image_name) }];
    } else {
      // Remove product
      return prev.filter(p => p.product !== product.name);
    }
  });
};


    useEffect(() => {
        if (isEditing) {
            setTempHighLevelScope(highLevelScope);
        }
    }, [isEditing]);

    const handleScopeChange = (index, newValue) => {
        const updatedScope = [...tempHighLevelScope];
        updatedScope[index].value = newValue;
        setTempHighLevelScope(updatedScope);
        console.log("updated scope:", updatedScope)
    };


    // useEffect(() => {
    //     const fetchProducts = async () => {

    //         const data = await getAllProducts();
    //         console.log("again products all : ", data);
    //         if (data && data.length > 0) {
    //             setProductData(data);
    //         }
    //     };
    //     fetchProducts();
    // }, []);

    // const filteredProducts = productData.filter((product) =>
    //     product.name.toLowerCase().includes(productSearchTerm.toLowerCase())
    // );



    useEffect(() => {
        setTempSelectedJars(selectedJars);
        setTempHighLevelScope(highLevelScope);
    }, [selectedJars, highLevelScope]);



    const toggleEdit = () => {
        if (isEditing) {
            // If exiting edit mode, discard changes and reset to original state
            setTempPatchData(patchData);
            setTempSelectedJars(selectedJars);
            setTempHighLevelScope(highLevelScope);
        }
        setIsEditing(!isEditing);
    };



    // const handleJarChange = (index, field, value) => {
    //     const updatedJars = [...tempSelectedJars];
    //     updatedJars[index][field] = value;
    //     setTempSelectedJars(updatedJars);
    // };

    const getProgressValue = (state) => {
        switch (state) {
            case 'new': return 30;
            case 'verified': return 50;
            case 'released': return 100;
            default: return 0;
        }
    };
    const handleSave = async (e) => {
        e.preventDefault();
        console.log("Save button clicked");
        console.log("selectedProducts", selectedProducts);
        // console.log("selectedImages", selectedImages);
        // console.log("temp high level data : ", tempHighLevelScope);
        // console.log("final their set ,", highLevelScope);
        try {
            const payload = {
                ...tempPatchData,
                // related_products: selectedProducts.map(p => p.name),
                // product_images: selectedImages,
                products_data:conversion_for_backend_posting(selectedProducts),
                jars_data: tempSelectedJars,
                scopes_data: tempHighLevelScope
            };
            console.log("PUT payload:", payload);

            await put_patches(patchName, payload); // <-- Make sure this API function is correct

            setPatchData(payload); // update local state with saved data
            setSelectedJars(tempSelectedJars);
            setHighLevelScope(tempHighLevelScope);
            setSelectedProducts(selectedProducts);
            // console.log("fetched products after save:", productData);
            console.log("selected products after save:", selectedProducts);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save patch data:", error);
        }
    };




    /* asks for qba while changing state to released */
    const handleStateChange = (e) => {
        const newState = e.target.value;

        // If changing to "released" from a different state
        if (newState === 'released' && tempPatchData.patch_state !== 'released') {
            const desc = window.prompt('Enter KBA link:');
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


    // Get current date
    const getDate = () => {
        const today = new Date();

        // Extract day, month, and year
        let day = today.getDate();
        let month = today.getMonth() + 1;
        let year = today.getFullYear();

        // Add leading zero to day and month if needed
        day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0' + month : month;

        // Format the date as dd/mm/yyyy
        const formattedDate = `${day}-${month}-${year}`;
        return formattedDate;
    }

   

    return (
        <>

            <div className="patch-page">
                <div className="patch-header">
                    <h2>Patch Details</h2>
                    {/* Button to export data */}
                    <div className='edit-export'>
                        <button
                            className="export-btn"
                            onClick={() => exportToExcel(patchData.products, `${patchName}_vulnerabilities_${getDate()}`)}
                        >
                            Export
                        </button>
                        {patchData.patch_state !== 'released' && (
                            <button className="edit-btn" onClick={toggleEdit}>
                                {isEditing ? 'Cancel' : 'Edit'}
                            </button>
                        )}
                    </div>
                </div>

                <form className="patch-form" onSubmit={handleSave}>
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
                                value={tempPatchData.code_freeze || ''}
                                disabled={!isEditing}
                                onChange={e => setTempPatchData({ ...tempPatchData, code_freeze: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Platform QA Build</label>
                            <input
                                type="date"
                                value={tempPatchData.platform_qa_build || ''}
                                disabled={!isEditing}
                                onChange={e => setTempPatchData({ ...tempPatchData, platform_qa_build: e.target.value })}
                            />
                        </div>
                    </div>

                    <HighLevelScopeComponent
                        highLevelScope={highLevelScope}
                        //  onScopeChange={handleScopeChange}
                        setHighLevelScope={setHighLevelScope}
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

                    {!isEditing? (
                        // Read-only mode
                        <>
                            <label>Products</label>
                            <ProductImageSelector
                                productData={productData}
                                selectedImages={[]}           // Not used in read mode
                                searchTerm=""
                                setSearchTerm={() => { }}
                                expandedProduct={expandedProduct}
                                setExpandedProduct={setExpandedProduct}
                                handleProductSelection={() => { }}
                                handleImageToggle={() => { }}
                                patchSpecificImages={selectedProducts} // Show patch images
                                mode="read"                        // Use mode prop instead of readOnly
                            />
                        </>
                    ) : (
                        // Edit mode with prepopulating
                        <ProductImageSelector
                            productData={productData}
                            selectedImages={selectedProducts}     // Pre-selected images passed here
                            searchTerm={productSearchTerm}
                            setSearchTerm={setProductSearchTerm}
                            expandedProduct={expandedProduct}
                            setExpandedProduct={setExpandedProduct}
                            handleProductSelection={handleProductSelection}
                            handleImageToggle={handleImageToggle}
                            patchSpecificImages={selectedProducts} // For filtering images in edit
                            mode="edit-prepopulated"            // Mode set to editable with prepopulate
                        />
                    )}


                    {isEditing && (
                        <div className='form-actions'>
                            <CancelButton />
                            <SaveButton />
                        </div>
                    )}
                </form>
            </div>
        </>
    );


}

export default PatchPage;


