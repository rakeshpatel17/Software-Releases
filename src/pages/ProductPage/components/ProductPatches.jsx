import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/Card/Card';
import getProductPatchProgress from '../../../api/getProductPatchProgress';

const PatchGroup = ({ title, patches, productName, navigate }) => {
    if (patches.length === 0) return null;

    return (
        <div className="release-group">
            <h3>{title}</h3>
            <div className="card-scrollable">
                <div className="card-grid">
                    {patches.map((patch) => (
                        <Card
                            key={patch.name}
                            info={{
                                title: patch.name,
                                description: patch.description,
                                badge: patch.patch_state,
                                footer: patch.release_date,
                            }}
                            products={patch.products.filter(p => p.name === productName)}
                            onProgressClick={() => navigate(`/patches/${patch.name}/products/${productName}`)}
                            progressFetcher={() => getProductPatchProgress(patch.name, productName)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export function ProductPatches({ productPatches, searchTerm, activeFilters, productName }) {
    const navigate = useNavigate();

    const filteredPatches = productPatches.filter(patch => {
        const searchTermMatch = patch.name.toLowerCase().includes(searchTerm.toLowerCase());
        const filterMatch = activeFilters.length === 0 || activeFilters.includes(patch.patch_state.toLowerCase());
        return searchTermMatch && filterMatch;
    });

    const newReleased = filteredPatches
        .filter(p => p.patch_state.toLowerCase() === 'new' || p.patch_state.toLowerCase() === 'released')
        .sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    const cancelled = filteredPatches.filter(p => p.patch_state.toLowerCase() === 'cancelled');
    const in_progress = filteredPatches.filter(p => p.patch_state.toLowerCase() === 'in_progress');
    
    const displayGroups = [
        { title: 'New & Released Patches', items: newReleased },
        { title: 'In Progress Patches', items: in_progress },
        { title: 'Cancelled Patches', items: cancelled }
    ];

    return (
        <>
            {displayGroups.map((group) => (
                <PatchGroup 
                    key={group.title} 
                    title={group.title} 
                    patches={group.items} 
                    productName={productName}
                    navigate={navigate}
                />
            ))}
        </>
    );
}