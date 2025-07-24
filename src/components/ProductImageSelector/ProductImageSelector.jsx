import React from "react";
import { useProductSelection } from "./hooks/useProductSelection";
import { ProductSearchBar } from "./components/ProductSearchBar";
import { ProductItem } from "./components/ProductItem";
import "./ProductImageSelector.css";

const ProductImageSelector = ({ mode, products = [], selectedProducts = [], onSelectionChange }) => {
    const {
        searchTerm,
        setSearchTerm,
        visibleProducts,
        selected,
        expanded,
        handlers
    } = useProductSelection({ mode, products, selectedProducts, onSelectionChange });

    const isDisabled = mode === 'read';

    return (
        <>
            {!isDisabled && (
                <ProductSearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            )}
            <div className="form-group">
                <div className="scrollable-product-list">
                    <div className="product-list">
                        {visibleProducts.length === 0 ? (
                            <div className="no-products-message">
                                {mode === 'read' ? 'No products selected for this patch' : 'No products found'}
                            </div>
                        ) : (
                            visibleProducts.map((product) => (
                                <ProductItem
                                    key={product.name}
                                    product={product}
                                    isExpanded={expanded[product.name] || false}
                                    selectedState={selected}
                                    isDisabled={isDisabled}
                                    handlers={handlers}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductImageSelector;