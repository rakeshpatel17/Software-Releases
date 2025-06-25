// // components/ProductTable.js
// import React, { useState, useEffect } from 'react';
// import './ImageTable.css'; // separate styling
// import EditableFieldComponent from '../EditableFieldComponent';
// import ToggleButtonComponent from '../ToggleButton/ToggleButton';
// import get_security_issues from '../../api/securityIssues';
// import { securityIssuesUpdate } from '../../api/updateIssuesdes';
// import { getPatchById } from '../../api/getPatchById';
// import SeverityFilterButtons from '../Button/SeverityFilterButtons';
// import SecurityIssuesTable from '../SecurityIssuesTable/SecurityIssuesTable';
// import JarTable from '../JarTable/JarTable';

// function highlightMatch(text, term) {
//     if (!term) return text;
//     const regex = new RegExp(`(${term})`, 'gi');
//     return text.split(regex).map((part, i) =>
//         part.toLowerCase() === term.toLowerCase() ? (
//             <span key={i} className="highlight">{part}</span>
//         ) : (
//             part
//         )
//     );
// }

// function ImageTable({ images, jars, productKey, patchname, searchTerm, onJarsUpdate }) {
//     const [expandedRows, setExpandedRows] = useState({});
//     // const [editingIndex, setEditingIndex] = useState(null);
//     // const [editedDescription, setEditedDescription] = useState('');

//     // console.log("data",images)
//     const [loading, setLoading] = useState(true);
//     const toggleRow = (idx) => {
//         setExpandedRows((prev) => ({
//             ...prev,
//             [idx]: !prev[idx],
//         }));
//     };

//     const [toggleRegisteryValues, setToggleRegisteryValues] = useState(() =>
//         images.map(() => 'Released')
//     );


//     const handleRegisteryToggle = (idx, newValue) => {
//         const updatedValues = [...toggleRegisteryValues];
//         updatedValues[idx] = newValue;
//         setToggleRegisteryValues(updatedValues);
//     };

//     const [toggleOT2Values, setToggleOT2Values] = useState(() =>
//         images.map(() => 'Released')
//     );
//     const handleOT2Toggle = (idx, newValue) => {
//         const updatedValues = [...toggleOT2Values];
//         updatedValues[idx] = newValue;
//         setToggleOT2Values(updatedValues);
//     };

//     const [toggleHelmValues, setToggleHelmValues] = useState(() =>
//         images.map(() => 'Released')
//     );
//     const handleHelmToggle = (idx, newValue) => {
//         const updatedValues = [...toggleHelmValues];
//         updatedValues[idx] = newValue;
//         setToggleHelmValues(updatedValues);
//     };
//     useEffect(() => {
//         if (images.length > 0) {
//             setToggleRegisteryValues(images.map(img => getToggleValue(img.registry)));
//             setToggleOT2Values(images.map(img => getToggleValue(img.ot2_pass)));
//             setToggleHelmValues(images.map(img => getToggleValue(img.helm_charts)));
//         }
//     }, [images]);



//     const getToggleValue = (dbValue) => {
//         const options = ['Released', 'Not Released', 'Not Applicable'];
//         const matchIndex = options.findIndex(opt => opt.toLowerCase() === dbValue?.toLowerCase());
//         return matchIndex !== -1 ? options[matchIndex] : 'Not Released'; // Default fallback
//     };

//     const severityOrder = { critical: 1, high: 2, medium: 3, low: 4 };
//     const levels = ['critical','high','medium','low'];
//     const [selectedLevels, setSelectedLevels] = useState(new Set(levels));

//     const toggleLevel = (level) => {
//         setSelectedLevels(prev => {
//             const copy = new Set(prev);
//             if (copy.has(level)) copy.delete(level);
//             else copy.add(level);
//             return copy;
//         });
//     };

//     const toggleAll = () => {
//         setSelectedLevels(prev =>
//             prev.size === 4 ? new Set() : new Set(['critical', 'high', 'medium', 'low'])
//         );
//     };


