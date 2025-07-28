import React from 'react';

export const ImageSubList = ({ product, selectedState, isDisabled, onImageToggle }) => (
    <div className="image-list">
        {product.images.map((image) => {
            const isChecked = selectedState[product.name]?.has(image.image_name) || false;
            return (
                <div key={image.image_name} className="image-item">
                    <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={isDisabled}
                        onChange={() => onImageToggle(product.name, image)}
                    />
                    <label>{image.image_name}</label>
                </div>
            );
        })}
    </div>
);