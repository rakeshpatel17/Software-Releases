import { useState, useEffect, useRef } from 'react';
import './SearchBar.css';
import { FaSearch, FaTimes, FaFilter } from 'react-icons/fa';

const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};



export default function SearchBar({
  onSearch,
  onFilterChange,
  value = '',
  initialFilters = [],
  placeholder = 'Search...',
  filterOptions,
}) {
  const [query, setQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState(initialFilters);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  
  const searchBarRef = useRef(null);
  useClickOutside(searchBarRef, () => setDropdownOpen(false));

  useEffect(() => {
    setQuery(value);
  }, [value]);
  
  useEffect(() => {
    if (onSearch) {
      onSearch(query);
    }
  }, [query, onSearch]);
 
  useEffect(() => {
    setSelectedFilters(initialFilters);
  }, [initialFilters]);

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(selectedFilters);
    }
  }, [selectedFilters, onFilterChange]);
  
  const handleFilterChange = (filterValue) => {
    setSelectedFilters((prevFilters) => 
      prevFilters.includes(filterValue)
        ? prevFilters.filter((f) => f !== filterValue)
        : [...prevFilters, filterValue]
    );
  };

  const clearInput = () => setQuery('');
  
  const hasFilters = filterOptions && filterOptions.length > 0;

  return (
    <div className="search-bar-container" ref={searchBarRef}>
      <div className="search-bar">
        <span className="icon search-icon"><FaSearch /></span>
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button className="icon clear-icon" onClick={clearInput} title="Clear search">
            <FaTimes />
          </button>
        )}
        <button
          className="icon filter-button"
          onClick={() => hasFilters && setDropdownOpen(!isDropdownOpen)}
          disabled={!hasFilters}
          title={hasFilters ? "Apply filters" : "No filters available"}
        >
          <FaFilter color={selectedFilters.length > 0 ? '#007bff' : 'inherit'} />
          {selectedFilters.length > 0 && (
            <span className="filter-count">{selectedFilters.length}</span>
          )}
        </button>
      </div>

      {isDropdownOpen && hasFilters && (
        <div className="filter-dropdown">
          <div className="filter-dropdown-header">Filter by</div>
          {filterOptions.map((option) => (
            <div key={option.value} className="filter-item">
              <label>
                <input
                  type="checkbox"
                  checked={selectedFilters.includes(option.value)}
                  onChange={() => handleFilterChange(option.value)}
                />
                {option.label}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}