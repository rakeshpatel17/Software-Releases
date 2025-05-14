import { useState, useEffect } from 'react';
import ImageTable from '../../components/ProductTable/ImageTable';
import './PatchProgressPage.css';
import { useParams } from 'react-router-dom';
import EditableFieldComponent from '../../components/EditableFieldComponent';
import ToggleButtonComponent from '../../components/ToggleButton/ToggleButton';
import { useOutletContext } from 'react-router-dom';

function PatchProgressPage() {
  const { searchTerm, setTitle } = useOutletContext(); 
  const { id } = useParams();
  const [productJars, setProductJars] = useState({
    Server: [
      { jar: 'reactor-netty-http', version: '1.2.4', remarks: 'Major version upgrade', updated: 'Yes' },
      { jar: 'reactor-netty-core', version: '1.2.4', remarks: 'Major version upgrade', updated: 'Yes' },
      { jar: 'libraries-bom', version: '26.56.0', remarks: '', updated: 'Yes' },
      { jar: 'httpcore5', version: '5.3.4', remarks: '', updated: 'Yes' },
      { jar: 'guava', version: '33.4.5-jre', remarks: 'Major version upgrade', updated: 'Yes' }
    ],
    ijms: [
      { jar: 'jakarta.servlet-api', version: '6.1.0', remarks: 'Major version upgrade', updated: 'Yes' },
      { jar: 'jakarta.annotation-api', version: '3.0.0', remarks: 'Major version upgrade', updated: 'Yes' },
      { jar: 'org.glassfish.jaxb_jaxb-xjc', version: '4.0.5', remarks: 'Major version upgrade', updated: 'Yes' },
      { jar: 'org.glassfish.jaxb_jaxb-jxc', version: '4.0.5', remarks: 'Major version upgrade', updated: 'Yes' },
      { jar: 'spring framework (spring-core)', version: '6.2.5', remarks: 'Major upgrade done in 25.2', updated: 'Yes' }
    ],
    D2: [
      { jar: 'spring security', version: '6.4.4', remarks: 'Major upgrade done in 25.2', updated: 'Yes' },
      { jar: 'spring-boot-starter-parent', version: '3.4.4', remarks: 'Major upgrade done in 25.2', updated: 'Yes' },
      { jar: 'ActiveMQ (activemq-broker)', version: '6.1.6', remarks: 'Major version upgraded in 25.2', updated: 'Yes' },
      { jar: 'jakarta.jms-api', version: '3.1.0', remarks: 'Major upgrade', updated: 'Yes' },
      { jar: 'Bouncy Castle', version: '1.80', remarks: 'Major upgrade', updated: 'Yes' }
    ]
  });
  const images = [{
    "image_name": "ot-dctm-ijms",
    "build_number": "24.2.0002.0137",
    "release_date": "2025-05-28T10:18:00Z",
    "ot2_pass": "Yes",
    "twistlock_report_url": "http://example.com/report",
    "twistlock_report_clean": false,
    "is_deleted": false,
    "product": "Ijms",
    "created_at": "2025-05-06T04:48:31.954493Z",
    "updated_at": "2025-05-06T04:48:31.954630Z",
    "security_issues": [
      {
        "cve_id": "CVE-2024-22262",
        "cvss_score": 4,
        "severity": "Critical",
        "affected_libraries": "org.springframework:spring-web",
        "library_path": "/bin",
        "description": "Coming from the base OS in sysdig scan and twistlock scan",
        "created_at": "2025-05-06T04:54:00.776950Z",
        "updated_at": "2025-05-06T04:54:00.777178Z",
        "is_deleted": false
      },
      {
        "cve_id": "CVE-2024-22243",
        "cvss_score": 4,
        "severity": "Critical",
        "affected_libraries": "org.springframework:spring-web",
        "library_path": "/bin",
        "description": "Coming from the base OS in sysdig scan and twistlock scan",
        "created_at": "2025-05-06T04:54:10.243657Z",
        "updated_at": "2025-05-06T04:54:10.243879Z",
        "is_deleted": false
      }
    ]
  }]

  
  const [filteredProducts, setFilteredProducts] = useState(productJars);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(productJars); // show all if search is empty
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      const filtered = Object.fromEntries(
        Object.entries(productJars).filter(([product]) =>
          product.toLowerCase().includes(lowerSearch)
        )
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm]);

  const highlightText = (text, highlight) => {
    if (!highlight) return text;
  
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
  
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={i} style={{ backgroundColor: 'yellow' }}>{part}</mark>
      ) : (
        part
      )
    );
  };
  

  useEffect(() => {
    setTitle(`${id} Progress`);  
  }, [id, setTitle]);

  return (

        <div className="dashboard-main">
          <div className="dashboard-header">
            {/* <h2 className="dashboard-title">{id} Progress</h2> */}
          </div>
          <div className="table-scroll-wrapper">
            {Object.entries(filteredProducts).map(([product, jars],index) => (
              <div className='patchProgress' key={index}>
                <div className="product-table-container" key={product}>
                  <h2>{/*product.toUpperCase()*/highlightText(product.toUpperCase(), searchTerm)}</h2>
                  <table className="product-table">
                    <thead>
                      <tr>
                        <th>Jar</th>
                        <th>Version</th>
                        <th>Remarks</th>
                        <th>Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jars.map((entry, index) => (
                        <tr key={index}>
                          <td>{entry.jar}</td>
                          <td>{entry.version}</td>
                          <td>
                            <EditableFieldComponent
                              value={entry.remarks || '—'}
                              onSave={(newValue) => {
                                entry.remarks = newValue;
                              }}
                            />
                          </td>
                          <td>

                            <ToggleButtonComponent
                              options={['Yes', 'No']}
                              value={entry.updated}  
                              onToggle={(newValue) => {
                                const updatedJars = { ...productJars };
                                updatedJars[product][index].updated = newValue;
                                setProductJars(updatedJars); 
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Rendering ImageTable  */}
                  <div className="image-table-wrapper">
                          <ImageTable images={images} /*searchTerm={searchTerm}*/ />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
  );
}

export default PatchProgressPage;

