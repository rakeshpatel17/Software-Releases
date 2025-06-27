
import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Checkbox, TablePagination, Button, Box, IconButton, TextField
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ImageDialog from './ImageDialog';
import { createReleaseProductImage } from '../../api/createReleaseProductImage';
import { updateReleaseProductImage } from '../../api/ReleaseProductImage';

const ImageTable = ({ images = [], release, product, onImageUpdate, onImageAdd }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [imageData, setImageData] = useState([]);
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [editMode, setEditMode] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState('view');
    const [dialogData, setDialogData] = useState({});

    useEffect(() => {
        setImageData(images);
        setPage(0);
    }, [images]);

    const handleSelect = (imageName) => {
        setSelected(prev =>
            prev.includes(imageName)
                ? prev.filter(name => name !== imageName)
                : [...prev, imageName]
        );
    };

    const handleChangePage = (_, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleAddImage = () => {
        setDialogMode('add');
        setDialogData({ release, product });
        setDialogOpen(true);
    };

    const handleOpenDialog = (row) => {
        const latest = imageData.find(img => img.image_name === row.image_name) || row;

        setDialogData({
            release,
            product,
            ...latest
        });
        setDialogMode(editMode ? 'edit' : 'view');
        setDialogOpen(true);
    };


    const handleDialogSave = async (newData) => {
        if (dialogMode === 'add') {
            try {
                const createdImage = await createReleaseProductImage({
                    release,
                    product,
                    ...newData
                });
                console.log("data to add image", createdImage)
                if (createdImage) {
                    setImageData(prevImageData => [...prevImageData, createdImage]);
                }
            } catch (err) {
                console.error("Failed to add image:", err);
            }
        } else {
            onImageUpdate(release, dialogData.image_name, newData);
        }
        setDialogOpen(false);
    };




    const handleEditToggle = async () => {
    if (editMode) {
        // Save: update backend with edited image names
        for (const img of imageData) {
            if (img.original_image_name && img.original_image_name !== img.image_name) {
                try {
                    await updateReleaseProductImage(
                        release,
                        product,
                        img.original_image_name,
                        {
                            ...img,
                            release,
                            product
                        }
                    );
                } catch (error) {
                    console.error("Error updating image:", error);
                }
            }
        }

        // Clear original names after saving
        const updated = imageData.map(({ original_image_name, ...rest }) => rest);
        setImageData(updated);
    } else {
        // On entering edit mode: store original image_name
        const updated = imageData.map((img) => ({
            ...img,
            original_image_name: img.image_name
        }));
        setImageData(updated);
    }

    setEditMode(prev => !prev);
};


    const paginated = imageData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Paper sx={{ width: '100%', mt: 2, borderRadius: 2 }}>
            <TableContainer>
                <Table size={isSmallScreen ? 'small' : 'medium'}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#1a237e' }}>
                            <TableCell sx={{ color: 'white' }} />
                            <TableCell sx={{ color: 'white' }}>Image Name</TableCell>
                            <TableCell sx={{ color: 'white' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginated.map((row, index) => (
                            <TableRow key={index} hover>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        checked={selected.includes(row.image_name)}
                                        onChange={() => handleSelect(row.image_name)}
                                    />
                                </TableCell>
                                <TableCell>
                                    {editMode ? (
                                        <TextField
                                            variant="standard"
                                            value={row.image_name}
                                            onChange={(e) => {
                                                const updated = [...imageData];
                                                const globalIndex = imageData.findIndex(
                                                    (img) => img.image_name === row.image_name
                                                );
                                                if (globalIndex !== -1) {
                                                    updated[globalIndex].image_name = e.target.value;
                                                    setImageData(updated);
                                                }
                                            }}
                                            fullWidth
                                        />
                                    ) : (
                                        row.image_name
                                    )}
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpenDialog(row)}>
                                        <AddCircleOutlineIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>


            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: 2,
                    py: 1
                }}
            >
                <TablePagination
                    component="div"
                    count={imageData.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

                <Box>
                    <Button
                        variant="contained"
                        startIcon={editMode ? <SaveIcon /> : <EditIcon />}
                        onClick={handleEditToggle}
                        sx={{ mr: 2 }}
                    >
                        {editMode ? 'Save' : 'Edit'}
                    </Button>
                    <Button variant="contained" onClick={handleAddImage}>
                        Add Image
                    </Button>
                </Box>
            </Box>

            <ImageDialog
                open={dialogOpen}
                mode={dialogMode}
                data={dialogData}
                onClose={() => setDialogOpen(false)}
                onSave={handleDialogSave}
            />
        </Paper>
    );
};

export default ImageTable;