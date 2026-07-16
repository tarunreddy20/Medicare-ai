import { Link } from "react-router-dom";
import specialties from "../data/specialties";
import { FaCheckCircle, FaClock, FaShieldAlt, FaLaptopMedical, FaHospital, FaSignOutAlt } from "react-icons/fa";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";

const FEATURES = [
  { icon: FaLaptopMedical, title: "AI-Powered Consultations", desc: "Get instant medical guidance from our AI specialists trained on clinical knowledge across 18 departments." },
  { icon: FaClock, title: "24/7 Availability", desc: "Access health consultations anytime — no waiting rooms, no appointments needed." },
  { icon: FaShieldAlt, title: "Privacy First", desc: "Your health data is encrypted and never shared with third parties." },
  { icon: FaHospital, title: "Multi-Specialty Coverage", desc: "From cardiology to dermatology — comprehensive coverage for all your health questions." },
];

export default function Services() {
  const { dark, toggle } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div className="portal-page services-page">
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
            <Link to="/services" className="portal-nav-link active">Services</Link>
            <Link to="/contact" className="portal-nav-link">Contact</Link>
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

      <section className="services-hero">
        <h1>Our Services</h1>
        <p>Comprehensive AI-powered health consultations across all major medical specialties</p>
      </section>

      {/* Key Features */}
      <section className="services-features">
        {FEATURES.map((f, i) => (
          <div className="feature-card" key={i}>
            <div className="feature-icon"><f.icon /></div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* All Specialties */}
      <section className="services-specialties">
        <h2>All Departments</h2>
        <p className="services-sub">Select a specialty to start your AI consultation</p>
        <div className="services-dept-grid">
          {specialties.map((spec) => {
            const Icon = spec.icon;
            return (
              <Link to={`/chat/${spec.slug}`} className="service-dept-card" key={spec.id}>
                <div className="service-dept-icon" style={{ color: spec.color }}>
                  <Icon />
                </div>
                <div className="service-dept-info">
                  <h4>{spec.name}</h4>
                  <p>{spec.description}</p>
                </div>
                <FaCheckCircle className="service-dept-check" />
              </Link>
            );
          })}
        </div>
      </section>

      <footer className="portal-footer">
        <p>© 2026 MediCare AI Health Portal. All consultations are informational only.</p>
      </footer>
    </div>
  );
}
