import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getLabTest, bookLabTest, getOrCreateUserId } from "../../services/api";

export default function BookLabTest() {
  const { testId, appId = "medibuddy" } = useParams();
  const userId = getOrCreateUserId();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [form, setForm] = useState({ address: "", city: "", pincode: "", phone: "" });

  const timeSlots = ["6:00 AM - 8:00 AM", "8:00 AM - 10:00 AM", "10:00 AM - 12:00 PM", "2:00 PM - 4:00 PM"];

  const getNext7Days = () => {
    const days = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push({
        value: d.toISOString().split("T")[0],
        label: d.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" }),
      });
    }
    return days;
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await getLabTest(testId);
        setTest(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    })();
  }, [testId]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) return;
    setSubmitting(true);
    try {
      const result = await bookLabTest({
        user_id: userId,
        test_id: testId,
        date: selectedDate,
        time_slot: selectedSlot,
        ...form,
      });
      setBooking(result);
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  if (loading) return <div className="mb-loading">Loading...</div>;
  if (!test) return <div className="mb-empty">Test not found</div>;

  if (booking) {
    return (
      <div className="mb-booking-success">
        <div className="mb-success-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
        <h2>Lab Test Booked!</h2>
        <div className="mb-success-details">
          <p><strong>Booking ID:</strong> {booking.booking_id}</p>
          <p><strong>Test:</strong> {booking.test_name}</p>
          <p><strong>Date:</strong> {booking.date}</p>
          <p><strong>Time:</strong> {booking.time_slot}</p>
          <p><strong>Sample Collection:</strong> {booking.address}</p>
          <p><strong>Sample Type:</strong> {booking.sample_type}</p>
          <p><strong>Status:</strong> <span className="mb-status-confirmed">{booking.status}</span></p>
        </div>
        <div className="mb-success-actions">
          <Link to={`/app/${appId}/my-bookings`} className="mb-btn-primary">View My Bookings</Link>
          <Link to={`/app/${appId}/lab-tests`} className="mb-btn-secondary">Book More Tests</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-book-labtest">
      <div className="mb-page-header">
        <h1>Book Lab Test</h1>
      </div>

      <div className="mb-booking-content">
        <div className="mb-lab-summary">
          <h2>{test.name}</h2>
          <p>{test.description}</p>
          <div className="mb-lab-meta">
            <span>Sample: {test.sample_type}</span>
            <span>⏱️ Report in {test.report_time}</span>
            <span>{test.tests_included?.length} tests</span>
          </div>
          <p className="mb-fee-highlight">Price: ₹{test.discounted_price} <span className="mb-lab-old-price">₹{test.price}</span></p>
          {test.preparation && <p className="mb-prep-note"><strong>Preparation:</strong> {test.preparation}</p>}
        </div>

        <form onSubmit={handleSubmit} className="mb-booking-form">
          <div className="mb-form-group">
            <label>Select Date for Sample Collection</label>
            <div className="mb-date-grid">
              {getNext7Days().map((d) => (
                <button
                  key={d.value}
                  type="button"
                  className={`mb-date-chip ${selectedDate === d.value ? "active" : ""}`}
                  onClick={() => setSelectedDate(d.value)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-form-group">
            <label>Select Time Slot</label>
            <div className="mb-slot-grid">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className={`mb-slot-chip ${selectedSlot === slot ? "active" : ""}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <h3>Sample Collection Address</h3>
          <div className="mb-form-group">
            <label>Address</label>
            <textarea name="address" value={form.address} onChange={handleChange} required placeholder="House no., Street, Area" rows={2} />
          </div>
          <div className="mb-form-row">
            <div className="mb-form-group">
              <label>City</label>
              <input type="text" name="city" value={form.city} onChange={handleChange} required placeholder="City" />
            </div>
            <div className="mb-form-group">
              <label>Pincode</label>
              <input type="text" name="pincode" value={form.pincode} onChange={handleChange} required placeholder="Pincode" maxLength={6} pattern="[0-9]{6}" />
            </div>
          </div>
          <div className="mb-form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} required placeholder="10-digit number" maxLength={10} pattern="[0-9]{10}" />
          </div>

          <button
            type="submit"
            className="mb-btn-primary mb-btn-lg"
            disabled={!selectedDate || !selectedSlot || submitting}
          >
            {submitting ? "Booking..." : `Confirm Booking • ₹${test.discounted_price}`}
          </button>
        </form>
      </div>
    </div>
  );
}
