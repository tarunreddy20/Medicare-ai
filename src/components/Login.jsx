import { useEffect, useRef, useCallback } from "react";
import { useAuth, decodeGoogleToken } from "../hooks/useAuth";
import { FaHeartbeat, FaShieldAlt, FaUserMd, FaClock, FaStethoscope, FaLaptopMedical } from "react-icons/fa";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export default function Login() {
  const { login } = useAuth();
  const btnRef = useRef(null);

  const handleCredentialResponse = useCallback((response) => {
    const profile = decodeGoogleToken(response.credential);
    if (profile) {
      login({
        name: profile.name,
        email: profile.email,
        picture: profile.picture,
        sub: profile.sub,
      });
    }
  }, [login]);

  useEffect(() => {
    const initGoogle = () => {
      if (!window.google?.accounts?.id) {
        setTimeout(initGoogle, 200);
        return;
      }

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      if (btnRef.current) {
        window.google.accounts.id.renderButton(btnRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "pill",
          logo_alignment: "left",
          width: 320,
        });
      }
    };

    initGoogle();
  }, [handleCredentialResponse]);

  return (
    <div className="login-page">
      {/* Left panel — branding */}
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-brand">
            <div className="login-brand-icon"><span>+</span></div>
            <span className="login-brand-name">MediCare</span>
          </div>
          <h1 className="login-hero-title">
            Your Health,<br />
            <span className="login-hero-accent">Our Priority.</span>
          </h1>
          <p className="login-hero-desc">
            Get instant, AI-powered health guidance from 18 medical specialists — available 24/7, private, and free.
          </p>
          <div className="login-hero-features">
            <div className="login-hero-feat">
              <div className="login-hero-feat-icon"><FaStethoscope /></div>
              <div>
                <strong>18 Specialties</strong>
                <p>Cardiology, Neurology, Dermatology, Pediatrics & more</p>
              </div>
            </div>
            <div className="login-hero-feat">
              <div className="login-hero-feat-icon"><FaClock /></div>
              <div>
                <strong>Available 24/7</strong>
                <p>No appointments, no waiting rooms</p>
              </div>
            </div>
            <div className="login-hero-feat">
              <div className="login-hero-feat-icon"><FaShieldAlt /></div>
              <div>
                <strong>Private & Secure</strong>
                <p>Your conversations stay confidential</p>
              </div>
            </div>
          </div>
        </div>
        <div className="login-left-pulse" aria-hidden="true" />
        <div className="login-left-pulse login-left-pulse-2" aria-hidden="true" />
      </div>

      {/* Right panel — sign in */}
      <div className="login-right">
        <div className="login-card">
          <div className="login-card-header">
            <div className="login-avatar-ring">
              <FaLaptopMedical />
            </div>
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Sign in to continue your health journey</p>
          </div>

          <div className="login-google-btn" ref={btnRef} />

          {!GOOGLE_CLIENT_ID && (
            <p className="login-warning">
              Google Client ID not configured. Set <code>VITE_GOOGLE_CLIENT_ID</code> in your .env file.
            </p>
          )}

          <div className="login-divider">
            <span>Trusted by patients worldwide</span>
          </div>

          <div className="login-stats">
            <div className="login-stat">
              <FaUserMd className="login-stat-icon" />
              <div className="login-stat-value">18</div>
              <div className="login-stat-label">AI Specialists</div>
            </div>
            <div className="login-stat">
              <FaHeartbeat className="login-stat-icon" />
              <div className="login-stat-value">24/7</div>
              <div className="login-stat-label">Always On</div>
            </div>
            <div className="login-stat">
              <FaShieldAlt className="login-stat-icon" />
              <div className="login-stat-value">100%</div>
              <div className="login-stat-label">Private</div>
            </div>
          </div>

          <p className="login-disclaimer">
            AI responses are informational only and do not replace professional medical advice. Always consult a licensed healthcare provider.
          </p>
        </div>
      </div>
    </div>
  );
}
