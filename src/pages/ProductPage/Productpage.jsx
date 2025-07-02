import { useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import ActionTable from '../../components/ProductImageTable/ActionTable';
import './ProductPage.css';
import { AllReleaseProductImage } from '../../api/AllReleaseProductImage';
import { deleteReleaseProductImage } from '../../api/deleteReleaseProductImage';
import { Box, IconButton, Typography, Paper, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import toast from 'react-hot-toast';
import get_release from '../../api/release';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import Card from '../../components/Card/Card';
import get_patches from '../../api/patches';

function ProductPage() {
    const { searchTerm, setTitle } = useOutletContext();
    const { productName } = useParams();
    const [groupedImages, setGroupedImages] = useState({});
    const [selectedImages, setSelectedImages] = useState({});


    const [allReleases, setAllReleases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [productPatches, setProductPatches] = useState([]);


    useEffect(() => {
        setTitle(`Images for ${productName}`);
    }, [productName, setTitle]);



    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [patchesData, releasesData, imagesData] = await Promise.all([
                    get_patches(),
                    get_release(),
                    AllReleaseProductImage()
                ]);

                console.log('Filtering for productName:', productName);

                // 2. Log the FIRST patch from the API to inspect its structure.
                if (patchesData && patchesData.length > 0) {
                    console.log('Structure of a patch from API:', patchesData[0]);
                }

                const filteredPatches = (patchesData || []).filter(patch =>
                    patch.products && patch.products.some(p => p.name === productName)
                ); setProductPatches(filteredPatches);

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
                toast.error("Failed to load page data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [productName]);

    const handleSelectionChange = (release, newSelection) => {
        setSelectedImages(prev => ({
            ...prev,
            [release]: newSelection
        }));
    };


    const handleDeleteSelected = async (release) => {
        const selectionToDelete = selectedImages[release] || [];
        if (selectionToDelete.length === 0) {
            // alert("No images selected for this release.");
            toast.error("No images selected for this release.");
            return;
        }

        if (window.confirm(`Are you sure you want to delete ${selectionToDelete.length} selected image(s) from release ${release}?`)) {
            const deletePromises = selectionToDelete.map(imageName =>
                deleteReleaseProductImage(release, productName, imageName)
            );

            try {
                await Promise.all(deletePromises);

                // If successful, update the UI state all at once
                setGroupedImages(prev => ({
                    ...prev,
                    [release]: prev[release].filter(image => !selectionToDelete.includes(image.image_name))
                }));

                // Clear the selection for this release
                setSelectedImages(prev => ({ ...prev, [release]: [] }));

                // alert("Selected images deleted successfully.");
                toast.success('Selected images deleted successfully.');


            } catch (error) {
                console.error("Error during batch deletion:", error);
                // alert(`An error occurred: ${error.message}`);
                const errorMessage = error.response?.data?.message || `An Error Occurred`;
                toast.error(errorMessage);
            }
        }
    };

    const handleImageDelete = (release, imageNameToDelete) => {
        setGroupedImages(prev => ({
            ...prev,
            [release]: prev[release].filter(image => image.image_name !== imageNameToDelete)
        }));
    };




    const handleImageUpdate = (release, originalImageName, updatedImage) => {
        setGroupedImages(prevGrouped => {
            const newGroupedData = { ...prevGrouped };
            const imagesInRelease = [...(newGroupedData[release] || [])];

            const imageIndex = imagesInRelease.findIndex(
                img => img.image_name === originalImageName
            );

            if (imageIndex !== -1) {
                // Replace the old image object with the new one
                imagesInRelease[imageIndex] = updatedImage;
                newGroupedData[release] = imagesInRelease;
            }

            return newGroupedData;
        });
    };

    const handleImageAdd = (release, newImage) => {
        setGroupedImages(prev => ({
            ...prev,
            [release]: [...(prev[release] || []), newImage]
        }));
    };

    const filteredReleases = allReleases.filter(releaseInfo =>
        releaseInfo.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );

    return (
        <div className="dashboard-main">
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    {/* <CircularProgress /> */}
                    <LoadingSpinner />
                </Box>
            ) : (<>
                {productPatches.length > 0 && (
                    <div className="release-group">
                        <h3>Associated Patches</h3>
                        <div className="card-scrollable">
                            <div className="card-grid">
                                {console.log("patches")}
                                {productPatches.map((patch) => (
                                    < Card
                                        key={patch.name}
                                        info={{
                                            title: patch.name || "Untitled Patch",
                                            description: patch.description || "No description",
                                            badge: patch.patch_state || "Unknown",
                                            footer: patch.release_date || "No date"
                                        }}
                                    // onClick={() => navigate(`/patches/${encodeURIComponent(patch.name)}`)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}


                {allReleases.length > 0 ? (

                    filteredReleases.length > 0 ? (

                        filteredReleases.map(releaseInfo => {
                            const releaseName = releaseInfo.name;
                            const imagesForRelease = groupedImages[releaseName] || [];
                            const selectionForRelease = selectedImages[releaseName] || [];

                            return (
                                <div key={releaseName} className="release-group">
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <h3>Release: {releaseName}</h3>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDeleteSelected(releaseName)}
                                            disabled={selectionForRelease.length === 0}
                                            aria-label="delete selected"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                    <ActionTable
                                        // The props now correctly receive data based on the release loop
                                        images={imagesForRelease} // This will be [] for releases with no images
                                        release={releaseName}
                                        product={productName}
                                        onImageUpdate={handleImageUpdate}
                                        onImageAdd={handleImageAdd}
                                        selected={selectionForRelease}
                                        onSelectionChange={(newSelection) => handleSelectionChange(releaseName, newSelection)}
                                        onImageDelete={handleImageDelete}
                                    />
                                </div>
                            );
                        })
                    ) : (
                        <Paper sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h6">No Matching Releases Found</Typography>
                            <Typography color="text.secondary">
                                Your search for "{searchTerm}" did not match any active releases for this product.
                            </Typography>
                        </Paper>
                    )
                ) : (
                    <Paper sx={{ p: 3, textAlign: 'center', mt: productPatches.length > 0 ? 4 : 0 }}>
                        <Typography variant="h6">No Active Releases Found</Typography>
                        <Typography color="text.secondary">
                            There are no active releases available in the system. Please create a release first.
                        </Typography>
                    </Paper>
                )}
            </>
            )}
        </div>
    );
}

export default ProductPage;