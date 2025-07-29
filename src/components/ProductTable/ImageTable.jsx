import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  TableContainer, Paper, Table, TableHead,
  TableRow, TableCell, TableBody, useTheme
} from '@mui/material';
import { useImageJars } from './hooks/useImageJars';
import { usePatchProducts } from './hooks/usePatchProducts';
import ImageRow from './components/ImageRow';

const headers = ['Image','Build Number','Registry','OT2 Pass','Status','More Details'];

export default function ImageTable({
  images, patchJars, patchname, searchTerm, onImageJarsUpdate
}) {
  const theme = useTheme();
  const imageJarsMap = useImageJars(patchname, images, patchJars);
  const { products } = usePatchProducts(patchname);

  const [expanded, setExpanded] = useState({});
  const [selectedLevels, setSelectedLevels] = useState(new Set(['critical','high','medium','low']));
  const [selectedJarStatuses, setSelectedJarStatuses] = useState(new Set(['updated','not updated']));

  const toggleExpand = idx => setExpanded(e => ({ ...e, [idx]: !e[idx] }));

  return (
    <TableContainer component={Paper}
      sx={{
        background: theme.palette.mode==='dark'
          ? theme.palette.background.paper
          : theme.palette.grey[50]
      }}>
      <Table aria-label="images table">
        <TableHead>
          <TableRow>
            {headers.map(label => (
              <TableCell
                key={label}
                align={['Registry','OT2 Pass','Status','More Details'].includes(label)? 'center':'left'}
                sx={{ backgroundColor:'#20338b', color:theme.palette.common.white, fontWeight:'bold' }}
              >
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {images.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ p:4, fontStyle:'italic' }}>
                No images found for this product.
              </TableCell>
            </TableRow>
          )}
          {images.map((img, idx) => (
            <ImageRow
              key={img.image_name}
              idx={idx}
              img={img}
              searchTerm={searchTerm}
              patchname={patchname}
              expanded={!!expanded[idx]}
              onExpand={() => toggleExpand(idx)}
              imageJars={imageJarsMap[img.image_name] || []}
              selectedLevels={selectedLevels}
              setSelectedLevels={setSelectedLevels}
              selectedJarStatuses={selectedJarStatuses}
              setSelectedJarStatuses={setSelectedJarStatuses}
              products={products}
              onImageJarsUpdate={onImageJarsUpdate}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

ImageTable.propTypes = {
  images: PropTypes.array.isRequired,
  patchJars: PropTypes.array.isRequired,
  patchname: PropTypes.string.isRequired,
  searchTerm: PropTypes.string,
  onImageJarsUpdate: PropTypes.func.isRequired
};
