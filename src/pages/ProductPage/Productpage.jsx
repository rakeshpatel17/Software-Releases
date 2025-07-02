import { useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import ActionTable from '../../components/ProductImageTable/ActionTable';
import './ProductPage.css';
import { AllReleaseProductImage } from '../../api/AllReleaseProductImage';
import { deleteReleaseProductImage } from '../../api/deleteReleaseProductImage';
import { Button, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import toast from 'react-hot-toast';


function ProductPage() {
    const { searchTerm, setTitle } = useOutletContext();
    const { productName } = useParams();
    const [groupedImages, setGroupedImages] = useState({});
    const [selectedImages, setSelectedImages] = useState({});


    useEffect(() => {
        setTitle(`Images for ${productName}`);
    }, [productName, setTitle]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await AllReleaseProductImage();
                const filtered = data.filter(img => img.product === productName);
                const grouped = filtered.reduce((acc, img) => {
                    const release = img.release;
                    if (!acc[release]) acc[release] = [];
                    acc[release].push(img);
                    return acc;
                }, {});
                setGroupedImages(grouped);
            } catch (error) {
                console.error('Error fetching release images:', error);
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
            // Create an array of delete promises
            const deletePromises = selectionToDelete.map(imageName =>
                deleteReleaseProductImage(release, productName, imageName)
            );

            try {
                // Wait for all delete operations to complete
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

    return (
        <div className="dashboard-main">
            {Object.entries(groupedImages).map(([release, images]) => (
                <div key={release} className="release-group">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <h3>Release: {release}</h3>
                        <IconButton
                            color="error"
                            onClick={() => handleDeleteSelected(release)}
                            disabled={!selectedImages[release] || selectedImages[release].length === 0}
                            aria-label="delete selected"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                    <ActionTable
                        images={images}
                        release={release}
                        product={productName}
                        // These props now correctly trigger the robust state updates
                        onImageUpdate={handleImageUpdate}
                        onImageAdd={handleImageAdd}

                        selected={selectedImages[release] || []}
                        onSelectionChange={(newSelection) => handleSelectionChange(release, newSelection)}

                        onImageDelete={handleImageDelete}

                    />
                </div>
            ))}
        </div>
    );
}

export default ProductPage;