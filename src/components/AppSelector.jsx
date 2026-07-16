import { Link } from "react-router-dom";
import appThemes from "../data/appThemes";

export default function AppSelector() {
  return (
    <div className="app-selector-page">
      <div className="selector-backdrop" />

      <header className="selector-header">
        <h1 className="selector-title">Health Portal Hub</h1>
        <p className="selector-subtitle">
          Choose your preferred health platform to get started with AI-powered consultations
        </p>
      </header>

      <main className="selector-grid">
        {appThemes.map((app) => (
          <Link
            to={`/app/${app.id}`}
            key={app.id}
            className="app-card"
            style={{
              "--app-primary": app.colors.primary,
              "--app-gradient": app.colors.gradient,
              "--app-light": app.colors.light,
            }}
          >
            <div className="app-card-logo">{app.logo}</div>
            <h2 className="app-card-name">{app.name}</h2>
            <p className="app-card-tagline">{app.tagline}</p>
            <p className="app-card-desc">{app.description}</p>
            <span className="app-card-cta">Open App →</span>
          </Link>
        ))}
      </main>

      <footer className="selector-footer">
        All platforms use AI assistants for educational guidance only. Not a replacement for real doctors.
      </footer>
    </div>
  );
}
