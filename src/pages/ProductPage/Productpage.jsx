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
// import get_patches from '../../api/patches';
import { getPatchesByProduct } from '../../api/PatchesByProduct';
import { useNavigate } from 'react-router-dom';


function ProductPage() {
    const { searchTerm, setTitle, activeFilters, setFilterOptions } = useOutletContext();
    const { productName } = useParams();
    const [groupedImages, setGroupedImages] = useState({});
    const [selectedImages, setSelectedImages] = useState({});


    const [allReleases, setAllReleases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [productPatches, setProductPatches] = useState([]);
    const navigate = useNavigate();




    const patchFilters = [
        { value: 'new', label: 'New' },
        { value: 'released', label: 'Released' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    useEffect(() => {
        setTitle(`Images for ${productName}`);
        setFilterOptions(patchFilters);
        return () => {
            setFilterOptions(null);
        };
    }, [productName, setTitle, setFilterOptions]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [productPatchesData, releasesData, imagesData] = await Promise.all([
                    getPatchesByProduct(productName),
                    get_release(),
                    AllReleaseProductImage()
                ]);

                console.log('Filtering for productName:', productName);


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

    const filteredPatches = productPatches.filter(patch => {
        const searchTermMatch = patch.name.toLowerCase().includes(searchTerm.toLowerCase());
        const filterMatch = activeFilters.length === 0 || activeFilters.includes(patch.patch_state.toLowerCase());
        return searchTermMatch && filterMatch;
    });

    const newReleased = filteredPatches
        .filter(p => p.patch_state.toLowerCase() === 'new' || p.patch_state.toLowerCase() === 'released')
        .sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

    const cancelled = filteredPatches.filter(p => p.patch_state.toLowerCase() === 'cancelled');
    const in_progress = filteredPatches.filter(p => p.patch_state.toLowerCase() === 'in_progress');

    const displayGroups = [
        { title: 'New & Released Patches', items: newReleased },
        { title: 'In Progress Patches', items: in_progress },
        { title: 'Cancelled Patches', items: cancelled }
    ];

    const filteredReleases = allReleases.filter(releaseInfo => releaseInfo.name.toLowerCase().includes(searchTerm.toLowerCase().trim()));

    return (
        <div className="dashboard-main">
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    {/* <CircularProgress /> */}
                    <LoadingSpinner />
                </Box>
            ) : (<>
                {displayGroups.map((group, idx) => (
                    group.items.length > 0 && (
                        <div key={idx} className="release-group">
                            <h3>Associated Patches</h3>
                            <div className="card-scrollable">
                                <div className="card-grid">
                                    {group.items.map((patch, index) => (
                                        <Card
                                            key={index}
                                            info={{
                                                title: patch.name,
                                                description: patch.description,
                                                badge: patch.patch_state,
                                                footer: patch.release_date,
                                            }}
                                            products={patch.products.filter(p => p.name === productName)}
                                            onProgressClick={() => navigate(`/patches/${patch.name}/products/${productName}`)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                ))}

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