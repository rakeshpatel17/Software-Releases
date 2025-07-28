import { useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { Box } from '@mui/material';
import toast from 'react-hot-toast';

import { useProductPageData } from './Hooks/useProductPageData';
import { ProductPatches } from './components/ProductPatches';
import { ProductReleases } from './components/ProductReleases';
import './ProductPage.css';

import LoadingSpinner from '../../components/Loading/LoadingSpinner';

import { dismissibleError } from '../../components/Toast/customToast';
import { dismissibleSuccess } from '../../components/Toast/customToast';

const PATCH_FILTERS = [
    { value: 'new', label: 'New' },
    { value: 'released', label: 'Released' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'cancelled', label: 'Cancelled' },
];

function ProductPage() {
    const { searchTerm, setTitle, activeFilters, setFilterOptions } = useOutletContext();
    const { productName } = useParams();
    const [selectedImages, setSelectedImages] = useState({});

    const { isLoading, allReleases, productPatches, groupedImages, handlers } = useProductPageData(productName);
    
    useEffect(() => {
        setTitle(`Images for ${productName}`);
        setFilterOptions(PATCH_FILTERS);
        return () => setFilterOptions(null);
    }, [productName, setTitle, setFilterOptions]);

    const handleSelectionChange = (release, newSelection) => {
        setSelectedImages(prev => ({ ...prev, [release]: newSelection }));
    };

    const handleDeleteSelected = async (release, selectionToDelete) => {
        if (selectionToDelete.length === 0) {
            // toast.error("No images selected for this release.");
            dismissibleError("No images selected for this release.")
            return;
        }
        const success = await handlers.handleBatchDelete(release, selectionToDelete);
        if (success) {
            setSelectedImages(prev => ({ ...prev, [release]: [] }));
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <LoadingSpinner />
            </Box>
        );
    }
    
    const hasVisiblePatches = productPatches.some(patch => {
        const searchTermMatch = patch.name.toLowerCase().includes(searchTerm.toLowerCase());
        const filterMatch = activeFilters.length === 0 || activeFilters.includes(patch.patch_state.toLowerCase());
        return searchTermMatch && filterMatch;
    });

    return (
        <div className="dashboard-main">
            <ProductPatches 
                productPatches={productPatches}
                searchTerm={searchTerm}
                activeFilters={activeFilters}
                productName={productName}
            />
            <ProductReleases
                allReleases={allReleases}
                groupedImages={groupedImages}
                searchTerm={searchTerm}
                productName={productName}
                selectedImages={selectedImages}
                onSelectionChange={handleSelectionChange}
                onBatchDelete={handleDeleteSelected}
                imageHandlers={handlers}
                hasPatches={hasVisiblePatches}
            />
        </div>
    );
}

export default ProductPage;