//     const [patchData, setPatchData] = useState(null);
//     const [Productsdata, setProductsdata] = useState(null);
//     useEffect(() => {
//         async function fetchData() {
//             try {
//                 const data = await getPatchById(patchname); // assuming this returns the JSON you posted
//                 // console.log(' Full patch data:', data);

//                 // Extract products_data
//                 const products_data = data.products;
//                 setPatchData(data);
//                 setProductsdata(products_data)
//                 // console.log(' Products data:', products_data);
//                 setLoading(false);
//             } catch (error) {
//                 console.error(' Error fetching patch data:', error);
//             }
//         }

//         fetchData();
//     }, [patchname]);




//     return (
//         <table className="product-table">
//             <thead>
//                 <tr>
//                     <th>Image</th>
//                     <th>Build Number</th>
//                     <th>Registery</th>
//                     <th>OT2 Pass</th>
//                     {/* <th>Helm Charts</th> */}
//                     <th>Status</th>
//                     <th>More Details</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {images.map((img, idx) => {
//                     const displayed = img.security_issues
//                     .slice()
//                     .sort((a, b) => {
//                         const sa = severityOrder[a.severity.toLowerCase()];
//                         const sb = severityOrder[b.severity.toLowerCase()];
//                         if (sa !== sb) return sa - sb;               // severity order
//                         return b.cvss_score - a.cvss_score;          // then CVSS desc
//                     })
//                     .filter(issue => selectedLevels.has(issue.severity.toLowerCase()));
            
//                  return (
//                     <React.Fragment key={idx}>
//                         <tr>
//                             <td>{img.image_name}</td>
//                             <td>{highlightMatch(img.patch_build_number, searchTerm)}</td>
//                             <td>
//                                 <ToggleButtonComponent
//                                     options={['Released', 'Not Released', 'Not Applicable']}
//                                     value={toggleOT2Values[idx]}
//                                     onToggle={(newValue) => handleOT2Toggle(idx, newValue)}
//                                 />

//                             </td>
//                             <td>
//                                 <ToggleButtonComponent
//                                     options={['Released', 'Not Released', 'Not Applicable']}
//                                     value={toggleRegisteryValues[idx]}
//                                     onToggle={(newValue) => handleRegisteryToggle(idx, newValue)}
//                                 />
//                             </td>
//                             <td>
//                                 { img.security_issues.length == 0 ? (
//                                     <span style={{ color: 'green', fontWeight: 'bold' }}> ✔ Success </span>
//                                 ) : (
//                                     <span style={{ color: 'red', fontWeight: 'bold' }}> ✖ Fail </span>
//                                 )}
//                             </td>
//                             <td style={{ textAlign: 'center' }}>
//                                 <button onClick={() => toggleRow(idx)}>
//                                     {expandedRows[idx] ? '▲' : '▼'}
//                                 </button>
//                             </td>
//                         </tr>
//                         {expandedRows[idx] && !loading && (
//                             <tr>
//                                 <td colSpan="6">
//                                     <div className="expanded-content">

