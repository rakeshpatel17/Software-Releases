

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
    const data = [
        {
            "name": "Server",
            "version": "1.0",
            "status": "Active",
            "is_deleted": false,
            "created_at": "2025-04-29T05:20:30.839549Z",
            "updated_at": "2025-05-06T04:19:59.277104Z",
            "images": [
                {
                    "image_name": "ot-dctm-ijms",
                    "build_number": "24.2.0002.0175",
                    "release_date": "2025-05-23T10:16:00Z",
                    "ot2_pass": "Yes",
                    "twistlock_report_url": "https://turl2.com",
                    "twistlock_report_clean": false,
                    "is_deleted": false,
                    "product": "Server",
                    "created_at": "2025-05-06T04:47:06.927926Z",
                    "updated_at": "2025-05-06T04:47:06.928127Z",
                    "security_issues": [
                        {
                            "cve_id": "CVE-2024-22243",
                            "cvss_score": 4.0,
                            "severity": "Critical",
                            "affected_libraries": "org.springframework:spring-web",
                            "library_path": "/bin",
                            "description": "Coming from the base OS in sysdig scan and twistlock scan",
                            "created_at": "2025-05-06T04:53:21.045626Z",
                            "updated_at": "2025-05-06T04:53:21.045817Z",
                            "is_deleted": false
                        },
                        {
                            "cve_id": "CVE-2024-22259",
                            "cvss_score": 4.0,
                            "severity": "Critical",
                            "affected_libraries": "org.springframework:spring-web",
                            "library_path": "/bin",
                            "description": "Coming from the base OS in sysdig scan and twistlock scan",
                            "created_at": "2025-05-06T04:53:46.398707Z",
                            "updated_at": "2025-05-06T04:53:46.398922Z",
                            "is_deleted": false
                        }
                    ]
                }
            ],
            "related_patches": [
                "24.2.2",
                "24.2.3"
            ]
        },
        {
            "name": "Ijms",
            "version": "1.0",
            "status": "Active",
            "is_deleted": false,
            "created_at": "2025-04-29T05:21:04.963277Z",
            "updated_at": "2025-05-06T04:22:00.070064Z",
            "images": [
                {
                    "image_name": "ot-dctm-ijms",
                    "build_number": "24.2.0002.0137",
                    "release_date": "2025-05-28T10:18:00Z",
                    "ot2_pass": "Yes",
                    "twistlock_report_url": "http://example.com/report",
                    "twistlock_report_clean": false,
                    "is_deleted": false,
                    "product": "Ijms",
                    "created_at": "2025-05-06T04:48:31.954493Z",
                    "updated_at": "2025-05-06T04:48:31.954630Z",
                    "security_issues": [
                        {
                            "cve_id": "CVE-2024-22262",
                            "cvss_score": 4.0,
                            "severity": "Critical",
                            "affected_libraries": "org.springframework:spring-web",
                            "library_path": "/bin",
                            "description": "Coming from the base OS in sysdig scan and twistlock scan",
                            "created_at": "2025-05-06T04:54:00.776950Z",
                            "updated_at": "2025-05-06T04:54:00.777178Z",
                            "is_deleted": false
                        },
                        {
                            "cve_id": "CVE-2024-22243",
                            "cvss_score": 4.0,
                            "severity": "Critical",
                            "affected_libraries": "org.springframework:spring-web",
                            "library_path": "/bin",
                            "description": "Coming from the base OS in sysdig scan and twistlock scan",
                            "created_at": "2025-05-06T04:54:10.243657Z",
                            "updated_at": "2025-05-06T04:54:10.243879Z",
                            "is_deleted": false
                        }
                    ]
                }
            ],
            "related_patches": [
                "24.2.2"
            ]
        },
        {
            "name": "D2",
            "version": "1.0",
            "status": "Active",
            "is_deleted": false,
            "created_at": "2025-04-29T05:21:56.713925Z",
            "updated_at": "2025-05-06T04:22:54.588101Z",
            "images": [
                {
                    "image_name": "ot-dctm-d2cp-installer",
                    "build_number": "24.2.0002.0157",
                    "release_date": "2025-05-31T10:18:00Z",
                    "ot2_pass": "Yes",
                    "twistlock_report_url": "http://example.com/report",
                    "twistlock_report_clean": false,
                    "is_deleted": false,
                    "product": "D2",
                    "created_at": "2025-05-06T04:50:36.645578Z",
                    "updated_at": "2025-05-06T04:50:36.645821Z",
                    "security_issues": [
                        {
                            "cve_id": "CVE-2021-22569",
                            "cvss_score": 7.5,
                            "severity": "High",
                            "affected_libraries": "com.google.protobuf_protobuf-java_2.5.0:gwt-servlet-ot-jak-mig-2.9.0.jar",
                            "library_path": "/opt/d2config/D2.war/gwt-servlet-ot-jak-mig-2.9.0.jar",
                            "description": "Coming from the base OS in sysdig scan and twistlock scan",
                            "created_at": "2025-05-06T04:55:15.148485Z",
                            "updated_at": "2025-05-06T04:55:15.148637Z",
                            "is_deleted": false
                        },
                        {
                            "cve_id": "CVE-2021-22570",
                            "cvss_score": 5.7,
                            "severity": "Medium",
                            "affected_libraries": "com.google.code.gson_gson_2.6.2:gwt-servlet-deps-2.9.0.jar",
                            "library_path": "/opt/d2config/D2.war/gwt-servlet-deps-2.9.0.jar",
                            "description": "Coming from the base OS",
                            "created_at": "2025-05-06T04:56:05.666846Z",
                            "updated_at": "2025-05-06T04:56:05.667010Z",
                            "is_deleted": false
                        }
                    ]
                },
                {
                    "image_name": "ot-dctm-d2cp-classic",
                    "build_number": "24.2.0002.0157",
                    "release_date": "2025-06-01T10:18:00Z",
                    "ot2_pass": "Yes",
                    "twistlock_report_url": "http://example.com/report",
                    "twistlock_report_clean": true,
                    "is_deleted": false,
                    "product": "D2",
                    "created_at": "2025-05-06T04:51:28.024542Z",
                    "updated_at": "2025-05-06T04:51:28.024773Z",
                    "security_issues": []
                }
            ],
            "related_patches": [
                "24.2.2",
                "24.2.3"
            ]
        }
    ];
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

                    // const selectedProds = patch.related_products || [];
                    // const selectedImgs = patch.product_images || [];
                    const productImageMap = patch.patch_product_images || [];
                    const highLevelScopes = patch.high_level_scope || [];
                    const selectedJars = patch.third_party_jars || [];

                    // setSelectedProducts(
                    //     selectedProds.map(prodName => ({
                    //         name: prodName,
                    //         images: products.find(p => p.name === prodName)?.images || []
                    //     }))
                    // );
                    // setSelectedImages(selectedImgs);

                    setSelectedProducts(productImageMap);


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
        try {
            const payload = {
                ...tempPatchData,
                // related_products: selectedProducts.map(p => p.name),
                // product_images: selectedImages,
                patch_product_images_input:selectedProducts,
                third_party_jars_input: tempSelectedJars,
                high_level_scope_input: tempHighLevelScope.map(scope => ({
                    name: scope.label,
                    version: scope.value
                }))
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
                            onClick={() => exportToExcel(data, `${patchName}_vulnerabilities_${getDate()}`)}
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

                    {!isEditing ? (
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


