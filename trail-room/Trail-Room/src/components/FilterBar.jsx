import '../styles/FilterBar.css';

function FilterBar({ filters, handleFilterChange }) {
  // Function to handle refresh button click
  const handleRefresh = () => {
    // Reset all filters to initial values
    handleFilterChange('demographic', 'all');
    handleFilterChange('category', 'all');
    handleFilterChange('ageRange', 'all');
  };

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="demographic">Demographic:</label>
        <select
          id="demographic"
          value={filters.demographic}
          onChange={(e) => handleFilterChange('demographic', e.target.value)}
        >
          <option value="all">All</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value="all">All</option>
          <option value="shirt">Shirts</option>
          <option value="pant">Pants</option>
          <option value="dress">Dresses</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label htmlFor="ageRange">Age Range:</label>
        <select
          id="ageRange"
          value={filters.ageRange}
          onChange={(e) => handleFilterChange('ageRange', e.target.value)}
        >
          <option value="all">All Ages</option>
          <option value="10-20">10-20</option>
          <option value="20-40">20-40</option>
          <option value="40+">40+</option>
        </select>
      </div>

      <button className="refresh-button" onClick={handleRefresh}>
        Refresh Filters
      </button>
    </div>
  );
}

export default FilterBar;