//                                         <p style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
//                                             <span ><strong>Twist Lock Report: </strong><a href={img.twistlock_report_url } target="_blank" rel="noopener noreferrer">
//                                                 View Report
//                                             </a></span>
//                                             {/* <span><strong>Twistlock Report Clean:</strong> {img.twistlock_report_clean ? 'Yes' : 'No'}</span> */}
//                                             <span><strong>Created At:</strong> {new Date(img.created_at).toLocaleString()}</span>
//                                         </p>
//                                         <div style={{ marginTop: '12px' }}>
//                                             <strong>Security Issues:</strong>
//                                             {Array.isArray(img.security_issues) && img.security_issues.length > 0 ? (
//                                                 <>
//                                                     {/* buttons */}
//                                                         <SeverityFilterButtons
//                                                             allIssues={img.security_issues}
//                                                             selectedLevels={selectedLevels}
//                                                             onToggleLevel={toggleLevel}
//                                                             onToggleAll={toggleAll}
//                                                         />
//                                                     {/*rendering security issue table */}
//                                                         <SecurityIssuesTable
//                                                             issues={displayed}
//                                                             Productsdata={Productsdata}
//                                                             patchname={patchname}
//                                                             refreshProductsData={async () => {
//                                                                 const refreshed = await getPatchById(patchname);
//                                                                 setProductsdata(refreshed.products);
//                                                             }}
//                                                             img = {img}
//                                                         />
//                                                      {/* 3. Render the shared JarTable under each image */}
//                                                         <div style={{ marginTop: '1rem' }}>
//                                                         <strong>Jars :</strong>
//                                                         <JarTable
//                                                             id={patchname}
//                                                             productKey={productKey}   
//                                                             jars={jars}               
//                                                             onJarsUpdate={onJarsUpdate} 
//                                                         />
//                                                         </div>

//                                                 </>
//                                             ) : (
//                                                 <p>None</p>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </td>
//                             </tr>
//                         )}
//                     </React.Fragment>
//                  )
//                 })}
//                 {images.length === 0 && (
//                     <tr>
//                         <td colSpan="7" style={{ textAlign: 'center', padding: '1rem' }}>
//                             No images found for this product.
//                         </td>
//                     </tr>
//                 )}
//             </tbody>
//         </table>
//     );
// }

// export default ImageTable;



import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Typography,
  useTheme,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon   from '@mui/icons-material/KeyboardArrowUp';

import EditableFieldComponent from '../EditableFieldComponent';
import ToggleButtonComponent  from '../ToggleButton/ToggleButton';
import SeverityFilterButtons  from '../Button/SeverityFilterButtons';
import JarFilterButtons from '../Button/JarFilterButtons';
import SecurityIssuesTable    from '../SecurityIssuesTable/SecurityIssuesTable';
import JarTable               from '../JarTable/JarTable';

import { getPatchById }         from '../../api/getPatchById';
import { securityIssuesUpdate } from '../../api/updateIssuesdes';
import ExpandableSection from '../ExpandableSection/ExpandableSection';

function highlightMatch(text, term) {
  if (!term) return text;
  const regex = new RegExp(`(${term})`, 'gi');
  return text.split(regex).map((part, i) =>
    part.toLowerCase() === term.toLowerCase()
      ? <span key={i} style={{ backgroundColor: 'yellow' }}>{part}</span>
      : part
  );
}

