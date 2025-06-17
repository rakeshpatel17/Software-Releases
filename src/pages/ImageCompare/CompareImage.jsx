import React, { useState, useEffect } from 'react';
import './CompareImage.css';
import get_patches from '../../api/patches';

export default function CompareImage() {
    const [patch1, setPatch1] = useState('');
    const [patch2, setPatch2] = useState('');
    const [commonImages, setCommonImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');
    const [compared, setCompared] = useState(null);
    const [patches, setPatches] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
        const data = await get_patches();
            setPatches(data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (patch1 && patch2) {
            const images1 = getImages(patch1);
            const images2 = getImages(patch2);
            const common = images1.filter(img1 =>
                images2.some(img2 => img2.image_name === img1.image_name)
            );
            setCommonImages(common.map(img => img.image_name));
            setSelectedImage('');
            setCompared(null);
        }
    }, [patch1, patch2]);

    const getImages = (patchName) => {
        const patch = patches.find(p => p.name === patchName);
        return patch?.products.flatMap(p => p.images) || [];
    };

    const handleCompare = () => {
        const img1 = getImages(patch1).find(i => i.image_name === selectedImage);
        const img2 = getImages(patch2).find(i => i.image_name === selectedImage);
        setCompared({ img1, img2 });
    };

    return (
        <div className="compare-container">
            <h2>Compare Patch Images</h2>
            <div className="dropdown-row">
                <div className="dropdown-group">
                    <label>Patch 1</label>
                    <select value={patch1} onChange={e => setPatch1(e.target.value)}>
                        <option value="">Select Patch</option>
                        {patches.map(p => (
                            <option key={p.name} value={p.name}>{p.name}</option>
                        ))}
                    </select>
                </div>

                <div className="dropdown-group">
                    <label>Patch 2</label>
                    <select value={patch2} onChange={e => setPatch2(e.target.value)}>
                        <option value="">Select Patch</option>
                        {patches.map(p => (
                            <option key={p.name} value={p.name}>{p.name}</option>
                        ))}
                    </select>
                </div>

                {commonImages.length > 0 && (
                    <div className="dropdown-group">
                        <label>Common Images</label>
                        <select value={selectedImage} onChange={e => setSelectedImage(e.target.value)}>
                            <option value="">Select Image</option>
                            {commonImages.map((img, idx) => (
                                <option key={idx} value={img}>{img}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>


    

            {selectedImage && (
                <button className="compare-btn" onClick={handleCompare}>Compare</button>
            )}

            {compared && (
                <div className="compare-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Field</th>
                                <th>{patch1}</th>
                                <th>{patch2}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Size</td>
                                <td>{compared.img1.size}</td>
                                <td>{compared.img2.size}</td>
                            </tr>
                            <tr>
                                <td>Layers</td>
                                <td>{compared.img1.layers}</td>
                                <td>{compared.img2.layers}</td>
                            </tr>
                            <tr>
                                <td>Build Number</td>
                                <td>{compared.img1.build_number}</td>
                                <td>{compared.img2.build_number}</td>
                            </tr>
                            <tr>
                                <td>Patch Build Number</td>
                                <td>{compared.img1.patch_build_number}</td>
                                <td>{compared.img2.patch_build_number}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
