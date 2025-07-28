import { useEffect } from 'react';
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import { usePatchForm } from './hooks/usePatchForm';
import { PatchDetailsSection } from './components/PatchDetailsSection';
import { PatchTimelineSection } from './components/PatchTimelineSection';
import { PatchInfoSection } from './components/PatchInfoSection';
import './Form.css';
import ProductImageSelector from '../ProductImageSelector/ProductImageSelector';
import JarSelector from '../JarSelector/JarSelector';
import HighLevelScopeComponent from '../HighLevelScope/HighLevelScope';
import CancelButton from '../Button/CancelButton';
import SaveButton from '../Button/SaveButton';


function Form({ onCancel }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { setTitle } = useOutletContext();
    
    const lockedRelease = location.state?.lockedRelease;

    // This callback now receives the full patch data from the hook
    const handleSuccess = (patchName, savedPatchData) => {
        setTimeout(() => {
            navigate(`/patches/${patchName}`, { state: { patch: savedPatchData } });
        }, 1000);
    };

    const { 
        formData, 
        errors, 
        releaseList, 
        productData, 
        highLevelScope, 
        selectedJars, 
        handlers 
    } = usePatchForm(lockedRelease, handleSuccess);

    useEffect(() => {
        setTitle(`Add New Patch`);
    }, [setTitle]);
    
    return (
        // The noValidate attribute prevents default browser validation, letting our logic take full control.
        <form className="form-container" onSubmit={handlers.handleSubmit} noValidate>
            <PatchDetailsSection
                formData={formData}
                errors={errors}
                releaseList={releaseList}
                lockedRelease={lockedRelease}
                handleChange={handlers.handleChange}
            />
            {/* The `readOnly` prop is now correctly managed by the auto-calculation logic */}
            <PatchTimelineSection
                formData={formData}
                errors={errors}
                handleChange={handlers.handleChange}
            />
            <HighLevelScopeComponent
                highLevelScope={highLevelScope}
                setHighLevelScope={handlers.setHighLevelScope}
                isEditing={true}
            />
            <JarSelector
                mode="edit"
                selectedJars={selectedJars}
                setSelectedJars={handlers.setSelectedJars}
                isEditing={true}
            />
            <PatchInfoSection
                formData={formData}
                errors={errors}
                handleChange={handlers.handleChange}
            />
            <ProductImageSelector
                mode="editEmpty"
                products={productData}
                selectedRelease={formData.release} // Use the single source of truth
                selectedProducts={[]}
                onSelectionChange={handlers.setSelectedProducts}
            />
            {errors.products && <span className="error-text" style={{display: 'block', marginTop: '-10px', marginBottom: '15px'}}>{errors.products}</span>}

            <div className="form-actions">
                <CancelButton onCancel={onCancel} />
                <SaveButton />
            </div>
        </form>
    );
}

export default Form;