// import ExcelJS from 'exceljs';
// import { saveAs } from 'file-saver';

// function exportToExcel(products, fileName) {
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet('Vulnerabilities');

//   // 1) Header row with styling
//   const headerRow = worksheet.addRow([
//     'product_name',
//     'image_name',
//     'scan_type',
//     'cve_id',
//     'severity',
//     'affected_libraries',
//     'library_path'
//   ]);
//   headerRow.eachCell(cell => {
//   cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
//   cell.alignment = { vertical: 'middle', horizontal: 'center' };
//   cell.fill = {
//     type: 'pattern',
//     pattern: 'solid',
//     fgColor: { argb: 'FF4472C4' } // A rich blue (Office-style)
//   };
//   cell.border = {
//     top:    { style: 'thin' },
//     left:   { style: 'thin' },
//     bottom: { style: 'thin' },
//     right:  { style: 'thin' }
//   };
// });

//   // 2) Populate data rows, skipping any is_deleted entries
//   let currentRow = 2; // next row index after header
//   for (const product of products) {
//     if (product.is_deleted) continue;
//     const productStartRow = currentRow;

//     for (const image of product.images) {
//       if (image.is_deleted) continue;
//       const imageStartRow = currentRow;

//       // Filter out deleted security issues
//       const issues = (image.security_issues || []).filter(issue => !issue.is_deleted);
//       if (issues.length === 0) {
//         // No issues: add a "clean" row
//         worksheet.addRow([
//           product.name,
//           image.image_name,
//           'Twistlock',
//           'clean',
//           '', // severity
//           '', // affected_libraries
//           ''  // library_path
//         ]);
//         currentRow++;
//       } else {
//         // Add one row per issue
//         for (const issue of issues) {
//           worksheet.addRow([
//             product.name,
//             image.image_name,
//             'Twistlock',
//             issue.cve_id,
//             issue.severity,
//             Array.isArray(issue.affected_libraries)
//               ? issue.affected_libraries.join(', ')
//               : issue.affected_libraries,
//             issue.library_path
//           ]);
//           currentRow++;
//         }
//       }

//       // 3) Merge image_name cells if multiple rows were added
//       const imageEndRow = currentRow - 1;
//       if (imageEndRow > imageStartRow) {
//         // Merge column B (image_name) from imageStartRow to imageEndRow
//         worksheet.mergeCells(imageStartRow, 2, imageEndRow, 2);
//       }
//     }

//     // 4) Merging name cells if multiple rows for this product
//     const productEndRow = currentRow - 1;
//     if (productEndRow > productStartRow) {
//       // Merge column A (name) from productStartRow to productEndRow
//       worksheet.mergeCells(productStartRow, 1, productEndRow, 1);
//     }
//   }

//   // Apply alignment and wrap text to all other rows
//   worksheet.eachRow((row, rowNumber) => {
//     if (rowNumber === 1) return;

//     row.eachCell(cell => {
//       cell.alignment = { 
//         vertical: 'middle', 
//         horizontal: 'center', 
//         wrapText: true 
//       };
//     });
//   });

//   // Auto-adjust column widths
//   worksheet.columns.forEach(column => {
//     let maxLength = 0;
//     column.eachCell({ includeEmpty: true }, cell => {
//       const columnLength = cell.value ? cell.value.toString().length : 10;
//       if (columnLength > maxLength) {
//         maxLength = columnLength;
//       }
//     });
//     column.width = maxLength + 2;
//   });

//   // 5) Writing workbook to buffer and save using FileSaver
//   workbook.xlsx.writeBuffer().then(buffer => {
//     const blob = new Blob([buffer], {
//       type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//     });
//     saveAs(blob, `${fileName}.xlsx`);
//   });
// }

// export default exportToExcel;


import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

