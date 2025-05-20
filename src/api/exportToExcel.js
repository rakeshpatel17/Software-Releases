// import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';

// const exportToExcel = (jsonData, fileName) => {
  
//     const report = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
//     const data = [
//       ["name", "image_name", "scan_type", "cve_id", "severity", "affected_libraries", "library_path"]
//     ];
//     const merges = [];

//     // Iterating over data
//     report.forEach(product => {
//       if (product.is_deleted) return; 
//       const productStart = data.length;  // starting row index for this product

//       // Iterating over images
//       product.images.forEach(image => {
//         if (image.is_deleted) return;    
//         const imageStart = data.length;  // starting row index for this image
        
//         // Iterate over security issues within image
//         // image.security_issues.forEach(issue => {
//         //   if (issue.is_deleted) return;  // skip deleted issues

//         //   // Add a row for each issue
//         //   data.push([
//         //     product.name,
//         //     image.image_name,
//         //     "Twistlock",         // fixed scan_type
//         //     issue.cve_id,
//         //     issue.severity,
//         //     issue.affected_libraries,
//         //     issue.library_path
//         //   ]);
//         // });
//         image.security_issues.length > 0 
//         ? image.security_issues.forEach(issue => {
//             if (issue.is_deleted) return;

//             data.push([
//               product.name,
//               image.image_name,
//               "Twistlock",
//               issue.cve_id,
//               issue.severity,
//               issue.affected_libraries,
//               issue.library_path
//             ]);
//           })
//         : data.push([
//             product.name,
//             image.image_name,
//             "Twistlock",  // fixed scan_type
//             "clean",           // cve_id
//             "",           // severity
//             "",           // affected_libraries
//             ""            // library_path
//           ]);

//         // If this image had multiple issues, merge the image_name column over those rows
//         if (data.length - 1 > imageStart) {
//           merges.push({
//             s: { r: imageStart, c: 1 }, 
//             e: { r: data.length - 1, c: 1 }
//           });
//         }
//       });

//       // If this product had multiple rows (across images), merge the name column
//       if (data.length - 1 > productStart) {
//         merges.push({
//           s: { r: productStart, c: 0 },
//           e: { r: data.length - 1, c: 0 }
//         });
//       }
//     });

//     // Convert array of arrays to a worksheet
//     const worksheet = XLSX.utils.aoa_to_sheet(data);
//     // Apply merges
//     worksheet['!merges'] = merges;
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
//     const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     const blob = new Blob([excelBuffer], {type: 'application/octet-stream'});
//     saveAs(blob, `${fileName}.xlsx`);
//   }

// export default exportToExcel;

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

function exportToExcel(products, fileName) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Vulnerabilities');

  // 1) Header row with styling
  const headerRow = worksheet.addRow([
    'name',
    'image_name',
    'scan_type',
    'cve_id',
    'severity',
    'affected_libraries',
    'library_path'
  ]);
  headerRow.eachCell(cell => {
  cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
  cell.alignment = { vertical: 'middle', horizontal: 'center' };
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' } // A rich blue (Office-style)
  };
  cell.border = {
    top:    { style: 'thin' },
    left:   { style: 'thin' },
    bottom: { style: 'thin' },
    right:  { style: 'thin' }
  };
});

  // 2) Populate data rows, skipping any is_deleted entries
  let currentRow = 2; // next row index after header
  for (const product of products) {
    if (product.is_deleted) continue;
    const productStartRow = currentRow;

    for (const image of product.images) {
      if (image.is_deleted) continue;
      const imageStartRow = currentRow;

      // Filter out deleted security issues
      const issues = (image.security_issues || []).filter(issue => !issue.is_deleted);
      if (issues.length === 0) {
        // No issues: add a "clean" row
        worksheet.addRow([
          product.name,
          image.image_name,
          'Twistlock',
          'clean',
          '', // severity
          '', // affected_libraries
          ''  // library_path
        ]);
        currentRow++;
      } else {
        // Add one row per issue
        for (const issue of issues) {
          worksheet.addRow([
            product.name,
            image.image_name,
            'Twistlock',
            issue.cve_id,
            issue.severity,
            Array.isArray(issue.affected_libraries)
              ? issue.affected_libraries.join(', ')
              : issue.affected_libraries,
            issue.library_path
          ]);
          currentRow++;
        }
      }

      // 3) Merge image_name cells if multiple rows were added
      const imageEndRow = currentRow - 1;
      if (imageEndRow > imageStartRow) {
        // Merge column B (image_name) from imageStartRow to imageEndRow
        worksheet.mergeCells(imageStartRow, 2, imageEndRow, 2);
      }
    }

    // 4) Merge name cells if multiple rows for this product
    const productEndRow = currentRow - 1;
    if (productEndRow > productStartRow) {
      // Merge column A (name) from productStartRow to productEndRow
      worksheet.mergeCells(productStartRow, 1, productEndRow, 1);
    }
  }

  // 5) Write workbook to buffer and save using FileSaver
  workbook.xlsx.writeBuffer().then(buffer => {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, `${fileName}.xlsx`);
  });
}

export default exportToExcel;