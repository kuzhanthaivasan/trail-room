import { useState } from 'react';
import '../styles/Header.css';
import { ShoppingCart, Search, User, Trash2, Check } from 'lucide-react';
import human from "../assets/logo/trail-human-logo.jpg";

function Header({ cartItems, setSearchQuery, removeFromCart, toggleSelectionMode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Handle removing item from cart
  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  // Handle adjusting item quantity
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      // This function would need to be updated in the parent component
      // For now, it's not fully implemented
      console.log(`Update quantity for item ${itemId} to ${newQuantity}`);
    }
  };

  // Handle user icon click - toggle selection mode
  const handleUserIconClick = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    // Toggle selection mode in parent component
    toggleSelectionMode();
  };

  return (
    <header className="header">
      <div className="logo">ShopEasy</div>
      
      <div className="header-icons">
        <div className="search-container">
          {isSearchOpen ? (
            <input
              type="text"
              placeholder="Search products..."
              className="search-input"
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          ) : null}
          <div
            className="icon search-icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search size={24} />
          </div>
        </div>
        
        <div className="user-container">
          <div 
            className={`icon user-icon human-icon ${isUserMenuOpen ? 'active' : ''}`}
            onClick={handleUserIconClick}
          >
            {human ? (
              <img src={human} alt="User" className="user-image" />
            ) : (
              <User size={24} />
            )}
            {isUserMenuOpen && (
              <div className="user-tick">
                <Check size={12} color="white" strokeWidth={3} />
              </div>
            )}
          </div>
        </div>
        
        <div className="cart-container">
          <div
            className="icon cart-icon"
            onClick={() => setIsCartOpen(!isCartOpen)}
          >
            <ShoppingCart size={24} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </div>
          
          {isCartOpen && (
            <div className="cart-dropdown">
              <h3>Your Cart</h3>
              {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <>
                  <ul className="cart-items">
                    {cartItems.map(item => (
                      <li key={item.id} className="cart-item">
                        <img src={item.image} alt={item.name} className="cart-item-image" />
                        <div className="cart-item-details">
                          <h4>{item.name}</h4>
                          <div className="cart-item-price-row">
                            <p>${item.price.toFixed(2)} × {item.quantity}</p>
                            <div className="cart-item-controls">
                              <button 
                                className="quantity-btn"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              >
                                -
                              </button>
                              <span className="item-quantity">{item.quantity}</span>
                              <button 
                                className="quantity-btn"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        <button 
                          className="remove-item-btn"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="cart-total">
                    <p>Total: ${totalPrice.toFixed(2)}</p>
                    <button className="checkout-btn">Checkout</button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;