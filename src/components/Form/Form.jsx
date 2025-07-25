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
import { AllReleaseProductImage } from '../../api/AllReleaseProductImage';
import toast from 'react-hot-toast';

function Form({ onCancel, lockedRelease: lockedReleaseProp, isEditing = true }) {
    const location = useLocation();
    const lockedRelease = lockedReleaseProp || location.state?.lockedRelease;
    console.log("locked release", lockedRelease)
    const [formData, setFormData] = useState({
        name: '',
        release: lockedRelease || '',
        release_date: '',
        code_freeze: '',
        platform_qa_build: '',
        description: '',
        patch_state: 'new',
        kba: '',
        functional_fixes: '',
        security_issues: '',
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


    //toastmessage
    const [toastState, setToastState] = useState({ message: '', type: '' });


    //error
    const [errors, setErrors] = useState({});

    //title
    const { searchTerm, setTitle } = useOutletContext();
    useEffect(() => {
        setTitle(`Add New Patch`);
    }, []);
    useEffect(() => {
        if (lockedRelease) {
            setSelectedRelease(lockedRelease);
        }
    }, [lockedRelease]);

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
        if (lockedRelease) {
            console.log(`Syncing state with new lockedRelease: ${lockedRelease}`);

            setFormData(prevData => ({
                ...prevData,
                release: lockedRelease,
                name: '',
            }));

            setSelectedRelease(lockedRelease);
        }

    }, [lockedRelease]);

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
    // useEffect(() => {
    //     const fetchProducts = async () => {
    //         const data = await getAllProducts();
    //         if (data && data.length > 0) {
    //             let releaseObj;
    //             if (selectedRelease) {
    //                 releaseObj = data.find(obj => Object.keys(obj)[0] === selectedRelease);
    //             }
    //             if (!releaseObj) releaseObj = data[0]; // fallback

    //             const releaseKey = Object.keys(releaseObj)[0];
    //             const releaseProducts = releaseObj[releaseKey];

    //             setSelectedRelease(releaseKey); setProductData(releaseProducts);
    //             console.log("productdata", releaseProducts)

    //         }

    //     }
    //     fetchProducts();
    // }, [selectedRelease]);

    useEffect(() => {
        const fetchAndProcessImages = async () => {

            if (!selectedRelease) {
                setProductData([]);
                return;
            }

            const allImages = await AllReleaseProductImage();
            if (!allImages) {
                console.error("Failed to fetch release images.");
                setProductData([]);
                return;
            }

            const imagesForRelease = allImages.filter(img => img.release === selectedRelease);

            const groupedByProduct = imagesForRelease.reduce((accumulator, currentImage) => {
                const product = currentImage.product;

                if (!accumulator[product]) {
                    accumulator[product] = [];
                }
                accumulator[product].push({
                    imagename: currentImage.image_name
                });

                return accumulator;
            }, {});
            const finalProductData = Object.keys(groupedByProduct).map(productName => {
                return {
                    name: productName,
                    images: groupedByProduct[productName]
                };
            });

            setProductData(finalProductData);
            console.log("Final processed productData:", finalProductData);
        };

        fetchAndProcessImages();
    }, [selectedRelease]);





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
                updatedData.kick_off = getPreviousDate(value, 14);
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
    useEffect(() => {
        if (lockedRelease) {
            setSelectedRelease(lockedRelease);
        }
    }, [lockedRelease]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const patchedFormData = {
            ...formData,
            release: selectedRelease || formData.release,
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
            toast.success('Patch saved successfully!');
            setTimeout(() => {
                navigate(`/patches/${finalData.name}`, {
                    state: { patch: finalData }
                });
            }, 2000);
        } catch (error) {
            console.error('Error while posting to database:', error);
            const errorMessage = error.response?.data?.message || 'Failed to save the patch. Please check the details.';
            toast.error(errorMessage);
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
        // If the previous date is before today, return today's date
        const today = new Date();
        if (date < today) {
            return today.toISOString().split('T')[0]; // returns today's date in YYYY-MM-DD format
        }
        return date.toISOString().split('T')[0]; // returns YYYY-MM-DD
    };
    const getFutureDate = (rdate, releaseDate, days) => {
        if (!rdate) return '';
        const date = new Date(rdate);
        date.setDate(date.getDate() + days);
        // If the future date exceeds releaseDate, return releaseDate
        const release = new Date(releaseDate);
        if (date > release) {
            return release.toISOString().split('T')[0]; // returns releaseDate in YYYY-MM-DD format
        }
        return date.toISOString().split('T')[0]; // returns YYYY-MM-DD
    }

    useEffect(() => {
        if (formData.release_date) {
            // Calculate the dates first
            const kick_off = getPreviousDate(formData.release_date, 14);
            const code_freeze = getFutureDate(kick_off, formData.release_date, 4);
            const platform_qa_build = getFutureDate(code_freeze, formData.release_date, 4);
            const client_build_availability = getFutureDate(platform_qa_build, formData.release_date, 2);
            setFormData((prev) => ({
                 ...prev,
                    kick_off,
                    code_freeze,
                    platform_qa_build,
                    client_build_availability
            }));
        }
    }, [formData.release_date]);

    // const transformedProducts = productData.map(item => ({
    //     name: item.products_data.name,
    //     images: item.products_data.images.map(img => ({
    //         image_name: img.imagename
    //     }))
    // }));
    // Corrected version
    const transformedProducts = productData.map(item => ({
        name: item.name,
        images: item.images.map(img => ({
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
                        name="kba"
                        value={formData.kba}
                        onChange={handleChange}
                        className="form-textarea"
                    />
                    {/* {errors.description && <span className="error-text">{errors.description}</span>} */}
                </div>

                <div className="form-group">
                    <label className="form-label">Functional Fixes</label>
                    <input
                        type="text"
                        name="functional_fixes"
                        value={formData.functional_fixes}
                        onChange={handleChange}
                        className="form-textarea"
                    />
                    {/* {errors.description && <span className="error-text">{errors.description}</span>} */}
                </div>


                <div className="form-group">
                    <label className="form-label">Security issues</label>
                    <input
                        type="text"
                        name="security_issues"
                        value={formData.security_issues}
                        onChange={handleChange}
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

