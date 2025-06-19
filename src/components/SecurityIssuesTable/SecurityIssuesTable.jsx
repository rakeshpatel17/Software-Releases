import React from 'react';
import PropTypes from 'prop-types';
import EditableFieldComponent from '../EditableFieldComponent';
import { securityIssuesUpdate } from '../../api/updateIssuesdes';

function SecurityIssuesTable({ issues, Productsdata, patchname, refreshProductsData, img}) {
  const severityColors = {
    low: '#008000',
    medium: '#FFD700',
    high: '#FF8C00',
    critical: '#FF0000'
  };

  return (
    <div className="security-issues-table">
      {issues.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
          <thead>
            <tr>
              <th>CVE ID</th>
              <th>CVSS Score</th>
              <th>Severity</th>
              <th>Affected Libraries</th>
              {/* <th>Library Path</th> */}
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue, idx) => (
              <tr key={idx}>
                <td>{issue.cve_id}</td>
                <td>{issue.cvss_score}</td>
                <td style={{ color: severityColors[issue.severity.toLowerCase()], fontWeight: 'bold' }}>
                  {issue.severity}
                </td>
                <td>{issue.affected_libraries}</td>
                {/* <td>{issue.library_path}</td> */}
                <td>
                  <EditableFieldComponent
                    value={
                      Productsdata.find(p => p.name === img.product)?.product_security_des || '—'
                    }
                    onSave={async (newValue) => {
                        const updatedProducts = [...Productsdata]; // shallow copy
                        // Find product that contains this image
                        const productIndex = updatedProducts.findIndex(p =>
                            p.images.some(i =>
                                i.image_name === img.image_name &&
                                i.patch_build_number === img.patch_build_number
                            )
                        );
                      if (productIndex !== -1) {
                        updatedProducts[productIndex].product_security_des = newValue;
                        try {
                          await securityIssuesUpdate(patchname, { products_data: updatedProducts});
                          await refreshProductsData();
                        } catch (err) {
                          console.error(err);
                          alert('Update failed');
                        }
                      }
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ marginTop: 8, fontStyle: 'italic' }}>No security issues...</p>
      )}
    </div>
  );
}

SecurityIssuesTable.propTypes = {
  issues: PropTypes.array.isRequired,
  productsData: PropTypes.array.isRequired,
  patchName: PropTypes.string.isRequired,
  refreshProductsData: PropTypes.func.isRequired
};

export default SecurityIssuesTable;