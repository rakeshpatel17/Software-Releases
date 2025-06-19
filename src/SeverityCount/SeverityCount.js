import React from 'react';
import './SeverityCount.css'; // Create this CSS file or include styles in your existing one

function SeverityCount({ products }) {
    const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };

    (products || []).forEach(product => {
        (product.images || []).forEach(image => {
            (image.security_issues || []).forEach(issue => {
                const severity = issue.severity;
                if (counts[severity] !== undefined) {
                    counts[severity]++;
                }
            });
        });
    });

    return (

  <div
    style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '1rem',
      fontWeight: '500',
      gap: '12px',            // Add spacing between spans
      whiteSpace: 'nowrap',   // Prevent breaking into next line
      marginLeft:'-1%'
    }}
  >
            <span style={{ color: 'red' }}>Critical: {counts.Critical}</span>
            <span style={{ color: 'orange' }}>High: {counts.High}</span>
            <span style={{ color: 'goldenrod' }}>Medium: {counts.Medium}</span>
            <span style={{ color: 'green' }}>Low: {counts.Low}</span>
            {/* <span style={{ color: 'red' }}>Critical: 1000</span>
            <span style={{ color: 'orange' }}>High: 1000</span>
            <span style={{ color: 'goldenrod' }}>Medium: 1000</span>
            <span style={{ color: 'green' }}>Low: 1000</span> */}
        </div>

    );
}

export default SeverityCount;
