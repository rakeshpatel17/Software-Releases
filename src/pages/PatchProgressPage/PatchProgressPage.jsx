import { useState, useEffect } from 'react';
import ImageTable from '../../components/ProductTable/ImageTable';
import './PatchProgressPage.css';
import { useParams } from 'react-router-dom';
import EditableFieldComponent from '../../components/EditableFieldComponent';
import ToggleButtonComponent from '../../components/ToggleButton/ToggleButton';
import { useOutletContext } from 'react-router-dom';
import { getPatchById } from '../../api/getPatchById';
import FilterMenu from '../../components/Filter/FilterMenu';
import getProductCompletion from '../../api/productCompletion';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import HelmCharts from '../../components/HelmCharts/HelmCharts';
import patch_product_jars from '../../api/patch_product_jars';
import { update_patch_product_jar } from '../../api/update_patch_product_jar';


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

  const normalize = str => str.trim().toLowerCase();

  if (filter === 'completed') {
    const completedSet = new Set(completedProducts.map(p => normalize(p.name)));
    productsToShow = Object.fromEntries(
      Object.entries(productJars).filter(([key]) => completedSet.has(normalize(key)))
    );
  } else if (filter === 'not_completed') {
    const notCompletedSet = new Set(notCompletedProducts.map(p => normalize(p.name)));
    productsToShow = Object.fromEntries(
      Object.entries(productJars).filter(([key]) => notCompletedSet.has(normalize(key)))
    );
  } else {
    productsToShow = productJars;
  }


  useEffect(() => {
    async function fetchData() {
        setLoading(true); 
      const data = await getPatchById(id);

      // Create an empty map.
      const productMap = {};

      // Loop over each product and fetch its jars.
      for (const prod of data.products) {
        const key = prod.name;

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
        setLoading(false);
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

  const handleProductRefresh = async (productKey) => {
    try {
      // Convert product key back to original case (if needed)
      const productName = productKey.toUpperCase();

      // Fetch full patch data
      const data = await getPatchById(id);

      // Find the product from the patch data
      const prod = data.products.find(p => p.name.toLowerCase() === productKey.toLowerCase());
      if (!prod) throw new Error(`Product ${productName} not found`);

      // Fetch jars for this product
      const ppj = await patch_product_jars(id, prod.name);

      // Build updated product object
      const updatedProduct = {
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

      // Update only this product in the state
      setProductJars(prev => ({
        ...prev,
        [productKey]: updatedProduct
      }));

      setFilteredProducts(prev => ({
        ...prev,
        [productKey]: updatedProduct
      }));

    } catch (error) {
      console.error(`Error refreshing ${productKey}:`, error.message);
      alert(`Failed to refresh ${productKey}`);
    }
  };



  return (
    <div>
      <div className="filter-menu-container">
        <FilterMenu setFilter={setFilter} />
      </div>
          {loading ? (
      <LoadingSpinner />
    ) : Object.keys(productsToShow).length === 0 && Object.keys(productJars).length > 0 ? (
      <div style={{ marginTop: '100px', textAlign: 'center', fontSize: '18px' }}>
        No products to show.
      </div>
    ) : (

      <div className="dashboard-main">
        <div className="dashboard-header">
          {/* <h2 className="dashboard-title">{id} Progress</h2> */}
        </div>
        <div className="table-scroll-wrapper">
          {Object.entries(productsToShow)
            .filter(([productKey]) => productKey.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(([productKey, productObj], index) => {

              const { jars, images } = productObj;
              return (
                <div className='patchProgress' key={index}>
                  <div className="product-table-container">
                    <div className="d-flex align-items-center mb-3" style={{ position: 'relative' }}>
                      <h2 className="mb-0 mx-auto">
                        {highlightText(productKey.toUpperCase(), searchTerm)}
                      </h2>
                      <button
                        onClick={() => handleProductRefresh(productKey)}
                        className="btn p-0 bg-transparent border-0"
                        title="Refresh"
                        style={{ position: 'absolute', right: '3px', marginRight: '3px' }}
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
                                    await update_patch_product_jar(id, productKey, entry.name, { "remarks": newValue }); // PATCH request
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
                      <HelmCharts product={productObj} />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>)}</div>
  );
}

export default PatchProgressPage;

