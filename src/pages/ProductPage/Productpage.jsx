import { useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import ActionTable from '../../components/ProductImageTable/ActionTable';
import './ProductPage.css';
import { AllReleaseProductImage } from '../../api/AllReleaseProductImage';

function ProductPage() {
    const { searchTerm, setTitle } = useOutletContext();
    const { productName } = useParams();
    const [groupedImages, setGroupedImages] = useState({});

    useEffect(() => {
        setTitle(`Images for ${productName}`);
    }, [productName, setTitle]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await AllReleaseProductImage();
                const filtered = data.filter(img => img.product === productName);
                const grouped = filtered.reduce((acc, img) => {
                    const release = img.release;
                    if (!acc[release]) acc[release] = [];
                    acc[release].push(img);
                    return acc;
                }, {});
                setGroupedImages(grouped);
            } catch (error) {
                console.error('Error fetching release images:', error);
            }
        };
        fetchData();
    }, [productName]);

    const handleImageUpdate = (release, originalImageName, updatedImage) => {
        setGroupedImages(prevGrouped => {
            const newGroupedData = { ...prevGrouped };
            const imagesInRelease = [...newGroupedData[release]];
            
            const imageIndex = imagesInRelease.findIndex(
                img => img.image_name === originalImageName
            );

            if (imageIndex !== -1) {
                // Replace the old image object with the new one
                imagesInRelease[imageIndex] = updatedImage;
                newGroupedData[release] = imagesInRelease;
            }

            return newGroupedData;
        });
    };

    const handleImageAdd = (release, newImage) => {
        setGroupedImages(prevGrouped => {
            const newGroupedData = { ...prevGrouped };
            const imagesInRelease = newGroupedData[release] ? [...newGroupedData[release]] : [];
            
            imagesInRelease.push(newImage);
            newGroupedData[release] = imagesInRelease;

            return newGroupedData;
        });
    };

    return (
        <div className="dashboard-main">
            {Object.entries(groupedImages).map(([release, images]) => (
                <div key={release} className="release-group">
                    <h3>Release: {release}</h3>
                    <ActionTable
                        images={images}
                        release={release}
                        product={productName}
                        // Pass the update function down as a prop
                        onImageUpdate={handleImageUpdate}
                        onImageAdd={handleImageAdd} 
                    />
                </div>
            ))}
        </div>
    );
}

export default ProductPage;