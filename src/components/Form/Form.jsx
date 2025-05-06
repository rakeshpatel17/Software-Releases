 
import React, { useState, useEffect } from 'react';
import './Form.css';
import get_release from '../../api/release';
import getAllProducts from '../../api/product';
import post_patches from '../../api/post_patches';
import get_patches from '../../api/patches';
import ProductImageSelector from '../ProductImageSelector';
import JarSelector from '../JarSelector';
 
 
function Form({ onCancel, lockedRelease }) {
    const [formData, setFormData] = useState({
        name: '',
        release: lockedRelease || '24.2',
        release_date: '',
        code_freeze:'',
        qa_build:'',
        description: '',
        //patch_version: '',
        patch_state: 'new',
        is_deleted: false,
        //selectedProduct: '',
        // expandedProduct: null,
    });
    const [selectedImages, setSelectedImages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [releaseList, setReleaseList] = useState([]);
    const [productData, setProductData] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    //const [patchSize, setPatchSize] = useState([]);
 
    // JAR-specific state
    const [jarSearchTerm, setJarSearchTerm] = useState('');
    const [filteredJars, setFilteredJars] = useState([]);
    const [selectedJars, setSelectedJars] = useState([]);
    const [expandedJar, setExpandedJar] = useState(null);
 
 
    //error
    const [errors, setErrors] = useState({});
 
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
        const fetchPatchSizeAndSetName = async () => {
            try {
                const patchData = await get_patches(formData.release);
                console.log("patchdata:", patchData.length);
                const size = patchData.length;
 
                //setPatchSize(size);
 
                setFormData((prev) => ({
                    ...prev,
                    name: formData.release + '.' + (size + 1),
                    patch_version: formData.release + '.' + (size + 1),
                }));
            } catch (error) {
                console.error("Failed to fetch patches:", error);
            }
        };
 
        if (formData.release) {
            fetchPatchSizeAndSetName();
        }
    }, [formData.release]);
 
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
 
     //product
    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getAllProducts();
            if (data && data.length > 0) {
                setProductData(data);
            }
        };
        fetchProducts();
    }, []);
 
     //jars
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
        console.log("Form Data before validation:", formData);  
 
        if (!validateForm()) {
            console.warn('Validation failed');
            return;
        }
 
 
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
 
        console.log('Final Submitted Data:', formData);
 
 
        try {
            const response = await post_patches(formData);
            console.log('Response from post_patches:', response);
        } catch (error) {
            console.error('Error while posting to database:', error);
        }
 
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
 
 
    //high level scope
    const [highLevelScope, setHighLevelScope] = useState([
        { label: 'Base OS', value: '' },
        { label: 'Tomcat', value: '' },
        { label: 'JDK', value: '' },
        { label: 'OTDS', value: '' },
        { label: 'New Relic', value: '' }
    ]);
 
 
    const handleHighLevelScopeChange = (index, newValue) => {
        setHighLevelScope(prev => {
            const updated = [...prev];
            updated[index].value = newValue;
            return updated;
        });
    };
 
    // client side validation
    const validateForm = () => {
        const newErrors = {};
 
        if (!formData.name.trim()) newErrors.name = 'Name is required'; 
        else  if (!formData.name.startsWith(formData.release)) {
            newErrors.name = `Name must start with release version (${formData.release})`;
        }
    
    
        if (!formData.release_date) newErrors.release_date = 'Release date is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';


        if (!formData.release_date) newErrors.code_freeze = 'Code Freeze date is required';
        if (!formData.release_date) newErrors.qa_build = 'Platform QA Build Date is required';

 
        // const scopeErrors = highLevelScope.map((item) => item.value.trim() === '');
        // if (scopeErrors.includes(true)) {
        //     newErrors.highLevelScope = 'high-level scope fields must be filled';
        // }
 
        if (selectedProducts.length === 0) {
            newErrors.products = 'At least one product must be selected';
        }
   
 
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    // To get code freeze date
    const getPreviousDate = (releaseDate, days) => {
        if (!releaseDate) return '';
        const date = new Date(releaseDate);
        date.setDate(date.getDate() - days);
        return date.toISOString().split('T')[0]; // returns YYYY-MM-DD
    };
 
 
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
                    {errors.name && <span className="error-text">{errors.name}</span>}
 
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
                        name="release_date"
                        value={formData.release_date}
                        onChange={handleChange}
                        className="form-input"
                        min={new Date().toISOString().split("T")[0]}
                    />
                    {errors.release_date && <span className="error-text">{errors.release_date}</span>}
 
                </div>

                {/* code freeze date */}
                <div className="form-group">
                    <label className="form-label">Code Freeze Date</label>
                    <input
                        type="date"
                        name="code_freeze"
                        onChange={handleChange}
                        value={formData.code_freeze || getPreviousDate(formData.release_date, 5)}
                        className="form-input"
                        //readOnly
                    />
                         {errors.code_freeze && <span className="error-text">{errors.code_freeze}</span>}
                </div>

                {/* Platform QA Build */}
                <div className="form-group">
                    <label className="form-label">Platform QA Build Date</label>
                    <input
                        type="date"
                        name="qa_build"
                        onChange={handleChange}
                        value={formData.qa_build || getPreviousDate(formData.release_date, 10)}
                        className="form-input"
                        //readOnly
                    />
                     {errors.qa_build && <span className="error-text">{errors.qa_build}</span>}

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
                {errors.description && <span className="error-text">{errors.description}</span>}
 
            </div>
 
            <div className="inline-fields">
                {/* <div className="form-group">
              <label className="form-label">Patch version</label>
              <input
                  name="patchVersion"
                  value={formData.patchVersion}
                  onChange={handleChange}
                  className="form-input"
              />
          </div> */}
 
                <div className="form-group">
                    <label className="form-label">Patch state</label>
                    <select
                        name="patch_state"
                        value={formData.patch_state}
                        onChange={handleChange}
                        className="form-select"
                    >
                        <option value="new">New</option>
                        <option value="released">Released</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>
            {/* High Level Scope */}
            <label className="form-label">High Level Scope</label>
            <div className="form-group">
                {highLevelScope.map((item, index) => (
                    <div className="inline-fields" key={index}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">{item.label}</label>
                        </div>
                        <div className="form-group" style={{ flex: 1.5, maxWidth: '380px' }}>
                            <input
                                type="text"
                                className="form-input"
                                value={item.value}
                                onChange={(e) => handleHighLevelScopeChange(index, e.target.value)}
                            />
                        </div>
                    </div>
                ))}
                {/* {errors.highLevelScope && <span className="error-text">{errors.highLevelScope}</span>} */}
 
            </div>
 
            <ProductImageSelector
                productData={productData}
                selectedImages={selectedImages}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                expandedProduct={formData.expandedProduct}
                setExpandedProduct={(val) =>
                    setFormData((prev) => ({ ...prev, expandedProduct: val }))
                }
                handleProductSelection={handleProductSelection}
                handleImageToggle={handleImageToggle}
            />
            {/* {errors.products && <span className="error-text">{errors.products}</span>} */}
 
 
            {/* Third-Party JAR Search */}
            <JarSelector
                jarSearchTerm={jarSearchTerm}
                setJarSearchTerm={setJarSearchTerm}
                filteredJars={filteredJars}
                expandedJar={expandedJar}
                setExpandedJar={setExpandedJar}
                selectedJars={selectedJars}
                setSelectedJars={setSelectedJars}
            />
 
 
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
 
 