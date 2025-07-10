

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  useTheme,
  Typography
} from '@mui/material';
import EditableFieldComponent from '../EditableFieldComponent';
import { securityIssuesUpdate } from '../../api/updateIssuesdes';
import { fetchDescription } from '../../api/fetchDescription ';

export default function SecurityIssuesTable({
  issues,
  Productsdata,
  patchname,
  img,
  allDetailedImages,
  setDetailedImages

}) {
  const theme = useTheme();
  console.log("issues in sec table", issues);

  const [descriptions, setDescriptions] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadAllDescriptions = async () => {
      if (!issues || issues.length === 0) {
        setIsLoading(false);
        return;
      }

      const currentProduct = Productsdata.find(p => p.images?.some(i => i.image_name === img.image_name));
      if (!currentProduct) {
        setIsLoading(false);
        return;
      }

      const descriptionPromises = issues.map(issue => {
        const libs = Array.isArray(issue.affected_libraries) ? issue.affected_libraries.join(', ') : issue.affected_libraries;
        const context = {
          patchName: patchname,
          productName: currentProduct.name,
          cve_id: issue.cve_id,
          cvss_score: issue.cvss_score,
          severity: issue.severity,
          affected_libraries: libs,
        };

        return fetchDescription(context).then(desc => ({
          key: `${issue.cve_id}-${issue.cvss_score}`, // A unique key for this issue
          description: desc
        }));
      });

      const results = await Promise.all(descriptionPromises);

      if (isMounted) {
        const descriptionMap = results.reduce((acc, curr) => {
          acc[curr.key] = curr.description;
          return acc;
        }, {});
        setDescriptions(descriptionMap);
        setIsLoading(false);
      }
    };

    loadAllDescriptions();

    return () => { isMounted = false; }; // Cleanup function
  }, [issues, Productsdata, patchname, img]);

  // Pagination state
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // slice the issues for current page
  const paginated = rowsPerPage > 0
    ? issues.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : issues;

  // your existing severity colors
  const severityColors = {
    low: '#008000',
    medium: '#FFD700',
    high: '#FF8C00',
    critical: '#FF0000'
  };


const handleSaveDescription = async (issue, newValue) => {
    const currentProduct = Productsdata.find(p => p.images?.some(i => i.image_name === img.image_name));
    if (!currentProduct) return;
    
    const libs = Array.isArray(issue.affected_libraries) ? issue.affected_libraries.join(', ') : issue.affected_libraries;
    const payload = {
      productName: currentProduct.name,
      cveId: issue.cve_id,
      cvss_score: issue.cvss_score,
      severity: issue.severity,
      affected_libraries: libs,
      product_security_des: newValue
    };
    
    try {
      await securityIssuesUpdate(patchname, payload);
      console.log("Database update successful!");

    
      const newDetailedImages = allDetailedImages.map(imageInState => {
        if (imageInState.image_name !== img.image_name) {
          return imageInState;
        }
        
        return {
          ...imageInState,
          security_issues: (imageInState.security_issues || []).map(issueInState => {
            if (issueInState.cve_id === issue.cve_id && issueInState.cvss_score === issue.cvss_score) {
              return { ...issueInState, product_security_des: newValue };
            }
            return issueInState;
          })
        };
      });

      setDetailedImages(newDetailedImages);

      const issueKey = `${issue.cve_id}-${issue.cvss_score}`;
      setDescriptions(prev => ({ ...prev, [issueKey]: newValue || '—' }));

    } catch (err) {
      console.error("Save failed:", err);
      alert("Save failed, please try again.");
    }
  };


  return (
    <Paper
      sx={{
        width: '100%',
        bgcolor: theme.palette.mode === 'dark'
          ? theme.palette.background.paper
          : '#fff'
      }}
    >
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {['CVE ID', 'CVSS Score', 'Severity', 'Affected Libraries', 'Description']
                .map((label) => (
                  <TableCell
                    key={label}
                    align={label === 'CVSS Score' || label === 'Severity' ? 'center' : 'left'}
                    sx={{
                      backgroundColor: '#20338b',
                      color: theme.palette.common.white,
                      fontWeight: 'bold'
                    }}
                  >
                    {label}
                  </TableCell>
                ))
              }
            </TableRow>
          </TableHead>

          <TableBody>
  {isLoading ? (
    <TableRow>
      <TableCell colSpan={5} align="center" sx={{ py: 4, fontStyle: 'italic' }}>
        Loading ...
      </TableCell>
    </TableRow>
  ) : (
    paginated.map((issue, idx) => {
      // Define `libs` here so it's available for the row
      const libs = Array.isArray(issue.affected_libraries)
        ? issue.affected_libraries.join(', ')
        : issue.affected_libraries;

      return (
        <TableRow key={idx} hover>
          <TableCell>{issue.cve_id}</TableCell>
          <TableCell align="center">{issue.cvss_score}</TableCell>
          <TableCell align="center">
            <Typography
              sx={{
                color: severityColors[issue.severity.toLowerCase()] || theme.palette.text.primary,
                fontWeight: 'bold'
              }}
            >
              {issue.severity}
            </Typography>
          </TableCell>
          <TableCell>{libs}</TableCell>
          <TableCell align="center">
            <EditableFieldComponent
              value={
                // Look up the value from the state you fetched in useEffect.
                // The key must match the key you created when fetching.
                descriptions[`${issue.cve_id}-${issue.cvss_score}`] || '—'
              }
              onSave={(newValue) => handleSaveDescription(issue, newValue)}
            />
          </TableCell>
        </TableRow>
      );
    })
  )}
  
  {/* This part for empty issues is correct */}
  {issues.length === 0 && !isLoading && (
    <TableRow>
      <TableCell colSpan={5} align="center" sx={{ py: 4, fontStyle: 'italic' }}>
        No security issues...
      </TableCell>
    </TableRow>
  )}
</TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, { value: -1, label: 'All' }]}
        component="div"
        count={issues.length}
        rowsPerPage={rowsPerPage > 0 ? rowsPerPage : issues.length}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          '.MuiTablePagination-toolbar': {
            bgcolor: theme.palette.background.default
          }
        }}
      />
    </Paper>
  );
}

SecurityIssuesTable.propTypes = {
  issues: PropTypes.array.isRequired,
  Productsdata: PropTypes.array.isRequired,
  patchname: PropTypes.string.isRequired,
  img: PropTypes.object.isRequired,
  allDetailedImages: PropTypes.array.isRequired,
  setDetailedImages: PropTypes.func.isRequired
};
