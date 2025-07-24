import React, { useState, useEffect } from 'react';
import './CompareImage.css';
import get_patches from '../../api/patches';
import { useOutletContext } from 'react-router-dom';

export default function CompareImage() {
    const [patch1, setPatch1] = useState('');
    const [patch2, setPatch2] = useState('');
    const [comparedImages, setComparedImages] = useState([]);
    const [patches, setPatches] = useState([]);
    const [showComparison, setShowComparison] = useState(false);

    const { setTitle } = useOutletContext();

    useEffect(() => {
        const fetchData = async () => {
            const data = await get_patches();
            setPatches(Array.isArray(data) ? data : []);
        };
        fetchData();
    }, []);

    useEffect(() => {
        setTitle('Image Comparison');
    }, []);

    const getPatchData = (patchName) => {
        return patches.find(p => p.name === patchName);
    };

    const handleCompare = () => {
    if (!patch1 || !patch2) return;

    if (patch1 === patch2) {
        alert('Patch 1 and Patch 2 should not be the same.');
        setPatch1('');
        setPatch2('');
        setComparedImages([]);
        setShowComparison(false);
        return;
    }

    // Sort patch names based on version number
    const versionToArray = (ver) => ver.split('.').map(num => parseInt(num, 10));

    const isOlder = (v1, v2) => {
        const a = versionToArray(v1);
        const b = versionToArray(v2);
        for (let i = 0; i < Math.max(a.length, b.length); i++) {
            const val1 = a[i] || 0;
            const val2 = b[i] || 0;
            if (val1 < val2) return true;
            if (val1 > val2) return false;
        }
        return false; // equal
    };

    // Ensure patch1 is always the older one
    let older = patch1;
    let newer = patch2;
    if (!isOlder(patch1, patch2)) {
        older = patch2;
        newer = patch1;
    }

    const patchData1 = getPatchData(older);
    const patchData2 = getPatchData(newer);
    if (!patchData1 || !patchData2) return;

    const comparison = [];

    patchData1.products.forEach(product1 => {
        const product2 = patchData2.products.find(p => p.name === product1.name);
        if (!product2) return;

        const commonImages = product1.images.filter(img1 =>
            product2.images.some(img2 => img2.image_name === img1.image_name)
        );

        if (commonImages.length > 0) {
            const rows = commonImages.map(img1 => {
                const img2 = product2.images.find(i => i.image_name === img1.image_name);
                return {
                    image_name: img1.image_name,
                    patch1: img1,
                    patch2: img2,
                    remarks: ''
                };
            });

            comparison.push({ product: product1.name, images: rows });
        }
    });

    if (comparison.length === 0) {
        alert('No common images found between the selected patches.');
        setPatch1('');
        setPatch2('');
        setComparedImages([]);
        setShowComparison(false);
        return;
    }

    setPatch1(older);
    setPatch2(newer);
    setComparedImages(comparison);
    setShowComparison(true);
};

    const compareSizeField = (img1, img2) => {
        const styleRed = { color: 'red', fontWeight: 'bold' };
        const styleGreen = { color: 'green', fontWeight: 'bold' };

        const parseSize = (size) => {
            if (!size) return 0;
            const num = parseFloat(size);
            if (size.toLowerCase().includes('gb')) return num * 1024;
            if (size.toLowerCase().includes('mb')) return num;
            return num;
        };

        const size1 = parseSize(img1?.size);
        const size2 = parseSize(img2?.size);

        return [
            size1 > size2
                ? <span style={styleRed}>{img1?.size}</span>
                : size1 < size2
                    ? <span style={styleGreen}>{img1?.size}</span>
                    : img1?.size,

            size2 > size1
                ? <span style={styleRed}>{img2?.size}</span>
                : size2 < size1
                    ? <span style={styleGreen}>{img2?.size}</span>
                    : img2?.size,
        ];
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
            </div>

            {patch1 && patch2 && (
                <button className="compare-btn" onClick={handleCompare}>Compare</button>
            )}

            {showComparison && comparedImages.length > 0 && (
                <div className="compare-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>{patch1}</th>
                                <th>{patch2}</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparedImages.map((group, idx) => (
                                <React.Fragment key={idx}>
                                    <tr className="product-row">
                                        <td colSpan="4"><strong>{group.product}</strong></td>
                                    </tr>
                                    {group.images.map((img, i) => (
                                        <tr key={i}>
                                            <td>{img.image_name}</td>
                                            {/* <td>{img.size1}</td>
                                            <td>{img.size2}</td> */}
                                            <td>{compareSizeField(img.patch1, img.patch2)[0]}</td>
                                            <td>{compareSizeField(img.patch1, img.patch2)[1]}</td>
                                            <td>{img.remarks}</td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
