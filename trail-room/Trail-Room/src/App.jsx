import { useState } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import FilterBar from './components/FilterBar';
import FittingRoom from './components/FittingRoom';
import './App.css';

//shirts
import shirt1 from "./assets/shirt-images/shirt-1.jpeg";
import pant1 from "./assets/pant-images/pant-1.png";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    demographic: 'all',
    category: 'all',
    ageRange: 'all'
  });
  const [filtersApplied, setFiltersApplied] = useState(false);
  // State to handle page navigation
  const [currentPage, setCurrentPage] = useState('products');
  // State for selected products for fitting room
  const [selectedProducts, setSelectedProducts] = useState([]);
  // New state for selection mode
  const [selectionModeEnabled, setSelectionModeEnabled] = useState(false);

  // Function to toggle selection mode when user icon is clicked
  const toggleSelectionMode = () => {
    setSelectionModeEnabled(!selectionModeEnabled);
  };

  const products = [
    // Men's clothing
    { id: 1, name: 'Men\'s Casual Shirt', price: 39.99, image: shirt1, category: 'shirt', demographic: 'men', ageRange: '20-40' },
    { id: 2, name: 'Men\'s Formal Shirt', price: 49.99, image: '/api/placeholder/200/200', category: 'shirt', demographic: 'men', ageRange: '20-40' },
    { id: 3, name: 'Men\'s Jeans', price: 59.99, image: '/api/placeholder/200/200', category: 'pant', demographic: 'men', ageRange: '20-40' },
    { id: 4, name: 'Men\'s Dress Pants', price: 69.99, image: pant1, category: 'pant', demographic: 'men', ageRange: '40+' },
    { id: 5, name: 'Men\'s Graphic Tee', price: 24.99, image: '/api/placeholder/200/200', category: 'shirt', demographic: 'men', ageRange: '10-20' },
    
    // Women's clothing
    { id: 6, name: 'Women\'s Summer Dress', price: 44.99, image: '/api/placeholder/200/200', category: 'dress', demographic: 'women', ageRange: '20-40' },
    { id: 7, name: 'Women\'s Blouse', price: 34.99, image: '/api/placeholder/200/200', category: 'shirt', demographic: 'women', ageRange: '20-40' },
    { id: 8, name: 'Women\'s Skinny Jeans', price: 54.99, image: '/api/placeholder/200/200', category: 'pant', demographic: 'women', ageRange: '10-20' },
    { id: 9, name: 'Women\'s Evening Dress', price: 79.99, image: '/api/placeholder/200/200', category: 'dress', demographic: 'women', ageRange: '40+' },
    { id: 10, name: 'Women\'s Casual Tee', price: 22.99, image: '/api/placeholder/200/200', category: 'shirt', demographic: 'women', ageRange: '10-20' },
    
    // Kids' clothing
    { id: 11, name: 'Boys\' Graphic Tee', price: 19.99, image: '/api/placeholder/200/200', category: 'shirt', demographic: 'kids', ageRange: '10-20' },
    { id: 12, name: 'Girls\' Summer Dress', price: 29.99, image: '/api/placeholder/200/200', category: 'dress', demographic: 'kids', ageRange: '10-20' },
    { id: 13, name: 'Kids\' Jeans', price: 34.99, image: '/api/placeholder/200/200', category: 'pant', demographic: 'kids', ageRange: '10-20' },
    { id: 14, name: 'Girls\' T-shirt', price: 17.99, image: '/api/placeholder/200/200', category: 'shirt', demographic: 'kids', ageRange: '10-20' },
    { id: 15, name: 'Boys\' Shorts', price: 24.99, image: '/api/placeholder/200/200', category: 'pant', demographic: 'kids', ageRange: '10-20' },
  ];

  // Fixed addToCart function that properly handles individual items
  // This function will be used both for single product additions and
  // when multiple products are added via the selection feature
  const addToCart = (product) => {
    // Handle the case when product is passed from multi-selection
    if (Array.isArray(product)) {
      // Process each product in the array sequentially
      const productArray = [...product]; // Create a copy to avoid mutation issues
      
      // Use functional update to ensure we're working with the latest state
      setCartItems(prevCartItems => {
        let updatedCartItems = [...prevCartItems];
        
        // Process each product individually
        productArray.forEach(singleProduct => {
          const existingItemIndex = updatedCartItems.findIndex(item => item.id === singleProduct.id);
          
          if (existingItemIndex >= 0) {
            // Item exists, update quantity
            updatedCartItems = updatedCartItems.map((item, index) => 
              index === existingItemIndex 
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            // Item doesn't exist, add it
            updatedCartItems = [...updatedCartItems, { ...singleProduct, quantity: 1 }];
          }
        });
        
        return updatedCartItems;
      });
    } else {
      // Regular single product handling
      setCartItems(prevCartItems => {
        const existingItem = prevCartItems.find(item => item.id === product.id);
        
        if (existingItem) {
          return prevCartItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prevCartItems, { ...product, quantity: 1 }];
        }
      });
    }
  };

  // Function to handle adding multiple selected products to cart
  const addMultipleToCart = (productsToAdd) => {
    // Process each product sequentially to ensure all are added correctly
    productsToAdd.forEach(product => {
      addToCart(product);
    });
  };

  // Modified to also check and update filtersApplied state
  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    };
    
    setFilters(newFilters);
    
    // Check if any filter is applied
    checkFiltersApplied(newFilters, searchQuery);
  };

  // Function to handle search query changes
  const handleSearchQueryChange = (query) => {
    setSearchQuery(query);
    
    // Check if any filter is applied including the new search query
    checkFiltersApplied(filters, query);
  };

  // Function to handle age range filter from Header component
  const handleAgeFilterChange = (ageRange) => {
    const newFilters = {
      ...filters,
      ageRange: ageRange
    };
    
    setFilters(newFilters);
    
    // Check if any filter is applied
    checkFiltersApplied(newFilters, searchQuery);
  };

  // Helper function to check if any filters are applied
  const checkFiltersApplied = (currentFilters, currentSearchQuery) => {
    const isAnyFilterApplied = 
      currentFilters.demographic !== 'all' || 
      currentFilters.category !== 'all' || 
      currentFilters.ageRange !== 'all' ||
      currentSearchQuery.trim() !== '';
    
    setFiltersApplied(isAnyFilterApplied);
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  // Update cart item quantity
  const updateCartItemQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(cartItems.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  const filteredProducts = products.filter(product => {
    // Search query filter
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Demographic filter
    const matchesDemographic = filters.demographic === 'all' || product.demographic === filters.demographic;
    
    // Category filter
    const matchesCategory = filters.category === 'all' || product.category === filters.category;
    
    // Age range filter
    const matchesAgeRange = filters.ageRange === 'all' || product.ageRange === filters.ageRange;
    
    return matchesSearch && matchesDemographic && matchesCategory && matchesAgeRange;
  });

  // Function to navigate to fitting room with selected products
  const goToFittingRoom = (products) => {
    setSelectedProducts(products);
    setCurrentPage('fitting-room');
  };

  // Function to return from fitting room to product list
  const returnToProductList = () => {
    setCurrentPage('products');
    setSelectedProducts([]);
  };

  return (
    <div className="app">
      <Header 
        cartItems={cartItems} 
        setSearchQuery={handleSearchQueryChange} 
        handleAgeFilterChange={handleAgeFilterChange}
        removeFromCart={removeFromCart}
        updateCartItemQuantity={updateCartItemQuantity}
        toggleSelectionMode={toggleSelectionMode} // Add the new toggle function
      />
      
      {currentPage === 'products' ? (
        <>
          <FilterBar 
            filters={filters}
            handleFilterChange={handleFilterChange}
          />
          <main>
            <ProductList
              products={filteredProducts}
              addToCart={addToCart}
              addMultipleToCart={addMultipleToCart}
              selectionModeEnabled={selectionModeEnabled} // Replace filtersApplied with selectionModeEnabled
              goToFittingRoom={goToFittingRoom}
            />
          </main>
        </>
      ) : (
        <main>
          <FittingRoom 
            selectedProducts={selectedProducts} 
            addToCart={addToCart}
            returnToProductList={returnToProductList}
          />
        </main>
      )}
    </div>
  );
}

export default App;