export default function ImageTable({
  images,
  jars,
  productKey,
  patchname,
  searchTerm,
  onJarsUpdate,
}) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading]   = useState(true);
  const [Productsdata, setProductsdata] = useState([]);

  // Toggles for Registry, OT2, Helm
  const [toggleRegistry, setToggleRegistry] = useState([]);
  const [toggleOT2,      setToggleOT2]      = useState([]);
  const [toggleHelm,     setToggleHelm]     = useState([]);

  // severity filtering
  const levels = ['critical','high','medium','low'];
  const [selectedLevels, setSelectedLevels] = useState(new Set(levels));
  const toggleLevel = lvl => {
    setSelectedLevels(s => {
      const copy = new Set(s);
      copy.has(lvl) ? copy.delete(lvl) : copy.add(lvl);
      return copy;
    });
  };
  const toggleAll = () => {
    setSelectedLevels(s =>
      s.size === levels.length
        ? new Set()
        : new Set(levels)
    );
  };

  // Helpers
  const getToggleValue = dbValue => {
    const options = ['Released','Not Released','Not Applicable'];
    const idx = options.findIndex(o => o.toLowerCase() === (dbValue||'').toLowerCase());
    return idx >= 0 ? options[idx] : 'Not Released';
  };
  const severityOrder = { critical:1, high:2, medium:3, low:4 };

  //jars filtering
    const [selectedJarStatuses, setSelectedJarStatuses] = useState(new Set(['updated','not updated']));
    const toggleJarStatus = status => {
        setSelectedJarStatuses(s => {
            const copy = new Set(s);
            copy.has(status) ? copy.delete(status) : copy.add(status);
            return copy;
        });
    };
    const toggleAllJars = () => {
        setSelectedJarStatuses(s =>
            s.size === 2
            ? new Set()
            : new Set(['updated','not updated'])
        );
    };

  // Compute filteredJars
    const filteredJars = jars.filter(j => {
    const status = j.updated ? 'updated' : 'not updated';
    return selectedJarStatuses.has(status);
    });

  // load products_data
  useEffect(() => {
    getPatchById(patchname)
      .then(data => {
        setProductsdata(data.products);
        setLoading(false);
      })
      .catch(console.error);
  }, [patchname]);

  // init toggles
  useEffect(() => {
    if (!images.length) return;
    setToggleRegistry(images.map(i => getToggleValue(i.registry)));
    setToggleOT2     (images.map(i => getToggleValue(i.ot2_pass)));
    setToggleHelm    (images.map(i => getToggleValue(i.helm_charts)));
  }, [images]);

  const handleExpand = idx =>
    setExpanded(e => ({ ...e, [idx]: !e[idx] }));

  const handleToggle = (arr, setter) => (idx, newVal) => {
    const copy = [...arr];
    copy[idx] = newVal;
    setter(copy);
  };

  const handleRegistryToggle = handleToggle(toggleRegistry, setToggleRegistry);
  const handleOT2Toggle      = handleToggle(toggleOT2,      setToggleOT2);
  const handleHelmToggle     = handleToggle(toggleHelm,     setToggleHelm);

  // Column labels in order, matching SecurityIssuesTable style:
  const headers = [
    'Image',
    'Build Number',
    'Registry',
    'OT2 Pass',
    'Status',
    'More Details'
  ];

  return (
    <TableContainer
      component={Paper}
      sx={{
        background:
          theme.palette.mode === 'dark'
            ? theme.palette.background.paper
            : theme.palette.grey[50]
      }}
    >
      <Table aria-label="images table">
        <TableHead>
          <TableRow>
            {headers.map(label => (
              <TableCell
                key={label}
                align={
                  ['Registry','OT2 Pass','Status','More Details'].includes(label)
                    ? 'center'
                    : 'left'
                }
                sx={{
                  backgroundColor: '#20338b',
                  color: theme.palette.common.white,
                  fontWeight: 'bold'
                }}
              >
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {images.map((img, idx) => {
            // sort & filter security issues
            const displayed = img.security_issues
              .slice()
              .sort((a,b)=>{
                const sa = severityOrder[a.severity.toLowerCase()];
                const sb = severityOrder[b.severity.toLowerCase()];
                if (sa!==sb) return sa-sb;
                return b.cvss_score - a.cvss_score;
              })
              .filter(i=> selectedLevels.has(i.severity.toLowerCase()));

            return (
              <React.Fragment key={idx}>
                <TableRow hover>
                  <TableCell>
                    {img.image_name}
                  </TableCell>

                  <TableCell>
                    {highlightMatch(img.patch_build_number, searchTerm)}
                  </TableCell>

                  <TableCell>
                    <ToggleButtonComponent
                      options={['Released','Not Released','Not Applicable']}
                      value={toggleRegistry[idx]}
                      onToggle={val=>handleRegistryToggle(idx, val)}
                    />
                  </TableCell>

                  <TableCell>
                    <ToggleButtonComponent
                      options={['Released','Not Released','Not Applicable']}
                      value={toggleOT2[idx]}
                      onToggle={val=>handleOT2Toggle(idx, val)}
                    />
                  </TableCell>

                  <TableCell>
                    {img.security_issues.length === 0
                      ? <Typography color="success.main" fontWeight="bold">✔ Success</Typography>
                      : <Typography color="error.main"   fontWeight="bold">✖ Fail</Typography>}
                  </TableCell>

                  {/* Only one arrow, last column: */}
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={()=>handleExpand(idx)}
                    >
                      {expanded[idx]
                        ? <KeyboardArrowUpIcon />
                        : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </TableCell>
                </TableRow>

                {/* Collapsible detail row */}
                <TableRow>
                  <TableCell colSpan={6} sx={{ p: 0, borderBottom: 'none' }}>
                    <Collapse in={expanded[idx]} timeout="auto" unmountOnExit>
                      <Box sx={{ m: 2 }}>
                        {/* Twist Lock + CreatedAt */}
                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            mb: 2
                          }}
                        >
                          <Typography>
                            <strong>Twist Lock Report: </strong>
                            <a
                              href={img.twistlock_report_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: theme.palette.primary.light,
                                textDecoration: 'none',
                               }}
                            >
                              View Report
                            </a>
                          </Typography>

                          <Typography>
                            <strong>Updated At:</strong>{' '}
                            {new Date(img.updated_at).toLocaleString()}
                          </Typography>
                        </Box>

                        {/* Security Issues */}
                        <Box sx={{ mb: 2 }}>
                          {/* <Typography variant="subtitle1" gutterBottom>
                            <strong>Security Issues:</strong>
                          </Typography> */}
                          {/* <SeverityFilterButtons
                            allIssues={img.security_issues}
                            selectedLevels={selectedLevels}
                            onToggleLevel={toggleLevel}
                            onToggleAll={toggleAll}
                          />

                          <SecurityIssuesTable
                            issues={displayed}
                            Productsdata={Productsdata}
                            patchname={patchname}
                            refreshProductsData={async ()=>{
                              const fresh = await getPatchById(patchname);
                              setProductsdata(fresh.products);
                            }}
                            img={img}
                          /> */}
                          <ExpandableSection 
                            title={"Security Issues"}
                            actions={
                                <SeverityFilterButtons
                                    allIssues={img.security_issues}
                                    selectedLevels={selectedLevels}
                                    onToggleLevel={toggleLevel}
                                    onToggleAll={toggleAll}
                                />
                            }>

                                <SecurityIssuesTable
                                    issues={displayed}
                                    Productsdata={Productsdata}
                                    patchname={patchname}
                                    refreshProductsData={async ()=>{
                                    const fresh = await getPatchById(patchname);
                                    setProductsdata(fresh.products);
                                    }}
                                    img={img}
                                />
                          </ExpandableSection>
                        </Box>

                        {/* Jars */}
                        <Box>
                          {/* <Typography variant="subtitle1" gutterBottom>
                            <strong>Jars:</strong>
                          </Typography> */}
                          {/* <JarTable
                            id={patchname}
                            productKey={productKey}
                            jars={jars}
                            onJarsUpdate={onJarsUpdate}
                          /> */}
                          <ExpandableSection
                            title="Jars"
                            actions={
                                <JarFilterButtons
                                allJars={jars}
                                selectedStatuses={selectedJarStatuses}
                                onToggleStatus={toggleJarStatus}
                                onToggleAll={toggleAllJars}
                                />
                            }
                            >
                            <JarTable
                                jars={filteredJars}
                                id={patchname}
                                productKey={productKey}
                                onJarsUpdate={onJarsUpdate}
                            />
                            </ExpandableSection>
                        </Box>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            );
          })}

          {images.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ p: 4, fontStyle: 'italic' }}>
                No images found for this product.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

ImageTable.propTypes = {
  images: PropTypes.array.isRequired,
  jars: PropTypes.array,
  productKey: PropTypes.string.isRequired,
  patchname: PropTypes.string.isRequired,
  searchTerm: PropTypes.string,
  onJarsUpdate: PropTypes.func,
};
