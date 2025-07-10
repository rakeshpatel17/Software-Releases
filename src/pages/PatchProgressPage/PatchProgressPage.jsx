import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import ImageTable from '../../components/ProductTable/ImageTable';
import HelmCharts from '../../components/HelmCharts/HelmCharts';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import RefreshButton from '../../components/Button/RefreshButton';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import Tooltip from '../../components/ToolTip/ToolTip';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';

// API Imports
import { getPatchById } from '../../api/getPatchById';
import getProductCompletion from '../../api/productCompletion';
import get_patch_progress from '../../api/get_patch_progress';
import getProductPatchProgress from '../../api/getProductPatchProgress';
import PatchProductSpecificDetails from '../../api/PatchProductSpecificDetails';
import getPatchProductDetail from '../../api/PatchProductDetail';
import patch_image_jars from '../../api/patch_image_jars';
import exportToExcel from '../../api/exportToExcel';

import './PatchProgressPage.css';

function PatchProgressPage() {
    const { searchTerm, setTitle, activeFilters, setFilterOptions } = useOutletContext();
    const { id, patchName, productName } = useParams();

    const patchId = id || patchName;
    const isSingleProductMode = !!productName;

    const [products, setProducts] = useState([]);
    const [patchData, setPatchData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    const [completedProducts, setCompletedProducts] = useState([]);
    const [notCompletedProducts, setNotCompletedProducts] = useState([]);


    const initialFetch = useCallback(async () => {
        if (!patchId) return;
        setLoading(true);
        try {
            if (isSingleProductMode) {
                const response = await PatchProductSpecificDetails(patchId, productName);
                const patchObject = response?.[0];
                if (patchObject?.products?.[0]) {
                    setProducts(patchObject.products);
                    setPatchData(patchObject);
                } else {
                    toast.error(`Could not find product "${productName}" in patch "${patchId}".`);
                    setProducts([]);
                }
            } else {
                const [patchDetails, completionData] = await Promise.all([
                    getPatchById(patchId),
                    getProductCompletion(patchId)
                ]);
                setProducts(patchDetails.products || []);
                setPatchData(patchDetails);
                setCompletedProducts(completionData.completed_products || []);
                setNotCompletedProducts(completionData.incomplete_products || []);
            }
        } catch (error) {
            console.error("Failed to fetch initial patch data:", error);
            toast.error("Failed to load patch details.");
        } finally {
            setLoading(false);
        }
    }, [patchId, productName, isSingleProductMode]);

    useEffect(() => {
        initialFetch();
    }, [initialFetch]);

    const handleProductRefresh = async (productKey) => {
        if (!productKey) return;
        const toastId = `refresh-${productKey}`;
        try {
            toast.loading(`Refreshing ${productKey}...`, { id: toastId });
            const response = await getPatchProductDetail(patchId, productKey);
            const refreshedProductData = response?.[0]?.products?.[0];
            if (refreshedProductData) {
                let allJars = [];
                if (refreshedProductData.images && Array.isArray(refreshedProductData.images)) {
                    const jarArrays = await Promise.all(
                        refreshedProductData.images.map(img => patch_image_jars(patchId, img.image_name))
                    );
                    allJars = jarArrays.flat().filter(Boolean);
                }
                const fullyRefreshedProduct = { ...refreshedProductData, jars: allJars };
                setProducts(prevProducts =>
                    prevProducts.map(p => p.name === productKey ? fullyRefreshedProduct : p)
                );
                toast.success(`${productKey} refreshed!`, { id: toastId });
            } else { throw new Error("Product data not found in response."); }
        } catch (error) {
            console.error(`Error refreshing ${productKey}:`, error);
            toast.error(`Failed to refresh ${productKey}.`, { id: toastId });
        }
    };

    const handlePageRefresh = async () => {
        if (!patchId || isSingleProductMode) return; // This function is now only for multi-product mode
        toast.loading("Refreshing all data...", { id: 'full-refresh' });
        try {
            const data = await getPatchProductDetail(patchId);
            const productsWithJars = await Promise.all(
                data.products.map(async (prod) => {
                    let allJars = [];
                    if (prod.images && Array.isArray(prod.images)) {
                        const jarArrays = await Promise.all(
                            prod.images.map(img => patch_image_jars(patchId, img.image_name))
                        );
                        allJars = jarArrays.flat().filter(Boolean);
                    }
                    return { ...prod, jars: allJars };
                })
            );
            setProducts(productsWithJars);
            setPatchData(data);
            toast.success("All data refreshed!", { id: 'full-refresh' });
        } catch (error) {
            console.error("Failed to perform page refresh:", error);
            toast.error("Could not refresh data.", { id: 'full-refresh' });
        }
    };
    
    useEffect(() => {
        const fetchProgress = async () => {
            if (!patchId) return;
            const progressValue = isSingleProductMode
                ? await getProductPatchProgress(patchId, productName)
                : await get_patch_progress(patchId);
            setProgress(progressValue || 0);
        };
        fetchProgress();
    }, [patchId, productName, isSingleProductMode, products]);

    useEffect(() => {
        if (isSingleProductMode) {
            setTitle(`Progress for ${productName} in ${patchId}`);
            setFilterOptions(null);
        } else {
            setTitle(`${patchId} Progress`);
            const options = [
                { value: 'completed', label: `Completed (${completedProducts.length})` },
                { value: 'not_completed', label: `Not Completed (${notCompletedProducts.length})` }
            ];
            setFilterOptions(options);
        }
        return () => { setTitle(""); setFilterOptions(null); };
    }, [isSingleProductMode, patchId, productName, setTitle, setFilterOptions, completedProducts, notCompletedProducts]);

    const finalProductsToDisplay = useMemo(() => {
        if (isSingleProductMode) return products;
        const completedSet = new Set(completedProducts.map(p => p.toLowerCase()));
        return products.filter(product => {
            const lowerProductName = product.name.toLowerCase();
            const searchTermMatch = lowerProductName.includes(searchTerm.toLowerCase());
            if (!searchTermMatch) return false;
            if (activeFilters.length === 0) return true;
            const isCompleted = completedSet.has(lowerProductName);
            const wantsCompleted = activeFilters.includes('completed');
            const wantsNotCompleted = activeFilters.includes('not_completed');
            if (wantsCompleted && wantsNotCompleted) return true;
            if (wantsCompleted) return isCompleted;
            if (wantsNotCompleted) return !isCompleted;
            return false;
        });
    }, [products, searchTerm, activeFilters, isSingleProductMode, completedProducts]);
    
    const handleImageJarsUpdate = (productKey, imageName, updatedJars) => {
        setProducts(prevProducts =>
            prevProducts.map(product => {
                if (product.name === productKey) {
                    const newImages = product.images.map(img => 
                        img.image_name === imageName ? { ...img, jars: updatedJars } : img
                    );
                    return { ...product, images: newImages };
                }
                return product;
            })
        );
    };
    
    const highlightText = (text, highlight) => {
        if (!highlight || isSingleProductMode) return text;
        const regex = new RegExp(`(${highlight})`, 'gi');
        return text.split(regex).map((part, i) =>
            part.toLowerCase() === highlight.toLowerCase() ? <mark key={i}>{part}</mark> : part
        );
    };
    
    const getDate = () => new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    
    if (loading) return <LoadingSpinner />;

    return (
        <div>
            <div className="top-bar">
                <div className="progress-export">
                    <div className="progress-container" style={{ pointerEvents: "none" }}>
                        <ProgressBar value={progress} label="Patch Progress" />
                    </div>
                    {products.length > 0 && (
                        <button className="export-btn" onClick={() => exportToExcel(products, `${patchId}_${productName || 'all'}_vulnerabilities_${getDate()}`)}>
                            <Tooltip text="Export Security Issues" position="down"><Download size={20} /></Tooltip>
                        </button>
                    )}
                    <div className='refresh'>
                        {!isSingleProductMode && (
                            <RefreshButton onRefresh={handlePageRefresh} tooltipText="Refresh All Products"/>
                        )}
                    </div>
                </div>
            </div>
            {finalProductsToDisplay.length === 0 ? (
                <div style={{ marginTop: '100px', textAlign: 'center', fontSize: '18px' }}>
                    {isSingleProductMode ? 'Product data not found.' : 'No products match the current filters.'}
                </div>
            ) : (
                <div className="dashboard-main">
                    <div className="table-scroll-wrapper">
                        {finalProductsToDisplay.map((product) => (
                        <div className='patchProgress' key={product.name}>
                            <div className="product-table-container">
                                <div className="d-flex align-items-center mb-3" style={{ position: 'relative' }}>
                                    <h2 className="mb-0 mx-auto">{highlightText(product.name.toUpperCase(), searchTerm)}</h2>
                                    <RefreshButton onRefresh={() => handleProductRefresh(product.name)} tooltipText={`Refresh ${product.name}`}/>
                                </div>
                                <div className="image-table-wrapper">
                                    <ImageTable
                                        key={`${product.name}-${JSON.stringify(product.images)}`}
                                        images={product.images || []}
                                        patchJars={patchData?.jars || product.jars || []}
                                        productKey={product.name}
                                        patchname={patchId}
                                        searchTerm={searchTerm}
                                        onImageJarsUpdate={(imageName, updatedJars) => 
                                            handleImageJarsUpdate(product.name, imageName, updatedJars)
                                        }
                                    />
                                </div>
                                <div className="image-table-wrapper">
                                    <HelmCharts product={product} />
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PatchProgressPage;