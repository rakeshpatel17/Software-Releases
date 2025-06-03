import './FilterMenu.css';
import { useState, useEffect } from 'react';

function FilterMenu({ setFilter }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'inline-block' , marginBottom: '10px' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ fontSize: '24px', border: 'none', background: 'none', cursor: 'pointer' }}
        aria-label="Open filter menu"
      >
        ⋮
      </button>

      {open && (
        <div className="filter-dropdown">
          <div onClick={() => { setFilter('completed'); setOpen(false); }}>
            Completed Products
          </div>
          <div onClick={() => { setFilter('not_completed'); setOpen(false); }}>
            Not Completed Products
          </div>
          <div onClick={() => { setFilter('all'); setOpen(false); }}>
            Show All
          </div>
        </div>
      )}
    </div>
  );
}


export default FilterMenu;
