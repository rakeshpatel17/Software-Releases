// usePatchActions.js
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import getPatchProductDetail from '../../../api/PatchProductDetail';
import patch_image_jars from '../../../api/patch_image_jars';
import exportToExcel from '../../../api/exportToExcel';

export default function usePatchActions({
  patchId,
  isSingleProductMode,
  products,
  setProducts,
  setPatchData,
  productName
}) {
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

    const getDate = () => new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    function handleExport(){
        exportToExcel(products, `${patchId}_${productName || 'all'}_vulnerabilities_${getDate()}`)
    }
  return { handleProductRefresh, handlePageRefresh, handleExport }
}
