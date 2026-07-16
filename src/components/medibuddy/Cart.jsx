import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCart, removeFromCart, updateCartQuantity, getOrCreateUserId } from "../../services/api";

export default function Cart() {
  const { appId = "medibuddy" } = useParams();
  const [cart, setCart] = useState({ items: [], total: 0, savings: 0 });
  const [loading, setLoading] = useState(true);
  const userId = getOrCreateUserId();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await getCart(userId);
      setCart(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleRemove = async (itemId) => {
    const data = await removeFromCart(userId, itemId);
    setCart(data);
  };

  const handleQuantity = async (itemId, qty) => {
    const data = await updateCartQuantity(userId, itemId, qty);
    setCart(data);
  };

  if (loading) return <div className="mb-loading">Loading cart...</div>;

  if (cart.items.length === 0) {
    return (
      <div className="mb-empty-cart">
        <div className="mb-empty-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#7B3EAC" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></div>
        <h2>Your cart is empty</h2>
        <p>Add medicines or lab tests to get started</p>
        <div className="mb-empty-actions">
          <Link to={`/app/${appId}/medicines`} className="mb-btn-primary">Browse Medicines</Link>
          <Link to={`/app/${appId}/lab-tests`} className="mb-btn-secondary">Browse Lab Tests</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-cart-page">
      <div className="mb-page-header">
        <h1>Your Cart</h1>
        <p>{cart.items.length} item{cart.items.length > 1 ? "s" : ""}</p>
      </div>

      <div className="mb-cart-layout">
        <div className="mb-cart-items">
          {cart.items.map((item) => (
            <div key={item.item_id} className="mb-cart-item">
              <div className="mb-cart-item-info">
                <h3>{item.name}</h3>
                <p className="mb-cart-item-type">{item.item_type}</p>
                <div className="mb-cart-item-pricing">
                  <span className="mb-cart-price">₹{item.discounted_price}</span>
                  {item.price !== item.discounted_price && (
                    <span className="mb-cart-original">₹{item.price}</span>
                  )}
                </div>
              </div>
              <div className="mb-cart-item-controls">
                <div className="mb-qty-control">
                  <button onClick={() => handleQuantity(item.item_id, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantity(item.item_id, item.quantity + 1)}>+</button>
                </div>
                <button className="mb-remove-btn" onClick={() => handleRemove(item.item_id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-cart-summary">
          <h3>Order Summary</h3>
          <div className="mb-summary-row">
            <span>Subtotal</span>
            <span>₹{(cart.total + cart.savings).toFixed(0)}</span>
          </div>
          <div className="mb-summary-row mb-savings">
            <span>Savings</span>
            <span>-₹{cart.savings.toFixed(0)}</span>
          </div>
          <div className="mb-summary-row mb-delivery">
            <span>Delivery</span>
            <span>{cart.total >= 500 ? "FREE" : "₹49"}</span>
          </div>
          <div className="mb-summary-total">
            <span>Total</span>
            <span>₹{(cart.total + (cart.total < 500 ? 49 : 0)).toFixed(0)}</span>
          </div>
          <button
            className="mb-btn-primary mb-btn-lg"
            onClick={() => navigate(`/app/${appId}/checkout`)}
          >
            Proceed to Checkout
          </button>
          <Link to={`/app/${appId}/medicines`} className="mb-btn-link mb-continue-shopping">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
