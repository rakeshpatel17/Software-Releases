
import { useState, useEffect } from 'react';
import './Form.css';
import get_release from '../../api/release';
import getAllProducts from '../../api/product';
import post_patches from '../../api/post_patches';
import get_patches from '../../api/patches';
import ProductImageSelector from '../ProductImageSelector/ProductImageSelector';
import JarSelector from '../JarSelector/JarSelector';
import { useLocation } from 'react-router-dom';
import HighLevelScopeComponent from '../HighLevelScope/HighLevelScope';
import CancelButton from '../Button/CancelButton';
import SaveButton from '../Button/SaveButton';


function Form({ onCancel, lockedRelease: lockedReleaseProp, isEditing = true }) {
    const location = useLocation();
    const lockedRelease = lockedReleaseProp || location.state?.lockedRelease;
    // const [formData, setFormData] = useState({
    //     name: '',
    //     release: lockedRelease || '24.2',
    //     release_date: '',
    //     code_freeze: '',
    //     qa_build: '',
    //     description: '',
    //     //patch_version: '',
    //     patch_state: 'new',
    //     is_deleted: false,
    //     //selectedProduct: '',
    //     // expandedProduct: null,
    // });
    const [formData, setFormData] = useState({
        name: '',
        release: lockedRelease || '24.2',
        release_date: '',
        code_freeze: '',
        platform_qa_build: '',
        description: '',
        patch_state: 'new',
        is_deleted: false,
        client_build_availability: '',
        high_level_scope_input: [],
        kick_off: '',
        product_images: [],
        related_products: [],
        third_party_jars_input: [],
    });

    const [selectedImages, setSelectedImages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [releaseList, setReleaseList] = useState([]);
    const [productData, setProductData] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    //const [patchSize, setPatchSize] = useState([]);
    const [expandedProduct, setExpandedProduct] = useState([]);
    const [productSearchTerm, setProductSearchTerm] = useState('');



    // JAR-specific state
    const [jarSearchTerm, setJarSearchTerm] = useState('');
    const [filteredJars, setFilteredJars] = useState([]);
    const [selectedJars, setSelectedJars] = useState([
        { name: 'log4j', version: '2.1', remarks: 'Major upgrade' },
        { name: 'commons-io', version: '2.2', remarks: 'Minor upgrade' },
        { name: 'guava', version: '3.1', remarks: 'Security patch applied' },
    ]);
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
                // console.log("patchdata:", patchData.length);
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

        const transformedHighLevelScope = highLevelScope.map(item => ({
            name: item.label || item.name,
            version: item.version || "1.0"
        }));

        const transformedSelectedJars = selectedJars.map(item => ({
            name: item.label || item.name,
            version: item.version || "1.0",
            remarks: item.remarks || ""
        }));

        console.log('Transformed High Level Scope:', transformedHighLevelScope);
        console.log('Transformed Third Party Jars:', transformedSelectedJars);

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
            // related_products: selectedProducts.map(prod => prod.name),
            related_products: selectedProducts.map(prod => prod.name),
            product_images: selectedImages,
            high_level_scope_input: transformedHighLevelScope,
            third_party_jars_input: transformedSelectedJars,
        };

        try {
            console.log("Final Form Data to send:", finalData);
            const response = await post_patches(finalData);
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

    // const filteredProducts = productData.filter((product) =>
    //     product.name.toLowerCase().includes(searchTerm.toLowerCase())
    // );


    //high level scope
    const [highLevelScope, setHighLevelScope] = useState([
        { label: 'alpine', value: '' },
        { label: 'jdk', value: '' },
        { label: 'new_relic', value: '' },
    ]);

    const handleScopeChange = (index, newValue) => {
        const updatedScope = [...highLevelScope];
        updatedScope[index].value = newValue;
        setHighLevelScope(updatedScope);
    };

    //jars




    // client side validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        else if (!formData.name.startsWith(formData.release)) {
            newErrors.name = `Name must start with release version (${formData.release})`;
        }
        if (!formData.release_date) newErrors.release_date = 'Release date is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';

        if (!formData.code_freeze) newErrors.code_freeze = 'Code Freeze date is required';
        if (!formData.platform_qa_build) newErrors.platform_qa_build = 'Platform QA Build Date is required';
        if (!formData.client_build_availability) newErrors.client_build_availability = 'Client Build Date is required';
        if (!formData.kick_off) newErrors.kick_off = 'Kick Off Date is required';



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

    useEffect(() => {
        if (formData.release_date) {
            setFormData((prev) => ({
                ...prev,
                code_freeze: prev.code_freeze || getPreviousDate(formData.release_date, 5),
                platform_qa_build: prev.platform_qa_build || getPreviousDate(formData.release_date, 10),
                client_build_availability: prev.client_build_availability || getPreviousDate(formData.release_date, 3),
                kick_off: prev.kick_off || getPreviousDate(formData.release_date, 30),
            }));
        }
    }, [formData.release_date]);



    return (
        <>

            <form className="form-container" onSubmit={handleSubmit}>
                <div className="inline-fields">
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
                        <label className="form-label">Version</label>
                        <input
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            className="form-input"
                        />
                        {errors.name && <span className="error-text">{errors.name}</span>}

                    </div>


                    {/*Release Date */}
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
                            min={new Date().toISOString().split("T")[0]}
                            max={formData.release_date}
                        //readOnly
                        />
                        {errors.code_freeze && <span className="error-text">{errors.code_freeze}</span>}

                    </div>

                    {/* Platform QA Build */}
                    <div className="form-group">
                        <label className="form-label">Platform QA Build Date</label>
                        <input
                            type="date"
                            name="platform_qa_build"
                            onChange={handleChange}
                            value={formData.platform_qa_build || getPreviousDate(formData.release_date, 10)}
                            className="form-input"
                            min={new Date().toISOString().split("T")[0]}
                            max={formData.release_date}
                        //readOnly 	
                        />
                        {errors.platform_qa_build && <span className="error-text">{errors.platform_qa_build}</span>}

                    </div>

                    {/* Client Build date */}
                    <div className="form-group">
                        <label className="form-label">Client Build Date</label>
                        <input
                            type="date"
                            name="client_build_availability"
                            onChange={handleChange}
                            value={formData.client_build_availability || getPreviousDate(formData.release_date, 3)}
                            className="form-input"
                            min={new Date().toISOString().split("T")[0]}
                            max={formData.release_date}
                        //readOnly
                        />
                        {errors.client_build_availability && <span className="error-text">{errors.client_build_availability}</span>}
                    </div>

                    {/* Kick Off date */}
                    <div className="form-group">
                        <label className="form-label">Kick Off Date</label>
                        <input
                            type="date"
                            name="kick_off"
                            onChange={handleChange}
                            value={formData.kick_off || getPreviousDate(formData.release_date, 30)}
                            className="form-input"
                            min={new Date().toISOString().split("T")[0]}
                            max={formData.release_date}
                        //readOnly
                        />
                        {errors.kick_off && <span className="error-text">{errors.kick_off}</span>}
                    </div>
                </div>
                <HighLevelScopeComponent
                    highLevelScope={highLevelScope}
                    setHighLevelScope={setHighLevelScope}
                    isEditing={true}
                />
                {/* Third-Party JAR Search */}

                <JarSelector
                    mode="edit"
                    selectedJars={selectedJars}
                    setSelectedJars={setSelectedJars}
                    isEditing={true}
                />

                <div className="form-group">
                    <label className="form-label">KBA</label>
                    <input
                        type="text"
                        name="KBA"
                        // value={formData.description}
                        // onChange={handleChange}
                        className="form-textarea"
                    />
                    {/* {errors.description && <span className="error-text">{errors.description}</span>} */}
                </div>

                <div className="form-group">
                    <label className="form-label">Functional Fixes</label>
                    <input
                        type="text"
                        name="FunctionalFixes"
                        // value={formData.description}
                        // onChange={handleChange}
                        className="form-textarea"
                    />
                    {/* {errors.description && <span className="error-text">{errors.description}</span>} */}
                </div>


                <div className="form-group">
                    <label className="form-label">Security issues</label>
                    <input
                        type="text"
                        name="SecurityIssues"
                        // value={formData.description}
                        // onChange={handleChange}
                        className="form-textarea"
                    />
                    {/* {errors.description && <span className="error-text">{errors.description}</span>} */}
                </div>

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
                </div>
                <ProductImageSelector
                    productData={productData}
                    selectedImages={selectedImages}  // pass current state instead of []
                    searchTerm={productSearchTerm}
                    setSearchTerm={setProductSearchTerm}
                    expandedProduct={expandedProduct}
                    setExpandedProduct={setExpandedProduct}
                    handleProductSelection={handleProductSelection}
                    handleImageToggle={handleImageToggle}
                    readOnly={false}
                    patchSpecificImages={[]}
                    mode="edit-empty"
                />



                {/* {errors.products && <span className="error-text">{errors.products}</span>} */}


                {/* Third-Party JAR Search */}
                {/* <JarSelector
                    mode="search"
                    jarSearchTerm={jarSearchTerm}
                    setJarSearchTerm={setJarSearchTerm}
                    filteredJars={filteredJars}
                    expandedJar={expandedJar}
                    setExpandedJar={setExpandedJar}
                    selectedJars={selectedJars}
                    setSelectedJars={setSelectedJars}
                /> */}



                <div className="form-actions">
                    <CancelButton onCancel={onCancel} />
                    <SaveButton />
                </div>
            </form>
        </>
    );
}

export default Form;

