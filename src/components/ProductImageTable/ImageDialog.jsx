import React from 'react';
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
  const [formData, setFormData] = React.useState({ ...data });

  React.useEffect(() => {
    if (open) setFormData(data || {});
  }, [open, data]);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const isViewOnly = mode === 'view';

  // Group fields by Registry, OT2PaaS, Local
  const groupedFields = {
    Registry: fields.filter(f => f.group === 'Registry'),
    OT2PaaS: fields.filter(f => f.group === 'OT2PaaS'),
    Local: fields.filter(f => f.group === 'Local'),
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === 'add' ? 'Add Image' : mode === 'edit' ? 'Edit Image' : 'View Image'}
      </DialogTitle>

      <DialogContent dividers>
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
        {!isViewOnly && (
          <Button variant="contained" onClick={() => onSave(formData)}>
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ImageDialog;
