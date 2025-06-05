
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
import get_patch_progress from '../../api/get_patch_progress';

function PatchPage() {
    const { patchName } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [patchData, setPatchData] = useState({});
    const [tempPatchData, setTempPatchData] = useState({});


    const [selectedRelease, setSelectedRelease] = useState("");
    const [versionName, SetversionName] = useState("");

    //products  
    const [productData, setProductData] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    //scope
    const [highLevelScope, setHighLevelScope] = useState([]);
    const [tempHighLevelScope, setTempHighLevelScope] = useState([]);

    //jars
    const [selectedJars, setSelectedJars] = useState([]);
    const [tempSelectedJars, setTempSelectedJars] = useState([]);

    const [progress, setProgress] = useState(null);
    useEffect(() => {
        const fetchProgress = async () => {
            const result = await get_patch_progress(patchName);
            console.log(`Patch ${patchName} progress: ${result}%`);
            setProgress(result); // result should be a number like 33.33
        };

        if (patchName) fetchProgress();
    }, [patchName]);

    useEffect(() => {
        const fetchData = async () => {
            const products = await getAllProducts();
            // console.log("all products getting :  ",products);
            if (products && products.length > 0) {
                let releaseObj;
                if (selectedRelease) {
                    releaseObj = products.find(obj => Object.keys(obj)[0] === selectedRelease);
                }
                if (!releaseObj) releaseObj = products[0]; // fallback

                const releaseKey = Object.keys(releaseObj)[0];
                const releaseProducts = releaseObj[releaseKey];

                setSelectedRelease(releaseKey);
                setProductData(releaseProducts);

                const patchData = await getPatchById(patchName);
                // console.log("The updated backend patch data is : ", patchData);
                if (patchData) {
                    const patch = patchData;
                    setPatchData(patch);
                    setTempPatchData(patch);


                    const productImageMap = patch.products || [];
                    const highLevelScopes = patch.scopes || [];
                    const selectedJars = patch.jars || [];

                    setSelectedProducts(productImageMap);
                    // console.log("the current selected products : ", selectedProducts);
                    // console.log("the current selected productimagemap : ", productImageMap);


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





    useEffect(() => {
        if (isEditing) {
            setTempHighLevelScope(highLevelScope);
        }
    }, [isEditing]);






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

    // const getProgressValue = async (id) => {
    //     const progress = await get_patch_progress(id);
    //     console.log(`Patch ${patchName} progress: ${progress}%`);
    //     return progress;
    // };
    const handleSave = async (e) => {
        e.preventDefault();
        console.log("Save button clicked");
        console.log("selectedProducts", selectedProducts);
        // console.log("selectedImages", selectedImages);
        // console.log("temp high level data : ", tempHighLevelScope);
        // console.log("final their set ,", highLevelScope);
        const transformedProducts = selectedProducts.map(product => ({
            name: product.name,
            images: product.images.map(img => ({
                ...img,
                ot2_pass: "Not Released",
                registry: "Not Released",
                helm_charts: "Not Released",
                patch_build_number: tempPatchData.name
            }))
        }));

        try {
            const payload = {
                ...tempPatchData,
                products_data: transformedProducts,
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
            // console.log("selected products after save:", selectedProducts);
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


    const transformedProducts = productData.map(item => ({
        name: item.products_data.name,
        images: item.products_data.images.map(img => ({
            image_name: img.imagename
        }))
    }));
    const handleReleaseChange = (newRelease) => {
        // For example, update a state that triggers fetching products
        setSelectedRelease(newRelease);
    };



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
                                onChange={e => {
                                    const newRelease = e.target.value;
                                    setTempPatchData({ ...tempPatchData, release: newRelease });
                                    handleReleaseChange(newRelease);
                                }}
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
                        <ProgressBar value={progress} label="Patch Progress" redirectTo={`/progress/${patchName}`} />
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
                                
                                mode="read"
                                products={transformedProducts}
                                selectedProducts={selectedProducts} // images to show as selected
                            />

                        </>
                    ) : (
                        // Edit mode with prepopulating

                        <ProductImageSelector
                            mode="editPrepopulate"
                            products={transformedProducts}
                            selectedProducts={selectedProducts} // already selected images for this patch
                            onSelectionChange={(selectedProducts) => {
                                setSelectedProducts(selectedProducts);
                                console.log("from patchpage parent", selectedProducts);
                            }}
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


