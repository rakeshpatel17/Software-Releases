
function SeverityCount({ products }) {
    const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };

    // console.log("Products with their images and security issues:");
    (products || []).forEach(product => {
        // console.log(`Product: ${product.name}`);
        (product.images || []).forEach(image => {
            console.log(`  Image: ${image.image_name}, Build: ${image.build_number}`);
            (image.security_issues || []).forEach(issue => {
                // console.log(
                //     `    Security Issue -> Severity: ${issue?.severity || 'N/A'}, CVE: ${issue?.cve_id || 'N/A'}`
                // );
                const severity = issue?.severity?.charAt(0).toUpperCase() + issue?.severity?.slice(1).toLowerCase(); 
                if (severity && counts[severity] !== undefined) {
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
                gap: '12px',
                whiteSpace: 'nowrap',
                marginLeft: '-1%'
            }}
        >
            <span style={{ color: 'red' }}>Critical: {counts.Critical}</span>
            <span style={{ color: 'orange' }}>High: {counts.High}</span>
            <span style={{ color: 'goldenrod' }}>Medium: {counts.Medium}</span>
            <span style={{ color: 'green' }}>Low: {counts.Low}</span>
        </div>
    );
}

export default SeverityCount;
