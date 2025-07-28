import React from 'react';
import { Box, IconButton, Typography, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ActionTable from '../ProductImageTable/ActionTable';

export function ProductReleases({
    allReleases,
    groupedImages,
    searchTerm,
    productName,
    selectedImages,
    onSelectionChange,
    onBatchDelete,
    imageHandlers,
    hasPatches // Used for conditional styling
}) {
    const filteredReleases = allReleases.filter(releaseInfo => 
        releaseInfo.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );

    if (allReleases.length === 0) {
        return (
            <Paper sx={{ p: 3, textAlign: 'center', mt: hasPatches ? 4 : 0 }}>
                <Typography variant="h6">No Active Releases Found</Typography>
                <Typography color="text.secondary">
                    There are no active releases available in the system.
                </Typography>
            </Paper>
        );
    }
    
    if (filteredReleases.length === 0) {
        return (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6">No Matching Releases Found</Typography>
                <Typography color="text.secondary">
                    Your search for "{searchTerm}" did not match any active releases.
                </Typography>
            </Paper>
        );
    }

    return (
        <>
            {filteredReleases.map(releaseInfo => {
                const releaseName = releaseInfo.name;
                const selectionForRelease = selectedImages[releaseName] || [];

                return (
                    <div key={releaseName} className="release-group">
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <h3>Release: {releaseName}</h3>
                            <IconButton
                                color="error"
                                onClick={() => onBatchDelete(releaseName, selectionForRelease)}
                                disabled={selectionForRelease.length === 0}
                                aria-label="delete selected"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                        <ActionTable
                            images={groupedImages[releaseName] || []}
                            release={releaseName}
                            product={productName}
                            onImageUpdate={imageHandlers.handleImageUpdate}
                            onImageAdd={imageHandlers.handleImageAdd}
                            selected={selectionForRelease}
                            onSelectionChange={(newSelection) => onSelectionChange(releaseName, newSelection)}
                            onImageDelete={imageHandlers.handleImageDelete}
                        />
                    </div>
                );
            })}
        </>
    );
}