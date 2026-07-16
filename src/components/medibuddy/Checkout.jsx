import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getCart, placeOrder, getOrCreateUserId } from "../../services/api";

export default function Checkout() {
  const { appId = "medibuddy" } = useParams();
  const [cart, setCart] = useState({ items: [], total: 0, savings: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState(null);
  const userId = getOrCreateUserId();

  const [form, setForm] = useState({
    delivery_name: "",
    delivery_address: "",
    delivery_city: "",
    delivery_pincode: "",
    delivery_phone: "",
    payment_method: "COD",
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await getCart(userId);
        setCart(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    })();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await placeOrder(userId, form);
      if (result.error) {
        alert(result.error);
      } else {
        setOrder(result);
      }
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  if (loading) return <div className="mb-loading">Loading...</div>;

  if (order) {
    return (
      <div className="mb-booking-success">
        <div className="mb-success-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
        <h2>Order Placed Successfully!</h2>
        <div className="mb-success-details">
          <p><strong>Order ID:</strong> {order.order_id}</p>
          <p><strong>Items:</strong> {order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
          <p><strong>Total:</strong> ₹{order.total}</p>
          <p><strong>Payment:</strong> {order.payment_method}</p>
          <p><strong>Delivery to:</strong> {order.delivery_address}</p>
          <p><strong>Status:</strong> <span className="mb-status-confirmed">{order.status}</span></p>
          <p className="mb-delivery-est">Estimated delivery: 2-3 business days</p>
        </div>
        <div className="mb-success-actions">
          <Link to={`/app/${appId}/my-bookings`} className="mb-btn-primary">View My Orders</Link>
          <Link to={`/app/${appId}/medicines`} className="mb-btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-checkout-page">
      <div className="mb-page-header">
        <h1>Checkout</h1>
      </div>

      <div className="mb-checkout-layout">
        <form onSubmit={handleSubmit} className="mb-checkout-form">
          <h3>Delivery Address</h3>
          <div className="mb-form-group">
            <label>Full Name</label>
            <input type="text" name="delivery_name" value={form.delivery_name} onChange={handleChange} required placeholder="Enter full name" />
          </div>
          <div className="mb-form-group">
            <label>Address</label>
            <textarea name="delivery_address" value={form.delivery_address} onChange={handleChange} required placeholder="House no., Street, Area" rows={2} />
          </div>
          <div className="mb-form-row">
            <div className="mb-form-group">
              <label>City</label>
              <input type="text" name="delivery_city" value={form.delivery_city} onChange={handleChange} required placeholder="City" />
            </div>
            <div className="mb-form-group">
              <label>Pincode</label>
              <input type="text" name="delivery_pincode" value={form.delivery_pincode} onChange={handleChange} required placeholder="6-digit pincode" maxLength={6} pattern="[0-9]{6}" />
            </div>
          </div>
          <div className="mb-form-group">
            <label>Phone Number</label>
            <input type="tel" name="delivery_phone" value={form.delivery_phone} onChange={handleChange} required placeholder="10-digit phone number" maxLength={10} pattern="[0-9]{10}" />
          </div>

          <h3>Payment Method</h3>
          <div className="mb-payment-options">
            {["COD", "UPI", "Card"].map((method) => (
              <label key={method} className={`mb-payment-option ${form.payment_method === method ? "active" : ""}`}>
                <input
                  type="radio"
                  name="payment_method"
                  value={method}
                  checked={form.payment_method === method}
                  onChange={handleChange}
                />
                <span>{method === "COD" ? "Cash on Delivery" : method === "UPI" ? "UPI Payment" : "Credit/Debit Card"}</span>
              </label>
            ))}
          </div>

          <button type="submit" className="mb-btn-primary mb-btn-lg" disabled={submitting}>
            {submitting ? "Placing Order..." : `Place Order • ₹${(cart.total + (cart.total < 500 ? 49 : 0)).toFixed(0)}`}
          </button>
        </form>

        <div className="mb-checkout-summary">
          <h3>Order Summary</h3>
          {cart.items.map((item) => (
            <div key={item.item_id} className="mb-checkout-item">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{(item.discounted_price * item.quantity).toFixed(0)}</span>
            </div>
          ))}
          <div className="mb-summary-total">
            <span>Total</span>
            <span>₹{(cart.total + (cart.total < 500 ? 49 : 0)).toFixed(0)}</span>
          </div>
          {cart.savings > 0 && (
            <p className="mb-savings-msg">You save &#8377;{cart.savings.toFixed(0)} on this order!</p>
          )}
        </div>
      </div>
    </div>
  );
}
