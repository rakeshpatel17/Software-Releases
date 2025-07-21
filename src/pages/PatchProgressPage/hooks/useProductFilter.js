import { useMemo } from "react";
export default function useProductFilter(products, searchTerm, activeFilters, isSingleProductMode, completedProducts)
{
    return useMemo(() => {
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
}
