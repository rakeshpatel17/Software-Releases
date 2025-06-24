import React from 'react';
import PropTypes from 'prop-types';
import EditableFieldComponent from '../EditableFieldComponent';
import { securityIssuesUpdate } from '../../api/updateIssuesdes';

function SecurityIssuesTable({ issues, Productsdata, patchname, refreshProductsData, img }) {
  const severityColors = {
    low: '#008000',
    medium: '#FFD700',
    high: '#FF8C00',
    critical: '#FF0000'
  };
  console.log("issues", issues)
  console.log("products", Productsdata)

const handleSaveDescription = async (issue, newValue) => {
  if (!img || !img.image_name) {
    console.error("❌ img is missing or invalid");
    return;
  }

  const matchedProduct = Productsdata.find(product =>
    product.images.some(image =>
      image.image_name === img.image_name &&
      image.security_issues.some(secIssue => secIssue.cve_id === issue.cve_id)
    )
  );

  if (!matchedProduct) {
    console.error("❌ No matching product/image/issue found");
    return;
  }

  const payload = {
    products_data: [
      {
        name: matchedProduct.name,
        images: [
          {
            image_name: img.image_name,
            security_issues: [
              {
                cve_id: issue.cve_id,
                product_security_des: newValue
              }
            ]
          }
        ]
      }
    ]
  };

  try {
    await securityIssuesUpdate(patchname, payload);
    refreshProductsData();
    console.log("✅ Saved successfully");
  } catch (err) {
    console.error("❌ API error:", err.message);
  }
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
                      issue.product_security_des || '—'
                    }
                    onSave={(newValue) => handleSaveDescription(issue, newValue)} // ✅ Correct order

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
  Productsdata: PropTypes.array.isRequired,
  patchname: PropTypes.string.isRequired,
  refreshProductsData: PropTypes.func.isRequired
};

export default SecurityIssuesTable;