// src/components/StickyHeader/StickyHeader.js
import React, { useState, useEffect, useRef } from 'react';
import './StickyHeader.css';

function StickyHeader({ children, topOffset = 0 }) {
  const [isSticky, setSticky] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // Get the main scrolling element. This is robust.
    const scrollContainer = document.querySelector('.dashboard-content') || window;
    
    const handleScroll = () => {
      if (ref.current) {
        // Get the position of the top of the header's original location
        const topPosition = ref.current.getBoundingClientRect().top;
        
        // Check if the top of the header has scrolled past the offset
        if (topPosition <= topOffset) {
          setSticky(true);
        } else {
          setSticky(false);
        }
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);

    // Cleanup function to remove the event listener
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [topOffset]); // Rerun effect if topOffset changes

  // The outer div acts as a placeholder to prevent the page layout from jumping
  // The inner div is what actually becomes sticky
  return (
    <div className="sticky-placeholder" ref={ref} style={{ height: ref.current?.offsetHeight }}>
      <div className={`sticky-inner ${isSticky ? 'is-sticky' : ''}`} style={{ top: `${topOffset}px` }}>
        {children}
      </div>
    </div>
  );
}

export default StickyHeader;