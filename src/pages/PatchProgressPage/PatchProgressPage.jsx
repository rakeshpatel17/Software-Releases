import { useState, useEffect } from 'react';
import ImageTable from '../../components/ProductTable/ImageTable';
import './PatchProgressPage.css';
import { useParams } from 'react-router-dom';
import EditableFieldComponent from '../../components/EditableFieldComponent';
import ToggleButtonComponent from '../../components/ToggleButton/ToggleButton';
import { useOutletContext } from 'react-router-dom';
import { getPatchById } from '../../api/getPatchById';
import { jarsUpdate } from '../../api/jars_update';
import FilterMenu from '../../components/Filter/FilterMenu';
import getProductCompletion from '../../api/productCompletion';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import HelmCharts from '../../components/HelmCharts/HelmCharts';
import patch_product_jars from '../../api/patch_product_jars';


function PatchProgressPage() {
  const { searchTerm, setTitle } = useOutletContext();
  const { id } = useParams();
  const [productJars, setProductJars] = useState({});
  const [filteredProducts, setFilteredProducts] = useState({});
  const [images, setImages] = useState([]);

  //product complete and not complete 
  const [filter, setFilter] = useState('all');
  const [completedProducts, setCompletedProducts] = useState({});
  const [notCompletedProducts, setNotCompletedProducts] = useState({});
  const [loading, setLoading] = useState(true);

  const [patch, setPatch] = useState(null);


  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await getProductCompletion(id);
      if (data) {
        setCompletedProducts(data.completed_products || {});
        setNotCompletedProducts(data.incomplete_products || {});
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  let productsToShow = {};

  if (filter === 'completed') {
    const completedMap = Object.fromEntries(
      completedProducts.map(prod => [prod.name.toLowerCase(), prod])
    );
    productsToShow = Object.fromEntries(
      Object.entries(productJars).filter(([key]) => key in completedMap)
    );
  } else if (filter === 'not_completed') {
    const notCompletedMap = Object.fromEntries(
      notCompletedProducts.map(prod => [prod.name.toLowerCase(), prod])
    );
    productsToShow = Object.fromEntries(
      Object.entries(productJars).filter(([key]) => key in notCompletedMap)
    );
  } else {
    productsToShow = productJars;
  }

  useEffect(() => {
    async function fetchData() {
      const data = await getPatchById(id);

      // Create an empty map.
      const productMap = {};

      // Loop over each product and fetch its jars.
      for (const prod of data.products) {
        const key = prod.name.toLowerCase();

        // Wait for patch_product_jars to resolve for this (patch, product).
        const ppj = await patch_product_jars(id, prod.name);

        // Build the entry for this product.
        productMap[key] = {
          images: prod.images,
          jars: ppj.map(jar => ({
            name: jar.name,
            version: jar.version,
            current_version: jar.current_version,
            remarks: jar.remarks || "",
            updated: jar.updated || false
          })),
          helm_charts: prod.helm_charts
        };
      }

      setProductJars(productMap);
      setFilteredProducts(productMap);
      setPatch(data);
    }

    fetchData();
  }, [id]);


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

  if (loading) return <LoadingSpinner />;

  if (!loading && Object.keys(productsToShow).length === 0) {
    return (
      <div style={{ marginTop: '100px', textAlign: 'center', fontSize: '18px' }}>
        No products to show .
      </div>
    );
  }

  const handleRefresh = async () => {
    try {
      const data = await getPatchById(id);
      const productMap = data.products.reduce((acc, prod) => {
        const key = prod.name.toLowerCase();
        acc[key] = {
          images: prod.images,
          jars: data.jars.map(jar => ({
            name: jar.name,
            version: jar.version,
            remarks: jar.remarks || '',
            updated: jar.updated || false,
          })),
          helm_charts: prod.helm_charts
        };
        return acc;
      }, {});
      console.log("in handle refresh",productMap)
      setProductJars(productMap);
      setFilteredProducts(productMap);
      setPatch(data);
    } catch (error) {
      console.error('Error refreshing data:', error.message);
      alert('Failed to refresh jars.');
    }
  };



  return (
    <div>
      <div className="filter-menu-container">
        <FilterMenu setFilter={setFilter} />
      </div>

      <div className="dashboard-main">
        <div className="dashboard-header">
          {/* <h2 className="dashboard-title">{id} Progress</h2> */}
        </div>
        <div className="table-scroll-wrapper">
          {Object.entries(productsToShow).map(([productKey, productObj], index) => {
            const { jars, images } = productObj;
            return (
              <div className='patchProgress' key={index}>
                <div className="product-table-container">
                  <div className="d-flex align-items-center mb-3" style={{ position: 'relative' }}>
                    <h2 className="mb-0 mx-auto">
                      {highlightText(productKey.toUpperCase(), searchTerm)}
                    </h2>
                    <button
                      onClick={handleRefresh}
                      className="btn p-0 bg-transparent border-0"
                      title="Refresh"
                      style={{ position: 'absolute', right: '3px' ,marginRight:'3px'}}
                    >
                      <i className="bi bi-arrow-clockwise fs-5"></i>
                    </button>
                  </div>

                   
                  <table className="product-table">
                    <thead>
                      <tr>
                        <th>Jar</th>
                        <th>Current Version</th>
                        <th>Version</th>
                        <th>Remarks</th>
                        <th>Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jars.map((entry, jIdx) => (
                        <tr key={jIdx}>
                          <td>{entry.name}</td>
                          <td>{entry.current_version}</td>
                          <td>{entry.version}</td>
                          <td>
                            <EditableFieldComponent
                              value={entry.remarks || '—'}
                              onSave={async (newValue) => {
                                const updatedJars = [...jars];
                                updatedJars[jIdx].remarks = newValue;
                                // console.log(jars);
                                // console.log("updated jars : ", updatedJars);
                                try {
                                  await jarsUpdate(id, { "jars_data": updatedJars }); // PATCH request
                                  const updated = { ...productJars };
                                  updated[productKey].jars[jIdx].remarks = newValue;
                                  setProductJars(updated);
                                } catch (error) {
                                  console.error('Error updating remarks:', error.message);
                                  alert('Failed to update remarks.');
                                }
                              }}
                            />
                          </td>
                          <td>
                            <ToggleButtonComponent
                              options={['Yes', 'No']}
                              value={entry.updated ? 'Yes' : 'No'}  // convert boolean → string
                              onToggle={(newValue) => {
                                const booleanValue = newValue === 'Yes';  // convert string → boolean
                                const updated = { ...productJars };
                                updated[productKey].jars[jIdx].updated = booleanValue;
                                setProductJars(updated);
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="image-table-wrapper">
                    {/* now pass this product’s own images */}
                    <ImageTable images={images} patchname={patch?.name} />
                  </div>
                     <div className="image-table-wrapper">
                    <HelmCharts  product={productObj} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div></div>
  );
}

export default PatchProgressPage;

