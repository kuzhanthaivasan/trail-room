import { useState, useEffect } from 'react';
import '../styles/ProductList.css';
import { ShoppingCart, Shirt, Eye, Check, Star, Search, CheckSquare, ShoppingBag } from 'lucide-react';

function ProductList({ products, addToCart, selectionModeEnabled, goToFittingRoom }) {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productData, setProductData] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', product: null });
  
  // Initialize productData when products prop changes
  useEffect(() => {
    const productDataMap = {};
    products.forEach(product => {
      productDataMap[product.id] = product;
    });
    setProductData(productDataMap);
  }, [products]);
  
  // Clear selected products when selection mode is disabled
  useEffect(() => {
    if (!selectionModeEnabled) {
      setSelectedProducts([]);
    }
  }, [selectionModeEnabled]);
  
  // Effect to automatically hide notification after 3 seconds
  useEffect(() => {
    let timer;
    if (notification.show) {
      timer = setTimeout(() => {
        setNotification({ show: false, message: '', product: null });
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [notification.show]);
  
  const toggleProductSelection = (product) => {
    // Only allow selection if selection mode is enabled
    if (!selectionModeEnabled) return;
    
    if (selectedProducts.some(item => item.id === product.id)) {
      // If already selected, remove it
      setSelectedProducts(selectedProducts.filter(item => item.id !== product.id));
    } else {
      // If not selected, add it
      setSelectedProducts([...selectedProducts, product]);
    }
  };
  
  // Handle viewing product details
  const viewProductDetails = (e, productId) => {
    e.stopPropagation(); // Prevent triggering selection
    // Store complete product data in localStorage for access on detail page
    localStorage.setItem('currentProduct', JSON.stringify(productData[productId]));
    // In a real app, you would navigate here. For now, just store the data
    console.log(`Viewing product ${productId} details:`, productData[productId]);
    // Future implementation: navigate(`/product/${productId}`);
  };
  
  const handleAddToCart = (product) => {
    // Add the product to cart
    addToCart(product);
    
    // Show notification
    setNotification({
      show: true,
      message: `${product.name} successfully added to cart!`,
      product: product
    });
  };
  
  const addSelectedToCart = () => {
    // Pass the entire array of selected products to addMultipleToCart
    addToCart(selectedProducts);
    
    // Show notification for multiple products
    setNotification({
      show: true,
      message: `${selectedProducts.length} products successfully added to cart!`,
      product: null
    });
    
    // Clear selection after processing
    setSelectedProducts([]);
  };

  // Function to go to fitting room with selected products
  const handleGoToFittingRoom = () => {
    goToFittingRoom(selectedProducts);
  };

  return (
    <div className="product-container">
      {/* Success Notification Toast */}
      {notification.show && (
        <div className="notification-toast">
          <div className="notification-content">
            <div className="notification-icon">
              <ShoppingBag size={20} />
            </div>
            <div className="notification-message">
              {notification.message}
            </div>
          </div>
          {notification.product && (
            <div className="notification-product">
              <img 
                src={notification.product.image} 
                alt={notification.product.name} 
                className="notification-product-image"
              />
            </div>
          )}
        </div>
      )}

      {selectedProducts.length > 0 && (
        <div className="selection-bar">
          <div className="selection-info">
            <span className="selection-count">{selectedProducts.length}</span>
            <span className="selection-text">Products Selected</span>
          </div>
          <div className="selection-actions">
            <button
              className="action-button add-selected-btn"
              onClick={addSelectedToCart}
            >
              <ShoppingCart className="icon" size={18} />
              Add to Cart
            </button>
            <button
              className="action-button fitting-room-btn"
              onClick={handleGoToFittingRoom}
            >
              <Shirt className="icon" size={18} />
              Try On
            </button>
          </div>
        </div>
      )}
      
      <div className="product-list">
        {products.length === 0 ? (
          <div className="no-products">
            <div className="empty-state-icon">
              <Search size={48} className="search-icon" />
            </div>
            <p>No products found</p>
            <p className="empty-state-subtitle">Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          products.map(product => (
            <div
              key={product.id}
              className={`product-card ${selectedProducts.some(item => item.id === product.id) ? 'selected' : ''} ${!selectionModeEnabled ? 'selection-disabled' : ''}`}
              onClick={() => toggleProductSelection(product)}
              data-product-id={product.id}
            >
              {/* Multi-selection indicator for each product */}
              {selectionModeEnabled && (
                <div className="multi-select-indicator">
                  <CheckSquare size={16} />
                </div>
              )}
              
              {product.isNew && <div className="product-tag new-tag">NEW</div>}
              {product.discount > 0 && <div className="product-tag discount-tag">{product.discount}% OFF</div>}
              
              <div className="product-image-container">
                <img src={product.image} alt={product.name} className="product-image" />
                
                {selectedProducts.some(item => item.id === product.id) && (
                  <div className="selection-indicator">
                    <Check size={24} />
                  </div>
                )}
              </div>
              
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price-container">
                  <p className="product-price">${product.price.toFixed(2)}</p>
                  {product.originalPrice && (
                    <p className="product-original-price">${product.originalPrice.toFixed(2)}</p>
                  )}
                </div>
                
                <div className="product-metadata">
                  {product.rating && (
                    <div className="product-rating">
                      <div className="star-rating">
                        {[...Array(5)].map((_, index) => (
                          <Star 
                            key={index}
                            size={16}
                            fill={index < Math.floor(product.rating) ? "currentColor" : "none"}
                            color="currentColor"
                          />
                        ))}
                      </div>
                      <span className="rating-count">({product.ratingCount || 0})</span>
                    </div>
                  )}
                </div>
                
                <button
                  className="add-to-cart-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering selection
                    handleAddToCart(product);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductList;