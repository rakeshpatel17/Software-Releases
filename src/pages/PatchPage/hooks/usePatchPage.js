import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';

import { getPatchById } from '../../../api/getPatchById';
import { AllReleaseProductImage } from '../../../api/AllReleaseProductImage';
import get_patch_progress from '../../../api/get_patch_progress';
import put_patches from '../../../api/put_patches';

import { dismissibleError } from '../../../components/Toast/customToast';
import { dismissibleSuccess } from '../../../components/Toast/customToast';

// Helper date functions
const getPreviousDate = (dateStr, days) => { if (!dateStr) return ''; const d = new Date(dateStr); d.setDate(d.getDate() - days); return d.toISOString().split('T')[0]; };
const getFutureDate = (baseDateStr, releaseDateStr, days) => { if (!baseDateStr || !releaseDateStr) return ''; const d = new Date(baseDateStr); d.setDate(d.getDate() + days); const r = new Date(releaseDateStr); return d > r ? r.toISOString().split('T')[0] : d.toISOString().split('T')[0]; };

export function usePatchPage() {
    const { patchName } = useParams();
    const { setTitle } = useOutletContext();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [progress, setProgress] = useState(null);

    // Reverting to the original's stable, separate state structure.
    const [patchData, setPatchData] = useState({});
    const [tempPatchData, setTempPatchData] = useState({});
    const [allPossibleProducts, setAllPossibleProducts] = useState([]);
    
    // States for selected items, initialized as empty arrays to prevent crashes.
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [highLevelScope, setHighLevelScope] = useState([]);
    const [selectedJars, setSelectedJars] = useState([]);

    // Temporary states for editing
    const [tempSelectedProducts, setTempSelectedProducts] = useState([]);
    const [tempHighLevelScope, setTempHighLevelScope] = useState([]);
    const [tempSelectedJars, setTempSelectedJars] = useState([]);


  useEffect(() => {
        const fetchData = async () => {
            if (!patchName) return;
            setIsLoading(true);
            try {
                // --- STEP 1: Fetch only the FAST data first ---
                // We separate the slow `AllReleaseProductImage` call from the initial load.
                const [patch, progressValue] = await Promise.all([
                    getPatchById(patchName),
                    get_patch_progress(patchName),
                ]);

                if (!patch) {
                    // toast.error(`Patch "${patchName}" not found.`);
                    dismissibleError(`Patch "${patchName}" not found.`)
                    navigate('/');
                    return;
                }
                
                // --- STEP 2: Set the initial state immediately ---
                // This makes the main page content appear almost instantly.
                setPatchData(patch);
                setTempPatchData(patch);
                
                const products = patch.products || [];
                const scopes = patch.scopes || [];
                const jars = patch.jars || [];

                setSelectedProducts(products);
                setHighLevelScope(scopes);
                setSelectedJars(jars);

                setTempSelectedProducts(products);
                setTempHighLevelScope(scopes);
                setTempSelectedJars(jars);
                
                setProgress(progressValue);
                setTitle(`Patch Details Of ${patch.name}`);

                // --- STEP 3: Stop the main loading spinner ---
                // The user now sees the page and can interact with it.
                setIsLoading(false);

                // --- STEP 4: Now, fetch the SLOW image data in the background ---
                const allImages = await AllReleaseProductImage();
                const imagesForRelease = allImages.filter(img => img.release === patch.release);

                const groupedByProduct = imagesForRelease.reduce((acc, img) => {
                    if (!acc[img.product]) acc[img.product] = [];
                    acc[img.product].push({ imagename: img.image_name });
                    return acc;
                }, {});

                // --- STEP 5: Update the state with the product data ---
                // The `ProductImageSelector` component will now populate with options.
                setAllPossibleProducts(Object.keys(groupedByProduct).map(name => ({ name, images: groupedByProduct[name] })));

            } catch (error) {
                console.error("Failed to fetch patch page data:", error);
                // toast.error("Could not load patch data.");
                dismissibleError("Could not load patch data.")
                setIsLoading(false); // Also stop loading on error
            }
        };
        fetchData();
    }, [patchName, setTitle, navigate]);

    
    useEffect(() => {
        if (tempPatchData?.release_date) {
            const kick_off = getPreviousDate(tempPatchData.release_date, 14);
            const code_freeze = getFutureDate(kick_off, tempPatchData.release_date, 4);
            const platform_qa_build = getFutureDate(code_freeze, tempPatchData.release_date, 4);
            const client_build_availability = getFutureDate(platform_qa_build, tempPatchData.release_date, 2);
            setTempPatchData(prev => ({ ...prev, kick_off, code_freeze, platform_qa_build, client_build_availability }));
        }
    }, [tempPatchData?.release_date]);

    const transformedProductsForSelector = useMemo(() => allPossibleProducts.map(item => ({
        name: item.name,
        images: (item.images || []).map(img => ({ image_name: img.imagename }))
    })), [allPossibleProducts]);

    const toggleEdit = () => {
        if (isEditing) {
            // Revert all temporary states to their master versions
            setTempPatchData(patchData);
            setTempSelectedProducts(selectedProducts);
            setTempHighLevelScope(highLevelScope);
            setTempSelectedJars(selectedJars);
        }
        setIsEditing(!isEditing);
    };

    const handleSave = async (e) => {
        e.preventDefault();
         // Check if any scope in the temporary (editing) state is empty.
        const hasEmptyScope = tempHighLevelScope.some(scope => !scope.name.trim() || !scope.version.trim());
        if (hasEmptyScope) {
            // toast.error('All High Level Scope entries must have both a name and a version to save.');
            dismissibleError('All High Level Scope entries must have both a name and a version to save.')
            return; // Stop the save
        }
        
        // Check if any JAR in the temporary (editing) state is empty. Remarks are optional.
        const hasEmptyJar = tempSelectedJars.some(jar => !jar.name.trim() || !jar.version.trim());
        if (hasEmptyJar) {
            // toast.error('All Third Party JAR entries must have both a name and a version to save.');
            dismissibleError('All Third Party JAR entries must have both a name and a version to save.')
            return; // Stop the save
        }
        try {
            // Assemble the payload from the temporary states, just like the original
            const payload = {
                ...tempPatchData,
                products_data: tempSelectedProducts,
                scopes_data: tempHighLevelScope,
                jars_data: tempSelectedJars,
            };
            console.log("payload for saving patch",payload);
            await put_patches(patchName, payload);
            // toast.success('Patch updated successfully!');
            dismissibleSuccess('Patch updated successfully!')

            // On success, promote all temp states to be the new master states
            setPatchData(tempPatchData);
            setSelectedProducts(tempSelectedProducts);
            setHighLevelScope(tempHighLevelScope);
            setSelectedJars(tempSelectedJars);
            
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save patch data:", error);
            // toast.error(error.response?.data?.message || 'Failed to update patch.');
            dismissibleError(error.response?.data?.message || 'Failed to update patch.')
        }
    };

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setTempPatchData(prev => ({ ...prev, [name]: value }));
    }, []);

     const handleStateChange = (e) => {
        const newState = e.target.value;

        if (newState === 'released' && tempPatchData.patch_state !== 'released') {
            const kbaLink = window.prompt('A KBA link is required to mark a patch as "Released". Please enter the link:');
            // Check if user clicked OK and provided a non-empty link
            if (kbaLink !== null && kbaLink.trim() !== '') {
                setTempPatchData(prev => ({
                    ...prev,
                    patch_state: newState,
                    kba: kbaLink.trim(),
                }));
            } else {
                // If user clicks cancel or enters an empty string
                // toast.error('State change cancelled. KBA link is required.');
                dismissibleError('State change cancelled. KBA link is required.')
                // Do not change the state
            }
        } else {
            // For all other state transitions
            setTempPatchData(prev => ({
                ...prev,
                patch_state: newState,
            }));
        }
    };

    return {
        isLoading, isEditing, patchData, tempPatchData, progress,
        transformedProductsForSelector,
        // Pass the correct state based on edit mode
        displayProducts: isEditing ? tempSelectedProducts : selectedProducts,
        displayScope: isEditing ? tempHighLevelScope : highLevelScope,
        displayJars: isEditing ? tempSelectedJars : selectedJars,
        handlers: {
            toggleEdit, handleSave, handleChange, handleStateChange,
            // Pass the temporary state setters for editing
            setTempSelectedProducts, setTempHighLevelScope, setTempSelectedJars
        }
    };
}