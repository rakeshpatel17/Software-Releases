import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import PatchProductSpecificDetails from '../../../api/PatchProductSpecificDetails';
import hydrateImages from '../../../api/hydrateImages';
import { getPatchById } from '../../../api/getPatchById';
import getProductCompletion from '../../../api/productCompletion';
import {props} from 'react';
import usePatchActions from './usePatchActions';
function usePatchData({
  patchId,
  productName,
  isSingleProductMode,
  setTitle,
  setFilterOptions,
  searchTerm,
  activeFilters
})
{
    const [products, setProducts] = useState([]);
    const [patchData, setPatchData] = useState(null);
    const [loading, setLoading] = useState(true);
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
            const hydratedProducts = await hydrateImages(patchObject.products);
            setProducts(hydratedProducts);
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
            const hydratedProducts = await hydrateImages(patchDetails.products || []);

            setProducts(hydratedProducts);
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

    const { handleProductRefresh, handlePageRefresh, handleExport } = usePatchActions({
    patchId,
    isSingleProductMode,
    products,
    setProducts,
    setPatchData,
    productName
    })

  return {
    loading,
    products,
    patchData,
    completedProducts,
    notCompletedProducts,
    handleProductRefresh,
    handlePageRefresh,
    handleImageJarsUpdate,
    handleExport
  };
}
export default usePatchData;