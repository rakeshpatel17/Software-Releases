import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

import get_release from '../../../api/release';
import post_patches from '../../../api/post_patches';
import get_patches from '../../../api/patches';
import { AllReleaseProductImage } from '../../../api/AllReleaseProductImage';

import { dismissibleError } from '../../Toast/customToast';
import { dismissibleSuccess } from '../../Toast/customToast';
// Initial state for the form to easily reset or initialize
const INITIAL_FORM_DATA = {
    name: '',
    release: '',
    release_date: '',
    code_freeze: '',
    platform_qa_build: '',
    description: '',
    patch_state: 'new',
    kba: '',
    functional_fixes: '',
    security_issues: '',
    is_deleted: false,
    client_build_availability: '',
    scopes_data: [],
    kick_off: '',
    products_data: [],
    jars_data: [],
};

// Helper functions for date calculations
const getPreviousDate = (dateStr, days) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
};

const getFutureDate = (baseDateStr, releaseDateStr, days) => {
    if (!baseDateStr || !releaseDateStr) return '';
    const date = new Date(baseDateStr);
    date.setDate(date.getDate() + days);
    const releaseDate = new Date(releaseDateStr);
    return date > releaseDate ? releaseDate.toISOString().split('T')[0] : date.toISOString().split('T')[0];
};


