
import React, { useState, useEffect } from 'react';
import { updateReleaseProductImage } from '../../api/ReleaseProductImage';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Grid, TextField, Typography, Button
} from '@mui/material';

const fields = [
    { key: 'registry_registry', label: 'Registry URL', group: 'Registry' },
    { key: 'registry_path', label: 'Registry Path', group: 'Registry' },
    { key: 'registry_image_name', label: 'Registry Image Name', group: 'Registry' },
    { key: 'ot2paas_registry', label: 'OT2PaaS URL', group: 'OT2PaaS' },
    { key: 'ot2paas_path', label: 'OT2PaaS Path', group: 'OT2PaaS' },
    { key: 'ot2paas_image_name', label: 'OT2PaaS Image Name', group: 'OT2PaaS' },
    { key: 'local_registry', label: 'Local URL', group: 'Local' },
    { key: 'local_path', label: 'Local Path', group: 'Local' },
    { key: 'local_image_name', label: 'Local Image Name', group: 'Local' }
];

const ImageDialog = ({ open, mode = 'view', onClose, data = {}, onSave }) => {
    const [formData, setFormData] = React.useState({});
    const [localEditMode, setLocalEditMode] = React.useState(false);

    React.useEffect(() => {
        if (open) {
            setFormData(data || {});
            setLocalEditMode(mode === 'edit'); // Enter edit mode if opened in edit mode
        }
    }, [open, data, mode]);
 
    console.log("data in dialog ",data)
    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const isViewOnly = mode === 'view' && !localEditMode;

    const groupedFields = {
        Registry: fields.filter(f => f.group === 'Registry'),
        OT2PaaS: fields.filter(f => f.group === 'OT2PaaS'),
        Local: fields.filter(f => f.group === 'Local'),
    };

    const handleToggleEdit = async () => {
        if (localEditMode) {
            // Save clicked
            console.log(" Saving data to backend:", formData);

            const { release, product, image_name } = data;
            try {
                const response = await updateReleaseProductImage(release, product, image_name, formData);
                if (response) {
                    console.log(" Save successful:", response);


                    onSave(response);
                } else {
                    console.error("Save failed: Empty response");
                }
            } catch (error) {
                console.error("Error while saving:", error);
            }
        } else {
            // Edit clicked
            setLocalEditMode(true);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {mode === 'add'
                    ? 'Add Image'
                    : localEditMode
                        ? 'Edit Image'
                        : 'View Image'}
            </DialogTitle>

            <DialogContent dividers>
                {mode === 'add' && (
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Image Name
                            </Typography>
                            <TextField
                                label="Image Name"
                                value={formData.image_name || ''}
                                onChange={(e) => handleChange('image_name', e.target.value)}
                                fullWidth
                                margin="dense"
                                required
                            />
                        </Grid>
                    </Grid>
                )}


                <Grid container spacing={2}>
                    {['Registry', 'OT2PaaS', 'Local'].map(group => (
                        <Grid item xs={12} md={4} key={group}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>{group}</Typography>
                            {groupedFields[group].map(field => (
                                <TextField
                                    key={field.key}
                                    label={field.label}
                                    value={formData[field.key] || ''}
                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                    fullWidth
                                    margin="dense"
                                    InputProps={{ readOnly: isViewOnly }}
                                />
                            ))}
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                {mode === 'view' && (
                    <Button
                        variant="contained"
                        onClick={handleToggleEdit}
                        color={localEditMode ? 'success' : 'primary'}
                    >
                        {localEditMode ? 'Save' : 'Edit'}
                    </Button>
                )}
                {mode !== 'view' && (
                    <Button
                        variant="contained"
                        onClick={() => {
                            const finalData = {
                                ...formData,
                                release: data.release,
                                product: data.product,
                                image_name: formData.image_name || data.image_name,
                            };
                            console.log("Sending data for ADD:", finalData);
                            onSave(finalData);
                        }}
                    >
                        Save
                    </Button>
                )}

            </DialogActions>
        </Dialog>
    );
};

export default ImageDialog;