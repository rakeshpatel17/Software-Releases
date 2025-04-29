import React, { useState, useEffect } from 'react';
import './Form.css';
import post_patches from '../../api/post_patches';
import get_release from '../../api/release';
 
function Form({ onCancel,lockedRelease }) {
    const [formData, setFormData] = useState({
        name: '',
        releaseDate: '',
        description: '',
        patchVersion: '',
        patchState: 'New',
        isDeleted: false,
        selectedProduct: '',
        expandedProduct: null,
    });

    const [selectedImages, setSelectedImages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [releaseList, setReleaseList] = useState([]);

    // useEffect(() => {
    //     const fetchReleases = async () => {
    //         const data = await get_release();
    //         if (data && data.length > 0) {
    //             setReleaseList(data);
    //             setFormData((prev) => ({
    //                 ...prev,
    //                 release: data[0].id,
    //             }));
    //         }
    //     };

    //     fetchReleases();
    // }, []);
    useEffect(() => {
        const fetchReleases = async () => {
          const data = await get_release();
          if (data && data.length > 0) {
            setReleaseList(data);
     
            setFormData((prev) => ({
              ...prev,
              release: lockedRelease || data[0].id, // use lockedRelease if present
            }));
          }
        };
     
        fetchReleases();
      }, [lockedRelease]);
     

    const productData = [
        { name: 'Product A', images: ['Image A1', 'Image A2', 'Image A3'] },
        { name: 'Product B', images: ['Image B1', 'Image B2'] },
        { name: 'Product C', images: ['Image C1', 'Image C2', 'Image C3'] },
        { name: 'Product D', images: ['Image d1', 'Image d2', 'Image d3'] },
        { name: 'Product E', images: ['Image e1', 'Image e2', 'Image e3'] },
        { name: 'Product F', images: ['Image f1', 'Image f2', 'Image f3'] },

    ];

    // const handleChange = (e) => {
    //     const { name, value, type, checked } = e.target;
    //     setFormData((prevData) => ({
    //         ...prevData,
    //         [name]: type === 'checkbox' ? checked : value,
    //     }));
    // };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: type === 'checkbox' ? checked : value,
        }));
      };
     
      const handleSubmit = async (e) => {
      //e.preventDefault();
      console.log('Submitted Form:', formData);
     
      try {
        const response = await post_patches(formData);
        console.log('Response from post_patches:', response);
      } catch (error) {
        console.error('Error in handleSubmit:', error);
      }
    };

    const handleImageToggle = (image) => {
        setSelectedImages((prev) =>
            prev.includes(image)
                ? prev.filter((img) => img !== image)
                : [...prev, image]
        );
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     console.log('Submitted Form:', formData);
    //     console.log('Selected Images:', selectedImages);
    // };

    const filteredProducts = productData.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <div className="inline-fields">
                <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Release</label>
                    <select
                        name="release"
                        value={formData.release}
                        onChange={handleChange}
                        className="form-select"
                    >
                        {releaseList.map((release) => (
                            <option key={release.id} value={release.id}>
                                {release.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Release date</label>
                    <input
                        type="date"
                        name="releaseDate"
                        value={formData.releaseDate}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="form-textarea"
                />
            </div>

            <div className="inline-fields">
                <div className="form-group">
                    <label className="form-label">Patch version</label>
                    <input
                        name="patchVersion"
                        value={formData.patchVersion}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Patch state</label>
                    <select
                        name="patchState"
                        value={formData.patchState}
                        onChange={handleChange}
                        className="form-select"
                    >
                        <option value="New">New</option>
                        <option value="Released">Released</option>
                        <option value="Verified">Verified</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="checkbox-group">
                <input
                    type="checkbox"
                    name="isDeleted"
                    checked={formData.isDeleted}
                    onChange={handleChange}
                    id="isDeleted"
                />
                <label htmlFor="isDeleted">Is deleted</label>
            </div>

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
                            const isExpanded = formData.expandedProduct === product.name;
                            return (
                                <div key={product.name} className="product-item">
                                    <div className="product-header">
                                        <div className="product-title-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={product.images.some((img) => selectedImages.includes(img))}
                                                onChange={(e) => {
                                                    const isChecked = e.target.checked;
                                                    const productImages = product.images;

                                                    setSelectedImages((prev) => {
                                                        if (isChecked) {
                                                            return [...new Set([...prev, ...productImages])];
                                                        } else {
                                                            return prev.filter((img) => !productImages.includes(img));
                                                        }
                                                    });
                                                }}
                                            />
                                            <span className="product-name">{product.name}</span>
                                        </div>

                                        <button
                                            type="button"
                                            className="expand-btn"
                                            onClick={() =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    expandedProduct: isExpanded ? null : product.name,
                                                }))
                                            }
                                        >
                                            {isExpanded ? '-' : '+'}
                                        </button>
                                    </div>


                                    {isExpanded && (
                                        <div className="image-list">
                                            {product.images.map((img, idx) => (
                                                <label key={idx} className="image-item">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedImages.includes(img)}
                                                        onChange={() => handleImageToggle(img)}
                                                    />
                                                    {img}
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


            <div className="form-actions">
                <button type="button" className="cancel-button" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit" className="submit-button">
                    SAVE
                </button>
            </div>
        </form>
    );
}

export default Form;