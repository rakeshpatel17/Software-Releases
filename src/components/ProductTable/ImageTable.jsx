

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
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import EditableFieldComponent from '../EditableFieldComponent';
import ToggleButtonComponent from '../ToggleButton/ToggleButton';
import SeverityFilterButtons from '../Button/SeverityFilterButtons';
import JarFilterButtons from '../Button/JarFilterButtons';
import SecurityIssuesTable from '../SecurityIssuesTable/SecurityIssuesTable';
import JarTable from '../JarTable/JarTable';
import patch_image_jars from '../../api/patch_image_jars';
import { getPatchById } from '../../api/getPatchById';
import { securityIssuesUpdate } from '../../api/updateIssuesdes';
import ExpandableSection from '../ExpandableSection/ExpandableSection';
import ToggleLockIcon from '../ToggleLockIcon'

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
  patchJars,
  productKey,
  patchname,
  searchTerm,
  //   onJarsUpdate,
  onImageJarsUpdate
}) {
  const theme = useTheme();
  const [detailedImages,setDetailedImages]=useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);
  const [Productsdata, setProductsdata] = useState([]);
  const [imageJarsMap, setImageJarsMap] = useState({});
//   console.log("patch jars are : ", patchJars);
  // whenever images or patchname changes, fetch jars per image
  useEffect(() => {
    if (!images.length || !patchJars.length) return;

    // 0) Build jarName → version lookup
    const versionLookup = Object.fromEntries(
      patchJars.map(pj => [pj.name, pj.version])
    );
    // console.log('versionLookup:', versionLookup);

    // 1) Fetch and merge per-image
    const fetches = images.map(img =>
      patch_image_jars(patchname, img.image_name)
        .then(rawJars => {
          console.log(`rawJars for ${img.image_name}:`, rawJars);

          // 2) Keep only jars present in versionLookup
          const merged = (rawJars || [])
            .filter(rj => versionLookup.hasOwnProperty(rj.name))
            .map(rj => ({
              ...rj,
              version: versionLookup[rj.name]
            }));
          //   console.log(`merged for ${img.image_name}:`, merged);

          return { image_name: img.image_name, jars: merged };
        })
        .catch(err => {
          console.error(`Error fetching jars for ${img.image_name}:`, err);
          return { image_name: img.image_name, jars: [] };
        })
    );

    // 3) One state update when all done
    Promise.all(fetches).then(results => {
      const map = Object.fromEntries(
        results.map(({ image_name, jars }) => [image_name, jars])
      );
      console.log('final imageJarsMap:', map);
      setImageJarsMap(map);
    });
  }, [images, patchJars, patchname]);
  // Toggles for Registry, OT2, Helm
  const [toggleRegistry, setToggleRegistry] = useState([]);
  const [toggleOT2, setToggleOT2] = useState([]);
  const [toggleHelm, setToggleHelm] = useState([]);

  // severity filtering
  const levels = ['critical', 'high', 'medium', 'low'];
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
    const options = ['Released', 'Not Released', 'Not Applicable'];
    const idx = options.findIndex(o => o.toLowerCase() === (dbValue || '').toLowerCase());
    return idx >= 0 ? options[idx] : 'Not Released';
  };
  const severityOrder = { critical: 1, high: 2, medium: 3, low: 4 };

  //jars filtering
  const [selectedJarStatuses, setSelectedJarStatuses] = useState(new Set(['updated', 'not updated']));
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
        : new Set(['updated', 'not updated'])
    );
  };

  // Compute filteredJars
  // const filteredJars = jars.filter(j => {
  // const status = j.updated ? 'updated' : 'not updated';
  // return selectedJarStatuses.has(status);
  // });

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
    setToggleOT2(images.map(i => getToggleValue(i.ot2_pass)));
    setToggleHelm(images.map(i => getToggleValue(i.helm_charts)));
  }, [images]);

  const handleExpand = idx =>
    setExpanded(e => ({ ...e, [idx]: !e[idx] }));

  const handleToggle = (arr, setter) => (idx, newVal) => {
    const copy = [...arr];
    copy[idx] = newVal;
    setter(copy);
  };

  const handleRegistryToggle = handleToggle(toggleRegistry, setToggleRegistry);
  const handleOT2Toggle = handleToggle(toggleOT2, setToggleOT2);
  const handleHelmToggle = handleToggle(toggleHelm, setToggleHelm);

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
      {/* <Table aria-label="images table"> */}
      <Table aria-label="images table">
        <TableHead>
          <TableRow>
            {headers.map(label => (
              <TableCell
                key={label}
                align={
                  ['Registry', 'OT2 Pass', 'Status', 'More Details'].includes(label)
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
            // console.log("image data is : ", img);
            // pull this image's own jars array:
            // const imageJars = img.jars || [];
            const imageJars = imageJarsMap[img.image_name] || [];
            // filter if you still need statuses:
            const filteredJars = imageJars.filter(j => {
              const status = j.updated ? 'updated' : 'not updated';
              return selectedJarStatuses.has(status);
            });
            // sort & filter security issues
            const displayed = img.security_issues
              .slice()
              .sort((a, b) => {
                const sa = severityOrder[a.severity.toLowerCase()];
                const sb = severityOrder[b.severity.toLowerCase()];
                if (sa !== sb) return sa - sb;
                return b.cvss_score - a.cvss_score;
              })
              .filter(i => selectedLevels.has(i.severity.toLowerCase()));

            return (
              <React.Fragment key={idx}>
                <TableRow hover>
                  <TableCell>
                    {img.image_name}
                  </TableCell>

                  {/* <TableCell>
                    {highlightMatch(img.patch_build_number, searchTerm)}
                  </TableCell> */}
                  <TableCell>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      width="100%"
                    >
                      <Box>
                        {highlightMatch(img.patch_build_number, searchTerm)}
                      </Box>
                      <ToggleLockIcon
                        initialLock={img.lock}
                        patchName={patchname}
                        imageName={img.image_name}
                      />
                    </Box>
                  </TableCell>

                  <TableCell>
                    <ToggleButtonComponent
                      options={['Released', 'Not Released', 'Not Applicable']}
                      value={toggleRegistry[idx]}
                      onToggle={val => handleRegistryToggle(idx, val)}
                    />
                  </TableCell>

                  <TableCell>
                    <ToggleButtonComponent
                      options={['Released', 'Not Released', 'Not Applicable']}
                      value={toggleOT2[idx]}
                      onToggle={val => handleOT2Toggle(idx, val)}
                    />
                  </TableCell>

                  <TableCell>
                    {img.security_issues.length === 0
                      ? <Typography color="success.main" fontWeight="bold">✔ Success</Typography>
                      : <Typography color="error.main" fontWeight="bold">✖ Fail</Typography>}
                  </TableCell>

                  {/* Only one arrow, last column: */}
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleExpand(idx)}
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
                              style={{
                                color: theme.palette.primary.light,
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
                              // refreshProductsData={async ()=>{
                              // const fresh = await getPatchById(patchname);
                              // setProductsdata(fresh.products);
                              // }}
                              img={img}
                              // Pass the state that actually CONTROLS the UI
                              allDetailedImages={detailedImages}
                              // Pass the state SETTER for that state
                              setDetailedImages={setDetailedImages}
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
                                allJars={filteredJars}
                                selectedStatuses={selectedJarStatuses}
                                onToggleStatus={toggleJarStatus}
                                onToggleAll={toggleAllJars}
                              />
                            }
                          >
                            {/* <JarTable
                                jars={filteredJars}
                                id={patchname}
                                productKey={productKey}
                                onJarsUpdate={onJarsUpdate}
                            /> */}
                            <JarTable
                              jars={filteredJars}
                              patchName={patchname}
                              imageName={img.image_name}
                              onJarsUpdate={(updatedJars) =>
                                onImageJarsUpdate(img.image_name, updatedJars)
                              }
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