function exportToExcel(products, fileName) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Vulnerabilities');
  worksheet.properties.outlineProperties = { summaryBelow: false };

  // Add header row (same as before)
  const headerRow = worksheet.addRow([
    'product_name',
    'image_name',
    'scan_type',
    'cve_id',
    'severity',
    'affected_libraries',
    'library_path'
  ]);
  
  // Style header row (same as before)
  headerRow.eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // Populate data rows with grouping
  let currentRow = 2;
  
  for (const product of products) {
    if (product.is_deleted) continue;
    const productStartRow = currentRow;

    for (const image of product.images) {
      if (image.is_deleted) continue;
      const imageStartRow = currentRow;

      const issues = (image.security_issues || []).filter(issue => !issue.is_deleted);
      
      if (issues.length === 0) {
        // No issues: add a "clean" row
        worksheet.addRow([
          product.name,
          image.image_name,
          'Twistlock',
          'clean',
          '', '', ''
        ]);
        currentRow++;
      } else {
        // Add summary row with visual indicator
        const summaryRow = worksheet.addRow([
          product.name,
          image.image_name,
          'Twistlock',
          `▼ ${issues.length} Issues`,
          issues.some(i => i.severity === 'Critical' || i.severity === 'High') ? 'Critical/High' : 'Medium/Low',
          'Click to expand',
          ''
        ]);
        
        // Style the summary row to indicate it's expandable
        summaryRow.eachCell(cell => {
          cell.font = { bold: true };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF0F0F0' }
          };
        });
        
        // Set outline level for grouping
        summaryRow.outlineLevel = 1;
        currentRow++;

        //  To write formula
        const firstDetailRow = worksheet.lastRow ? worksheet.lastRow.number + 1 : 2;

        // Add detail rows (hidden by default)
        for (const issue of issues) {
          const issueRow = worksheet.addRow([
            '', // Empty for product name
            '', // Empty for image name
            'Twistlock',
            issue.cve_id,
            issue.severity,
            Array.isArray(issue.affected_libraries)
              ? issue.affected_libraries.join(', ')
              : issue.affected_libraries,
            issue.library_path
          ]);
          
          // Set outline level for grouping
          issueRow.outlineLevel = 2;
          
          // Hide detail rows by default
          issueRow.hidden = true;
          
          currentRow++;
        }
        const lastDetailRow = worksheet.lastRow.number;
        //overwrite cell F with the IF‑formula
        const toggleFormula = 
          `IF(SUBTOTAL(103, D${firstDetailRow}:D${lastDetailRow})>0,` +
          `"Click to minimize","Click to expand")`;

        summaryRow.getCell(6).value = { formula: toggleFormula, result: 'Click to expand' };
        summaryRow.getCell(6).font      = { bold: true };
        summaryRow.getCell(6).alignment = { horizontal: 'center' };
      }
    }
  }

  // Apply styling to all data rows
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header

    row.eachCell(cell => {
      cell.alignment = { 
        vertical: 'middle', 
        horizontal: 'center', 
        wrapText: true 
      };
    });
  });

  // Auto-adjust column widths
  worksheet.columns.forEach(column => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, cell => {
      const columnLength = cell.value ? cell.value.toString().length : 10;
      if (columnLength > maxLength) {
        maxLength = columnLength;
      }
    });
    column.width = maxLength + 2;
  });

  //  Add one empty row for spacing, to seperate the note and table.
  worksheet.addRow([]);
  currentRow++;

  // 1'st note about using Excel's outline controls
  const noteRow = worksheet.addRow(['Note: Use Excel\'s +/- buttons in the left margin to expand/collapse groups, or select rows and right-click to unhide/hide.']);
  noteRow.font = { italic: true };
  worksheet.mergeCells(currentRow, 1, currentRow, 7);

  // 2) Spacer row
  const spacer = worksheet.addRow([]);
  // no merge needed for blank row

  // 3) Header for mode selection
  const headerModeRow = worksheet.addRow([ 'Click the numbers in the left margin to switch views:' ]);
  headerModeRow.font      = { bold: true };
  headerModeRow.alignment = { vertical: 'middle' };
  worksheet.mergeCells(headerModeRow.number, 1, headerModeRow.number, 7);

  // 4) Mode 1: Clean view
  const mode1Row = worksheet.addRow([
    '1. Show only images with no security issues (Clean view).'
  ]);
  mode1Row.font      = { italic: true };
  mode1Row.alignment = { wrapText: true, vertical: 'middle' };
  worksheet.mergeCells(mode1Row.number, 1, mode1Row.number, 7);

  // 5) Mode 2: Summary view
  const mode2Row = worksheet.addRow([
    '2. Show all images and list every issue, but collapsed by default (Summary view).'
  ]);
  mode2Row.font      = { italic: true };
  mode2Row.alignment = { wrapText: true, vertical: 'middle' };
  worksheet.mergeCells(mode2Row.number, 1, mode2Row.number, 7);

  // 6) Mode 3: Detailed view
  const mode3Row = worksheet.addRow([
    '3. Show all images with every issue expanded (Detailed view).'
  ]);
  mode3Row.font      = { italic: true };
  mode3Row.alignment = { wrapText: true, vertical: 'middle' };
  worksheet.mergeCells(mode3Row.number, 1, mode3Row.number, 7);
  
  // Save the workbook
  workbook.xlsx.writeBuffer().then(buffer => {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, `${fileName}.xlsx`);
  });
}

export default exportToExcel;
