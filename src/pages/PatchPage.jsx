import React, { useState } from 'react';
import ProductImageSelector from '../components/ProductImageSelector';
import JarSelector from '../components/JarSelector';
import './PatchPage.css';

function PatchPage() {
    const [isEditing, setIsEditing] = useState(false);

    const [patchData, setPatchData] = useState({
        name: 'Release 1.6',
        release: 'Release 1',
        releaseDate: '2025-05-10',
        description: 'Bug fixes and security patches.',
        state: 'New'
    });

    // States for ProductImageSelector
    const [productSearchTerm, setProductSearchTerm] = useState('');
    const [expandedProduct, setExpandedProduct] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);

    const productData = [
        {
            name: 'OpenText™ Documentum™ Server',
            images: [{ image_name: 'docbase.jar' }, { image_name: 'content.jar' }],
            name: 'OpenText™ Documentum™ Server',
            images: [{ image_name: 'docbase.jar' }, { image_name: 'content.jar' }],
            name: 'OpenText™ Documentum™ Server',
            images: [{ image_name: 'docbase.jar' }, { image_name: 'content.jar' }],
            name: 'OpenText™ Documentum™ Server',
            images: [{ image_name: 'docbase.jar' }, { image_name: 'content.jar' }],
            name: 'OpenText™ Documentum™ Server',
            images: [{ image_name: 'docbase.jar' }, { image_name: 'content.jar' }]
        },
        {
            name: 'D2',
            images: [{ image_name: 'd2-core.jar' }],
            name: 'D2',
            images: [{ image_name: 'd2-core.jar' }],
            name: 'D2',
            images: [{ image_name: 'd2-core.jar' }],
            name: 'D2',
            images: [{ image_name: 'd2-core.jar' }]

        }
    ];

    const handleProductSelection = (product, isChecked) => {
        const imageNames = product.images?.map(img => img.image_name) || [];
        setSelectedImages(prev =>
            isChecked
                ? [...new Set([...prev, ...imageNames])]
                : prev.filter(img => !imageNames.includes(img))
        );
    };

    const handleImageToggle = (imageName) => {
        setSelectedImages(prev =>
            prev.includes(imageName)
                ? prev.filter(name => name !== imageName)
                : [...prev, imageName]
        );
    };

    // States for JarSelector
    const [jarSearchTerm, setJarSearchTerm] = useState('');
    const [expandedJar, setExpandedJar] = useState(null);
    const [selectedJars, setSelectedJars] = useState(['log4j', 'commons-io']);

    const allJars = [
        { name: 'log4j' },
        { name: 'commons-io' },
        { name: 'guava' },
        { name: 'slf4j' },
        { name: 'jackson-core' }
    ];

    const filteredJars = allJars.filter(jar =>
        jar.name.toLowerCase().includes(jarSearchTerm.toLowerCase())
    );

    const handleFieldChange = (field, value) => {
        setPatchData(prev => ({ ...prev, [field]: value }));
    };

    const toggleEdit = () => setIsEditing(prev => !prev);

    return (
        <div className="patch-page">
            <div className="patch-header">
                <h2>Patch Details</h2>
                <button className="edit-btn" onClick={toggleEdit}>
                    {isEditing ? 'Cancel' : 'Edit'}
                </button>
            </div>

            <form className="patch-form">
                <div className="form-row">
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            value={patchData.name}
                            disabled={!isEditing}
                            onChange={e => handleFieldChange('name', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Release</label>
                        <input
                            type="text"
                            value={patchData.release}
                            disabled={!isEditing}
                            onChange={e => handleFieldChange('release', e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Release Date</label>
                        <input
                            type="date"
                            value={patchData.releaseDate}
                            disabled={!isEditing}
                            onChange={e => handleFieldChange('releaseDate', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Patch State</label>
                        <select
                            value={patchData.state}
                            disabled={!isEditing}
                            onChange={e => handleFieldChange('state', e.target.value)}
                        >
                            <option value="New">New</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>

                <label>Description</label>
                <textarea
                    value={patchData.description}
                    disabled={!isEditing}
                    onChange={e => handleFieldChange('description', e.target.value)}
                />

                {/* Product Section */}
                {/* Product Section */}
                <label>Products</label>
                {!isEditing ? (
                    <div className="read-only-products">
                        {/* Display selected products in a read-only format */}
                        <ul>
                            {productData.map((product, index) => (
                                <li key={index}>
                                    <strong>{product.name}</strong>:
                                    {product.images.map((img, idx) => (
                                        <span key={idx}> {img.image_name}</span>
                                    ))}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <ProductImageSelector
                        productData={productData}
                        selectedImages={selectedImages}
                        searchTerm={productSearchTerm}
                        setSearchTerm={setProductSearchTerm}
                        expandedProduct={expandedProduct}
                        setExpandedProduct={setExpandedProduct}
                        handleProductSelection={handleProductSelection}
                        handleImageToggle={handleImageToggle}
                    />
                )}


                {/* Jar Section */}
                <label>Jars</label>
                {!isEditing ? (
                    <div className="read-only-jars">
                        {/* Display selected jars in a read-only format */}
                        {selectedJars.map(jar => (
                            <div key={jar}>{jar}</div>
                        ))}
                    </div>
                ) : (
                    <JarSelector
                        jarSearchTerm={jarSearchTerm}
                        setJarSearchTerm={setJarSearchTerm}
                        filteredJars={filteredJars}
                        expandedJar={expandedJar}
                        setExpandedJar={setExpandedJar}
                        selectedJars={selectedJars}
                        setSelectedJars={setSelectedJars}
                        isEditing={isEditing}
                    />
                )}

                {isEditing && (
                    <button type="submit" className="save-btn">
                        Save
                    </button>
                )}
            </form>
        </div>
    );
}

export default PatchPage;
