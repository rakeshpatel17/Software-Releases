import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import getProductDetails from '../../api/image';
import ImageTable from '../../components/ProductTable/ImageTable';
import './ProductPage.css';
import { useOutletContext } from 'react-router-dom';
import ActionTable from '../../components/ProductImageTable/ActionTable';


// function highlightMatch(text, term) {
//     if (!term) return text;
//     const regex = new RegExp(`(${term})`, 'gi');
//     return text.split(regex).map((part, i) =>
//         part.toLowerCase() === term.toLowerCase() ? (
//             <span key={i} className="highlight">{part}</span>
//         ) : (
//             part
//         )
//     );
// }


function ProductPage() {

    const { searchTerm, setTitle } = useOutletContext(); 
    const { productName } = useParams();
    const [images, setImages] = useState([]);
    // const [searchTerm, setSearchTerm] = useState('');
    const [expandedRows, setExpandedRows] = useState({});
    /*text area */
    // const [editingIndex, setEditingIndex] = useState(null);
    // const [editedDescription, setEditedDescription] = useState('');
    useEffect(() => {
        setTitle(`Images for ${productName}`);  
    }, [productName, setTitle]);

    const toggleRow = (idx) => {
        setExpandedRows((prev) => ({
            ...prev,
            [idx]: !prev[idx],
        }));
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProductDetails(`${productName}`);
                if (data && Array.isArray(data.images)) {
                    const filteredImages = data.images.filter((img) =>
                        img.build_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        img.ot2_pass.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                    setImages(filteredImages);
                } else {
                    setImages([]);
                }
            } catch (err) {
                console.error('Error fetching images for product:', err);
                setImages([]);
            }
        };
        fetchData();
    }, [productName, searchTerm]);

    return (

        <div className="dashboard-main" >
            {/* <h2>Images for Product: {productName}</h2> */}
            {/* <ImageTable images={images} searchTerm={searchTerm} /> */}
            {console.log("images in product page",images)}
            <ActionTable images={images}/>
        </div>
        
    );
}

export default ProductPage;
