import { Link, Outlet, useParams } from "react-router-dom";
import mbLogo from "../../assets/medibuddy/logo.svg";
import iconDoctor from "../../assets/medibuddy/icon-doctor.svg";
import iconMedicine from "../../assets/medibuddy/icon-medicine.svg";
import iconAppointment from "../../assets/medibuddy/icon-appointment.svg";
import iconLab from "../../assets/medibuddy/icon-lab.svg";
import iconSurgery from "../../assets/medibuddy/icon-surgery.svg";
import iconGold from "../../assets/medibuddy/icon-gold.svg";
import t1mgLogo from "../../assets/tata1mg/logo.svg";
import t1mgLocIcon from "../../assets/tata1mg/icon-location.svg";
import t1mgSearchIcon from "../../assets/tata1mg/icon-search.svg";
import t1mgCartIcon from "../../assets/tata1mg/icon-cart.svg";
import t1mgLightningIcon from "../../assets/tata1mg/icon-lightning.svg";

export default function MediBuddyLayout() {
  const { appId = "medibuddy" } = useParams();
  const basePath = `/app/${appId}`;
  const isTata = appId === "tata-1mg";
  const brandLogo = isTata ? t1mgLogo : mbLogo;

  // Practo, Apollo, PharmEasy have their own full-page layouts in ThemedDashboard
  if (appId !== "medibuddy" && appId !== "tata-1mg") {
    return <Outlet />;
  }

  const services = [
    { label: "Talk to Doctor", link: `${basePath}/doctors`, icon: iconDoctor },
    { label: "Medicine", link: `${basePath}/medicines`, icon: isTata ? t1mgLightningIcon : iconMedicine },
    { label: "Book Dr. Appointment", link: `${basePath}/doctors`, icon: isTata ? t1mgLocIcon : iconAppointment },
    { label: "Lab Test & Packages", link: `${basePath}/lab-tests`, icon: iconLab },
    { label: "Surgery", link: `${basePath}/surgery`, icon: iconSurgery },
    { label: isTata ? "Care Plan" : "MediBuddy GOLD", link: `${basePath}/insurance`, icon: isTata ? t1mgSearchIcon : iconGold, gold: true },
  ];

  return (
    <div className={`mb-layout ${isTata ? "mb-layout-tata" : "mb-layout-medibuddy"}`}>
      <header className="mb-layout-header">
        {isTata ? (
          <>
            <div className="mb-layout-tata-utility">
              <div className="mb-layout-tata-utility-inner">
                <span>Delivering to New Delhi</span>
                <Link to={`${basePath}/my-bookings`}>Track Order</Link>
              </div>
            </div>
            <div className="mb-layout-header-inner mb-layout-header-inner-tata">
              <Link to={basePath} className="mb-layout-logo">
                <img src={brandLogo} alt="Tata 1mg" className="mb-layout-logo-img" />
                <span className="mb-layout-logo-fallback">Tata 1mg</span>
              </Link>
              <div className="mb-layout-tata-search-wrap">
                <img src={t1mgSearchIcon} alt="" className="mb-layout-tata-search-icon" />
                <input className="mb-layout-tata-search" value="Search medicines, lab tests, doctors" readOnly />
              </div>
              <div className="mb-layout-actions mb-layout-actions-tata">
                <Link to={`${basePath}/medicines`} className="mb-layout-tata-buy"><img src={t1mgLightningIcon} alt="" />Quick Buy</Link>
                <Link to={`${basePath}/cart`} className="mb-layout-tata-cart"><img src={t1mgCartIcon} alt="" />Cart</Link>
              </div>
            </div>
            <nav className="mb-layout-tata-nav">
              <div className="mb-layout-tata-nav-inner">
                <Link to={`${basePath}/medicines`}>MEDICINES</Link>
                <Link to={`${basePath}/lab-tests`}>LAB TESTS</Link>
                <Link to={`${basePath}/doctors`}>CONSULT DOCTORS</Link>
                <Link to={`${basePath}/surgery`}>SURGERY</Link>
                <Link to={`${basePath}/insurance`} className="mb-layout-tata-nav-care">CARE PLAN</Link>
              </div>
            </nav>
          </>
        ) : (
          <div className="mb-layout-header-inner">
            <Link to={basePath} className="mb-layout-logo">
              <img src={brandLogo} alt="MediBuddy" className="mb-layout-logo-img" />
              <span className="mb-layout-logo-fallback">MediBuddy</span>
            </Link>
            <nav className="mb-layout-nav">
              {services.map((service) => (
                <Link to={service.link} key={service.label} className={`mb-layout-nav-item${service.gold ? " mb-layout-nav-item-gold" : ""}`}>
                  <img src={service.icon} alt="" className="mb-layout-nav-icon" />
                  <span>{service.label}</span>
                </Link>
              ))}
              <Link to={`${basePath}/my-bookings`} className="mb-layout-nav-item mb-layout-nav-item-more">
                <span className="mb-layout-more-dots">•••</span>
                <span>More</span>
              </Link>
            </nav>
            <div className="mb-layout-actions">
              <Link to={`${basePath}/insurance`} className="mb-layout-link">About Us</Link>
              <Link to={`${basePath}/doctors`} className="mb-layout-link">Login</Link>
            </div>
          </div>
        )}
      </header>
      <div className="mb-layout-quick-links">
        <div className="mb-layout-quick-links-inner">
          <Link to={`${basePath}/chat/general-surgery`} className="mb-layout-quick-ai">Talk to AI Doctor</Link>
          <Link to={`${basePath}/cart`}><img src={isTata ? t1mgCartIcon : iconMedicine} alt="" className="mb-layout-quick-icon" />Cart</Link>
          <Link to={`${basePath}/my-bookings`}>My Bookings</Link>
          <Link to={`${basePath}/insurance`}>Insurance</Link>
        </div>
      </div>
      <main className="mb-layout-main">
        <Outlet />
      </main>
      <footer className="mb-layout-footer">
        <div className="mb-layout-footer-inner">
          <div className="mb-layout-footer-links">
            <Link to={basePath}>Home</Link>
            <Link to={`${basePath}/doctors`}>Doctors</Link>
            <Link to={`${basePath}/medicines`}>Medicines</Link>
            <Link to={`${basePath}/lab-tests`}>Lab Tests</Link>
            <Link to={`${basePath}/insurance`}>Insurance</Link>
            <Link to={`${basePath}/my-bookings`}>My Bookings</Link>
          </div>
          <p className="mb-layout-footer-disclaimer">AI Assistant only — not a replacement for real doctors. © 2026 {isTata ? "Tata 1mg" : "MediBuddy"}</p>
        </div>
      </footer>
    </div>
  );
}
