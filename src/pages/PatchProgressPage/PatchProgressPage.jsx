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
import patch_image_jars from '../../api/patch_image_jars';
import { update_patch_image_jar } from '../../api/update_patch_image_jar';
import RefreshButton from '../../components/Button/RefreshButton';
import JarTable from '../../components/JarTable/JarTable';
import getPatchProductDetail from '../../api/PatchProductDetail';
import CompletionFilter from '../../components/Button/CompletionFilter';

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
    // async function fetchData() {
    //   setLoading(true);
    //   const data = await getPatchById(id);

    //   // Create an empty map.
    //   const productMap = {};

    //   // Loop over each product and fetch its jars.
    //   for (const prod of data.products) {
    //     const key = prod.name;

    //     // Wait for patch_product_jars to resolve for this (patch, product).
    //     const ppj = await patch_product_jars(id, prod.name);

    //     // Build the entry for this product.
    //     productMap[key] = {
    //       images: prod.images,
    //       jars: ppj.map(jar => ({
    //         name: jar.name,
    //         version: jar.version,
    //         current_version: jar.current_version,
    //         remarks: jar.remarks || "",
    //         updated: jar.updated || false
    //       })),
    //       helm_charts: prod.helm_charts
    //     };
    //   }

    //   setProductJars(productMap);
    //   setFilteredProducts(productMap);
    //   setPatch(data);
    //   setLoading(false);
    // }

    // fetchData();
  async function fetchData() {
    setLoading(true);
    const data = await getPatchById(id);

    // Now props.images includes a `.jars` array under each image.
    const productMap = data.products.reduce((map, prod) => {
      map[prod.name] = {
        images: prod.images,
        helm_charts: prod.helm_charts
      };
      return map;
    }, {});

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
      // const productName = productKey.toUpperCase();
        console.log("Refreshing product:", productKey); // ADD THIS

      // Use patch name directly (assuming 'patchName' is available in scope)
      const data = await getPatchProductDetail(id, productKey);
              console.log("AFTER REFRESH: ", data.images); // <-- Confirm security_issues are []

      const updatedProduct = {
images: JSON.parse(JSON.stringify(data.images || [])),
        jars: (data.jars || []).map(jar => ({
          name: jar.name,
          version: jar.version,
          current_version: jar.current_version,
          remarks: jar.remarks || "",
          updated: jar.updated || false
        })),
        helm_charts: data.helm_charts || []
      };

      console.log("issues",updatedProduct.images);

      

      // Update state
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


  const handleJarsUpdate = (productKey, updatedJars) => {
    setProductJars(prev => ({
      ...prev,
      [productKey]: {
        ...prev[productKey],
        jars: updatedJars
      }
    }));
    setFilteredProducts(prev => ({
      ...prev,
      [productKey]: {
        ...prev[productKey],
        jars: updatedJars
      }
    }));
  };
  const counts = {
    completed: completedProducts.length,
    not_completed: notCompletedProducts.length,
  };



  return (
    <div>
      {/* <div className="filter-menu-container">
        <FilterMenu setFilter={setFilter} />
      </div> */}
      <div className="filter-menu-container">
        <CompletionFilter filter={filter} setFilter={setFilter} counts={counts} />
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
                        {/* <button
                        onClick={() => handleProductRefresh(productKey)}
                        className="btn p-0 bg-transparent border-0"
                        title="Refresh"
                        style={{ position: 'absolute', right: '3px', marginRight: '3px' }}
                      >
                        <i className="bi bi-arrow-clockwise fs-5"></i>
                      </button> */}
                        <RefreshButton onRefresh={() => handleProductRefresh(productKey)} />

                      </div>
                      {/* JarTable component */}
                      {/* <JarTable
                      id={id}
                      productKey={productKey}
                      jars={productObj.jars}
                      onJarsUpdate={(updatedJars) => handleJarsUpdate(productKey, updatedJars)}
                    /> */}
                      <div className="image-table-wrapper">
                        {/* now pass this product’s own images */}
                        {/* <ImageTable images={images} patchname={patch?.name} /> */}
                        <ImageTable
                          images={productObj.images}
                          patchJars={patch.jars}
                          productKey={productKey}
                          patchname={patch?.name}
                          searchTerm={searchTerm}
                          // onJarsUpdate={(updatedJars) =>
                          //   handleJarsUpdate(productKey, updatedJars)
                          // }
                          onImageJarsUpdate={(imageName, updatedJars) =>
                            // bubble up so PatchProgressPage can merge into state
                            setProductJars(prev => ({
                              ...prev,
                              [productKey]: {
                                ...prev[productKey],
                                images: prev[productKey].images.map(img =>
                                  img.image_name === imageName
                                    ? { ...img, jars: updatedJars }
                                    : img
                                )
                              }
                            }))
                          }
                        />
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

