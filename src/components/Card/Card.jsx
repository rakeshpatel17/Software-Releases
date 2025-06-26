import './Card.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deletePatch } from '../../api/deletePatch';
import { Trash2 } from 'lucide-react';
import SeverityCount from '../SeverityCount/SeverityCount';
import ProgressBar from '../ProgressBar/ProgressBar';
import get_patch_progress from '../../api/get_patch_progress';

const Card = ({ info, setPatches, products = [], className = '', children, ...rest }) => {
  const { title, description, image, badge, footer } = info || {};
  const cardClasses = `enhanced-card float = 'float' ${className}`.trim();

  //function to delete patches
  const handleDelete = async (patchName) => {
    const userConfirmed = window.confirm(`Are you sure you want to delete the patch: ${patchName}?`);
    if (userConfirmed) {
      try {
        const result = await deletePatch(patchName);
        alert(result.message || 'Patch deleted successfully');
        setPatches(prev => prev.filter(patch => patch.title !== patchName));

      } catch (err) {
        console.error("Delete patch error:", err);
        alert(`Unable to delete Patch ${patchName}`);
      }
    } else {
      alert('Patch deletion cancelled');
    }
  };

  const navigate = useNavigate();
  const handleClick = () => {
    // Navigate to the PatchPage with the patch title as the identifier
    navigate(`/patches/${encodeURIComponent(title)}`);
  };

   const [progress, setProgress] = useState(null);
    useEffect(() => {
        const fetchProgress = async () => {
            const result = await get_patch_progress(title);
            // console.log(`Patch ${patchName} progress: ${result}%`);
            setProgress(result); // result should be a number like 33.33
        };

        if (title) fetchProgress();
    }, [title]);

  return (
    <div className={cardClasses} onClick={handleClick} {...rest}>
      {image && <img src={image} alt={title} className="card-image" />}

      <div className="card-body">
     
        {badge && (
          <span className={`card-badge ${badge.toLowerCase()}`}>{(badge[0].toUpperCase() + badge.slice(1))}</span>)}
          
       
           <div className='card-header'>
        <h3 className="card-title">{title}</h3>
        <div className="progress-container"  onClick={(e) => e.stopPropagation()}>
          <ProgressBar value={progress} label="Patch Progress" redirectTo={`/progress/${title}`} />
        </div>
         </div>
        {/* <p className="card-description">{description}</p> */}
        <p className="card-description">
          {badge?.toLowerCase() === 'released' ? (
            <a href={description} target="_blank" rel="noopener noreferrer" className="kba-link"
              onClick={(e) => e.stopPropagation()} // Prevent card click
            >
              KBA
            </a>
          ) : (
            description
          )}
        </p>
        <div className="severity-grid">
          <SeverityCount products={products} />
        </div>
        
        {children && <div className="card-children">{children}</div>}
      </div>

      {footer && (
        <div className="card-footer">
          {/* delete button */}
          <button className='patch-btn' onClick={(e) => {
            e.stopPropagation();
            handleDelete(title);
          }}>
            <Trash2 size={18} />
          </button>
          Release Date: {new Date(footer).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      )}
    </div>
  );
};

export default Card;
