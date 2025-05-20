import React from 'react';
import './ProductImageSelector.css';

function ProductImageSelector({
  productData = [],
  selectedImages = [],
  searchTerm,
  setSearchTerm,
  expandedProduct,
  setExpandedProduct,
  handleProductSelection,
  handleImageToggle,
  patchSpecificImages = [],
  mode = 'read', // 'read', 'edit-prepopulated', or 'edit-empty'
}) {
  // Filter products by search term
  const filteredProducts = productData.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to check if image belongs to patch
  const isImageInPatch = (imageName) => patchSpecificImages.includes(imageName);

  // Show product in read mode only if it has patch images
  const shouldShowProduct = (product) => {
    if (mode !== 'read') return true;
    return product.images?.some(img => patchSpecificImages.includes(img.image_name));
  };

  // Determine if image is checked based on mode
  const isImageChecked = (imageName) => {
    if (mode === 'read') {
      return patchSpecificImages.includes(imageName);
    }
    // In edit modes, use selectedImages state (parent manages this)
    return selectedImages.includes(imageName);
  };

  // Show only products based on mode & filter
  const visibleProducts = filteredProducts.filter(shouldShowProduct);

  // Disable checkboxes only in read mode
  const checkboxesDisabled = mode === 'read';

  return (
    <>
      {/* Show search input only in edit modes */}
      {(mode !== 'read') && (
        <div className="form-group">
          <label className="form-label">Search Product</label>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
          />
        </div>
      )}

      <div className="form-group">
        <div className="scrollable-product-list">
          <div className="product-list">

            {visibleProducts.length === 0 ? (
              <div className="no-products-message">No products under this patch</div>
            ) : (
              visibleProducts.map((product) => {
                const isExpanded = expandedProduct === product.name;
                // Checkbox checked if any images in product are selected
                const isChecked = product.images?.some(img => isImageChecked(img.image_name));

                return (
                  <div key={product.name} className="product-item">
                    <div className="product-header">
                      <div className="product-title-checkbox">
                        {/* Show product checkbox only in edit modes */}
                        {(mode !== 'read') && (
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => handleProductSelection(product, e.target.checked)}
                          />
                        )}
                        <span className="product-name">{product.name}</span>
                      </div>
                      <button
                        type="button"
                        className="expand-btn"
                        onClick={() =>
                          setExpandedProduct(isExpanded ? null : product.name)
                        }
                      >
                        {isExpanded ? '-' : '+'}
                      </button>
                    </div>

                    {isExpanded && product.images && (
                      <div className="image-list">
                        {product.images
                          .filter(img => (mode === 'read' ? isImageInPatch(img.image_name) : true))
                          .map((img) => (
                            <label key={img.image_name} className="image-item">
                              <input
                                type="checkbox"
                                checked={isImageChecked(img.image_name)}
                                disabled={checkboxesDisabled}
                                onChange={() => handleImageToggle(img.image_name)}
                              />
                              {img.image_name}
                            </label>
                          ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductImageSelector;
