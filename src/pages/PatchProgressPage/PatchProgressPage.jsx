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
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import get_patch_progress from '../../api/get_patch_progress';
import { getPatchDetailsById } from '../../api/getPatchDetailsById';
import exportToExcel from '../../api/exportToExcel';
import { Pencil, X, Download } from 'lucide-react'; 
import Tooltip from '../../components/ToolTip/ToolTip';


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
    const [patchData, setPatchData] = useState({});

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
    setPatchData(data);
  }

  fetchData();
  }, [id]);

   const getDate = () => {
        const today = new Date();

        // Extract day, month, and year
        let day = today.getDate();
        let month = today.getMonth() + 1;
        let year = today.getFullYear();

        // Add leading zero to day and month if needed
        day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0' + month : month;

        // Format the date as dd/mm/yyyy
        const formattedDate = `${day}-${month}-${year}`;
        return formattedDate;
    }
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

  const [progress, setProgress] = useState(null);
  useEffect(() => {
    const fetchProgress = async () => {
      const result = await get_patch_progress(id);
      // console.log(`Patch ${patchName} progress: ${result}%`);
      setProgress(result); // result should be a number like 33.33
    };

    if (id) fetchProgress();
  }, [id]);



  if (loading) return <LoadingSpinner />;


  const handleProductRefresh = async (productKey) => {
    // event.preventDefault();
    try {
      console.log("Refreshing product:", productKey);

      const responseData = await getPatchProductDetail(id, productKey);

      if (!Array.isArray(responseData) || responseData.length === 0) {
        console.error("Invalid response format:", responseData);
        alert(`Failed to refresh ${productKey}: Invalid server response.`);
        return;
      }  

      const patchData = responseData[0];
      const product = (patchData.products || []).find(
        (p) => p.name.toLowerCase() === productKey.toLowerCase()
      );

      if (!product) {
        console.error("Product not found in patch:", productKey);
        alert(`Product ${productKey} not found in response.`);
        return;
      }

      // Clean and format security issues
      product.images.forEach((img) => {
        img.security_issues = (img.security_issues || []).map((issue) => ({
          ...issue,
          product_security_des:
            issue.product_security_des ||
            issue.product_security_description ||
            "",
        }));
      });

      const updatedProduct = {
        images: JSON.parse(JSON.stringify(product.images || [])),
        jars: (patchData.jars || []).map((jar) => ({
          name: jar.name,
          version: jar.version,
          current_version: jar.current_version,
          remarks: jar.remarks || "",
          updated: jar.updated || false,
        })),
        helm_charts: product.helm_charts || "Not Released",
      };

      setProductJars((prev) => ({
        ...prev,
        [productKey]: updatedProduct,
      }));

      setFilteredProducts((prev) => ({
        ...prev,
        [productKey]: updatedProduct,
      }));

      console.log(` Successfully refreshed ${productKey}`, updatedProduct);
    } catch (error) {
      console.error(` Error refreshing ${productKey}:`, error);
      alert(`Failed to refresh ${productKey}: ${error.message}`);
    }
  };


 const handlePageRefresh = async (id) => {
        // setLoading(true);

        try {
            const data = await getPatchProductDetail(id);
            const progressresult=get_patch_progress(id);
            const productMap = {};
            // for (const prod of data.products) {
            //     const key = prod.name;
            //     const ppj = await patch_product_jars(id, prod.name);
            //     productMap[key] = {
            //         images: prod.images,
            //         jars: ppj.map(jar => ({
            //             name: jar.name,
            //             version: jar.version,
            //             current_version: jar.current_version,
            //             remarks: jar.remarks || "",
            //             updated: jar.updated || false
            //         })),
            //         helm_charts: prod.helm_charts
            //     };
            // }
            for (const prod of data.products) {
                    const key = prod.name;
                    const images = prod.images;
            
                    // Fetch jars per‐image, then flatten them into one array for this product
                    let allJars = [];
                    await Promise.all(images.map(async img => {
                        const ijs = await patch_image_jars(id, img.image_name);
                        if (Array.isArray(ijs)) {
                            allJars = allJars.concat(
                                ijs.map(jar => ({
                                    name: jar.name,
                                    version: jar.version,
                                    current_version: jar.current_version,
                                    remarks: jar.remarks || "",
                                    updated: jar.updated || false
                                }))
                            );
                        }
                    }));
            
                    productMap[key] = {
                        images,
                        jars: allJars,
                        helm_charts: prod.helm_charts
                    };
             }
            setProductJars(productMap);
            setFilteredProducts(productMap);
            setPatch(data);
            // setProgress(progressresult);
            setProgress(isNaN(progressresult) ? 0 : progressresult);


        } catch (err) {
            console.error("Failed to refresh patch data:", err);
        }
        // finally {
        //     setLoading(false);
        // }
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
      <div className="top-bar">
        <div className="progress-refresh">
          <div className="progress-container" style={{ pointerEvents: "none" }}>
            <ProgressBar value={progress} label="Patch Progress" />
          </div >
          <RefreshButton onRefresh={() => handlePageRefresh(id)} /> 
              
        </div>
       <div className='progress-refresh'>
        {!loading && (
                            <button
                                className="export-btn"
                                onClick={() =>
                                    exportToExcel(
                                        patchData.products,
                                        `${id}_vulnerabilities_${getDate()}`
                                    )
                                }
                            >
                                    <Tooltip text="Export Security issues" position="down">
                                    <Download size={20} /></Tooltip>
                            </button>

                        )}
        <div className="filter-menu-container">
          <CompletionFilter filter={filter} setFilter={setFilter} counts={counts} />
        </div>
        </div>
      </div>

      {/* <div style={{ height: '56px' }}></div> */}

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
                          key={productObj.name + JSON.stringify(productObj.images)}
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

