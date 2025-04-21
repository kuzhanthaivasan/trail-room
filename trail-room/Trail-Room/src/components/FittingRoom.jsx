import { useState, useEffect } from 'react';
import './FittingRoom.css';

//shirts
import shirt1 from "../assets/shirt-images/shirt-1.jpeg";
import pant1 from "../assets/pant-images/pant-1.png";

function FittingRoom({ selectedProducts, addToCart, returnToProductList }) {
  const [selectedShirt, setSelectedShirt] = useState(null);
  const [selectedPants, setSelectedPants] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  
  // Product details for recommendations
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

  // Categorize products into shirts and pants on component mount
  useEffect(() => {
    // Find shirts and pants from selected products
    const shirts = selectedProducts.filter(product => 
      product.category.toLowerCase() === 'shirt');
    
    const pants = selectedProducts.filter(product => 
      product.category.toLowerCase() === 'pant');
    
    // Set initial selections if available
    if (shirts.length > 0) setSelectedShirt(shirts[0]);
    if (pants.length > 0) setSelectedPants(pants[0]);
  }, [selectedProducts]);

  // Generate recommendations whenever selections or products change
  useEffect(() => {
    if (!selectedProducts.length) return;
    
    // Get all shirts and pants from products list for recommendations
    const allShirts = products.filter(product => 
      product.category.toLowerCase() === 'shirt');
    
    const allPants = products.filter(product => 
      product.category.toLowerCase() === 'pant');
    
    let newRecommendations = [];
    
    // If user has selected a shirt but no pants, recommend pants
    if (selectedShirt && !selectedPants && allPants.length > 0) {
      // Filter pants that might match the shirt based on demographic and age range
      const matchingPants = allPants.filter(pant => 
        (selectedShirt.demographic && pant.demographic === selectedShirt.demographic) || 
        (selectedShirt.ageRange && pant.ageRange === selectedShirt.ageRange)
      );
      
      if (matchingPants.length > 0) {
        newRecommendations = matchingPants.slice(0, 3).map(item => ({
          ...item,
          message: `This ${item.name} would go well with your selected shirt!`
        }));
      } else {
        // If no specific matches, just recommend any available pants
        newRecommendations = allPants.slice(0, 3).map(item => ({
          ...item,
          message: `Try this ${item.name} with your shirt!`
        }));
      }
    }
    
    // If user has selected pants but no shirt, recommend shirts
    else if (!selectedShirt && selectedPants && allShirts.length > 0) {
      // Filter shirts that might match the pants based on demographic and age range
      const matchingShirts = allShirts.filter(shirt => 
        (selectedPants.demographic && shirt.demographic === selectedPants.demographic) || 
        (selectedPants.ageRange && shirt.ageRange === selectedPants.ageRange)
      );
      
      if (matchingShirts.length > 0) {
        newRecommendations = matchingShirts.slice(0, 3).map(item => ({
          ...item,
          message: `This ${item.name} would complement your selected pants!`
        }));
      } else {
        // If no specific matches, just recommend any available shirts
        newRecommendations = allShirts.slice(0, 3).map(item => ({
          ...item,
          message: `Try this ${item.name} with your pants!`
        }));
      }
    }
    
    // No recommendations when both shirt and pants are selected
    
    setRecommendations(newRecommendations);
  }, [selectedShirt, selectedPants, selectedProducts]);

  const handleAddToCart = () => {
    let addedItems = [];
    
    if (selectedShirt) {
      addToCart(selectedShirt);
      addedItems.push(selectedShirt.name);
    }
    
    if (selectedPants) {
      addToCart(selectedPants);
      addedItems.push(selectedPants.name);
    }
    
    if (addedItems.length > 0) {
      alert(`Added ${addedItems.join(' and ')} to cart!`);
    } else {
      alert('Please select items to add to cart');
    }
  };

  const calculateTotal = () => {
    let total = 0;
    if (selectedShirt) total += selectedShirt.price;
    if (selectedPants) total += selectedPants.price;
    return total.toFixed(2);
  };

  const addRecommendedItem = (item) => {
    if (item.category.toLowerCase() === 'shirt') {
      setSelectedShirt(item);
    } else if (item.category.toLowerCase() === 'pant') {
      setSelectedPants(item);
    }
  };

  // Filter shirts and pants from selected products
  const shirts = selectedProducts.filter(product => 
    product.category.toLowerCase() === 'shirt');
  
  const pants = selectedProducts.filter(product => 
    product.category.toLowerCase() === 'pant');

  return (
    <div className="fitting-room-container">
      <h1>Virtual Fitting Room</h1>
      
      <div className="model-view">
        <div className="model-placeholder">
          {selectedShirt && (
            <img 
              src={selectedShirt.image} 
              alt={selectedShirt.name} 
              className="selected-shirt"
            />
          )}
          {selectedPants && (
            <img 
              src={selectedPants.image} 
              alt={selectedPants.name} 
              className="selected-pants"
            />
          )}
          {!selectedShirt && !selectedPants && (
            <div className="placeholder-text">Select items to see them here</div>
          )}
        </div>
      </div>

      {/* Recommendations section - only shows when either shirt or pants is selected, not both */}
      {recommendations.length > 0 && (
        <div className="recommendations-section">
          <h2>Recommended for your outfit</h2>
          <div className="recommendations-container">
            {recommendations.map(item => (
              <div 
                key={item.id} 
                className="recommended-item"
                onClick={() => addRecommendedItem(item)}
              >
                <img src={item.image} alt={item.name} />
                <p className="item-name">{item.name}</p>
                <p className="item-price">${item.price.toFixed(2)}</p>
                <p className="recommendation-message">{item.message}</p>
                <button 
                  className="add-recommendation-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    addRecommendedItem(item);
                  }}
                >
                  Try this
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="selection-area">
        <div className="item-selection">
          <h2>Shirts</h2>
          <div className="items-container">
            {shirts.length > 0 ? (
              shirts.map(shirt => (
                <div 
                  key={shirt.id} 
                  className={`item ${selectedShirt?.id === shirt.id ? 'selected' : ''}`}
                  onClick={() => setSelectedShirt(shirt)}
                >
                  <img src={shirt.image} alt={shirt.name} />
                  <p>{shirt.name}</p>
                  <p>${shirt.price.toFixed(2)}</p>
                </div>
              ))
            ) : (
              <p className="no-items">No shirts selected</p>
            )}
          </div>
        </div>

        <div className="item-selection">
          <h2>Pants</h2>
          <div className="items-container">
            {pants.length > 0 ? (
              pants.map(pant => (
                <div 
                  key={pant.id} 
                  className={`item ${selectedPants?.id === pant.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPants(pant)}
                >
                  <img src={pant.image} alt={pant.name} />
                  <p>{pant.name}</p>
                  <p>${pant.price.toFixed(2)}</p>
                </div>
              ))
            ) : (
              <p className="no-items">No pants selected</p>
            )}
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <div className="total-price">
          <p>Total: ${calculateTotal()}</p>
        </div>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
        <button className="return-btn" onClick={returnToProductList}>Return</button>
      </div>
    </div>
  );
}

export default FittingRoom;