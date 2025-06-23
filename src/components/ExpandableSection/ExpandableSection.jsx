import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton, Typography, Collapse } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function ExpandableSection({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <Box>
      {/* Header with toggle */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          p: 1,
          backgroundColor: (theme) => theme.palette.grey[100],
          borderRadius: 1
        }}
        onClick={() => setOpen((prev) => !prev)}
      >
        {/* <Typography variant="subtitle1">{title}</Typography> */}
        <Typography variant="subtitle1" gutterBottom>
            <strong>{title}</strong>
        </Typography>
        <IconButton size="small">
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </Box>

      {/* Content that expands */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 1 }}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );
}

ExpandableSection.propTypes = {
  title: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
};
