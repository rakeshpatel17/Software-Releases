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
  // console.log("filter:", filter);
  // console.log("completedProducts:", completedProducts);
  // console.log("notCompletedProducts:", notCompletedProducts);
  // console.log("productJars:", productJars);

  if (filter === 'completed') {
  // Convert array to object keyed by product name lowercased
  const completedMap = Object.fromEntries(
    completedProducts.map(prod => [prod.name.toLowerCase(), prod])
  );
  // console.log("Completed Map keys:", Object.keys(completedMap));
  
  productsToShow = Object.fromEntries(
    Object.entries(productJars).filter(([key]) => key in completedMap)
  );
} else if (filter === 'not_completed') {
  // Convert array to object keyed by product name lowercased
  const notCompletedMap = Object.fromEntries(
    notCompletedProducts.map(prod => [prod.name.toLowerCase(), prod])
  );
  // console.log("Not Completed Map keys:", Object.keys(notCompletedMap));
  
  productsToShow = Object.fromEntries(
    Object.entries(productJars).filter(([key]) => key in notCompletedMap)
  );
} else {
  productsToShow = productJars;
}

  useEffect(() => {
    async function fetchData() {
      const data = await getPatchById(id);

      // Build a per‐product map where each key is the product name (lowercased)
      // and contains both its images and the global jars bucket.
      const productMap = data.products.reduce((acc, prod) => {
        const key = prod.name.toLowerCase();
        acc[key] = {
          // images belong to this product
          images: prod.images,

          // assign the global jars to each product
          jars: data.jars.map(jar => ({
            jar: jar.name,
            version: jar.version,
            remarks: jar.remarks || '',
            updated: 'Yes'
          }))
        };
        return acc;
      }, {});
      console.log("the present product map is : ", productMap);
      setProductJars(productMap);
      setFilteredProducts(productMap);
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

  if (loading) return <div>Loading...</div>;

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
                  <h2>
                    {highlightText(productKey.toUpperCase(), searchTerm)}
                  </h2>

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
                      {jars.map((entry, jIdx) => (
                        <tr key={jIdx}>
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
                                const updated = { ...productJars };
                                updated[productKey].jars[jIdx].updated = newValue;
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
                    <ImageTable images={images} />
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

