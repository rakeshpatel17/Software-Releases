import React, { useRef, useEffect } from 'react';
import { ImageSubList } from './ImageSubList';

/**
 * Renders a full product row, with a correctly functioning parent checkbox.
 */
export const ProductItem = ({ product, isExpanded, selectedState, isDisabled, handlers }) => {
    const parentCheckboxRef = useRef(null);

    const imageCount = product.images.length;
    const selectedCount = selectedState[product.name]?.size || 0;

    // Determine the state of the parent checkbox
    const isAllSelected = imageCount > 0 && selectedCount === imageCount;
    const isSomeSelected = selectedCount > 0 && selectedCount < imageCount;

    // This effect correctly sets the indeterminate state of the checkbox
    useEffect(() => {
        if (parentCheckboxRef.current) {
            parentCheckboxRef.current.indeterminate = isSomeSelected;
        }
    }, [isSomeSelected]);

    return (
        <div className="product-item">
            <div className="product-header">
                <div className="product-title-checkbox">
                    <input
                        ref={parentCheckboxRef}
                        type="checkbox"
                        checked={isAllSelected} // CRITICAL FIX: The `checked` state is now based on ALL images being selected
                        disabled={isDisabled}
                        onChange={() => handlers.handleProductToggle(product.name, product.images)}
                    />
                    <label onClick={() => handlers.toggleExpand(product.name)} style={{ cursor: "pointer", userSelect: "none", marginLeft: "8px" }}>
                        {product.name}
                    </label>
                </div>
                <button type="button" className="expand-btn" onClick={() => handlers.toggleExpand(product.name)}>
                    {isExpanded ? "−" : "+"}
                </button>
            </div>
            {isExpanded && (
                <ImageSubList
                    product={product}
                    selectedState={selectedState}
                    isDisabled={isDisabled}
                    onImageToggle={handlers.handleImageToggle}
                />
            )}
        </div>
    );
};