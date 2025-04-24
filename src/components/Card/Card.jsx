import React from 'react';
import './Card.css';

const Card = ({ info, className = '', children, ...rest }) => {
  const { title, description, image, badge, footer } = info || {};
  const cardClasses = `enhanced-card float = 'float' ${className}`.trim();

  return (
    <div className={cardClasses} {...rest}>
      {image && <img src={image} alt={title} className="card-image" />}

      <div className="card-body">
      {badge && (
        <span className={`card-badge ${badge.toLowerCase()}`}>{(badge[0].toUpperCase() + badge.slice(1))}</span>)}
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        {children && <div className="card-children">{children}</div>}
      </div>

      {footer && (
  <div className="card-footer">
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