export function usePatchForm(lockedRelease, onSuccess) {
    const [formData, setFormData] = useState({ ...INITIAL_FORM_DATA, release: lockedRelease || '' });
    const [errors, setErrors] = useState({});

    // State for data used in selectors and child components
    const [releaseList, setReleaseList] = useState([]);
    const [productData, setProductData] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [highLevelScope, setHighLevelScope] = useState([
        { name: 'alpine', version: '21' },
        { name: 'jdk', version: '12' },
        { name: 'new_relic', version: '1.5.3' },
    ]);
    const [selectedJars, setSelectedJars] = useState([
        { name: 'log4j', version: '2.1', remarks: 'Major upgrade' },
        { name: 'commons-io', version: '2.2', remarks: 'Minor upgrade' },
        { name: 'guava', version: '3.1', remarks: 'Security patch applied' },
    ]);

    // Effect to react to external changes of the lockedRelease prop
    useEffect(() => {
        if (lockedRelease) {
            setFormData(prev => ({ ...INITIAL_FORM_DATA, release: lockedRelease, name: '' }));
            setProductData([]);
            setSelectedProducts([]);
        }
    }, [lockedRelease]);

    // Effect to fetch initial release list on mount
    useEffect(() => {
        const fetchReleases = async () => {
            try {
                const data = await get_release();
                setReleaseList(data || []);
                if (!lockedRelease && data && data.length > 0) {
                    setFormData(prev => ({ ...prev, release: data[0].name }));
                }
            } catch (error) {
                // toast.error("Failed to fetch releases.");
               dismissibleError("Failed to fetch releases.");
            }
        };
        fetchReleases();
    }, [lockedRelease]);

    // Effect to auto-generate patch version when release changes
    useEffect(() => {
        const fetchPatchSizeAndSetName = async () => {
            if (!formData.release) {
                setFormData(prev => ({ ...prev, name: '' }));
                return;
            }
            try {
                const patchData = await get_patches(formData.release);
                setFormData(prev => ({ ...prev, name: `${formData.release}.${patchData.length + 1}` }));
            } catch (error) {
                console.error("Failed to fetch patches for naming:", error);
            }
        };
        fetchPatchSizeAndSetName();
    }, [formData.release]);

    // Effect to fetch products for the selected release
    useEffect(() => {
        const fetchProductsForRelease = async () => {
            if (!formData.release) {
                setProductData([]);
                return;
            }
            try {
                const allImages = await AllReleaseProductImage();
                const imagesForRelease = allImages.filter(img => img.release === formData.release);
                const groupedByProduct = imagesForRelease.reduce((acc, img) => {
                    if (!acc[img.product]) acc[img.product] = [];
                    acc[img.product].push({ imagename: img.image_name });
                    return acc;
                }, {});
                setProductData(Object.keys(groupedByProduct).map(name => ({ name, images: groupedByProduct[name] })));
            } catch (error) {
                // toast.error("Failed to fetch products for release.");
                dismissibleError("Failed to fetch products for release.");
            }
        };
        fetchProductsForRelease();
    }, [formData.release]);

    // Effect to auto-calculate timeline dates when release_date changes
    useEffect(() => {
        if (formData.release_date) {
            const kick_off = getPreviousDate(formData.release_date, 14);
            const code_freeze = getFutureDate(kick_off, formData.release_date, 4);
            const platform_qa_build = getFutureDate(code_freeze, formData.release_date, 4);
            const client_build_availability = getFutureDate(platform_qa_build, formData.release_date, 2);
            setFormData(prev => ({ ...prev, kick_off, code_freeze, platform_qa_build, client_build_availability }));
        } else {
            setFormData(prev => ({ ...prev, kick_off: '', code_freeze: '', platform_qa_build: '', client_build_availability: '' }));
        }
    }, [formData.release_date]);

    // Centralized form input change handler
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const updatedData = { ...prev, [name]: value };
            if (name === 'release') {
                updatedData.name = ''; // Clear version when release changes
            }
            return updatedData;
        });

        // Clear error for the field being edited
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        // Clear errors of dependent fields
        if (name === 'release_date') {
            setErrors(prev => ({ ...prev, kick_off: '', code_freeze: '', platform_qa_build: '', client_build_availability: '' }));
        }
        if (name === 'release') {
            setErrors(prev => ({ ...prev, name: '' }));
        }
    }, [errors]);

    // Validation logic
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Version is required';
        if (!formData.release) newErrors.release = 'Release is required';
        if (!formData.release_date) newErrors.release_date = 'Release date is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.kick_off) newErrors.kick_off = 'Kick Off Date is required';
        if (!formData.code_freeze) newErrors.code_freeze = 'Code Freeze date is required';
        if (!formData.platform_qa_build) newErrors.platform_qa_build = 'Platform QA Build Date is required';
        if (!formData.client_build_availability) newErrors.client_build_availability = 'Client Build Date is required';
        if (selectedProducts.length === 0) newErrors.products = 'At least one product must be selected';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            // toast.error("Please fix the validation errors.");
            dismissibleError("Please fix the validation errors.");
            return;
        }

        // Check if there's any scope with an empty name or version.
        const hasEmptyScope = highLevelScope.some(scope => !scope.name.trim() || !scope.version.trim());
        if (hasEmptyScope) {
            // toast.error('All High Level Scope entries must have both a name and a version.');
            dismissibleError('All High Level Scope entries must have both a name and a version.')
            return; // Stop the submission
        }

        // Check if there's any JAR with an empty name or version. Remarks are optional.
        const hasEmptyJar = selectedJars.some(jar => !jar.name.trim() || !jar.version.trim());
        if (hasEmptyJar) {
            // toast.error('All Third Party JAR entries must have both a name and a version.');
            dismissibleError('All Third Party JAR entries must have both a name and a version.')
            return; // Stop the submission
        }

        const finalData = {
            ...formData,
            products_data: selectedProducts.map(p => ({
                ...p,
                helm_charts: "Not Released",
                images: p.images.map(img => ({
                    ...img,
                    ot2_pass: "Not Released",
                    registry: "Not Released",
                    patch_build_number: formData.name
                }))
            })),
            scopes_data: highLevelScope.map(item => ({
                name: item.label || item.name,
                version: item.version || "1.0"
            })),
            jars_data: selectedJars.map(item => ({
                name: item.label || item.name,
                version: item.version || "1.0",
                remarks: item.remarks || ""
            })),
        };

        try {
            await post_patches(finalData);
            // toast.success('Patch saved successfully!');
            dismissibleSuccess('Patch saved successfully!')
            if (onSuccess) {
                onSuccess(finalData.name, finalData);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to save the patch.';
            // toast.error(errorMessage);
            dismissibleError(errorMessage)
        }
    };

    // Expose state and handlers to the component
    return {
        formData,
        errors,
        releaseList,
        productData: productData.map(item => ({
            name: item.name,
            images: item.images.map(img => ({ image_name: img.imagename }))
        })),
        highLevelScope,
        selectedJars,
        handlers: {
            handleChange,
            handleSubmit,
            setSelectedProducts,
            setHighLevelScope,
            setSelectedJars
        }
    };
}