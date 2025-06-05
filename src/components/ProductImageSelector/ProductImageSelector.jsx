import React, { useEffect, useState } from "react";
import "./ProductImageSelector.css";

const ProductImageSelector = ({ mode, products = [], release, selectedProducts = [], onSelectionChange }) => {
  const [selected, setSelected] = useState({});
  const [expanded, setExpanded] = useState({});
  const [searchTerm, setSearchTerm] = useState("");





  console.log("product data in child ", products);
  console.log("release ", release)
  console.log("selectedproducts in child ", selectedProducts);
  // Filter products based on search term
  const visibleProducts =
    mode === "read"
      ? selectedProducts
      : products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );



  useEffect(() => {
    if (mode === "editPrepopulate") {
      const initSelected = {};
      selectedProducts.forEach((product) => {
        initSelected[product.name] = new Set(
          product.images.map((image) => image.image_name)
        );
      });
      setSelected({ ...initSelected }); // ensure new object reference
    }
    else if (mode === "read") {
      const initSelected = {};
      const initExpanded = {};
      selectedProducts.forEach((product) => {
        initSelected[product.name] = new Set(
          product.images.map((image) => image.image_name)
        );
        initExpanded[product.name] = false; // auto-expand
      });
      setSelected(initSelected);
      setExpanded(initExpanded);
    }

  }, [mode, selectedProducts]);

  const isChecked = (productName, imageName = null) => {
    if (!selected[productName]) return false;
    if (imageName) return selected[productName].has(imageName);
    return selected[productName].size > 0;
  };

  const handleImageToggle = (productName, image) => {
    const updated = { ...selected };
    if (!updated[productName]) updated[productName] = new Set();

    if (updated[productName].has(image.image_name)) {
      updated[productName].delete(image.image_name);
    } else {
      updated[productName].add(image.image_name);
    }

    if (updated[productName].size === 0) {
      delete updated[productName];
    }

    setSelected(updated);
    propagateSelection(updated);
  };

  const propagateSelection = (selectedMap) => {
    const selectedList = Object.entries(selectedMap).map(([productName, imageSet]) => {
      const productObj = products.find((p) => p.name === productName);
      return {
        name: productName,
        images: productObj.images
          .filter((img) => imageSet.has(img.image_name))
          .map(img => ({
            ...img,
            // build_number: patchName,  
          })),
      };
    });
    onSelectionChange(selectedList);
  };

  const toggleExpand = (productName) => {
    setExpanded((prev) => ({ ...prev, [productName]: !prev[productName] }));
  };
  const handleProductToggle = (productName, images) => {
    const updated = { ...selected };
    const allSelected = selected[productName] && images.every(img => selected[productName].has(img.image_name));

    if (allSelected) {
      // Unselect all
      delete updated[productName];
    } else {
      // Select all
      updated[productName] = new Set(images.map(img => img.image_name));
    }

    setSelected(updated);
    propagateSelection(updated);
  };


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
              visibleProducts.map((product) => (
                <div key={product.name} className="product-item">
                  <div className="product-header">
                    <div className="product-title-checkbox">
                      <input
                        type="checkbox"
                        checked={isChecked(product.name)}
                        disabled={mode === "read"}
                        onChange={() => handleProductToggle(product.name, product.images)}
                      />
                      <label>{product.name}</label>
                    </div>
                    <button type="button" className="expand-btn" onClick={() => toggleExpand(product.name)}>
                      {expanded[product.name] ? "−" : "+"}
                    </button>
                  </div>

                  {expanded[product.name] && (
                    <div className="image-list">
                      {product.images.map((image) => (
                        <div key={image.image_name} className="image-item">
                          <input
                            type="checkbox"
                            checked={isChecked(product.name, image.image_name)}
                            disabled={mode === "read"}
                            onChange={() => handleImageToggle(product.name, image)}
                          />
                          <label>{image.image_name}</label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductImageSelector;
