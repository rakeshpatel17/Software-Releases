// SearchBar.jsx
import { useState, useEffect } from 'react';
import './SearchBar.css';
import { FaSearch, FaTimes } from 'react-icons/fa';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (onSearch) onSearch(query);
  }, [query, onSearch]);

  const clearInput = () => setQuery('');

  return (
    <div className="search-bar">
      <span className="icon search-icon"><FaSearch /></span>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <button className="icon clear-icon" onClick={clearInput} title="Clear">
          <FaTimes />
        </button>
      )}
    </div>
  );
}
