import React from 'react';
import { useParams } from 'react-router-dom';

import { usePatchPage } from './hooks/usePatchPage';
import { PatchPageHeader } from './components/PatchPageHeader';
import { PatchDetails } from './components/PatchDetails';
import { PatchTimeline } from './components/PatchTimeline';
import { PatchInfoSection } from './components/PatchInfoSection';
import './PatchPage.css';

import ProductImageSelector from '../../components/ProductImageSelector/ProductImageSelector';
import JarSelector from '../../components/JarSelector/JarSelector';
import HighLevelScopeComponent from '../../components/HighLevelScope/HighLevelScope';
import CancelButton from '../../components/Button/CancelButton';
import SaveButton from '../../components/Button/SaveButton';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';

function PatchPage() {
    const { patchName } = useParams();
    
    const {
        isLoading, isEditing, patchData, tempPatchData, progress,
        transformedProductsForSelector,
        displayProducts, displayScope, displayJars,
        handlers
    } = usePatchPage();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="patch-page">
            <PatchPageHeader
                patchName={patchName}
                patchData={patchData}
                progress={progress}
                isEditing={isEditing}
                onToggleEdit={handlers.toggleEdit}
            />

            <form className="patch-form" onSubmit={handlers.handleSave}>
                <PatchDetails patch={tempPatchData} isEditing={isEditing} onChange={handlers.handleChange} />
                <PatchTimeline patch={tempPatchData} isEditing={isEditing} onChange={handlers.handleChange} />
                
                <HighLevelScopeComponent
                    highLevelScope={displayScope}
                    setHighLevelScope={isEditing ? handlers.setTempHighLevelScope : undefined}
                    isEditing={isEditing}
                />
                <JarSelector
                    mode="edit"
                    selectedJars={displayJars}
                    setSelectedJars={isEditing ? handlers.setTempSelectedJars : undefined}
                    isEditing={isEditing}
                />
                
                <PatchInfoSection
                    patch={tempPatchData}
                    isEditing={isEditing}
                    onChange={handlers.handleChange}
                    onStateChange={handlers.handleStateChange}
                />

                {isEditing ? (
                    <ProductImageSelector
                        mode="editPrepopulate"
                        products={transformedProductsForSelector}
                        selectedProducts={displayProducts}
                        onSelectionChange={handlers.setTempSelectedProducts}
                    />
                ) : (
                    <>
                        <label>Products</label>
                        <ProductImageSelector
                            mode="read"
                            products={transformedProductsForSelector}
                            selectedProducts={displayProducts}
                        />
                    </>
                )}

                {isEditing && (
                    <div className='form-actions'>
                        <CancelButton onCancel={handlers.toggleEdit} />
                        <SaveButton />
                    </div>
                )}
            </form>
        </div>
    );
}

export default PatchPage;