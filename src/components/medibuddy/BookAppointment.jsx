import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getDoctor, bookAppointment, getOrCreateUserId } from "../../services/api";
import doctorPlaceholder from "../../assets/medibuddy/doctor-placeholder.svg";

export default function BookAppointment() {
  const { doctorId, appId = "medibuddy" } = useParams();
  const navigate = useNavigate();
  const userId = getOrCreateUserId();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [reason, setReason] = useState("");
  const [booking, setBooking] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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
        const data = await getDoctor(doctorId);
        setDoctor(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    })();
  }, [doctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) return;
    setSubmitting(true);
    try {
      const result = await bookAppointment({
        user_id: userId,
        doctor_id: doctorId,
        date: selectedDate,
        time_slot: selectedSlot,
        reason,
      });
      setBooking(result);
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  if (loading) return <div className="mb-loading">Loading...</div>;
  if (!doctor) return <div className="mb-empty">Doctor not found</div>;

  if (booking) {
    return (
      <div className="mb-booking-success">
        <div className="mb-success-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
        <h2>Appointment Confirmed!</h2>
        <div className="mb-success-details">
          <p><strong>Appointment ID:</strong> {booking.appointment_id}</p>
          <p><strong>Doctor:</strong> {booking.doctor_name}</p>
          <p><strong>Hospital:</strong> {booking.hospital}</p>
          <p><strong>Date:</strong> {booking.date}</p>
          <p><strong>Time:</strong> {booking.time_slot}</p>
          <p><strong>Status:</strong> <span className="mb-status-confirmed">{booking.status}</span></p>
        </div>
        <div className="mb-success-actions">
          <Link to={`/app/${appId}/my-bookings`} className="mb-btn-primary">View My Bookings</Link>
          <Link to={`/app/${appId}/doctors`} className="mb-btn-secondary">Book Another</Link>
          <Link
            to={`/app/${appId}/chat/${doctor.specialty}?context=appointment&doctor=${encodeURIComponent(doctor.name)}`}
            className="mb-btn-secondary"
          >
            Ask AI about preparation
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-book-appointment">
      <div className="mb-page-header">
        <h1>Book Appointment</h1>
      </div>

      <div className="mb-booking-content">
        <div className="mb-doctor-summary">
          <img
            className="mb-doctor-avatar-lg"
            src={doctor.image || doctorPlaceholder}
            alt={doctor.name}
            onError={(e) => {
              e.currentTarget.src = doctorPlaceholder;
            }}
          />
          <div>
            <h2>{doctor.name}</h2>
            <p>{doctor.specialty.replace("-", " ")} &bull; {doctor.experience} yrs exp &bull; &#9733; {doctor.rating}</p>
            <p>{doctor.hospital}, {doctor.city}</p>
            <p className="mb-fee-highlight">Consultation Fee: &#8377;{doctor.fee}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mb-booking-form">
          <div className="mb-form-group">
            <label>Select Date</label>
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
              {doctor.available_slots?.map((slot) => (
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

          <div className="mb-form-group">
            <label>Reason for Visit (optional)</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe your symptoms or reason for visit..."
              className="mb-textarea"
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="mb-btn-primary mb-btn-lg"
            disabled={!selectedDate || !selectedSlot || submitting}
          >
            {submitting ? "Booking..." : `Confirm Booking • ₹${doctor.fee}`}
          </button>
        </form>
      </div>
    </div>
  );
}
