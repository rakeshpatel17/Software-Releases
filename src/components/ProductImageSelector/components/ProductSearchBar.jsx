import React from 'react';

export const ProductSearchBar = ({ searchTerm, onSearchChange }) => (
    <div className="form-group">
        <label className="form-label">Search Product</label>
        <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="form-input"
        />
    </div>
);