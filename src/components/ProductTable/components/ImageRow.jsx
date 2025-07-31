import React from 'react';
import PropTypes from 'prop-types';
import {
  TableRow, TableCell, IconButton, Collapse, Box, Typography, useTheme
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ToggleButtonComponent from '../../ToggleButton/ToggleButton';
import ToggleLockIcon from '../../ToggleLockIcon';
import HighlightMatch from './HighlightMatch';
import ImageDetailsPanel from './ImageDetailsPanel';
import { useState } from 'react';
import AuthorizedAction from '../../AuthorizedAction/AuthorizedAction';

const statusText = issuesLength =>
  issuesLength === 0
    ? <Typography color="success.main" fontWeight="bold">✔ Success</Typography>
    : <Typography color="error.main" fontWeight="bold">✖ Fail</Typography>;

export default function ImageRow({
  img, idx, searchTerm, patchname, expanded, onExpand,
  imageJars, selectedLevels, setSelectedLevels,
  selectedJarStatuses, setSelectedJarStatuses,
  products, onImageJarsUpdate
}) {
  const theme = useTheme();
  const getToggleValue = dbValue => {
    const opts = ['Released', 'Not Released', 'Not Applicable'];
    const idx = opts.findIndex(o => o.toLowerCase() === (dbValue || '').toLowerCase());
    return idx >= 0 ? opts[idx] : 'Not Released';
  };
  const [togReg, togOT2] = [getToggleValue(img.registry), getToggleValue(img.ot2_pass)];
  const [registryState, setRegistryState] = useState(getToggleValue(img.registry));
  const [ot2State, setOT2State] = useState(getToggleValue(img.ot2_pass));

  const handleRegistryToggle = (newValue) => {
    setRegistryState(newValue);
    console.log(`API CALL: Update registry for ${img.image_name} to ${newValue}`);
  };

  const handleOt2Toggle = (newValue) => {
    setOT2State(newValue);
    console.log(`API CALL: Update ot2_pass for ${img.image_name} to ${newValue}`);
  };

  return (
    <>
      <TableRow hover>
        <TableCell>{img.image_name}</TableCell>
        <TableCell>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <HighlightMatch text={img.patch_build_number} term={searchTerm} />
            <ToggleLockIcon initialLock={img.lock} patchName={patchname} imageName={img.image_name} />
          </Box>
        </TableCell>
        <TableCell>
          <AuthorizedAction allowedRoles={['admin', 'product_manager']}>
            {(isAuthorized, onUnauthorized) => (
              <ToggleButtonComponent
                options={['Released', 'Not Released', 'Not Applicable']}
                value={registryState}
                onToggle={isAuthorized ? handleRegistryToggle : onUnauthorized}
              />
            )}
          </AuthorizedAction>
        </TableCell>

        <TableCell>
          <AuthorizedAction allowedRoles={['admin', 'product_manager']}>
            {(isAuthorized, onUnauthorized) => (
              <ToggleButtonComponent
                options={['Released', 'Not Released', 'Not Applicable']}
                value={ot2State}
                onToggle={isAuthorized ? handleOt2Toggle : onUnauthorized}
              />
            )}
          </AuthorizedAction>
        </TableCell>
        <TableCell>{statusText(img.security_issues.length)}</TableCell>
        <TableCell align="center">
          <IconButton size="small" onClick={onExpand}>
            {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={6} sx={{ p: 0, borderBottom: 'none' }}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{ m: 2 }}>
              <ImageDetailsPanel
                img={img}
                imageJars={imageJars}
                selectedLevels={selectedLevels}
                setSelectedLevels={setSelectedLevels}
                selectedJarStatuses={selectedJarStatuses}
                setSelectedJarStatuses={setSelectedJarStatuses}
                products={products}
                patchname={patchname}
                onImageJarsUpdate={onImageJarsUpdate}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

ImageRow.propTypes = {
  img: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
  searchTerm: PropTypes.string,
  patchname: PropTypes.string.isRequired,
  expanded: PropTypes.bool.isRequired,
  onExpand: PropTypes.func.isRequired,
  imageJars: PropTypes.array.isRequired,
  selectedLevels: PropTypes.instanceOf(Set).isRequired,
  setSelectedLevels: PropTypes.func.isRequired,
  selectedJarStatuses: PropTypes.instanceOf(Set).isRequired,
  setSelectedJarStatuses: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
  onImageJarsUpdate: PropTypes.func.isRequired
};
