import React, { useEffect, useState } from 'react';
import './HelmCharts.css';
import ToggleButtonComponent from '../ToggleButton/ToggleButton';

const HelmCharts = ({ product }) => {
  const [toggleHelmValues, setToggleHelmValues] = useState([]);

  const getToggleValue = (dbValue) => {
    const options = ['Released', 'Not Released', 'Not Applicable'];
    const matchIndex = options.findIndex(opt => opt.toLowerCase() === dbValue?.toLowerCase());
    return matchIndex !== -1 ? options[matchIndex] : 'Not Released';
  };

  useEffect(() => {
    if (product?.images) {
      setToggleHelmValues(product.images.map(img => getToggleValue(img.helm_charts)));
    } else {
      setToggleHelmValues([]);
    }
  }, [product]);

  const handleHelmToggle = (idx, newValue) => {
    const updatedValues = [...toggleHelmValues];
    updatedValues[idx] = newValue;
    setToggleHelmValues(updatedValues);
  };

  if (!product) {
    return <div>No product selected.</div>;
  }

  return (
    <div className="helm-charts-container">
      <h3>{product.name}</h3>
      <table className="helm-charts-table">
        <thead>
          <tr>

            <th>Helm Chart</th>
          </tr>
        </thead>
        <tbody>
          {product.images && product.images.length > 0 ? (
            product.images.map((img, idx) => (
              <tr key={idx}>
                <td>
                  <ToggleButtonComponent
                    options={['Released', 'Not Released', 'Not Applicable']}
                    value={toggleHelmValues[idx]}
                    onToggle={(newValue) => handleHelmToggle(idx, newValue)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" style={{ textAlign: 'center' }}>
                No Helm Chart data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HelmCharts;
