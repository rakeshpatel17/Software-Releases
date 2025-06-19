// components/ProductTable.js
import React, { useState, useEffect } from 'react';
import './ImageTable.css'; // separate styling
import EditableFieldComponent from '../EditableFieldComponent';
import ToggleButtonComponent from '../ToggleButton/ToggleButton';
import get_security_issues from '../../api/securityIssues';
import { securityIssuesUpdate } from '../../api/updateIssuesdes';
import { getPatchById } from '../../api/getPatchById';
import SeverityFilterButtons from '../Button/SeverityFilterButtons';
import SecurityIssuesTable from '../SecurityIssuesTable/SecurityIssuesTable';
import JarTable from '../JarTable/JarTable';

function highlightMatch(text, term) {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.split(regex).map((part, i) =>
        part.toLowerCase() === term.toLowerCase() ? (
            <span key={i} className="highlight">{part}</span>
        ) : (
            part
        )
    );
}

function ImageTable({ images, jars, productKey, patchname, searchTerm, onJarsUpdate }) {
    const [expandedRows, setExpandedRows] = useState({});
    // const [editingIndex, setEditingIndex] = useState(null);
    // const [editedDescription, setEditedDescription] = useState('');

    // console.log("data",images)
    const [loading, setLoading] = useState(true);
    const toggleRow = (idx) => {
        setExpandedRows((prev) => ({
            ...prev,
            [idx]: !prev[idx],
        }));
    };

    const [toggleRegisteryValues, setToggleRegisteryValues] = useState(() =>
        images.map(() => 'Released')
    );


    const handleRegisteryToggle = (idx, newValue) => {
        const updatedValues = [...toggleRegisteryValues];
        updatedValues[idx] = newValue;
        setToggleRegisteryValues(updatedValues);
    };

    const [toggleOT2Values, setToggleOT2Values] = useState(() =>
        images.map(() => 'Released')
    );
    const handleOT2Toggle = (idx, newValue) => {
        const updatedValues = [...toggleOT2Values];
        updatedValues[idx] = newValue;
        setToggleOT2Values(updatedValues);
    };

    const [toggleHelmValues, setToggleHelmValues] = useState(() =>
        images.map(() => 'Released')
    );
    const handleHelmToggle = (idx, newValue) => {
        const updatedValues = [...toggleHelmValues];
        updatedValues[idx] = newValue;
        setToggleHelmValues(updatedValues);
    };
    useEffect(() => {
        if (images.length > 0) {
            setToggleRegisteryValues(images.map(img => getToggleValue(img.registry)));
            setToggleOT2Values(images.map(img => getToggleValue(img.ot2_pass)));
            setToggleHelmValues(images.map(img => getToggleValue(img.helm_charts)));
        }
    }, [images]);



    const getToggleValue = (dbValue) => {
        const options = ['Released', 'Not Released', 'Not Applicable'];
        const matchIndex = options.findIndex(opt => opt.toLowerCase() === dbValue?.toLowerCase());
        return matchIndex !== -1 ? options[matchIndex] : 'Not Released'; // Default fallback
    };

    const severityOrder = { critical: 1, high: 2, medium: 3, low: 4 };
    const levels = ['critical','high','medium','low'];
    const [selectedLevels, setSelectedLevels] = useState(new Set(levels));

    const toggleLevel = (level) => {
        setSelectedLevels(prev => {
            const copy = new Set(prev);
            if (copy.has(level)) copy.delete(level);
            else copy.add(level);
            return copy;
        });
    };

    const toggleAll = () => {
        setSelectedLevels(prev =>
            prev.size === 4 ? new Set() : new Set(['critical', 'high', 'medium', 'low'])
        );
    };


    const [patchData, setPatchData] = useState(null);
    const [Productsdata, setProductsdata] = useState(null);
    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getPatchById(patchname); // assuming this returns the JSON you posted
                // console.log(' Full patch data:', data);

                // Extract products_data
                const products_data = data.products;
                setPatchData(data);
                setProductsdata(products_data)
                // console.log(' Products data:', products_data);
                setLoading(false);
            } catch (error) {
                console.error(' Error fetching patch data:', error);
            }
        }

        fetchData();
    }, [patchname]);




    return (
        <table className="product-table">
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Build Number</th>
                    <th>Registery</th>
                    <th>OT2 Pass</th>
                    {/* <th>Helm Charts</th> */}
                    <th>Status</th>
                    <th>More Details</th>
                </tr>
            </thead>
            <tbody>
                {images.map((img, idx) => {
                    const displayed = img.security_issues
                    .slice()
                    .sort((a, b) => {
                        const sa = severityOrder[a.severity.toLowerCase()];
                        const sb = severityOrder[b.severity.toLowerCase()];
                        if (sa !== sb) return sa - sb;               // severity order
                        return b.cvss_score - a.cvss_score;          // then CVSS desc
                    })
                    .filter(issue => selectedLevels.has(issue.severity.toLowerCase()));
            
                 return (
                    <React.Fragment key={idx}>
                        <tr>
                            <td>{img.image_name}</td>
                            <td>{highlightMatch(img.patch_build_number, searchTerm)}</td>
                            <td>
                                <ToggleButtonComponent
                                    options={['Released', 'Not Released', 'Not Applicable']}
                                    value={toggleOT2Values[idx]}
                                    onToggle={(newValue) => handleOT2Toggle(idx, newValue)}
                                />

                            </td>
                            <td>
                                <ToggleButtonComponent
                                    options={['Released', 'Not Released', 'Not Applicable']}
                                    value={toggleRegisteryValues[idx]}
                                    onToggle={(newValue) => handleRegisteryToggle(idx, newValue)}
                                />
                            </td>
                            <td>
                                { img.security_issues.length == 0 ? (
                                    <span style={{ color: 'green', fontWeight: 'bold' }}> ✔ Success </span>
                                ) : (
                                    <span style={{ color: 'red', fontWeight: 'bold' }}> ✖ Fail </span>
                                )}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                <button onClick={() => toggleRow(idx)}>
                                    {expandedRows[idx] ? '▲' : '▼'}
                                </button>
                            </td>
                        </tr>
                        {expandedRows[idx] && !loading && (
                            <tr>
                                <td colSpan="6">
                                    <div className="expanded-content">

                                        <p style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                            <span ><strong>Twist Lock Report: </strong><a href={img.twistlock_report_url } target="_blank" rel="noopener noreferrer">
                                                View Report
                                            </a></span>
                                            {/* <span><strong>Twistlock Report Clean:</strong> {img.twistlock_report_clean ? 'Yes' : 'No'}</span> */}
                                            <span><strong>Created At:</strong> {new Date(img.created_at).toLocaleString()}</span>
                                        </p>
                                        <div style={{ marginTop: '12px' }}>
                                            <strong>Security Issues:</strong>
                                            {Array.isArray(img.security_issues) && img.security_issues.length > 0 ? (
                                                <>
                                                    {/* buttons */}
                                                        <SeverityFilterButtons
                                                            allIssues={img.security_issues}
                                                            selectedLevels={selectedLevels}
                                                            onToggleLevel={toggleLevel}
                                                            onToggleAll={toggleAll}
                                                        />
                                                    {/*rendering security issue table */}
                                                        <SecurityIssuesTable
                                                            issues={displayed}
                                                            Productsdata={Productsdata}
                                                            patchname={patchname}
                                                            refreshProductsData={async () => {
                                                                const refreshed = await getPatchById(patchname);
                                                                setProductsdata(refreshed.products);
                                                            }}
                                                            img = {img}
                                                        />
                                                     {/* 3. Render the shared JarTable under each image */}
                                                        <div style={{ marginTop: '1rem' }}>
                                                        <strong>Jars :</strong>
                                                        <JarTable
                                                            id={patchname}
                                                            productKey={productKey}   
                                                            jars={jars}               
                                                            onJarsUpdate={onJarsUpdate} 
                                                        />
                                                        </div>

                                                </>
                                            ) : (
                                                <p>None</p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                 )
                })}
                {images.length === 0 && (
                    <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '1rem' }}>
                            No images found for this product.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

export default ImageTable;
