import './ProductImageSelector.css';

// function ProductImageSelector({
//   productData,
//   selectedImages,
//   searchTerm,
//   setSearchTerm,
//   expandedProduct,
//   setExpandedProduct,
//   handleProductSelection,
//   handleImageToggle
// }) {
//   const filteredProducts = productData.filter(product =>
//     product.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

function ProductImageSelector({
    productData = [],
    selectedImages,
    searchTerm,
    setSearchTerm,
    expandedProduct,
    setExpandedProduct,
    handleProductSelection,
    handleImageToggle
  }) {
    const filteredProducts = productData.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  

  return (
    <>
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

      <div className="form-group">
        <div className="scrollable-product-list">
          <div className="product-list">
            {filteredProducts.map((product) => {
              const isExpanded = expandedProduct === product.name;
              return (
                <div key={product.name} className="product-item">
                  <div className="product-header">
                    <div className="product-title-checkbox">
                      <input
                        type="checkbox"
                        checked={product.images?.some(img => selectedImages.includes(img.image_name))}
                        onChange={(e) => handleProductSelection(product, e.target.checked)}
                      />
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
                      {product.images.map((img, idx) => (
                        <label key={idx} className="image-item">
                          <input
                            type="checkbox"
                            checked={selectedImages.includes(img.image_name)}
                            onChange={() => handleImageToggle(img.image_name)}
                          />
                          {img.image_name}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductImageSelector;
