import React from 'react';
import { updateReleaseProductImage } from '../../../api/ReleaseProductImage';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Grid, TextField, Typography, Button, Box
} from '@mui/material';
import RoleVisibility from '../../../components/AuthorizedAction/RoleVisibility';
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

const ImageDialog = ({ open, mode = 'view', onClose, data = {}, onSave, renderInline = false }) => {
    const [formData, setFormData] = React.useState({});
    const [localEditMode, setLocalEditMode] = React.useState(false);

    React.useEffect(() => {
        if (open || renderInline) {
            setFormData(data || {});
            setLocalEditMode(mode === 'edit' || mode === 'add');
        }
    }, [open, data, mode, renderInline]);

    const handleChange = (key, value) => {
        if (key === 'image_name') {
            setFormData(prev => ({
                ...prev,
                image_name: value,

                registry_image_name: value,
                ot2paas_image_name: value,
                local_image_name: value
            }));
        } else {
            setFormData(prev => ({ ...prev, [key]: value }));
        }
    };

    const isViewOnly = mode === 'view' && !localEditMode;
    const groupedFields = {
        Registry: fields.filter(f => f.group === 'Registry'),
        OT2PaaS: fields.filter(f => f.group === 'OT2PaaS'),
        Local: fields.filter(f => f.group === 'Local'),
    };

    const handleToggleEdit = async () => {
        if (localEditMode) {
            const { release, product, image_name } = data;
            try {
                const response = await updateReleaseProductImage(release, product, image_name, formData);
                if (response) {
                    onSave(response);
                }
            } catch (error) { console.error("Error while saving:", error); }
        } else {
            setLocalEditMode(true);
        }
    };

    const DialogFormContent = (
        <>
            {/* <DialogTitle>{mode === 'add' ? 'Add Image' : localEditMode ? 'Edit Image' : `View Image: ${data.image_name}`}</DialogTitle> */}
            <DialogContent dividers>
                {mode === 'add' && (<TextField label="Image Name" value={formData.image_name || ''} onChange={(e) => handleChange('image_name', e.target.value)} fullWidth margin="dense" required />)}
                <Grid container spacing={2} sx={{ mt: mode === 'add' ? 1 : 0 }}>
                    {['Registry', 'OT2PaaS', 'Local'].map(group => (
                        <Grid item xs={12} md={4} key={group}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>{group}</Typography>
                            {groupedFields[group].map(field => (<TextField key={field.key} label={field.label} value={formData[field.key] || ''} onChange={(e) => handleChange(field.key, e.target.value)} fullWidth margin="dense" InputProps={{ readOnly: isViewOnly }} />))}
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
            <DialogActions>
                <RoleVisibility roles={['admin', 'product_manager']}>
                    {mode === 'view' && (
                        <Button
                            variant="contained"
                            onClick={handleToggleEdit}
                            color={localEditMode ? 'success' : 'primary'}
                        >
                            {localEditMode ? 'Save' : 'Edit'}
                        </Button>
                    )}
                </RoleVisibility>
                {mode !== 'view' && (<Button variant="contained" onClick={() => onSave(formData)}>Save</Button>)}
                                <Button onClick={onClose}>Cancel</Button>

            </DialogActions>
        </>
    );

    if (renderInline) {
        return <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }}>{DialogFormContent}</Box>;
    }
    return <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>{DialogFormContent}</Dialog>;
};

export default ImageDialog;