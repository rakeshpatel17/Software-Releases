import './ProductImageSelector.css';
  import { useMemo } from 'react';

function ProductImageSelector({
  productData = [],
  selectedImages = [], // format: [{ productName, imageName }]
  searchTerm,
  setSearchTerm,
  expandedProduct,
  setExpandedProduct,
  handleProductSelection,
  handleImageToggle,
  patchSpecificImages = [],
  mode = 'read',
}) {
    // console.log("selectedImages in child:", selectedImages);

  const filteredProducts = productData.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

// For edit mode, if selectedImages is an object like { productName: [images...] }
const flattenedSelectedImagesForEdit = useMemo(() => {
  if (!selectedImages || typeof selectedImages !== 'object' || Array.isArray(selectedImages)) return [];
  return Object.entries(selectedImages).flatMap(([productName, images]) =>
    (images || []).map(imageName => ({
      productName,
      imageName,
    }))
  );
}, [selectedImages]);

// For other mode or default, when selectedImages is array of { product, images }
const flattenedSelectedImagesForArray = useMemo(() => {
  if (!Array.isArray(selectedImages)) return [];
  return selectedImages.flatMap(p =>
    (p.images || []).map(img => ({
      productName: p.product,
      imageName: img,
    }))
  );
}, [selectedImages]);





const isImageInPatch = (productName, imageName) =>
  patchSpecificImages.some(product =>
    product.product === productName &&
    product.images?.some(img => img === imageName)
  );

const shouldShowProduct = (product) => {
  if (mode !== 'read') return true;
  return patchSpecificImages.some(p =>
    p.product === product.name && p.images?.length > 0
  );
};

// const isImageChecked = (productName, imageName) => {
//   if (mode === 'read') {
//     return patchSpecificImages.some(
//       p => p.product === productName && p.images.includes(imageName)
//     );
//   }
//   return flattenedSelectedImages.some(
//     img => img.productName === productName && img.imageName === imageName
//   );
// };
const isImageChecked = (productName, imageName) => {
  if (mode === 'read') {
    return patchSpecificImages.some(
      p => p.product === productName && p.images.includes(imageName)
    );
  }
  // Use the right flattenedSelectedImages based on selectedImages type
  if (typeof selectedImages === 'object' && !Array.isArray(selectedImages)) {
    return flattenedSelectedImagesForEdit.some(
      img => img.productName === productName && img.imageName === imageName
    );
  }
  return flattenedSelectedImagesForArray.some(
    img => img.productName === productName && img.imageName === imageName
  );
};






  const visibleProducts = filteredProducts.filter(shouldShowProduct);
  const checkboxesDisabled = mode === 'read';

  const isProductChecked = (product) =>
  product.images?.some(img => isImageChecked(product.name, img.image_name));


  return (
    <>
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
                const isChecked = isProductChecked(product);

                return (
                  <div key={product.name} className="product-item">
                    <div className="product-header">
                      <div className="product-title-checkbox">
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
                          .filter(img => (mode === 'read' ? isImageInPatch(product.name, img.image_name) : true))
                          .map((img) => (
                            <label key={img.image_name} className="image-item">
                              <input
                                type="checkbox"
                                checked={isImageChecked(product.name, img.image_name)}
                                disabled={checkboxesDisabled}
                                onChange={() => handleImageToggle(product.name, img.image_name)}
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