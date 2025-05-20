import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

function exportToExcel(products, fileName) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Vulnerabilities');

  // 1) Header row with styling
  const headerRow = worksheet.addRow([
    'product_name',
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

    // 4) Merging name cells if multiple rows for this product
    const productEndRow = currentRow - 1;
    if (productEndRow > productStartRow) {
      // Merge column A (name) from productStartRow to productEndRow
      worksheet.mergeCells(productStartRow, 1, productEndRow, 1);
    }
  }

  // Apply alignment and wrap text to all other rows
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

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

  // 5) Writing workbook to buffer and save using FileSaver
  workbook.xlsx.writeBuffer().then(buffer => {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, `${fileName}.xlsx`);
  });
}

export default exportToExcel;