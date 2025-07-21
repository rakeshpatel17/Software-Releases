import './PatchProgressPage.css';
import RefreshButton from '../../components/Button/RefreshButton';
import ImageTable from '../../components/ProductTable/ImageTable';
import HelmCharts from '../../components/HelmCharts/HelmCharts';
function PatchProductSection({finalProductsToDisplay, searchTerm, handleProductRefresh, patchData, patchId, isSingleProductMode, handleImageJarsUpdate }) 
{
    const highlightText = (text, highlight) => {
        if (!highlight || isSingleProductMode) return text;
        const regex = new RegExp(`(${highlight})`, 'gi');
        return text.split(regex).map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? <mark key={i}>{part}</mark> : part
        );
    };
    return(
        <div className="dashboard-main">
          <div className="table-scroll-wrapper">
            {finalProductsToDisplay.map((product) => (
              <div className='patchProgress' key={product.name}>
                <div className="product-table-container">
                  <div className="d-flex align-items-center mb-3" style={{ position: 'relative' }}>
                    <h2 className="mb-0 mx-auto">{highlightText(product.name.toUpperCase(), searchTerm)}</h2>
                    <RefreshButton onRefresh={() => handleProductRefresh(product.name)} tooltipText={`Refresh ${product.name}`} />
                  </div>
                  <div className="image-table-wrapper">
                    <ImageTable
                      key={`${product.name}-${JSON.stringify(product.images)}`}
                      images={product.images || []}
                      patchJars={patchData?.jars || product.jars || []}
                      productKey={product.name}
                      patchname={patchId}
                      searchTerm={searchTerm}
                      onImageJarsUpdate={(imageName, updatedJars) =>
                        handleImageJarsUpdate(product.name, imageName, updatedJars)
                      }
                    />
                  </div>
                  <div className="image-table-wrapper">
                    <HelmCharts product={product} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
    );
}
export default PatchProductSection;