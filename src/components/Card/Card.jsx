import React from 'react';
import './Card.css';
import { useNavigate } from 'react-router-dom';
import { deletePatch } from '../../api/deletePatch';
import { Trash2 } from 'lucide-react';

const Card = ({ info, className = '', children, ...rest }) => {
  const { title, description, image, badge, footer } = info || {};
  const cardClasses = `enhanced-card float = 'float' ${className}`.trim();

  //function to delete patches
  const handleDelete = async (patchName) => {
    const userConfirmed = window.confirm(`Are you sure you want to delete the patch: ${patchName}?`);
        if (userConfirmed) {
            try {
                const result = await deletePatch(patchName);
                alert(result.message || 'Patch deleted successfully');
            } catch (err) {
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
  return (
    <div className={cardClasses} onClick={handleClick} {...rest}>
      {image && <img src={image} alt={title} className="card-image" />}

      <div className="card-body">
        {badge && (
          <span className={`card-badge ${badge.toLowerCase()}`}>{(badge[0].toUpperCase() + badge.slice(1))}</span>)}
        <h3 className="card-title">{title}</h3>
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
