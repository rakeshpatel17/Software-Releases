import React from 'react';

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
        size1 > size2 ? <span style={styleRed}>{img1?.size}</span> : size1 < size2 ? <span style={styleGreen}>{img1?.size}</span> : img1?.size,
        size2 > size1 ? <span style={styleRed}>{img2?.size}</span> : size2 < size1 ? <span style={styleGreen}>{img2?.size}</span> : img2?.size,
    ];
};

export default function ComparisonResultsTable({ comparedImages, patch1, patch2 }) {
    if (!comparedImages || comparedImages.length === 0) {
        return null;
    }

    return (
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
                            {group.images.map((img, i) => {
                                const [size1Display, size2Display] = compareSizeField(img.patch1, img.patch2);
                                return (
                                    <tr key={i}>
                                        <td>{img.image_name}</td>
                                        <td>{size1Display}</td>
                                        <td>{size2Display}</td>
                                        <td>{img.remarks}</td>
                                    </tr>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}