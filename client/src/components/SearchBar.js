import React from 'react';
import { FiSearch } from 'react-icons/fi';
import '../styles/SearchBar.css';

const SearchBar = ({ onSearch, onFilterChange, loading }) => {
  const [search, setSearch] = React.useState('');
  const [author, setAuthor] = React.useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    onSearch({ search: value, author });
  };

  const handleAuthorFilter = (e) => {
    const value = e.target.value;
    setAuthor(value);
    onSearch({ search, author: value });
  };

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search by title, author, or tags..."
          value={search}
          onChange={handleSearch}
          disabled={loading}
          className="search-input"
        />
      </div>

      <input
        type="text"
        placeholder="Filter by author..."
        value={author}
        onChange={handleAuthorFilter}
        disabled={loading}
        className="author-input"
      />
    </div>
  );
};

export default SearchBar;
