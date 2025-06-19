import { useNavigate } from 'react-router-dom';
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
import { useOutletContext } from 'react-router-dom';




function Form({ onCancel, lockedRelease: lockedReleaseProp, isEditing = true }) {
    const location = useLocation();
    const lockedRelease = lockedReleaseProp || location.state?.lockedRelease;
    const [formData, setFormData] = useState({
        name: '',
        release: lockedRelease || '',
        release_date: '',
        code_freeze: '',
        platform_qa_build: '',
        description: '',
        patch_state: 'new',
        is_deleted: false,
        client_build_availability: '',
        scopes_data: [],
        kick_off: '',
        products_data: [],
        jars_data: [],
    });


    const [releaseList, setReleaseList] = useState([]);
    const [productData, setProductData] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedRelease, setSelectedRelease] = useState("");


    // JAR-specific state
    const [jarSearchTerm, setJarSearchTerm] = useState('');
    const [filteredJars, setFilteredJars] = useState([]);
    const [selectedJars, setSelectedJars] = useState([
        { name: 'log4j', version: '2.1', remarks: 'Major upgrade' },
        { name: 'commons-io', version: '2.2', remarks: 'Minor upgrade' },
        { name: 'guava', version: '3.1', remarks: 'Security patch applied' },
    ]);


    


    //error
    const [errors, setErrors] = useState({});

    //title
    const { searchTerm, setTitle } = useOutletContext();
    useEffect(() => {
        setTitle(`Add New Patch`);
    }, []);


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

    //  product
    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getAllProducts();
            if (data && data.length > 0) {
                let releaseObj;
                if (selectedRelease) {
                    releaseObj = data.find(obj => Object.keys(obj)[0] === selectedRelease);
                }
                if (!releaseObj) releaseObj = data[0]; // fallback

                const releaseKey = Object.keys(releaseObj)[0];
                const releaseProducts = releaseObj[releaseKey];

                setSelectedRelease(releaseKey); setProductData(releaseProducts);
                console.log("productdata", data)

            }

        }


        fetchProducts();
    }, [selectedRelease]);

    // const handleChange = (e) => {
    //   setSelectedRelease(e.target.value);
    //   // also update formData if you use it
    // };





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

    // const handleChange = (e) => {
    //     const { name, value, type, checked } = e.target;
    //     setFormData((prevData) => ({
    //         ...prevData,
    //         [name]: type === 'checkbox' ? checked : value,
    //     }));
    //     if (name === "release") {
    //         setSelectedRelease(value);
    //     }

    //     if (errors[name]) {
    //         setErrors((prevErrors) => ({
    //             ...prevErrors,
    //             [name]: '',
    //         }));
    //     }
    // };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prevData) => {
            let updatedData = {
                ...prevData,
                [name]: type === 'checkbox' ? checked : value,
            };

            // If release_date changes, update dependent dates
            if (name === 'release_date') {
                updatedData.code_freeze = getPreviousDate(value, 1);
                updatedData.platform_qa_build = getPreviousDate(value, 1);
                updatedData.client_build_availability = getPreviousDate(value, 1);
                updatedData.kick_off = getPreviousDate(value, 1);
            }
            if (name === 'release') {
                updatedData.name = ``;
            }



            return updatedData;
        });

        // Update selected release
        if (name === "release") {
            setSelectedRelease(value);
        }

    

        // Clear error for changed field
        if (errors[name]) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: '',
            }));
        }

        // Clear dependent field errors if release_date changes
        if (name === 'release_date') {
            setErrors((prevErrors) => ({
                ...prevErrors,
                code_freeze: '',
                platform_qa_build: '',
                client_build_availability: '',
                kick_off: '',
            }));
        }

        // Clear name error if release changes
        if (name === 'release') {
            setErrors((prevErrors) => ({
                ...prevErrors,
                name: '',
            }));
        }
    };


    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const patchedFormData = {
            ...formData,
            release: selectedRelease || formData.release, // Fallback to selectedRelease
        };

        console.log("Form Data before validation:", patchedFormData);

        if (!validateForm(patchedFormData)) {
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

        const transformedProducts = selectedProducts.map(product => ({
            name: product.name,
            helm_charts: "Not Released",
            images: product.images.map(img => ({
                ...img,
                ot2_pass: "Not Released",
                registry: "Not Released",
                patch_build_number: patchedFormData.name
            }))
        }));

        const finalData = {
            ...patchedFormData,
            products_data: transformedProducts,
            scopes_data: transformedHighLevelScope,
            jars_data: transformedSelectedJars,
        };

        console.log("Final Form Data to send:", finalData);

        try {
            const response = await post_patches(finalData);
            navigate(`/patches/${patchedFormData.name}`, {
                state: { patch: finalData }
            });
        } catch (error) {
            console.error('Error while posting to database:', error);
        }
    };




    //high level scope
    const [highLevelScope, setHighLevelScope] = useState([
        { name: 'alpine', version: '21' },
        { name: 'jdk', version: '12' },
        { name: 'new_relic', version: '1.5.3' },
    ]);


    // client side validation
    const validateForm = (formDataArg = formData) => {
        const newErrors = {};

        if (!formDataArg.name?.trim()) newErrors.name = 'Name is required';
        if (!formDataArg.release) newErrors.release = 'Release is required';
        if (!formDataArg.release_date) newErrors.release_date = 'Release date is required';
        if (!formDataArg.description?.trim()) newErrors.description = 'Description is required';
        if (!formDataArg.code_freeze) newErrors.code_freeze = 'Code Freeze date is required';
        if (!formDataArg.platform_qa_build) newErrors.platform_qa_build = 'Platform QA Build Date is required';
        if (!formDataArg.client_build_availability) newErrors.client_build_availability = 'Client Build Date is required';
        if (!formDataArg.kick_off) newErrors.kick_off = 'Kick Off Date is required';

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
                code_freeze: prev.code_freeze || getPreviousDate(formData.release_date, 1),
                platform_qa_build: prev.platform_qa_build || getPreviousDate(formData.release_date, 1),
                client_build_availability: prev.client_build_availability || getPreviousDate(formData.release_date, 1),
                kick_off: prev.kick_off || getPreviousDate(formData.release_date, 1),
            }));
        }
    }, [formData.release_date]);

    const transformedProducts = productData.map(item => ({
        name: item.products_data.name,
        images: item.products_data.images.map(img => ({
            image_name: img.imagename
        }))
    }));


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
                            <option value="" disabled>
                                -- Select a Release --
                            </option>
                            {releaseList.map((release) => (
                                <option key={release.name} value={release.name}>
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
                </div>
                <div className="inline-fields">
                    {/* code freeze date */}
                    <div className="form-group">
                        <label className="form-label">Code Freeze Date</label>
                        <input
                            type="date"
                            name="code_freeze"
                            onChange={handleChange}
                            value={formData.code_freeze || getPreviousDate(formData.release_date, 1)}
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
                            value={formData.platform_qa_build || getPreviousDate(formData.release_date, 1)}
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
                            value={formData.client_build_availability || getPreviousDate(formData.release_date, 1)}
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
                            value={formData.kick_off || getPreviousDate(formData.release_date, 1)}
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
                        <option value="cancelled">Cancelled</option>
                        <option value="in_progress">In progress</option>
                    </select>
                </div>

                <div className="inline-fields">


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
                    mode="editEmpty"
                    products={transformedProducts}
                    selectedRelease={selectedRelease}
                    selectedProducts={[]}
                    onSelectionChange={(selectedProducts) => {
                        setSelectedProducts(selectedProducts);
                        console.log("From parent", selectedProducts)
                    }}

                />
                {/* {errors.products && <span className="error-text">{errors.products}</span>} */}


                <div className="form-actions">
                    <CancelButton onCancel={onCancel} />
                    <SaveButton />
                </div>
            </form>
        </>
    );
}

export default Form;

