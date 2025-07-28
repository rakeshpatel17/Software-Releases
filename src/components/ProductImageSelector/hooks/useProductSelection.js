import { useState, useEffect, useMemo, useCallback } from 'react';

export function useProductSelection({ mode, products, selectedProducts, onSelectionChange }) {
    const [selected, setSelected] = useState({});
    const [expanded, setExpanded] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

  
    useEffect(() => {
        const initialSelected = {};
        if (mode === "editPrepopulate" || mode === "read") {
            (selectedProducts || []).forEach((product) => {
                const imageNames = new Set((product.images || []).map((image) => image.image_name));
                if (imageNames.size > 0) {
                    initialSelected[product.name] = imageNames;
                }
            });
        }
        setSelected(initialSelected);
    }, []); 
   
    const visibleProducts = useMemo(() => {
        if (mode === "read") {
            return selectedProducts;
        }
        return products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm, mode, selectedProducts]);

    const propagateSelection = useCallback((selectedMap) => {
        if (!onSelectionChange) return;

        const selectedList = Object.entries(selectedMap).map(([productName, imageSet]) => {
            const productObj = products.find((p) => p.name === productName);
            return {
                name: productName,
                images: productObj ? productObj.images.filter((img) => imageSet.has(img.image_name)) : [],
            };
        });
        onSelectionChange(selectedList);
    }, [products, onSelectionChange]);

    const handleImageToggle = useCallback((productName, image) => {
        const updated = { ...selected };
        if (!updated[productName]) updated[productName] = new Set();

        if (updated[productName].has(image.image_name)) {
            updated[productName].delete(image.image_name);
        } else {
            updated[productName].add(image.image_name);
        }

        if (updated[productName].size === 0) delete updated[productName];
        
        setSelected(updated);
        propagateSelection(updated);
    }, [selected, propagateSelection]);

    const handleProductToggle = useCallback((productName, images) => {
        const updated = { ...selected };
        const allImageNames = images.map(img => img.image_name);
        const currentSelection = selected[productName] || new Set();
        
        const isAllSelected = allImageNames.length > 0 && allImageNames.every(name => currentSelection.has(name));

        if (isAllSelected) {
            delete updated[productName];
        } else {
            updated[productName] = new Set(allImageNames);
        }

        setSelected(updated);
        propagateSelection(updated);
    }, [selected, propagateSelection]);

    const toggleExpand = useCallback((productName) => {
        setExpanded(prev => ({ ...prev, [productName]: !prev[productName] }));
    }, []);

    return {
        searchTerm, setSearchTerm, visibleProducts, selected, expanded,
        handlers: { handleImageToggle, handleProductToggle, toggleExpand }
    };
}