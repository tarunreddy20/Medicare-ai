import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import specialties from "../data/specialties";
import TIPS from "../data/healthTips";
import { FaShieldAlt, FaUserMd, FaClock, FaStar, FaSearch, FaMoon, FaSun, FaLightbulb, FaHistory, FaSignOutAlt } from "react-icons/fa";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { getOrCreateUserId, getChatHistory } from "../services/api";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const { dark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const [tipIndex, setTipIndex] = useState(0);
  const [recentChats, setRecentChats] = useState([]);

  // Health tips carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((i) => (i + 1) % TIPS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Load recent conversations
  useEffect(() => {
    const loadRecent = async () => {
      const userId = getOrCreateUserId();
      const results = [];
      for (const spec of specialties.slice(0, 6)) {
        try {
          const history = await getChatHistory(spec.slug, userId, 2);
          if (history.messages?.length > 1) {
            const lastMsg = history.messages[history.messages.length - 1];
            results.push({ slug: spec.slug, name: spec.name, icon: spec.icon, color: spec.color, preview: lastMsg.text?.slice(0, 80) });
          }
        } catch (e) { /* skip */ }
      }
      setRecentChats(results.slice(0, 4));
    };
    loadRecent();
  }, []);

  const filtered = specialties.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="portal-page" role="application" aria-label="MediCare AI Health Portal">

      {/* SKIP LINK */}
      <a href="#departments" className="skip-link">Skip to departments</a>

      {/* TOP NAV */}
      <nav className="portal-nav" aria-label="Main navigation">
        <div className="portal-nav-inner">
          <div className="portal-logo">
            <div className="portal-logo-icon">
              <span>+</span>
            </div>
            <div>
              <div className="portal-logo-name">MediCare</div>
              <div className="portal-logo-sub">AI Health Portal</div>
            </div>
          </div>
          <div className="portal-nav-links">
            <Link to="/symptom-checker" className="portal-nav-link">Symptom Checker</Link>
            <Link to="/services" className="portal-nav-link">Services</Link>
            <Link to="/contact" className="portal-nav-link">Contact</Link>
          </div>
          <div className="portal-nav-right">
            <div className="live-indicator" role="status" aria-live="polite" aria-label="System status: AI Doctors are online">
              <span className="live-dot" aria-hidden="true" />
              <span>AI Doctors Online</span>
              <button
                className="theme-toggle"
                onClick={toggle}
                aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                aria-pressed={dark}
              >
                {dark ? <FaSun aria-hidden="true" /> : <FaMoon aria-hidden="true" />}
              </button>
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

      {/* HERO */}
      <section className="portal-hero" aria-labelledby="hero-title">
        <div className="portal-hero-inner">
          <div className="portal-hero-text">
            <div className="portal-hero-badge" aria-hidden="true">
              <FaShieldAlt /> Trusted AI Medical Guidance
            </div>
            <h1 className="portal-hero-title" id="hero-title">
              Consult With AI Specialists<br />
              <span className="portal-hero-accent">Anytime. Instantly.</span>
            </h1>
            <p className="portal-hero-desc">
              Get informed, expert-level health guidance from our AI specialists across
              12 medical departments — available 24/7, no appointment needed.
            </p>
            <div className="portal-hero-ctas">
              <Link to="/symptom-checker" className="hero-cta-btn primary">
                Check Symptoms →
              </Link>
              <a href="#departments" className="hero-cta-btn secondary">
                Browse Departments
              </a>
            </div>
            <div className="portal-hero-stats">
              <div className="portal-stat">
                <div className="portal-stat-value">12</div>
                <div className="portal-stat-label">Specialties</div>
              </div>
              <div className="portal-stat-divider" />
              <div className="portal-stat">
                <div className="portal-stat-value">24/7</div>
                <div className="portal-stat-label">Availability</div>
              </div>
              <div className="portal-stat-divider" />
              <div className="portal-stat">
                <div className="portal-stat-value">AI</div>
                <div className="portal-stat-label">Powered</div>
              </div>
            </div>
          </div>
          <div className="portal-hero-card">
            <div className="portal-trust-header">
              <FaUserMd className="portal-trust-icon" />
              <div>
                <div className="portal-trust-title">Why Choose MediCare AI?</div>
                <div className="portal-trust-sub">Designed for real health conversations</div>
              </div>
            </div>
            <div className="portal-trust-items">
              <div className="portal-trust-item">
                <FaStar className="pti-icon" />
                <div>
                  <strong>Specialty-Matched Guidance</strong>
                  <p>Each AI is trained on department-specific context</p>
                </div>
              </div>
              <div className="portal-trust-item">
                <FaShieldAlt className="pti-icon" />
                <div>
                  <strong>Safe &amp; Informational</strong>
                  <p>No diagnosis, no prescriptions — evidence-based info only</p>
                </div>
              </div>
              <div className="portal-trust-item">
                <FaClock className="pti-icon" />
                <div>
                  <strong>Instant Response</strong>
                  <p>No waiting rooms — get answers in seconds</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DISCLAIMER BANNER */}
      <div className="portal-disclaimer" role="alert" aria-label="Important disclaimer">
        <FaShieldAlt aria-hidden="true" />
        <span>
          AI responses are for <strong>educational purposes only</strong> and do not replace a licensed physician.
          For emergencies, call your local emergency number immediately.
        </span>
      </div>

      {/* HEALTH TIPS CAROUSEL */}
      <div className="health-tips-bar" role="region" aria-label="Health tips" aria-live="polite" aria-atomic="true">
        <FaLightbulb className="tips-icon" aria-hidden="true" />
        <div className="tips-content">
          <span className="tips-category" aria-label={`Category: ${TIPS[tipIndex].category}`}>{TIPS[tipIndex].category}</span>
          <span className="tips-text">{TIPS[tipIndex].text}</span>
        </div>
        <div className="tips-dots" role="tablist" aria-label="Health tip navigation">
          {TIPS.map((_, i) => (
            <span
              key={i}
              className={`tips-dot ${i === tipIndex ? "active" : ""}`}
              onClick={() => setTipIndex(i)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setTipIndex(i)}
              role="tab"
              aria-selected={i === tipIndex}
              aria-label={`Tip ${i + 1} of ${TIPS.length}`}
              tabIndex={0}
            />
          ))}
        </div>
      </div>

      {/* RECENT CONVERSATIONS */}
      {recentChats.length > 0 && (
        <section className="portal-recent" aria-label="Recent conversations">
          <div className="portal-recent-inner">
            <h3 className="portal-recent-title"><FaHistory aria-hidden="true" /> Recent Conversations</h3>
            <div className="recent-grid" role="list">
              {recentChats.map((chat) => {
                const ChatIcon = chat.icon;
                return (
                  <Link
                    to={`/chat/${chat.slug}`}
                    key={chat.slug}
                    className="recent-card"
                    style={{ "--dept-color": chat.color }}
                    role="listitem"
                    aria-label={`Continue ${chat.name} conversation: ${chat.preview}`}
                  >
                    <div className="recent-card-icon" aria-hidden="true"><ChatIcon /></div>
                    <div className="recent-card-info">
                      <strong>{chat.name}</strong>
                      <p>{chat.preview}...</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* DEPARTMENTS */}
      <section className="portal-departments" id="departments" aria-labelledby="dept-heading">
        <div className="portal-departments-inner">
          <div className="portal-section-header">
            <div>
              <h2 className="portal-section-title" id="dept-heading">Select Your Department</h2>
              <p className="portal-section-sub">Choose a specialty below to start your AI consultation</p>
            </div>
            <div className="dept-search">
              <FaSearch className="dept-search-icon" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search specialties..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="dept-search-input"
                aria-label="Search departments"
                role="searchbox"
                aria-describedby="search-results-status"
              />
            </div>
          </div>

          <div id="search-results-status" className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {search && `${filtered.length} department${filtered.length !== 1 ? "s" : ""} found`}
          </div>

          {filtered.length === 0 && (
            <div className="dept-empty">
              <p>No departments match &ldquo;<strong>{search}</strong>&rdquo;</p>
              <button onClick={() => setSearch("")}>Clear Search</button>
            </div>
          )}

          <div className="dept-grid" role="list" aria-label="Medical departments">
            {filtered.map((spec, index) => {
              const SpecIcon = spec.icon;
              return (
                <Link
                  to={`/chat/${spec.slug}`}
                  key={spec.id}
                  className="dept-card"
                  style={{ "--dept-color": spec.color, "--reveal-delay": `${index * 60}ms` }}
                  role="listitem"
                  aria-label={`${spec.name} department — ${spec.description}. Available now.`}
                >
                  <div className="dept-card-top">
                    <div className="dept-icon-wrap" aria-hidden="true">
                      <SpecIcon />
                    </div>
                    <div className="dept-available" aria-label="Available">
                      <span className="dept-dot" aria-hidden="true" />
                      Available
                    </div>
                  </div>
                  <h3 className="dept-name">{spec.name}</h3>
                  <p className="dept-desc">{spec.description}</p>
                  <div className="dept-cta" aria-hidden="true">
                    Start Consultation <span className="dept-arrow">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="portal-footer" role="contentinfo">
        <div className="portal-footer-inner">
          <div className="portal-footer-brand">
            <div className="portal-logo-icon small">+</div>
            <span>MediCare AI Health Portal</span>
          </div>
          <p className="portal-footer-legal">
            This platform provides AI-generated health information only.
            It does not constitute medical advice, diagnosis, or treatment.
            Always consult a qualified healthcare professional.
          </p>
          <p className="portal-footer-signature">Designed & Developed by <strong>Tarun Reddy</strong></p>
        </div>
      </footer>
    </div>
  );
}

