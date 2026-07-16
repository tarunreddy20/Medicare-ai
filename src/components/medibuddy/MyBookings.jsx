import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrders, getAppointments, getLabBookings, getOrCreateUserId } from "../../services/api";

export default function MyBookings() {
  const { appId = "medibuddy" } = useParams();
  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [labBookings, setLabBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = getOrCreateUserId();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [appts, ords, labs] = await Promise.all([
        getAppointments(userId),
        getOrders(userId),
        getLabBookings(userId),
      ]);
      setAppointments(appts || []);
      setOrders(ords || []);
      setLabBookings(labs || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const tabs = [
    { id: "appointments", label: `Appointments (${appointments.length})` },
    { id: "orders", label: `📦 Orders (${orders.length})` },
    { id: "labtests", label: `Lab Tests (${labBookings.length})` },
  ];

  if (loading) return <div className="mb-loading">Loading your bookings...</div>;

  const isEmpty = appointments.length === 0 && orders.length === 0 && labBookings.length === 0;

  if (isEmpty) {
    return (
      <div className="mb-empty-cart">
        <div className="mb-empty-icon">📋</div>
        <h2>No bookings yet</h2>
        <p>Start by booking a doctor, ordering medicines, or scheduling a lab test</p>
        <div className="mb-empty-actions">
          <Link to={`/app/${appId}/doctors`} className="mb-btn-primary">Find Doctors</Link>
          <Link to={`/app/${appId}/medicines`} className="mb-btn-secondary">Browse Medicines</Link>
          <Link to={`/app/${appId}/lab-tests`} className="mb-btn-secondary">Book Lab Test</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-bookings-page">
      <div className="mb-page-header">
        <h1>📋 My Bookings</h1>
      </div>

      <div className="mb-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`mb-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-tab-content">
        {activeTab === "appointments" && (
          <div className="mb-bookings-list">
            {appointments.length === 0 ? (
              <p className="mb-empty-tab">No appointments yet. <Link to={`/app/${appId}/doctors`}>Find a doctor</Link></p>
            ) : (
              appointments.map((apt) => (
                <div key={apt.appointment_id} className="mb-booking-card">
                  <div className="mb-booking-left">
                    <h4>{apt.doctor_name}</h4>
                    <p>{apt.doctor_specialty?.replace("-", " ")} • {apt.hospital}</p>
                    <p>📅 {apt.date} at {apt.time_slot}</p>
                    {apt.reason && <p className="mb-booking-reason">Reason: {apt.reason}</p>}
                  </div>
                  <div className="mb-booking-right">
                    <span className={`mb-status-badge mb-status-${apt.status}`}>{apt.status}</span>
                    <span className="mb-booking-id">{apt.appointment_id}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="mb-bookings-list">
            {orders.length === 0 ? (
              <p className="mb-empty-tab">No orders yet. <Link to={`/app/${appId}/medicines`}>Browse medicines</Link></p>
            ) : (
              orders.map((order) => (
                <div key={order.order_id} className="mb-booking-card">
                  <div className="mb-booking-left">
                    <h4>Order {order.order_id}</h4>
                    <p>{order.items.length} item{order.items.length > 1 ? "s" : ""} • {order.payment_method}</p>
                    <p>📍 {order.delivery_address}</p>
                    <p className="mb-booking-date">{new Date(order.created_at).toLocaleDateString("en-IN")}</p>
                  </div>
                  <div className="mb-booking-right">
                    <span className="mb-order-total">₹{order.total}</span>
                    <span className={`mb-status-badge mb-status-${order.status}`}>{order.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "labtests" && (
          <div className="mb-bookings-list">
            {labBookings.length === 0 ? (
              <p className="mb-empty-tab">No lab bookings yet. <Link to={`/app/${appId}/lab-tests`}>Book a test</Link></p>
            ) : (
              labBookings.map((lab) => (
                <div key={lab.booking_id} className="mb-booking-card">
                  <div className="mb-booking-left">
                    <h4>{lab.test_name}</h4>
                    <p>📅 {lab.date} at {lab.time_slot}</p>
                    <p>📍 {lab.address}</p>
                    <p>Sample: {lab.sample_type}</p>
                  </div>
                  <div className="mb-booking-right">
                    <span className={`mb-status-badge mb-status-${lab.status}`}>{lab.status}</span>
                    <span className="mb-booking-id">{lab.booking_id}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
