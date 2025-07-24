import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

import { AllReleaseProductImage } from '../../../api/AllReleaseProductImage';
import { deleteReleaseProductImage } from '../../../api/deleteReleaseProductImage';
import get_release from '../../../api/release';
import { getPatchesByProduct } from '../../../api/PatchesByProduct';
import { dismissibleError } from '../../../components/Toast/customToast';
import { dismissibleSuccess } from '../../../components/Toast/customToast';

export function useProductPageData(productName) {
    const [isLoading, setIsLoading] = useState(true);
    const [allReleases, setAllReleases] = useState([]);
    const [productPatches, setProductPatches] = useState([]);
    const [groupedImages, setGroupedImages] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            if (!productName) return;
            setIsLoading(true);
            try {
                const [productPatchesData, releasesData, imagesData] = await Promise.all([
                    getPatchesByProduct(productName),
                    get_release(),
                    AllReleaseProductImage()
                ]);

                setProductPatches(productPatchesData || []);

                const activeReleases = releasesData
                    .filter(r => r.active)
                    .sort((a, b) => a.name.localeCompare(b.name));
                setAllReleases(activeReleases);

                const filteredImages = imagesData.filter(img => img.product === productName);
                const grouped = filteredImages.reduce((acc, img) => {
                    const release = img.release;
                    if (!acc[release]) acc[release] = [];
                    acc[release].push(img);
                    return acc;
                }, {});
                setGroupedImages(grouped);

            } catch (error) {
                console.error('Error fetching product page data:', error);
                // toast.error("Failed to load page data. Please try again.");
                dismissibleError("Failed to load page data. Please try again.")
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [productName]);

    const handleImageAdd = useCallback((release, newImage) => {
        setGroupedImages(prev => ({ ...prev, [release]: [...(prev[release] || []), newImage] }));
    }, []);

    const handleImageUpdate = useCallback((release, originalImageName, updatedImage) => {
        setGroupedImages(prev => {
            const imagesInRelease = prev[release] || [];
            const imageIndex = imagesInRelease.findIndex(img => img.image_name === originalImageName);
            if (imageIndex === -1) return prev;

            const newImages = [...imagesInRelease];
            newImages[imageIndex] = updatedImage;
            return { ...prev, [release]: newImages };
        });
    }, []);

    const handleImageDelete = useCallback((release, imageNameToDelete) => {
        setGroupedImages(prev => ({
            ...prev,
            [release]: prev[release].filter(image => image.image_name !== imageNameToDelete)
        }));
    }, []);
const handleBatchDelete = useCallback(async (release, selectionToDelete) => {
    if (!window.confirm(`Are you sure you want to delete ${selectionToDelete.length} selected image(s) from release ${release}?`)) {
        return false;
    }

    
    let successfulDeletions = [];

    for (const imageName of selectionToDelete) {
        try {
            // "await" here PAUSES the entire loop until this one request is done.
            await deleteReleaseProductImage(release, productName, imageName);
            successfulDeletions.push(imageName);
        } catch (error) {
            // This will now catch the error for the specific image that failed.
            console.error(`Failed to delete ${imageName}:`, error);
            const errorMessage = error.response?.data?.message || `An error occurred while deleting ${imageName}.`;
            dismissibleError(errorMessage);

            if (successfulDeletions.length > 0) {
                setGroupedImages(prev => ({
                    ...prev,
                    [release]: prev[release].filter(image => successfulDeletions.includes(image.image_name))
                }));
            }
            
            return false; // Stop the process because one part failed.
        }
    }

    // This code only runs if every single deletion was successful.
    setGroupedImages(prev => ({
        ...prev,
        [release]: prev[release].filter(image => !selectionToDelete.includes(image.image_name))
    }));
    
    dismissibleSuccess('Selected images deleted successfully.');
    return true; // Indicate success

}, [productName]);


    return {
        isLoading,
        allReleases,
        productPatches,
        groupedImages,
        handlers: { handleImageAdd, handleImageUpdate, handleImageDelete, handleBatchDelete }
    };
}