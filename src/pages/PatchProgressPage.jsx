import React, { useState, useEffect } from 'react';
import SideNavbar from '../components/Side-nav/SideNavbar';
import TopNavbar from '../components/Top-nav/TopNavbar';
import './PatchProgressPage.css';
import { useParams } from 'react-router-dom';
import EditableFieldComponent from '../components/EditableFieldComponent';
import ToggleButtonComponent from '../components/ToggleButtonComponent';
import BackButtonComponent from '../components/BackButtonComponent';

function PatchProgressPage({ onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const { id } = useParams();
  const productJars = {
    server: [
      { jar: 'reactor-netty-http', version: '1.2.4', remarks: 'Major version upgrade', updated: 'yes' },
      { jar: 'reactor-netty-core', version: '1.2.4', remarks: 'Major version upgrade', updated: 'yes' },
      { jar: 'libraries-bom', version: '26.56.0', remarks: '', updated: 'yes' },
      { jar: 'httpcore5', version: '5.3.4', remarks: '', updated: 'yes' },
      { jar: 'guava', version: '33.4.5-jre', remarks: 'Major version upgrade', updated: 'yes' }
    ],
    ijms: [
      { jar: 'jakarta.servlet-api', version: '6.1.0', remarks: 'Major version upgrade', updated: 'yes' },
      { jar: 'jakarta.annotation-api', version: '3.0.0', remarks: 'Major version upgrade', updated: 'yes' },
      { jar: 'org.glassfish.jaxb_jaxb-xjc', version: '4.0.5', remarks: 'Major version upgrade', updated: 'yes' },
      { jar: 'org.glassfish.jaxb_jaxb-jxc', version: '4.0.5', remarks: 'Major version upgrade', updated: 'yes' },
      { jar: 'spring framework (spring-core)', version: '6.2.5', remarks: 'Major upgrade done in 25.2', updated: 'yes' }
    ],
    D2: [
      { jar: 'spring security', version: '6.4.4', remarks: 'Major upgrade done in 25.2', updated: 'yes' },
      { jar: 'spring-boot-starter-parent', version: '3.4.4', remarks: 'Major upgrade done in 25.2', updated: 'yes' },
      { jar: 'ActiveMQ (activemq-broker)', version: '6.1.6', remarks: 'Major version upgraded in 25.2', updated: 'yes' },
      { jar: 'jakarta.jms-api', version: '3.1.0', remarks: 'Major upgrade', updated: 'yes' },
      { jar: 'Bouncy Castle', version: '1.80', remarks: 'Major upgrade', updated: 'yes' }
    ]
  };

  console.log(productJars);

  useEffect(() => {
    const fetch = async () => {
      console.log("In patch progress page");
    };
    fetch();
  }, []);


  return (

    <div className="dashboard-container">
      <SideNavbar />
      <div className="dashboard-content">
        <TopNavbar onSearch={setSearchTerm} onLogout={onLogout} />
        <div className="dashboard-main">
          <div className="dashboard-header">
             <BackButtonComponent fallback={-1}/>
            <h2 className="dashboard-title">{id} Progress</h2>
          </div>
          <div className="table-scroll-wrapper">
            {Object.entries(productJars).map(([product, jars]) => (
              <div className='patchProgress'>
                <div className="product-table-container" key={product}>
                  <h2>{product.toUpperCase()}</h2>
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
                            value={entry.updated}
                            onToggle={(newValue) => {
                              entry.updated = newValue;
                              // Optionally update state
                            }}
                          />
                       </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatchProgressPage;

