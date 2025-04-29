
// import React, { useState, useEffect } from 'react';
// import './Form.css';
// import get_release from '../../api/release';
// import getAllProducts from '../../api/product';
// import post_patches from '../../api/post_patches';

// function Form({ onCancel, lockedRelease }) {
//     const [formData, setFormData] = useState({
//         name: '',
//         releaseDate: '',
//         description: '',
//         patchVersion: '',
//         patchState: 'New',
//         selectedProduct: '',
//         expandedProduct: null,
//     });

//     const [selectedImages, setSelectedImages] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [releaseList, setReleaseList] = useState([]);
//     const [productData, setProductData] = useState([]);
//     const [selectedProducts, setSelectedProducts] = useState([]);

//     useEffect(() => {
//         const fetchReleases = async () => {
//             const data = await get_release();
//             if (data && data.length > 0) {
//                 setReleaseList(data);
//                 setFormData((prev) => ({
//                     ...prev,
//                     release: lockedRelease || data[0].id,
//                 }));
//             }
//         };
//         fetchReleases();
//     }, [lockedRelease]);

//     useEffect(() => {
//         const fetchProducts = async () => {
//             const data = await getAllProducts();
//             if (data && data.length > 0) {
//                 setProductData(data);
//             }
//         };
//         fetchProducts();
//     }, []);

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData((prevData) => ({
//             ...prevData,
//             [name]: type === 'checkbox' ? checked : value,
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         // Build the final structured data
//         const finalData = {
//             ...formData,
//             products: selectedProducts.map((product) => {
//                 const selectedImagesForProduct = (product.images || [])
//                     .filter((img) => selectedImages.includes(img.image_name))
//                     .map((img) => img.image_name);

//                 return {
//                     productName: product.name, 
//                     selectedImages: selectedImagesForProduct,
//                 };
//             }),
//         };

//         console.log('Final Submitted Data:', finalData);

//         // Uncomment the following to POST the data to your database
//         /*
//         try {
//             const response = await post_patches(finalData);
//             console.log('Response from post_patches:', response);
//         } catch (error) {
//             console.error('Error while posting to database:', error);
//         }
//         */
//     };

//     const handleImageToggle = (image) => {
//         setSelectedImages((prev) =>
//             prev.includes(image)
//                 ? prev.filter((img) => img !== image)
//                 : [...prev, image]
//         );
//     };

//     const handleProductSelection = (product, isChecked) => {
//         const productImages = product.images || [];

//         // Update selected images based on product selection
//         setSelectedImages((prev) => {
//             if (isChecked) {
//                 return [...new Set([...prev, ...productImages.map((img) => img.image_name)])];
//             } else {
//                 return prev.filter((img) => !productImages.some((prodImg) => prodImg.image_name === img));
//             }
//         });

//         // Update selected products using product.name as the unique key
//         setSelectedProducts((prev) => {
//             if (isChecked) {
//                 // Add the full product object (using name as identifier)
//                 return [...new Set([...prev, { name: product.name, images: product.images }])];
//             } else {
//                 // Remove the product by matching its name
//                 return prev.filter((prod) => prod.name !== product.name);
//             }
//         });
//     };

//     const filteredProducts = productData.filter((product) =>
//         product.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <form className="form-container" onSubmit={handleSubmit}>
//             <div className="inline-fields">
//                 <div className="form-group">
//                     <label className="form-label">Name</label>
//                     <input
//                         name="name"
//                         type="text"
//                         value={formData.name}
//                         onChange={handleChange}
//                         className="form-input"
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label className="form-label">Release</label>
//                     <select
//                         name="release"
//                         value={formData.release}
//                         onChange={handleChange}
//                         className="form-select"
//                         disabled={!!lockedRelease} // disable if lockedRelease is passed
//                     >
//                         {releaseList.map((release) => (
//                             <option key={release.id} value={release.id}>
//                                 {release.name}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 <div className="form-group">
//                     <label className="form-label">Release date</label>
//                     <input
//                         type="date"
//                         name="releaseDate"
//                         value={formData.releaseDate}
//                         onChange={handleChange}
//                         className="form-input"
//                         min={new Date().toISOString().split("T")[0]}
//                     />
//                 </div>
//             </div>

//             <div className="form-group">
//                 <label className="form-label">Description</label>
//                 <textarea
//                     name="description"
//                     value={formData.description}
//                     onChange={handleChange}
//                     rows="3"
//                     className="form-textarea"
//                 />
//             </div>

//             <div className="inline-fields">
//                 <div className="form-group">
//                     <label className="form-label">Patch version</label>
//                     <input
//                         name="patchVersion"
//                         value={formData.patchVersion}
//                         onChange={handleChange}
//                         className="form-input"
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label className="form-label">Patch state</label>
//                     <select
//                         name="patchState"
//                         value={formData.patchState}
//                         onChange={handleChange}
//                         className="form-select"
//                     >
//                         <option value="New">New</option>
//                         <option value="Released">Released</option>
//                         <option value="Verified">Verified</option>
//                         <option value="Rejected">Rejected</option>
//                     </select>
//                 </div>
//             </div>

//             <div className="form-group">
//                 <label className="form-label">Search Product</label>
//                 <input
//                     type="text"
//                     placeholder="Search products..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="form-input"
//                 />
//             </div>

//             <div className="form-group">
//                 <div className="scrollable-product-list">
//                     <div className="product-list">
//                         {filteredProducts.map((product) => {
//                             const isExpanded = formData.expandedProduct === product.name;
//                             return (
//                                 <div key={product.name} className="product-item">
//                                     <div className="product-header">
//                                         <div className="product-title-checkbox">
//                                             <input
//                                                 type="checkbox"
//                                                 checked={product.images && product.images.some((img) => selectedImages.includes(img.image_name))}
//                                                 onChange={(e) => {
//                                                     const isChecked = e.target.checked;
//                                                     handleProductSelection(product, isChecked);
//                                                 }}
//                                             />
//                                             <span className="product-name">{product.name}</span>
//                                         </div>

//                                         <button
//                                             type="button"
//                                             className="expand-btn"
//                                             onClick={() =>
//                                                 setFormData((prev) => ({
//                                                     ...prev,
//                                                     expandedProduct: isExpanded ? null : product.name,
//                                                 }))
//                                             }
//                                         >
//                                             {isExpanded ? '-' : '+'}
//                                         </button>
//                                     </div>

//                                     {isExpanded && product.images && (
//                                         <div className="image-list">
//                                             {product.images.map((img, idx) => (
//                                                 <label key={idx} className="image-item">
//                                                     <input
//                                                         type="checkbox"
//                                                         checked={selectedImages.includes(img.image_name)}
//                                                         onChange={() => handleImageToggle(img.image_name)}
//                                                     />
//                                                     {img.image_name}
//                                                 </label>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>
//             </div>



//             <div className="form-actions">
//                 <button type="button" className="cancel-button" onClick={onCancel}>
//                     Cancel
//                 </button>
//                 <button type="submit" className="submit-button">
//                     SAVE
//                 </button>
//             </div>
//         </form>
//     );
// }

// export default Form;


import React, { useState, useEffect } from 'react';
import './Form.css';
import get_release from '../../api/release';
import getAllProducts from '../../api/product';
import post_patches from '../../api/post_patches';

function Form({ onCancel, lockedRelease }) {
    const [formData, setFormData] = useState({
        name: '',
        releaseDate: '',
        description: '',
        patchVersion: '',
        patchState: 'New',
        selectedProduct: '',
        expandedProduct: null,
        
    });

    const [selectedImages, setSelectedImages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [releaseList, setReleaseList] = useState([]);
    const [productData, setProductData] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    // JAR-specific state
    const [jarSearchTerm, setJarSearchTerm] = useState('');
    const [filteredJars, setFilteredJars] = useState([]);
    const [selectedJars, setSelectedJars] = useState([]);
    const [expandedJar, setExpandedJar] = useState(null);

    const staticJarData = [
        { name: 'commons-cli' },
        { name: 'commons-codec' },
        { name: 'commons-io' },
        { name: 'log4j' },
        { name: 'spring-core' },
        { name: 'spring-security' },
        { name: 'xmlsec' },
    ];

    useEffect(() => {
        const fetchReleases = async () => {
            const data = await get_release();
            if (data && data.length > 0) {
                setReleaseList(data);
                setFormData((prev) => ({
                    ...prev,
                    release: lockedRelease || data[0].id,
                }));
            }
        };
        fetchReleases();
    }, [lockedRelease]);

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getAllProducts();
            if (data && data.length > 0) {
                setProductData(data);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (jarSearchTerm.trim()) {
            const filtered = staticJarData.filter(jar =>
                jar.name.toLowerCase().includes(jarSearchTerm.toLowerCase())
            );
            setFilteredJars(filtered);
        } else {
            setFilteredJars([]);
        }
    }, [jarSearchTerm]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalData = {
            ...formData,
            products: selectedProducts.map((product) => {
                const selectedImagesForProduct = (product.images || [])
                    .filter((img) => selectedImages.includes(img.image_name))
                    .map((img) => img.image_name);

                return {
                    productName: product.name,
                    selectedImages: selectedImagesForProduct,
                };
            }),
            thirdPartyJars: selectedJars,
        };

        console.log('Final Submitted Data:', finalData);

        /*
        try {
            const response = await post_patches(finalData);
            console.log('Response from post_patches:', response);
        } catch (error) {
            console.error('Error while posting to database:', error);
        }
        */
    };

    const handleImageToggle = (image) => {
        setSelectedImages((prev) =>
            prev.includes(image) ? prev.filter((img) => img !== image) : [...prev, image]
        );
    };

    const handleProductSelection = (product, isChecked) => {
        const productImages = product.images || [];

        setSelectedImages((prev) => {
            if (isChecked) {
                return [...new Set([...prev, ...productImages.map((img) => img.image_name)])];
            } else {
                return prev.filter((img) => !productImages.some((prodImg) => prodImg.image_name === img));
            }
        });

        setSelectedProducts((prev) => {
            if (isChecked) {
                return [...prev, { name: product.name, images: product.images }];
            } else {
                return prev.filter((prod) => prod.name !== product.name);
            }
        });
    };

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
                        disabled={!!lockedRelease}
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
                        min={new Date().toISOString().split("T")[0]}
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
                                                checked={product.images && product.images.some((img) => selectedImages.includes(img.image_name))}
                                                onChange={(e) => handleProductSelection(product, e.target.checked)}
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

            {/* Third-Party JAR Search */}
            <div className="form-group">
                <label className="form-label">Add Third-Party JAR</label>
                <div className="jar-search-wrapper">
                    <div className="jar-search-bar" style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type="text"
                            placeholder="Search for JAR"
                            value={jarSearchTerm}
                            onChange={(e) => {
                                setJarSearchTerm(e.target.value);
                                setExpandedJar(null);
                            }}
                            className="form-input search-jar-input"
                            style={{ flex: 1 }}
                        />
                    </div>

                    {filteredJars.length > 0 && !expandedJar && (
                        <div className="jar-dropdown">
                            {filteredJars.map((jar) => (
                                <div
                                    key={jar.name}
                                    className="jar-dropdown-item"
                                    style={{ cursor: 'pointer', padding: '0.5rem' }}
                                    onClick={() => {
                                        setExpandedJar(jar.name);
                                        setJarSearchTerm('');
                                    }}
                                >
                                    {jar.name}
                                </div>
                            ))}
                        </div>
                    )}

                    {expandedJar && (
                        <div
                            className="jar-selected"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '1px solid #ccc',
                                borderRadius: '6px',
                                padding: '0.5rem',
                                marginTop: '0.5rem',
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={selectedJars.includes(expandedJar)}
                                onChange={() =>
                                    setSelectedJars((prev) =>
                                        prev.includes(expandedJar)
                                            ? prev.filter((name) => name !== expandedJar)
                                            : [...prev, expandedJar]
                                    )
                                }
                                style={{ marginRight: '0.5rem' }}
                            />
                            <span style={{ flex: 1, color: '#2c3e50' }}>{expandedJar}</span>
                            <input
                                type="text"
                                placeholder="Version"
                                className="form-input"
                                style={{ marginLeft: '0.5rem' }}
                            />
                            <button
                                type="button"
                                onClick={() => setExpandedJar(null)}
                                style={{
                                    backgroundColor: '#f5f5f5',
                                    border: 'none',
                                    fontSize: '1.2rem',
                                    color: '#007bff',
                                    cursor: 'pointer',
                                    marginLeft:'10px'
                                }}
                            >
                                +
                            </button>
                        </div>
                    )}
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
