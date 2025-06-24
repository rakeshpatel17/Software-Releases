// import React from 'react';
// import PropTypes from 'prop-types';
// import EditableFieldComponent from '../EditableFieldComponent';
// import ToggleButtonComponent from '../ToggleButton/ToggleButton';
// import { update_patch_product_jar } from '../../api/update_patch_product_jar';

// function JarTable({
//   id,
//   productKey,
//   jars,
//   onJarsUpdate
// }) {
//   const handleSaveRemarks = async (jIdx, newValue) => {
//     try {
//       const jarName = jars[jIdx].name;
//       await update_patch_product_jar(id, productKey, jarName, { remarks: newValue });
//       const updated = jars.map((jar, i) =>
//         i === jIdx ? { ...jar, remarks: newValue } : jar
//       );
//       onJarsUpdate(updated);
//     } catch (error) {
//       console.error('Error updating remarks:', error.message);
//       alert('Failed to update remarks.');
//     }
//   };

//   const handleToggleUpdated = (jIdx, newValue) => {
//     const booleanValue = newValue === 'Yes';
//     const updated = jars.map((jar, i) =>
//       i === jIdx ? { ...jar, updated: booleanValue } : jar
//     );
//     onJarsUpdate(updated);
//   };

//   return (
//     <table className="product-table">
//       <thead>
//         <tr>
//           <th>Jar</th>
//           <th>Current Version</th>
//           <th>Version</th>
//           <th>Remarks</th>
//           <th>Updated</th>
//         </tr>
//       </thead>
//       <tbody>
//         {jars.length === 0 ? (
//           <tr>
//             <td colSpan={5} style={{ textAlign: 'center' }}>
//               No jars available
//             </td>
//           </tr>
//         ) : (
//           jars.map((entry, jIdx) => (
//             <tr key={jIdx}>
//               <td>{entry.name}</td>
//               <td>{entry.current_version}</td>
//               <td>{entry.version}</td>
//               <td>
//                 <EditableFieldComponent
//                   value={entry.remarks || '—'}
//                   onSave={(newValue) => handleSaveRemarks(jIdx, newValue)}
//                 />
//               </td>
//               <td>
//                 <ToggleButtonComponent
//                   options={['Yes', 'No']}
//                   value={entry.updated ? 'Yes' : 'No'}
//                   onToggle={(newValue) => handleToggleUpdated(jIdx, newValue)}
//                 />
//               </td>
//             </tr>
//           ))
//         )}
//       </tbody>
//     </table>
//   );
// }

// JarTable.propTypes = {
//   id: PropTypes.string.isRequired,
//   productKey: PropTypes.string.isRequired,
//   jars: PropTypes.arrayOf(
//     PropTypes.shape({
//       name: PropTypes.string,
//       version: PropTypes.string,
//       current_version: PropTypes.string,
//       remarks: PropTypes.string,
//       updated: PropTypes.bool
//     })
//   ).isRequired,
//   onJarsUpdate: PropTypes.func.isRequired
// };

// export default JarTable;


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
  useTheme
} from '@mui/material';
import EditableFieldComponent from '../EditableFieldComponent';
import ToggleButtonComponent  from '../ToggleButton/ToggleButton';
import { update_patch_product_jar } from '../../api/update_patch_product_jar';

export default function JarTable({
  id,
  productKey,
  jars,
  onJarsUpdate
}) {
  const theme = useTheme();

  // Pagination
  const [page, setPage]         = React.useState(0);
  const [rowsPerPage, setRPP]   = React.useState(10);
  const handleChangePage       = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = e => {
    setRPP(parseInt(e.target.value, 10));
    setPage(0);
  };

  // Handlers
  const handleSaveRemarks = async (jIdx, newValue) => {
    try {
      const jarName = jars[jIdx].name;
      await update_patch_product_jar(id, productKey, jarName, { remarks: newValue });
      const updated = jars.map((jar, i) =>
        i === jIdx ? { ...jar, remarks: newValue } : jar
      );
      onJarsUpdate(updated);
    } catch (err) {
      console.error('Error updating remarks:', err);
      alert('Failed to update remarks.');
    }
  };

  const handleToggleUpdated = (jIdx, newValue) => {
    const booleanValue = newValue === 'Yes';
    const updated = jars.map((jar, i) =>
      i === jIdx ? { ...jar, updated: booleanValue } : jar
    );
    onJarsUpdate(updated);
  };

  // Slice for pagination
  const paginated = rowsPerPage > 0
    ? jars.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : jars;

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
        <Table stickyHeader aria-label="jar table">
          <TableHead>
            <TableRow>
              {['Jar','Current Version','Version','Remarks','Updated'].map((label) => (
                <TableCell
                  key={label}
                  align={label === 'Remarks' ? 'left' : 'center'}
                  sx={{
                    backgroundColor: '#20338b',
                    color: theme.palette.common.white,
                    fontWeight: 'bold'
                  }}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.length === 0
              ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, fontStyle: 'italic' }}>
                    No jars available
                  </TableCell>
                </TableRow>
              )
              : paginated.map((jar, jIdx) => (
                <TableRow key={jIdx} hover>
                  <TableCell align="center">{jar.name}</TableCell>
                  <TableCell align="center">{jar.current_version}</TableCell>
                  <TableCell align="center">{jar.version}</TableCell>
                  <TableCell>
                    <EditableFieldComponent
                      value={jar.remarks || '—'}
                      onSave={(newValue) => handleSaveRemarks(jIdx + page * rowsPerPage, newValue)}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <ToggleButtonComponent
                      options={['Yes','No']}
                      value={jar.updated ? 'Yes' : 'No'}
                      onToggle={(newVal) => handleToggleUpdated(jIdx + page * rowsPerPage, newVal)}
                    />
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5,10,25,{ value: -1, label: 'All' }]}
        component="div"
        count={jars.length}
        rowsPerPage={rowsPerPage > 0 ? rowsPerPage : jars.length}
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

JarTable.propTypes = {
  id: PropTypes.string.isRequired,
  productKey: PropTypes.string.isRequired,
  jars: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      version: PropTypes.string,
      current_version: PropTypes.string,
      remarks: PropTypes.string,
      updated: PropTypes.bool
    })
  ).isRequired,
  onJarsUpdate: PropTypes.func.isRequired
};
