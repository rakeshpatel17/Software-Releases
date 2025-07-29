import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import ExpandableSection from '../../ExpandableSection/ExpandableSection';
import SeverityFilterButtons from '../../Button/SeverityFilterButtons'
import JarFilterButtons from '../../Button/JarFilterButtons';
import SecurityIssuesTable from '../../SecurityIssuesTable/SecurityIssuesTable';
import JarsSection from './JarsSection';

export default function ImageDetailsPanel({
  img, imageJars,
  selectedLevels, setSelectedLevels,
  selectedJarStatuses, setSelectedJarStatuses,
  products, patchname, onImageJarsUpdate
}) {
  const theme = useTheme();

  return (
    <>
      <Box sx={{ display:'flex', flexWrap:'wrap', justifyContent:'space-between', mb:2 }}>
        <Typography><strong>Twist Lock Report: </strong>
          <a href={img.twistlock_report_url} target="_blank" rel="noopener noreferrer"
            style={{ color: theme.palette.primary.light, textDecoration:'none' }}>
            View Report
          </a>
        </Typography>
        <Typography><strong>Updated At:</strong> {new Date(img.updated_at).toLocaleString()}</Typography>
      </Box>

      <ExpandableSection
        title="Security Issues"
        actions={
          <SeverityFilterButtons
            allIssues={img.security_issues}
            selectedLevels={selectedLevels}
            onToggleLevel={lvl => {
              setSelectedLevels(s => {
                const copy = new Set(s);
                copy.has(lvl) ? copy.delete(lvl) : copy.add(lvl);
                return copy;
              });
            }}
            onToggleAll={() => {
              setSelectedLevels(s =>
                s.size === ['critical','high','medium','low'].length
                  ? new Set() : new Set(['critical','high','medium','low'])
              );
            }}
          />
        }
      >
        <SecurityIssuesTable
          issues={img.security_issues}
          Productsdata={products}
          patchname={patchname}
          img={img}
        />
      </ExpandableSection>

      <JarsSection
        jars={imageJars}
        patchname={patchname}
        imageName={img.image_name}
        selectedJarStatuses={selectedJarStatuses}
        setSelectedJarStatuses={setSelectedJarStatuses}
        onImageJarsUpdate={onImageJarsUpdate}
      />
    </>
  );
}
