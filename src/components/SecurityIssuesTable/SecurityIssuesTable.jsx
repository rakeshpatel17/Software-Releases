// import React from 'react';
// import PropTypes from 'prop-types';
// import EditableFieldComponent from '../EditableFieldComponent';
// import { securityIssuesUpdate } from '../../api/updateIssuesdes';

// function SecurityIssuesTable({ issues, Productsdata, patchname, refreshProductsData, img}) {
//   const severityColors = {
//     low: '#008000',
//     medium: '#FFD700',
//     high: '#FF8C00',
//     critical: '#FF0000'
//   };

//   return (
//     <div className="security-issues-table">
//       {issues.length > 0 ? (
//         <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
//           <thead>
//             <tr>
//               <th>CVE ID</th>
//               <th>CVSS Score</th>
//               <th>Severity</th>
//               <th>Affected Libraries</th>
//               {/* <th>Library Path</th> */}
//               <th>Description</th>
//             </tr>
//           </thead>
//           <tbody>
//             {issues.map((issue, idx) => (
//               <tr key={idx}>
//                 <td>{issue.cve_id}</td>
//                 <td>{issue.cvss_score}</td>
//                 <td style={{ color: severityColors[issue.severity.toLowerCase()], fontWeight: 'bold' }}>
//                   {issue.severity}
//                 </td>
//                 <td>{issue.affected_libraries}</td>
//                 {/* <td>{issue.library_path}</td> */}
//                 <td>
//                   <EditableFieldComponent
//                     value={
//                       Productsdata.find(p => p.name === img.product)?.product_security_des || '—'
//                     }
//                     onSave={async (newValue) => {
//                         const updatedProducts = [...Productsdata]; // shallow copy
//                         // Find product that contains this image
//                         const productIndex = updatedProducts.findIndex(p =>
//                             p.images.some(i =>
//                                 i.image_name === img.image_name &&
//                                 i.patch_build_number === img.patch_build_number
//                             )
//                         );
//                       if (productIndex !== -1) {
//                         updatedProducts[productIndex].product_security_des = newValue;
//                         try {
//                           await securityIssuesUpdate(patchname, { products_data: updatedProducts});
//                           await refreshProductsData();
//                         } catch (err) {
//                           console.error(err);
//                           alert('Update failed');
//                         }
//                       }
//                     }}
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p style={{ marginTop: 8, fontStyle: 'italic' }}>No security issues...</p>
//       )}
//     </div>
//   );
// }

// SecurityIssuesTable.propTypes = {
//   issues: PropTypes.array.isRequired,
//   productsData: PropTypes.array.isRequired,
//   patchName: PropTypes.string.isRequired,
//   refreshProductsData: PropTypes.func.isRequired
// };

// export default SecurityIssuesTable;

import React from 'react';
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

export default function SecurityIssuesTable({
  issues,
  Productsdata,
  patchname,
  refreshProductsData,
  img
}) {
  const theme = useTheme();

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
            {paginated.map((issue, idx) => {
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
                        Productsdata.find(p => p.name === img.product)
                          ?.product_security_des || '—'
                      }
                      onSave={async (newValue) => {
                        const updated = [...Productsdata];
                        const idxProd = updated.findIndex(p =>
                          p.images.some(i =>
                            i.image_name === img.image_name &&
                            i.patch_build_number === img.patch_build_number
                          )
                        );
                        if (idxProd !== -1) {
                          updated[idxProd].product_security_des = newValue;
                          try {
                            await securityIssuesUpdate(patchname, {
                              products_data: updated
                            });
                            await refreshProductsData();
                          } catch (err) {
                            console.error(err);
                            alert('Update failed');
                          }
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}

            {issues.length === 0 && (
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
  refreshProductsData: PropTypes.func.isRequired,
  img: PropTypes.object.isRequired
};
