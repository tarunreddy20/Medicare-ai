import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";

export default function Contact() {
  const { dark, toggle } = useTheme();
  const { user, logout } = useAuth();

  const contactName = import.meta.env.VITE_CONTACT_NAME || "Tarun Reddy";
  const address = import.meta.env.VITE_CONTACT_ADDRESS || "";
  const phone = import.meta.env.VITE_CONTACT_PHONE || "";
  const email = import.meta.env.VITE_CONTACT_EMAIL || "";

  return (
    <div className="portal-page contact-page">
      <nav className="portal-nav" aria-label="Main navigation">
        <div className="portal-nav-inner">
          <Link to="/" className="portal-logo">
            <div className="portal-logo-icon"><span>+</span></div>
            <div>
              <div className="portal-logo-name">MediCare</div>
              <div className="portal-logo-sub">AI Health Portal</div>
            </div>
          </Link>
          <div className="portal-nav-links">
            <Link to="/symptom-checker" className="portal-nav-link">Symptom Checker</Link>
            <Link to="/services" className="portal-nav-link">Services</Link>
            <Link to="/contact" className="portal-nav-link active">Contact</Link>
          </div>
          <div className="portal-nav-right">
            <div className="live-indicator">
              <span className="live-dot" />
              <span>AI Doctors Online</span>
            </div>
            {user && (
              <div className="nav-user">
                <img src={user.picture} alt="" className="nav-user-avatar" referrerPolicy="no-referrer" />
                <span className="nav-user-name">{user.name?.split(" ")[0]}</span>
                <button className="nav-logout-btn" onClick={logout} aria-label="Sign out" title="Sign out">
                  <FaSignOutAlt />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <section className="contact-hero">
        <h1>Contact</h1>
        <p>Get in touch — we'd love to hear from you.</p>
      </section>

      <div className="contact-grid">
        <div className="contact-info-section">
          <div className="contact-card">
            <div className="contact-card-icon"><FaUser /></div>
            <h3>{contactName}</h3>
            <p>Developer & Creator</p>
          </div>

          {email && (
            <div className="contact-card">
              <div className="contact-card-icon"><FaEnvelope /></div>
              <h3>Email</h3>
              <p><a href={`mailto:${email.trim()}`}>{email.trim()}</a></p>
            </div>
          )}

          {phone && (
            <div className="contact-card">
              <div className="contact-card-icon"><FaPhone /></div>
              <h3>Phone</h3>
              <p><a href={`tel:${phone.trim().replace(/\s/g, "")}`}>{phone.trim()}</a></p>
            </div>
          )}

          {address && (
            <div className="contact-card">
              <div className="contact-card-icon"><FaMapMarkerAlt /></div>
              <h3>Location</h3>
              <p>{address}</p>
            </div>
          )}
        </div>
      </div>

      <footer className="portal-footer">
        <p>© 2026 MediCare AI Health Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}
