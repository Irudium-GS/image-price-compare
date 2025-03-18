import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [platform, setPlatform] = useState('');
  const [page, setPage] = useState(1); // State for current page

  // Handle the search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle the filter change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Handle the platform selection change
  const handlePlatformChange = (e) => {
    setPlatform(e.target.value);
  };

  // Handle the page change
  const handlePageChange = async (newPage) => {
    if (newPage < 1) return; // Prevent going below page 1
    setPage(newPage); // Set the new page number

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/search?query=${searchTerm}&filter=${filter}&platform=${platform}&page=${newPage}`);
      setPrices(response.data.prices);
    } catch (error) {
      console.error('Error searching for prices', error);
    }
    setLoading(false);
  };

  // Handle the button click to search for prices
  const handleSearch = async () => {
    if (!searchTerm) {
      alert('Please enter a search term!');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/search?query=${searchTerm}&filter=${filter}&platform=${platform}&page=${page}`);
      setPrices(response.data.prices);
    } catch (error) {
      console.error('Error searching for prices', error);
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Your One-Stop Solution for Stock Images</h1>
      </header>

      <div className="search-container">
        {/* Search input field */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
          placeholder="Search for images (e.g., sky, beach, city)"
        />

        {/* Filter dropdown */}
        <select value={filter} onChange={handleFilterChange} className="filter-select">
          <option value="">All Prices</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>

        {/* Platform dropdown */}
        <select value={platform} onChange={handlePlatformChange} className="platform-select">
          <option value="">All Platforms</option>
          <option value="pexels">Pexels</option>
          <option value="pixabay">Pixabay</option>
        </select>

        {/* Search button */}
        <button onClick={handleSearch} className="search-button">Search Images</button>
      </div>

      {loading && <p className="loading">Loading...</p>}

      {prices.length > 0 && (
        <div className="results-container">
          <h2>Results for "{searchTerm}":</h2>
          <div className="grid-container">
            {prices.map((price, index) => (
              <div key={index} className="image-card">
                <img src={price.imageUrl} alt={searchTerm} className="image" />
                <p className="image-price">{price.platform}: {price.price}</p>
                <a href={price.originalUrl} target="_blank" rel="noopener noreferrer" className="view-button">
                  View on {price.platform}
                </a>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
              Previous
            </button>
            <span>Page {page}</span>
            <button onClick={() => handlePageChange(page + 1)}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
