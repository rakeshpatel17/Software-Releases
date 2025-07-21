import { useParams, useOutletContext } from 'react-router-dom';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import PatchTopBar from './PatchTopBar';
// API Imports
import './PatchProgressPage.css';
import EmptyStateMessage from './EmptyStateMessage';
import PatchProductSection from './PatchProductSection';
import usePatchProgress from './hooks/usePatchProgress';
import useProductFilter from './hooks/useProductFilter';
import usePatchData from './hooks/usePatchData';

function PatchProgressPage() {
  const { searchTerm, setTitle, activeFilters, setFilterOptions } = useOutletContext();
  const { id, patchName, productName } = useParams();
  const patchId = id || patchName;
  const isSingleProductMode = !!productName;
  const {
    loading,
    products,
    patchData,
    completedProducts,
    notCompletedProducts,
    handleProductRefresh,
    handlePageRefresh,
    handleImageJarsUpdate,
    handleExport
  } = usePatchData({
    patchId,
    productName,
    isSingleProductMode,
    setTitle,
    setFilterOptions,
    searchTerm,
    activeFilters
  });
  const progress = usePatchProgress(patchId, productName, isSingleProductMode, products);
  const finalProductsToDisplay = useProductFilter(products, searchTerm, activeFilters, isSingleProductMode, completedProducts);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PatchTopBar
        products={products}
        progress={progress}
        onExport={handleExport}
        onRefreshAll={handlePageRefresh}
        isSingleProductMode={isSingleProductMode}
      />
      {finalProductsToDisplay.length === 0 ? (
        <EmptyStateMessage isSingleProductMode = {isSingleProductMode}/>
      ) : (
        <PatchProductSection
            finalProductsToDisplay={finalProductsToDisplay}
            patchData={patchData}
            patchId={patchId}
            searchTerm={searchTerm}
            isSingleProductMode={isSingleProductMode}
            handleProductRefresh={handleProductRefresh}
            handleImageJarsUpdate={handleImageJarsUpdate}
        />
      )}
    </div>
  );
}

export default PatchProgressPage;