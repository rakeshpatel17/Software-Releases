import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Checkbox, TablePagination, Button, Box, IconButton, TextField, Collapse, Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete'; // Import Delete Icon
import ImageDialog from './ImageDialog';
import { createReleaseProductImage } from '../../../api/createReleaseProductImage';
import { updateReleaseProductImage } from '../../../api/ReleaseProductImage';
import { deleteReleaseProductImage } from '../../../api/deleteReleaseProductImage'; // Import Delete API
import toast from 'react-hot-toast';

import { dismissibleError } from '../../../components/Toast/customToast';
import { dismissibleSuccess } from '../../../components/Toast/customToast';


const ImageTable = ({
    images = [], release, product,
    onImageUpdate, onImageAdd, onImageDelete,
    selected = [], onSelectionChange
}) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [imageData, setImageData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [editMode, setEditMode] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState('view');
    const [dialogData, setDialogData] = useState({});
    const [expandedRowKey, setExpandedRowKey] = useState(null);

    useEffect(() => { setImageData(images); setPage(0); }, [images]);

    const handleSelect = (imageName) => {
        const newSelection = selected.includes(imageName)
            ? selected.filter(name => name !== imageName)
            : [...selected, imageName];
        onSelectionChange(newSelection);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            onSelectionChange(images.map(img => img.image_name));
        } else {
            onSelectionChange([]);
        }
    };

    const handleDelete = async (imageToDelete) => {
        if (window.confirm(`Are you sure you want to delete the image "${imageToDelete.image_name}"?`)) {
            try {
                await deleteReleaseProductImage(release, product, imageToDelete.image_name);
                // toast.success(`${imageToDelete.image_name} deleted successfully`);
                dismissibleSuccess(`${imageToDelete.image_name} deleted successfully`)
                onImageDelete(release, imageToDelete.image_name);
            } catch (error) {
                console.error("Failed to delete image:", error);
                // alert(`Could not delete the image: ${error.message}`);
                const errorMessage = error.response?.data?.message || `Unable to delete image`;
                // toast.error(errorMessage);
                dismissibleError(errorMessage);
            }
        }
    };

    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); };
    // const handleAddImage = () => { setDialogMode('add'); setDialogData({ release, product }); setDialogOpen(true); };
    const handleAddImage = () => {
        let initialDataForDialog;
        if (images && images.length > 0) {
          
            const lastImage = images[images.length - 1];

            initialDataForDialog = {
                ...lastImage,
                image_name: '',
                registry_image_name: '',
                ot2paas_image_name: '',
                local_image_name: '',
                release: release,
                product: product,
            };
        } else {
           
            initialDataForDialog = {
                release: release,
                product: product,

                image_name: '',
                registry_image_name: '',
                ot2paas_image_name: '',
                local_image_name: '',

                registry_registry: ' https://artifactory.otxlab.net',
                registry_path: 'bpdockerhub',

                ot2paas_registry: ' https://artifactory.otxlab.net',
                ot2paas_path: 'bpdockerhub',
                local_registry: ' https://artifactory.otxlab.net',
                local_path: 'bpdockerhub',
            };
        }

        // This part remains the same, it just uses the object we prepared.
        setDialogMode('add');
        setDialogData(initialDataForDialog);
        setDialogOpen(true);
    };

    const handleDialogSave = async (newData) => {
        if (dialogMode === 'add') {
            try {
                const createdImage = await createReleaseProductImage({ release, product, ...newData });
                // toast.success(`image added successfully`);
                dismissibleSuccess(`image added successfully`);
                if (createdImage) { 
                    const newImageForrelease = {
                    ...newData,
                    release: release, 
                    product: product
                };
                    onImageAdd(release, newImageForrelease); }
            } catch (err) {
                console.error("Failed to add image:", err);
                const errorMessage = err.response?.data?.message || `Unable to add image`;
                // toast.error(errorMessage);
                dismissibleError(errorMessage)
            }
        }
        setDialogOpen(false);
    };
    const handleToggleExpandRow = (rowKey) => { setExpandedRowKey(prevKey => (prevKey === rowKey ? null : rowKey)); };
    const handleInlineSave = (updatedData) => { onImageUpdate(release, expandedRowKey, updatedData); setExpandedRowKey(null); };

    const handleEditToggle = async () => {
        if (editMode) {
            for (const img of imageData) {
                if (img.original_image_name && img.original_image_name !== img.image_name) {
                    try {
                        const originalName = img.original_image_name;
                        const updatedImg = { ...img };
                        delete updatedImg.original_image_name;
                        await updateReleaseProductImage(release, product, originalName, updatedImg);
                        onImageUpdate(release, originalName, updatedImg);
                    } catch (error) { console.error("Error updating image:", error); }
                }
            }
        }
        setEditMode(prev => !prev);
        if (!editMode) {
            setImageData(imgs => imgs.map(img => ({ ...img, original_image_name: img.image_name })));
        }
    };

    const paginated = imageData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Paper sx={{ width: '100%', mt: 2, borderRadius: 2 }}>
            <TableContainer>
                <Table size={isSmallScreen ? 'small' : 'medium'}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#1a237e' }}>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    color="primary" sx={{ color: 'white', '&.Mui-checked': { color: 'white' }, '&.MuiCheckbox-indeterminate': { color: 'white' } }}
                                    indeterminate={selected.length > 0 && selected.length < images.length}
                                    checked={images.length > 0 && selected.length === images.length}
                                    onChange={handleSelectAllClick}
                                    disabled={images.length === 0}
                                />
                            </TableCell>
                            <TableCell sx={{ color: 'white' }}>Image Name</TableCell>
                            <TableCell sx={{ color: 'white', textAlign: 'center' }}>Details</TableCell>
                            <TableCell sx={{ color: 'white', textAlign: 'center' }}>Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {imageData.length > 0 ? (
                            paginated.map((row) => {
                                const rowKey = row.original_image_name || row.image_name;
                                const isExpanded = expandedRowKey === rowKey;
                                const isSelected = selected.includes(row.image_name);

                                return (
                                    <React.Fragment key={rowKey}>
                                        <TableRow hover selected={isSelected} sx={{ '& > *': { borderBottom: 'unset' } }}>
                                            <TableCell padding="checkbox">
                                                <Checkbox color="primary" checked={isSelected} onChange={() => handleSelect(row.image_name)} />
                                            </TableCell>
                                            <TableCell>
                                                {editMode ? (
                                                    // Your original edit logic - RESTORED
                                                    <TextField
                                                        variant="standard" value={row.image_name}
                                                        onChange={(e) => {
                                                            setImageData(currentData => currentData.map(img =>
                                                                (img.original_image_name || img.image_name) === rowKey
                                                                    ? { ...img, image_name: e.target.value }
                                                                    : img
                                                            ));
                                                        }}
                                                        fullWidth
                                                    />
                                                ) : (row.image_name)}
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton onClick={() => handleToggleExpandRow(rowKey)}>
                                                    {isExpanded ? <CloseIcon /> : <AddCircleOutlineIcon />}
                                                </IconButton>
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton color="error" onClick={() => handleDelete(row)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                                                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                                    <ImageDialog renderInline={true} mode="view" data={{ release, product, ...row }} onClose={() => setExpandedRowKey(null)} onSave={handleInlineSave} />
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                    <Typography color="text.secondary">
                                        No images exist for this release.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1 }}>
                <TablePagination component="div" count={imageData.length} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} rowsPerPageOptions={[5, 10, 25]} onRowsPerPageChange={handleChangeRowsPerPage} />
                <Box>
                    <Button variant="contained" startIcon={editMode ? <SaveIcon /> : <EditIcon />} onClick={handleEditToggle} sx={{ mr: 2 }}>{editMode ? 'Save Names' : 'Edit'}</Button>
                    <Button variant="contained" onClick={handleAddImage}>Add Image</Button>
                </Box>
            </Box>

            <ImageDialog open={dialogOpen} mode={dialogMode} data={dialogData} onClose={() => setDialogOpen(false)} onSave={handleDialogSave} />
        </Paper>
    );
};

export default ImageTable;