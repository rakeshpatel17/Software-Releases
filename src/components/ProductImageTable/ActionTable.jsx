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

const ImageTable = ({ images = [] }) => {
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

    // ✅ Reset image data when images prop changes
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
        setDialogData({});
        setDialogOpen(true);
    };

    const handleOpenDialog = (row) => {
        setDialogMode(editMode ? 'edit' : 'view');
        setDialogData(row);
        setDialogOpen(true);
    };

    const handleDialogSave = (newData) => {
        if (dialogMode === 'add') {
            setImageData([...imageData, newData]);
        } else if (dialogMode === 'edit') {
            setImageData(prev =>
                prev.map(item =>
                    item.image_name === newData.image_name ? newData : item
                )
            );
        }
        setDialogOpen(false);
    };

    const handleEditToggle = () => setEditMode(prev => !prev);

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
                            <TableCell sx={{ color: 'white' }}>Build Number</TableCell>
                            <TableCell sx={{ color: 'white' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginated.map((row, index) => {
                            console.log('Rendering row:', row);
                            return (
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
                                        {editMode ? (
                                            <TextField
                                                variant="standard"
                                                value={row.build_number}
                                                onChange={(e) => {
                                                    const updated = [...imageData];
                                                    const globalIndex = imageData.findIndex(
                                                        (img) => img.image_name === row.image_name
                                                    );
                                                    if (globalIndex !== -1) {
                                                        updated[globalIndex].build_number = e.target.value;
                                                        setImageData(updated);
                                                    }
                                                }}
                                                fullWidth
                                            />
                                        ) : (
                                            row.build_number
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleOpenDialog(row)}>
                                            <AddCircleOutlineIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
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
