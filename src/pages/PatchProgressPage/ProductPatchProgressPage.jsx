    import { useState, useEffect } from 'react';
    import { useParams, useOutletContext } from 'react-router-dom';
    import LoadingSpinner from '../../components/Loading/LoadingSpinner';
    import ImageTable from '../../components/ProductTable/ImageTable';
    import HelmCharts from '../../components/HelmCharts/HelmCharts';
    import RefreshButton from '../../components/Button/RefreshButton';
    import toast from 'react-hot-toast';
    import './PatchProgressPage.css';
    import PatchProductSpecificDetails from '../../api/PatchProductSpecificDetails';
    import getProductPatchProgress from '../../api/getProductPatchProgress';
    import ProgressBar from '../../components/ProgressBar/ProgressBar';
    import Tooltip from '../../components/ToolTip/ToolTip';

    function ProductPatchProgressPage() {
        const { setTitle, setFilterOptions } = useOutletContext();
        const { patchName, productName } = useParams(); 

        const [productData, setProductData] = useState(null);
        const [patchJars, setPatchJars] = useState([]); 
        const [loading, setLoading] = useState(true);

        const [progress, setProgress] = useState(null);

    

        const fetchData = async () => {
            if (!patchName || !productName) return;
            setLoading(true);
            try {
            
                const response = await PatchProductSpecificDetails(patchName, productName);

                const patchObject = response && response.length > 0 ? response[0] : null;

                if (patchObject && patchObject.products && patchObject.products.length > 0) {
                    const singleProduct = patchObject.products[0];
                    setProductData(singleProduct);
                    setPatchJars(patchObject.jars || []); 
                } else {
                    toast.error(`Could not find product "${productName}" in patch "${patchName}".`);
                    setProductData(null); // Clear any old data
                    setPatchJars([]);
                }
            } catch (error) {
                console.error("Failed to fetch product patch details:", error);
                toast.error("Failed to load product details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            setTitle(`Progress for ${productName} in ${patchName}`);
            setFilterOptions(null);

            fetchData();

            return () => {
                setTitle("");
                setFilterOptions(null);
            };
        }, [patchName, productName, setTitle, setFilterOptions]); 

        useEffect(() => {
            const fetchProgress = async () => {
                if (patchName && productName) {
                    const percentage = await getProductPatchProgress(patchName, productName);
                    setProgress(percentage);
                }
            };

            fetchProgress();
        }, [patchName, productName]);

        if (loading) {
            return <LoadingSpinner />;
        }

        if (!productData) {
            return (
                <div className="dashboard-main" style={{ textAlign: 'center', marginTop: '50px' }}>
                    <h2>Product Data Not Found</h2>
                    <p>Could not find details for product "{productName}" in patch "{patchName}".</p>
                </div>
            );
        }

        return (
            <>
            <div className="top-bar">
            <div className="progress-export">
            <div className="progress-container" style={{ pointerEvents: "none" }}>
                <ProgressBar value={progress} label="Patch Progress" />
            </div >    
            {/* {!loading && (
                <button
                className="export-btn"
                onClick={() =>
                    exportToExcel(
                    patchData.products,
                    `${id}_vulnerabilities_${getDate()}`
                    )
                }
                >
                <Tooltip text="Export Security issues" position="down">
                    <Download size={20} /></Tooltip>
                </button>

            )} */}
        
            </div>
            </div>
            <div className="dashboard-main">
                <div className="patchProgress">
                    <div className="product-table-container">
                        <div className="d-flex align-items-center mb-3" style={{ position: 'relative' }}>
                            <h2 className="mb-0 mx-auto">
                                {productName.toUpperCase()}
                            </h2>
                            <RefreshButton onRefresh={fetchData} />
                        </div>

                        {/* Image Table */}
                        <div className="image-table-wrapper">
                            <ImageTable
                                key={productData.name} 
                                images={productData.images || []}
                                patchJars={patchJars} 
                                patchname={patchName}
                                productKey={productName}
                            />
                        </div>

                        {/* Helm Charts */}
                        <div className="image-table-wrapper">
                            <HelmCharts product={productData} />
                        </div>
                    </div>
                </div>
            </div></>
        );
    }

    export default ProductPatchProgressPage;