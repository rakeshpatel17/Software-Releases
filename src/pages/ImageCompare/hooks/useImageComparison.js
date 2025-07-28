import { useState, useEffect } from 'react';
import get_patches from '../../../api/patches';
import getImageDetails from '../../../api/imageDetails';


import { dismissibleError } from '../../../components/Toast/customToast';
import { dismissibleSuccess } from '../../../components/Toast/customToast';

export const useImageComparison = (setTitle) => {
    const [patch1, setPatch1] = useState('');
    const [patch2, setPatch2] = useState('');
    const [comparedImages, setComparedImages] = useState([]);
    const [patches, setPatches] = useState([]);
    const [showComparison, setShowComparison] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // This effect runs once on component mount to fetch the list of all available patches.
    useEffect(() => {
        const fetchData = async () => {
            const data = await get_patches();
            setPatches(Array.isArray(data) ? data : []);
        };
        fetchData();
    }, []);

    // This effect sets the page title.
    useEffect(() => {
        setTitle('Image Comparison');
    }, [setTitle]);

    // A simple helper to get all images from a patch, regardless of product.
    const getAllImagesFromPatch = (patchData) => {
        if (!patchData || !patchData.products) return [];
        return patchData.products.flatMap(product => product.images || []);
    };

    // This is the main function that runs when the user clicks "Compare". It's async because it fetches data.
    const handleCompare = async () => {
        if (!patch1 || !patch2) return;
        if (patch1 === patch2) {
            // alert('Patch 1 and Patch 2 should not be the same.');
            dismissibleError('Patch 1 and Patch 2 should not be the same.');
            setPatch1('');
            setPatch2('');
            return;
        }

        setIsLoading(true);
        setShowComparison(false);

        try {
            //  AUTO-SORT: Determine which patch version is older.
            const versionToArray = (ver) => ver.split('.').map(num => parseInt(num, 10));
            const isOlder = (v1, v2) => {
                const a = versionToArray(v1);
                const b = versionToArray(v2);
                for (let i = 0; i < Math.max(a.length, b.length); i++) {
                    const val1 = a[i] || 0;
                    const val2 = b[i] || 0;
                    if (val1 < val2) return true;
                    if (val1 > val2) return false;
                }
                return false;
            };

            let olderVersion = patch1;
            let newerVersion = patch2;
            if (!isOlder(patch1, patch2)) {
                olderVersion = patch2;
                newerVersion = patch1;
            }
            //FIND MATCHES: Get all images from each patch and find pairs with the same name.
            const patchData1 = patches.find(p => p.name === olderVersion);
            const patchData2 = patches.find(p => p.name === newerVersion);
            
            if (!patchData1 || !patchData2) return;

            const allImages1 = getAllImagesFromPatch(patchData1);
            const allImages2 = getAllImagesFromPatch(patchData2);

            const matchedPairs = [];
            allImages1.forEach(img1 => {
                const matchingImg2 = allImages2.find(img2 => img2.image_name === img1.image_name);
                if (matchingImg2) {
                    matchedPairs.push({
                        imageName: img1.image_name,
                        build1: olderVersion,
                        build2: newerVersion,
                    });
                }
            });

            if (matchedPairs.length === 0) {
                // alert('No common images found between the selected patches.');
                dismissibleError('No common images found between the selected patches.')
                setPatch1('');
                setPatch2('');
                return;
            }
            //  FETCH DETAILS: For each matched pair, fetch the detailed data (including size) concurrently.
            const detailPromises = matchedPairs.map(pair =>
                Promise.all([
                    getImageDetails(pair.imageName, pair.build1),
                    getImageDetails(pair.imageName, pair.build2)
                ])
            );

            const detailedResults = await Promise.all(detailPromises);
 
            // Create the final array for display.
            const finalComparison = [];
            detailedResults.forEach(([details1, details2]) => {
                if (details1 && details2) {
                    console.log(`[${details1.product}] ${details1.image_name} (${details1.build_number}): Size = ${details1.size}`);
                    console.log(`[${details2.product}] ${details2.image_name} (${details2.build_number}): Size = ${details2.size}`);
                    finalComparison.push({
                        image_name: details1.image_name,
                        patch1: details1, // Data from the older patch
                        patch2: details2, // Data from the newer patch
                        remarks: ''
                    });
                }
            });

            if (finalComparison.length === 0) {
                // alert('Could not fetch details for any common images.');
                dismissibleError('Could not fetch details for any common images.')
                setPatch1('');
                setPatch2('');
                return;
            }
            
            //group the results by product and update the component's state.
            const groupedComparison = finalComparison.reduce((acc, item) => {
                const product = item.patch1.product;
                if (!acc[product]) {
                    acc[product] = { product: product, images: [] };
                }
                acc[product].images.push(item);
                return acc;
            }, {});

          
            setPatch1(olderVersion);
            setPatch2(newerVersion);

            setComparedImages(Object.values(groupedComparison));
            setShowComparison(true);

        } catch (error) {
            console.error("Failed during image comparison:", error);
            // alert("An error occurred. Please check the console.");
            dismissibleError(`An error occurred. ${error}`)

        } finally {
            setIsLoading(false);
        }
    };

    // The hook returns an object with all the state and functions that the UI components will need.
    return { patch1, setPatch1, patch2, setPatch2, patches, comparedImages, showComparison, isLoading, handleCompare };
};