import React, { useState, useEffect, useRef } from 'react';
import { getSeverityCounts } from '../../api/getSeverityCounts ';

function SeverityCount({ products }) {
    const [counts, setCounts] = useState({ Critical: 0, High: 0, Medium: 0, Low: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const isInitialMount = useRef(true);

    useEffect(() => {
        if (!products || products.length === 0) {
            setCounts({ Critical: 0, High: 0, Medium: 0, Low: 0 });
            return;
        }

        const fetchCounts = async () => {
            if (isInitialMount.current) {
                setIsLoading(true);
            }
            
            setError(null);
            try {
                const summaryCounts = await getSeverityCounts(products);
                setCounts(summaryCounts);
            } catch (err) {
                console.error("Failed to fetch severity counts:", err);
                setError("Could not load counts.");
            } finally {
                if (isInitialMount.current) {
                    isInitialMount.current = false;
                }
                setIsLoading(false);
            }
        };

        fetchCounts();
    }, [products]);

    if (isLoading) {
        return <span>Loading counts...</span>;
    }

    if (error) {
        return <span style={{ color: 'red' }}>{error}</span>;
    }

    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1rem',
                fontWeight: '500',
                gap: '2px',
                whiteSpace: 'nowrap',
            }}
        >
            <span style={{ color: 'red' }}>Critical: {counts.Critical || 0}</span>
            <span style={{ color: 'orange' }}>High: {counts.High || 0}</span>
            <span style={{ color: 'goldenrod' }}>Medium: {counts.Medium || 0}</span>
            <span style={{ color: 'green' }}>Low: {counts.Low || 0}</span>
        </div>
    );
}

export default SeverityCount;