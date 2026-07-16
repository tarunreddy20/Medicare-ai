import { Link, useParams } from "react-router-dom";
import specialties from "../data/specialties";
import mbLogo from "../assets/medibuddy/logo.svg";
import iconDoctor from "../assets/medibuddy/icon-doctor.svg";
import iconMedicine from "../assets/medibuddy/icon-medicine.svg";
import iconAppointment from "../assets/medibuddy/icon-appointment.svg";
import iconLab from "../assets/medibuddy/icon-lab.svg";
import iconSurgery from "../assets/medibuddy/icon-surgery.svg";
import iconGold from "../assets/medibuddy/icon-gold.svg";
import iconMore from "../assets/medibuddy/icon-more.svg";
import t1mgLogo from "../assets/tata1mg/logo.svg";
import t1mgLocIcon from "../assets/tata1mg/icon-location.svg";
import t1mgSearchIcon from "../assets/tata1mg/icon-search.svg";
import t1mgCartIcon from "../assets/tata1mg/icon-cart.svg";
import t1mgLightningIcon from "../assets/tata1mg/icon-lightning.svg";

export default function ThemedDashboard() {
  const { appId } = useParams();

  const renderers = {
    medibuddy: MediBuddyHome,
    "tata-1mg": Tata1mgHome,
    practo: PractoHome,
    apollo247: Apollo247Home,
    pharmeasy: PharmEasyHome,
  };

  const Renderer = renderers[appId];
  if (!Renderer) return <FallbackHome appId={appId} />;
  return <Renderer appId={appId} />;
}

function SpecGrid({ appId, cardClass }) {
  return (
    <div className="themed-spec-grid">
      {specialties.map((spec) => (
        <Link to={`/app/${appId}/chat/${spec.slug}`} key={spec.id} className={`themed-spec-card ${cardClass}`}>
          <span className="spec-icon">{spec.icon}</span>
          <h3>{spec.name}</h3>
          <p>{spec.description}</p>
        </Link>
      ))}
    </div>
  );
}

/* =================== MediBuddy =================== */
function MediBuddyHome({ appId }) {
  const services = [
    { label: "Talk to Doctor", link: `/app/${appId}/doctors`, icon: iconDoctor },
    { label: "Medicine", link: `/app/${appId}/medicines`, icon: iconMedicine },
    { label: "Book Dr.\nAppointment", link: `/app/${appId}/doctors`, icon: iconAppointment },
    { label: "Lab Test &\nPackages", link: `/app/${appId}/lab-tests`, icon: iconLab },
    { label: "Surgery", link: `/app/${appId}/surgery`, icon: iconSurgery },
    { label: "MediBuddy\nGOLD", link: `/app/${appId}/insurance`, icon: iconGold, gold: true },
    { label: "More", link: `/app/${appId}/my-bookings`, icon: iconMore },
  ];

  const surgeries = [
    { label: "Cataract", link: `/app/${appId}/surgery` },
    { label: "Hair Transplant", link: `/app/${appId}/surgery` },
    { label: "Lasik", link: `/app/${appId}/surgery` },
    { label: "Knee", link: `/app/${appId}/surgery` },
    { label: "Hysterectomy", link: `/app/${appId}/surgery` },
    { label: "Tonsillectomy", link: `/app/${appId}/surgery` },
    { label: "Gallstone", link: `/app/${appId}/surgery` },
    { label: "Piles", link: `/app/${appId}/surgery` },
    { label: "Hernia", link: `/app/${appId}/surgery` },
    { label: "Kidney Stones", link: `/app/${appId}/surgery` },
    { label: "Appendix", link: `/app/${appId}/surgery` },
    { label: "Gynecomastia", link: `/app/${appId}/surgery` },
  ];

  return (
    <div className="mb-real-page">
      {/* Hero - Consult AI Doctor */}
      <section className="mb-real-hero">
        <div className="mb-real-hero-card">
          <div>
            <h2>Consult with AI Doctors Online, 24x7</h2>
            <p className="mb-real-hero-sub">Choose a specialty and get instant AI-powered health guidance</p>
          </div>
          <Link to={`/app/${appId}/chat/general-surgery`} className="mb-real-consult-btn">
            Talk to AI Doctor <span className="mb-real-arrow">&rarr;</span>
          </Link>
        </div>
      </section>

      {/* AI Doctor Specialties */}
      <section className="mb-real-ai-section">
        <h2 className="mb-real-section-title">Talk to an AI Doctor — Choose Specialty</h2>
        <p className="mb-real-section-desc">Get instant AI-powered guidance from a specialist. Not a replacement for real doctors.</p>
        <SpecGrid appId={appId} cardClass="medibuddy-card" />
      </section>

      {/* Promo Carousel */}
      <section className="mb-real-promo">
        <div className="mb-real-promo-card">
          <div className="mb-real-promo-content">
            <h3>Get your Medicines in 60 mins!</h3>
            <p>Available in select pin codes. Order now for fast delivery.</p>
            <Link to={`/app/${appId}/medicines`} className="mb-real-promo-btn">ORDER NOW &rsaquo;</Link>
          </div>
        </div>
        <div className="mb-real-promo-card">
          <div className="mb-real-promo-content">
            <h3>Sample Pickup in Just 2 Hrs!</h3>
            <p>Free home sample pickup for lab tests (6 AM - 2 PM)</p>
            <Link to={`/app/${appId}/lab-tests`} className="mb-real-promo-btn">BOOK NOW &rsaquo;</Link>
          </div>
        </div>
      </section>

      {/* Surgery Section */}
      <section className="mb-real-surgery-section">
        <h2 className="mb-real-section-title">Get Cashless Hospitalization Support</h2>
        <div className="mb-real-surgery-grid">
          {surgeries.map((s) => (
            <Link to={s.link} key={s.label} className="mb-real-surgery-tile">
              <div className="mb-real-surgery-icon-circle">
                <span className="mb-real-surgery-initial">{s.label.charAt(0)}</span>
              </div>
              <span>{s.label}</span>
            </Link>
          ))}
          <Link to={`/app/${appId}/surgery`} className="mb-real-surgery-tile mb-real-more-tile">
            <div className="mb-real-surgery-icon-circle">
              <span className="mb-real-surgery-initial">+</span>
            </div>
            <span className="mb-real-more-link">View All</span>
          </Link>
        </div>
      </section>

      {/* Insurance Section */}
      <section className="mb-real-insurance">
        <h2 className="mb-real-section-title">Insurance</h2>
        <p className="mb-real-section-desc">Get access to all your Health insurance services - View Policy, Initiate and Track Claims, Go Cashless with network hospitals and intimate Hospitalization</p>
        <div className="mb-real-insurance-grid">
          <Link to={`/app/${appId}/insurance`} className="mb-real-ins-card">
            <div className="mb-real-ins-top">
              <strong>E-Card</strong>
              <span className="mb-real-ins-arrow">&rarr;</span>
            </div>
            <p>Get e-cards for you and your family members</p>
          </Link>
          <Link to={`/app/${appId}/insurance`} className="mb-real-ins-card">
            <div className="mb-real-ins-top">
              <strong>Claims</strong>
              <span className="mb-real-ins-arrow">&rarr;</span>
            </div>
            <p>Track your claims in real-time</p>
          </Link>
          <Link to={`/app/${appId}/insurance`} className="mb-real-ins-card">
            <div className="mb-real-ins-top">
              <strong>Network Hospitals</strong>
              <span className="mb-real-ins-arrow">&rarr;</span>
            </div>
            <p>Search for the nearest Network hospital to go cashless</p>
          </Link>
          <Link to={`/app/${appId}/insurance`} className="mb-real-ins-card">
            <div className="mb-real-ins-top">
              <strong>Empanel Hospitals</strong>
              <span className="mb-real-ins-arrow">&rarr;</span>
            </div>
            <p>Become a part of Network Hospitals</p>
          </Link>
        </div>
      </section>

      {/* Surgery CTA Banner */}
      <section className="mb-real-cta-banner">
        <div className="mb-real-cta-inner">
          <div className="mb-real-cta-text">
            <h3>Worried about getting your Surgery done?</h3>
            <p>MediBuddy is here to <strong>Simplify</strong> your surgery journey</p>
          </div>
          <Link to={`/app/${appId}/surgery`} className="mb-real-cta-btn">Learn More &rsaquo;</Link>
        </div>
      </section>

    </div>
  );
}

/* =================== Tata 1mg =================== */
function Tata1mgHome({ appId }) {
  const basePath = `/app/${appId}`;

  const concerns = [
    { label: "Diabetes", specialty: "dietitian" },
    { label: "Heart Care", specialty: "cardiologist" },
    { label: "Stomach Care", specialty: "general-surgery" },
    { label: "Liver Care", specialty: "general-surgery" },
    { label: "Bone, Joint & Muscle", specialty: "orthopedics" },
    { label: "Kidney Care", specialty: "general-surgery" },
    { label: "Derma Care", specialty: "dermatologist" },
    { label: "Respiratory", specialty: "ent" },
    { label: "Eye Care", specialty: "neurosurgeon" },
  ];

  const categories = [
    "Vitamins & Supplements", "Nutritional Drinks", "Skin Care",
    "Hair Care", "Sexual Wellness", "Ayurveda Products", "Pain Relief", "Homeopathy"
  ];

  const checkups = [
    { name: "Comprehensive Gold Full Body Checkup", lab: "Tata 1mg Labs", price: "2499", oldPrice: "4998", off: "50% off" },
    { name: "Good Health Silver Package", lab: "Tata 1mg Labs", price: "749", oldPrice: "1498", off: "50% off" },
    { name: "Good Health Gold Package", lab: "Tata 1mg Labs", price: "999", oldPrice: "1998", off: "50% off" },
    { name: "Comprehensive Platinum Checkup", lab: "Tata 1mg Labs", price: "3999", oldPrice: "7998", off: "50% off" },
  ];

  const trustPoints = [
    "India's leading healthcare platform",
    "Genuine products from verified sellers",
    "Easy returns and responsive support",
    "Fast delivery and secure payments",
  ];

  const deals = [
    { title: "Diabetes Essentials", subtitle: "Up to 35% off + extra savings", cta: "Explore", link: `${basePath}/medicines` },
    { title: "Women's Wellness", subtitle: "Curated care products and supplements", cta: "Shop now", link: `${basePath}/medicines` },
    { title: "Heart Health", subtitle: "Doctor consult + medicine follow-up", cta: "Book care", link: `${basePath}/doctors?specialty=cardiologist` },
  ];

  const trendingSearches = [
    "Dolo 650", "Vitamin D3", "Fish Oil", "Protein Powder", "Diabetes Care", "Thyroid Test",
  ];

  const featuredBrands = [
    "Tata 1mg", "Ensure", "Accu-Chek", "Himalaya", "Dabur", "Cetaphil",
  ];

  return (
    <div className="tata1mg-page">
      {/* Banner area */}
      <section className="t1mg-banner reveal-up reveal-delay-1">
        <Link to={`${basePath}/medicines`} className="t1mg-banner-slide">
          <span>Get 25% off on medicines* - Order Now!</span>
        </Link>
      </section>

      <section className="t1mg-section t1mg-trust-strip reveal-up reveal-delay-2">
        {trustPoints.map((point) => (
          <div key={point} className="t1mg-trust-item">{point}</div>
        ))}
      </section>

      <section className="t1mg-section t1mg-journey-grid reveal-up reveal-delay-3">
        <Link to={`${basePath}/medicines`} className="t1mg-journey-card">
          <h3>Order Medicines</h3>
          <p>Authentic medicines and health products with rapid delivery.</p>
          <span>Shop now →</span>
        </Link>
        <Link to={`${basePath}/lab-tests`} className="t1mg-journey-card">
          <h3>Book Lab Tests</h3>
          <p>Home sample collection, NABL partner labs, and digital reports.</p>
          <span>Book test →</span>
        </Link>
        <Link to={`${basePath}/doctors`} className="t1mg-journey-card">
          <h3>Consult Doctors</h3>
          <p>Choose specialists and book appointments in minutes.</p>
          <span>Find doctor →</span>
        </Link>
      </section>

      <section className="t1mg-section t1mg-deal-grid reveal-up reveal-delay-4">
        {deals.map((deal) => (
          <Link to={deal.link} key={deal.title} className="t1mg-deal-card">
            <h3>{deal.title}</h3>
            <p>{deal.subtitle}</p>
            <span>{deal.cta} →</span>
          </Link>
        ))}
      </section>

      {/* Shop by health concerns */}
      <section className="t1mg-section reveal-up reveal-delay-5">
        <h2 className="t1mg-section-title">Shop by health concerns</h2>
        <div className="t1mg-concern-row">
          {concerns.map((c) => (
            <Link to={`${basePath}/doctors?specialty=${c.specialty}`} key={c.label} className="t1mg-concern-chip">
              <div className="t1mg-chip-circle"></div>
              <span>{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Full body health checkups */}
      <section className="t1mg-section reveal-up reveal-delay-6">
        <div className="t1mg-section-header">
          <h2 className="t1mg-section-title">Full body health checkups</h2>
          <Link to={`${basePath}/lab-tests`} className="t1mg-see-all">See all →</Link>
        </div>
        <div className="t1mg-checkup-scroll">
          {checkups.map((pkg) => (
            <Link to={`${basePath}/lab-tests`} className="t1mg-checkup-card" key={pkg.name}>
            <div className="t1mg-card-badge">SAFE</div>
            <h3>{pkg.name}</h3>
            <p className="t1mg-lab-name">{pkg.lab}</p>
            <div className="t1mg-card-price">
              <span className="t1mg-new-price">₹{pkg.price}</span>
              <span className="t1mg-old-price">₹{pkg.oldPrice}</span>
              <span className="t1mg-discount">{pkg.off}</span>
            </div>
          </Link>
          ))}
        </div>
      </section>

      <section className="t1mg-section t1mg-trending reveal-up reveal-delay-6">
        <h2 className="t1mg-section-title">Trending Searches</h2>
        <div className="t1mg-trending-row">
          {trendingSearches.map((item) => (
            <Link to={`${basePath}/medicines`} key={item} className="t1mg-trending-chip">{item}</Link>
          ))}
        </div>
      </section>

      {/* Popular categories */}
      <section className="t1mg-section reveal-up reveal-delay-6">
        <h2 className="t1mg-section-title">Popular categories</h2>
        <div className="t1mg-categories-row">
          {categories.map((cat) => (
            <Link to={`${basePath}/medicines`} className="t1mg-cat-chip" key={cat}>{cat}</Link>
          ))}
        </div>
      </section>

      <section className="t1mg-section t1mg-brand-strip reveal-up reveal-delay-6">
        <h2 className="t1mg-section-title">Featured Brands</h2>
        <div className="t1mg-brand-row">
          {featuredBrands.map((brand) => (
            <Link to={`${basePath}/medicines`} key={brand} className="t1mg-brand-chip">{brand}</Link>
          ))}
        </div>
      </section>

      {/* Consult Doctors */}
      <section className="t1mg-section reveal-up reveal-delay-6">
        <h2 className="t1mg-section-title">Consult a Specialist</h2>
        <SpecGrid appId={appId} cardClass="tata1mg-card" />
      </section>

      <section className="t1mg-section t1mg-feature-actions reveal-up reveal-delay-6">
        <Link to={`${basePath}/medicines`} className="t1mg-feature-pill">Prescription Upload</Link>
        <Link to={`${basePath}/my-bookings`} className="t1mg-feature-pill">Track Orders</Link>
        <Link to={`${basePath}/insurance`} className="t1mg-feature-pill">Manage Care Plan</Link>
      </section>

      <section className="t1mg-section t1mg-app-promo reveal-up reveal-delay-6">
        <div className="t1mg-app-promo-text">
          <h3>Get the Tata 1mg app experience</h3>
          <p>Track orders, reminders, test reports, and consultations in one place.</p>
        </div>
        <div className="t1mg-app-promo-actions">
          <Link to={`${basePath}/my-bookings`} className="t1mg-app-btn">Track Orders</Link>
          <Link to={`${basePath}/lab-tests`} className="t1mg-app-btn t1mg-app-btn-light">Book Lab Test</Link>
        </div>
      </section>

    </div>
  );
}

/* =================== Practo =================== */
function PractoHome({ appId }) {
  const services = [
    { icon: "📹", label: "Instant Video Consult", desc: "Connect within 60 secs", slug: "general-surgery" },
    { icon: "🏥", label: "Find Doctors Near You", desc: "Confirmed appointments", slug: "cardiologist" },
    { icon: "💊", label: "Medicines", desc: "Essentials delivered in 2 hrs", slug: "dietitian" },
    { icon: "🧪", label: "Lab Tests", desc: "Sample pickup at your home", slug: "dermatologist" },
    { icon: "🔪", label: "Surgeries", desc: "Safe and trusted", slug: "orthopedics" },
  ];

  return (
    <div className="themed-page practo-page">
      {/* Header */}
      <header className="pr-topbar">
        <div className="pr-topbar-inner">
          <Link to="/" className="pr-logo-link">
            <span className="pr-logo-mark">+</span>
            <span className="pr-logo-text">practo</span>
          </Link>
          <nav className="pr-nav-links">
            <Link to={`/app/${appId}/chat/general-surgery`}>Find Doctors</Link>
            <Link to={`/app/${appId}/chat/general-surgery`}>Video Consult</Link>
            <Link to={`/app/${appId}/chat/dietitian`}>Medicines</Link>
            <Link to={`/app/${appId}/chat/dermatologist`}>Lab Tests</Link>
            <Link to={`/app/${appId}/chat/orthopedics`}>Surgeries</Link>
            <Link to={`/app/${appId}/chat/general-surgery`}>For Corporates</Link>
          </nav>
          <div className="pr-nav-right">
            <span className="pr-security-tag">🔒 Security & trust</span>
          </div>
        </div>
      </header>

      {/* Hero search section */}
      <section className="pr-hero">
        <div className="pr-hero-inner">
          <h1 className="pr-hero-title">Your home for health</h1>
          <div className="pr-search-box">
            <div className="pr-search-location">
              <span>📍</span>
              <input type="text" placeholder="Bangalore" readOnly />
            </div>
            <div className="pr-search-main">
              <span>🔍</span>
              <input type="text" placeholder="Search doctors, clinics, hospitals, etc." readOnly />
            </div>
          </div>
        </div>
      </section>

      {/* Service cards - 5 icons in a row like Practo */}
      <section className="pr-services-section">
        <div className="pr-services-row">
          {services.map((s) => (
            <Link to={`/app/${appId}/chat/${s.slug}`} key={s.slug} className="pr-svc-card">
              <div className="pr-svc-icon-wrapper">{s.icon}</div>
              <h3>{s.label}</h3>
              <p>{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Book appointment section */}
      <section className="pr-book-section">
        <h2>Book an appointment for an in-clinic consultation</h2>
        <p className="pr-book-subtitle">Find experienced doctors across all specialties</p>
        <SpecGrid appId={appId} cardClass="practo-card" />
      </section>

      {/* Read health articles */}
      <section className="pr-articles">
        <h2>Read top articles from health experts</h2>
        <div className="pr-article-row">
          <Link to={`/app/${appId}/chat/general-surgery`} className="pr-article-card">
            <div className="pr-article-tag">CORONA</div>
            <h3>12 Coronavirus Myths and Facts You Should Be Aware Of</h3>
          </Link>
          <Link to={`/app/${appId}/chat/dietitian`} className="pr-article-card">
            <div className="pr-article-tag">VITAMINS</div>
            <h3>Vitamin D: Sources, Benefits, and Dosage</h3>
          </Link>
          <Link to={`/app/${appId}/chat/dietitian`} className="pr-article-card">
            <div className="pr-article-tag">DIET</div>
            <h3>The Right Diet for Pre-Diabetes Patients</h3>
          </Link>
        </div>
      </section>

      <footer className="pr-footer">
        <div className="pr-footer-top">
          <div className="pr-footer-col">
            <h4>Practo</h4>
            <Link to={`/app/${appId}`}>About</Link><Link to={`/app/${appId}`}>Blog</Link><Link to={`/app/${appId}`}>Careers</Link><Link to={`/app/${appId}`}>Contact Us</Link>
          </div>
          <div className="pr-footer-col">
            <h4>For patients</h4>
            <Link to={`/app/${appId}/chat/general-surgery`}>Search for doctors</Link><Link to={`/app/${appId}/chat/general-surgery`}>Search for clinics</Link><Link to={`/app/${appId}/chat/general-surgery`}>Search for hospitals</Link>
          </div>
          <div className="pr-footer-col">
            <h4>For doctors</h4>
            <Link to={`/app/${appId}`}>Practo Profile</Link><Link to={`/app/${appId}`}>Practo Reach</Link><Link to={`/app/${appId}`}>Practo Drive</Link>
          </div>
        </div>
        <div className="pr-footer-bottom">
          AI Assistant only — not a replacement for real doctors.
        </div>
      </footer>
    </div>
  );
}

/* =================== Apollo 24|7 =================== */
function Apollo247Home({ appId }) {
  const navItems = [
    { icon: "💊", label: "Buy Medicines\n& Essentials", slug: "dietitian" },
    { icon: "👨‍⚕️", label: "Doctor\nAppointment", slug: "general-surgery" },
    { icon: "🧪", label: "Lab Tests", slug: "dermatologist" },
    { icon: "🛡️", label: "Health\nInsurance", slug: "cardiologist" },
  ];

  const topTests = [
    { name: "CBC Test (Complete Blood Count)", tests: "30 Tests Included", price: "₹439", old: "₹1098", off: "60% off" },
    { name: "HbA1c Test (Hemoglobin A1c)", tests: "3 Tests Included", price: "₹659", old: "₹1647", off: "60% off" },
    { name: "FBS (Fasting Blood Sugar) Test", tests: "1 Test Included", price: "₹99", old: "₹248", off: "60% off" },
    { name: "Lipid Profile Test", tests: "8 Tests Included", price: "₹849", old: "₹2122", off: "60% off" },
  ];

  const categories = [
    "Health Monitors", "Ayurvedic Diabetes Care", "Pain Relief", "Baby Care",
    "Nutritional Drinks", "Adult Diapers", "Vitamins & Minerals", "Protein Powders",
  ];

  return (
    <div className="themed-page apollo-page">
      {/* Top Bar */}
      <header className="ap-topbar">
        <div className="ap-topbar-inner">
          <Link to={`/app/${appId}/chat/general-surgery`} className="ap-desc">Online Doctor Consultation & Medicines</Link>
          <Link to={`/app/${appId}/chat/general-surgery`} className="ap-login-link">Login</Link>
        </div>
      </header>

      {/* Main Nav */}
      <nav className="ap-main-nav">
        <Link to="/" className="ap-logo-link">
          <span className="ap-logo-icon">⚕️</span>
          <span className="ap-logo-text">Apollo 24|7</span>
        </Link>
        <div className="ap-nav-links">
          <Link to={`/app/${appId}/chat/dietitian`}>Buy Medicines</Link>
          <Link to={`/app/${appId}/chat/general-surgery`}>Find Doctors</Link>
          <Link to={`/app/${appId}/chat/dermatologist`}>Lab Tests</Link>
          <Link to={`/app/${appId}/chat/cardiologist`} className="ap-circle-link">Circle Membership</Link>
          <Link to={`/app/${appId}/chat/general-surgery`}>Health Records</Link>
          <Link to={`/app/${appId}/chat/cardiologist`} className="ap-new-badge">Credit Card <sup>New</sup></Link>
          <Link to={`/app/${appId}/chat/cardiologist`} className="ap-new-badge">Buy Insurance <sup>New</sup></Link>
        </div>
      </nav>

      {/* Service Navigator - the iconic 4-icon row */}
      <section className="ap-navigator-section">
        <div className="ap-navigator-row">
          {navItems.map((item) => (
            <Link to={`/app/${appId}/chat/${item.slug}`} key={item.slug} className="ap-nav-tile">
              <div className="ap-nav-tile-icon">{item.icon}</div>
              <span className="ap-nav-tile-label">{item.label.split('\n').map((l, i) => <span key={i}>{l}<br/></span>)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Shop By Category */}
      <section className="ap-section">
        <div className="ap-section-header">
          <h2>Shop By Category<span className="ap-count">(12)</span></h2>
        </div>
        <div className="ap-category-row">
          {categories.map((cat) => (
            <Link to={`/app/${appId}/chat/${cat.includes('Pain') ? 'physiotherapy' : cat.includes('Baby') ? 'pediatrician' : cat.includes('Diabetes') ? 'dietitian' : cat.includes('Ayurvedic') ? 'general-surgery' : cat.includes('Vitamin') || cat.includes('Protein') || cat.includes('Nutritional') ? 'dietitian' : cat.includes('Health') ? 'cardiologist' : 'general-surgery'}`} key={cat} className="ap-category-chip">{cat}</Link>
          ))}
        </div>
      </section>

      {/* Top Booked Tests */}
      <section className="ap-section">
        <div className="ap-section-header">
          <h2>Top Booked Tests<span className="ap-count">(41)</span></h2>
          <Link to={`/app/${appId}/chat/dermatologist`} className="ap-view-all">View All</Link>
        </div>
        <div className="ap-tests-scroll">
          {topTests.map((test) => (
            <Link to={`/app/${appId}/chat/dermatologist`} key={test.name} className="ap-test-card">
              <h3>{test.name}</h3>
              <p className="ap-test-meta">{test.tests}</p>
              <div className="ap-test-price">
                <span className="ap-price-new">{test.price}</span>
                <span className="ap-price-old">({test.old})</span>
                <span className="ap-price-off">{test.off}</span>
              </div>
              <span className="ap-add-btn">Add</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Circle banner */}
      <section className="ap-circle-banner">
        <div className="ap-circle-inner">
          <div className="ap-circle-left">
            <h2>Apollo Circle Membership</h2>
            <p>Priority access to Apollo's best doctors, free delivery, and exclusive health programs</p>
            <Link to={`/app/${appId}/chat/cardiologist`} className="ap-circle-cta">Explore Now →</Link>
          </div>
          <div className="ap-circle-right">
            <div className="ap-trust-badge">Trusted by<br/><strong>8 Crore</strong><br/>Indians</div>
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="ap-section">
        <h2>Top Specialties</h2>
        <SpecGrid appId={appId} cardClass="apollo-card" />
      </section>

      {/* Trust badges */}
      <section className="ap-trust-section">
        <div className="ap-trust-item">
          <span>🔒</span><strong>Secure Payment</strong>
        </div>
        <div className="ap-trust-item">
          <span>👥</span><strong>Trusted by 8 Crore Indians</strong>
        </div>
        <div className="ap-trust-item">
          <span>✅</span><strong>Genuine Products</strong>
        </div>
      </section>

      <footer className="ap-footer">
        <div className="ap-footer-cols">
          <div className="ap-footer-col">
            <h4>About Apollo 247</h4>
            <Link to={`/app/${appId}`}>About Us</Link><Link to={`/app/${appId}`}>Contact Us</Link><Link to={`/app/${appId}`}>FAQs</Link><Link to={`/app/${appId}`}>Terms</Link>
          </div>
          <div className="ap-footer-col">
            <h4>Services</h4>
            <Link to={`/app/${appId}/chat/general-surgery`}>Online Doctor Consultation</Link><Link to={`/app/${appId}/chat/cardiologist`}>Apollo Circle</Link><Link to={`/app/${appId}/chat/dietitian`}>Medicines</Link>
          </div>
          <div className="ap-footer-col">
            <h4>Top Specialties</h4>
            <Link to={`/app/${appId}/chat/dermatologist`}>Dermatology</Link><Link to={`/app/${appId}/chat/pediatrician`}>Paediatrics</Link><Link to={`/app/${appId}/chat/psychiatrist`}>Psychiatry</Link><Link to={`/app/${appId}/chat/cardiologist`}>Cardiology</Link>
          </div>
        </div>
        <div className="ap-footer-bottom">
          AI Assistant only — not a replacement for real doctors. | Apollo Hospitals Est. 1983
        </div>
      </footer>
    </div>
  );
}

/* =================== PharmEasy =================== */
function PharmEasyHome({ appId }) {
  const offerings = [
    { icon: "💊", label: "Medicine", tag: "SAVE 27%", slug: "general-surgery" },
    { icon: "🧪", label: "Lab Tests", tag: "BUY 1 GET 1", slug: "dermatologist" },
    { icon: "👨‍⚕️", label: "Doctor Consult", tag: "FROM ₹199", slug: "cardiologist" },
    { icon: "💎", label: "Branded Substitute", tag: "UPTO 50% OFF", slug: "general-surgery" },
    { icon: "🏷️", label: "Healthcare", tag: "UPTO 60% OFF", slug: "physiotherapy" },
    { icon: "📰", label: "Health Blogs", tag: "", slug: "psychiatrist" },
    { icon: "⭐", label: "PLUS", tag: "Save 5% Extra", slug: "dietitian" },
    { icon: "🎁", label: "Offers", tag: "", slug: "general-surgery" },
    { icon: "🏪", label: "Value Store", tag: "UPTO 50% OFF", slug: "physiotherapy" },
  ];

  const labConcerns = [
    { label: "Health Checkups", slug: "dermatologist" },
    { label: "Vitamins", slug: "dietitian" },
    { label: "Diabetes Tests", slug: "dietitian" },
    { label: "Women Care", slug: "gynecologist" },
    { label: "Fever Infection", slug: "ent" },
    { label: "Thyroid", slug: "general-surgery" },
    { label: "Heart", slug: "cardiologist" },
    { label: "Allergy", slug: "dermatologist" },
  ];

  const labTests = [
    { name: "Healthy 2026 Full Body Checkup", desc: "Diagnostic tool for screening", price: "₹1649", old: "₹3599", off: "54% OFF" },
    { name: "Diabetes Care", desc: "Preventive care for diabetics", price: "₹849", old: "₹1399", off: "39% OFF" },
    { name: "Basic Health Checkup", desc: "47 essential body parameters", price: "₹1049", old: "₹2249", off: "53% OFF" },
  ];

  const shopCategories = [
    "Must Haves", "Vitamin Store", "Sexual Wellness", "Personal Care",
    "Health Food & Drinks", "Diabetes Essentials", "Ayurvedic Care", "Mother & Baby"
  ];

  return (
    <div className="themed-page pharmeasy-page">
      {/* Top delivery bar */}
      <div className="pe-delivery-bar">
        <span>🚚 Express delivery to <strong>400001</strong> Mumbai</span>
        <div className="pe-bar-right">
          <Link to={`/app/${appId}/chat/general-surgery`}>Offers</Link>
          <Link to={`/app/${appId}/chat/dietitian`}>🛒 Cart</Link>
        </div>
      </div>

      {/* Main header */}
      <header className="pe-header">
        <Link to="/" className="pe-logo-link">
          <span className="pe-logo-icon">💚</span>
          <span className="pe-logo-text">PharmEasy</span>
        </Link>
        <div className="pe-search-area">
          <span className="pe-search-icon">🔍</span>
          <input type="text" placeholder="What are you looking for?" readOnly />
        </div>
        <div className="pe-header-right">
          <Link to={`/app/${appId}/chat/general-surgery`} className="pe-upload-btn">
            📋 Order with prescription. <strong>UPLOAD NOW</strong>
          </Link>
        </div>
      </header>

      {/* Discover Our Offerings - the main grid */}
      <section className="pe-section">
        <h2 className="pe-section-title">Discover Our Offerings</h2>
        <div className="pe-offerings-grid">
          {offerings.map((o) => (
            <Link to={`/app/${appId}/chat/${o.slug}`} key={o.label} className="pe-offering-tile">
              <div className="pe-tile-icon">{o.icon}</div>
              <span className="pe-tile-label">{o.label}</span>
              {o.tag && <span className="pe-tile-tag">{o.tag}</span>}
            </Link>
          ))}
        </div>
      </section>

      {/* Lab Tests by Health Concern */}
      <section className="pe-section">
        <div className="pe-section-row">
          <h2 className="pe-section-title">Lab Tests by Health Concern</h2>
          <span className="pe-powered">Powered by Thyrocare</span>
        </div>
        <div className="pe-concern-row">
          {labConcerns.map((c) => (
            <Link to={`/app/${appId}/chat/${c.slug}`} key={c.label} className="pe-concern-chip">
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Upload Prescription */}
      <section className="pe-prescription-banner">
        <div className="pe-presc-left">
          <h3>Order with Prescription</h3>
          <p>Upload prescription and we will deliver your medicines</p>
          <Link to={`/app/${appId}/chat/general-surgery`} className="pe-presc-upload-btn">Upload</Link>
        </div>
        <div className="pe-presc-right">📋</div>
      </section>

      {/* Shop by Category */}
      <section className="pe-section">
        <h2 className="pe-section-title">Shop by Category</h2>
        <div className="pe-cat-row">
          <Link to={`/app/${appId}/chat/general-surgery`} className="pe-cat-chip">Must Haves</Link>
          <Link to={`/app/${appId}/chat/dietitian`} className="pe-cat-chip">Vitamin Store</Link>
          <Link to={`/app/${appId}/chat/gynecologist`} className="pe-cat-chip">Sexual Wellness</Link>
          <Link to={`/app/${appId}/chat/dermatologist`} className="pe-cat-chip">Personal Care</Link>
          <Link to={`/app/${appId}/chat/dietitian`} className="pe-cat-chip">Health Food & Drinks</Link>
          <Link to={`/app/${appId}/chat/dietitian`} className="pe-cat-chip">Diabetes Essentials</Link>
          <Link to={`/app/${appId}/chat/general-surgery`} className="pe-cat-chip">Ayurvedic Care</Link>
          <Link to={`/app/${appId}/chat/pediatrician`} className="pe-cat-chip">Mother & Baby</Link>
        </div>
      </section>

      {/* Frequently Booked Lab Tests */}
      <section className="pe-section">
        <div className="pe-section-row">
          <h2 className="pe-section-title">Frequently Booked Lab Tests</h2>
          <Link to={`/app/${appId}/chat/dermatologist`} className="pe-view-all">View All</Link>
        </div>
        <div className="pe-lab-cards">
          {labTests.map((t) => (
            <Link to={`/app/${appId}/chat/dermatologist`} key={t.name} className="pe-lab-card">
              <span className="pe-lab-off">{t.off}</span>
              <h3>{t.name}</h3>
              <p>{t.desc}</p>
              <div className="pe-lab-price">
                <span className="pe-lab-new">{t.price}</span>
                <span className="pe-lab-old">{t.old}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Plus membership */}
      <section className="pe-plus-banner">
        <div className="pe-plus-inner">
          <span className="pe-plus-text">Become a <strong>Plus member</strong> And enjoy extra bachat on every order</span>
          <Link to={`/app/${appId}/chat/dietitian`} className="pe-plus-cta">Explore Now →</Link>
        </div>
      </section>

      {/* Consult Specialists */}
      <section className="pe-section">
        <h2 className="pe-section-title">Consult a Specialist</h2>
        <SpecGrid appId={appId} cardClass="pharmeasy-card" />
      </section>

      {/* Why Choose Us */}
      <section className="pe-why-section">
        <h2>Why Choose Us?</h2>
        <div className="pe-stats-row">
          <div className="pe-stat-card">
            <span className="pe-stat-icon">👨‍👩‍👧‍👦</span>
            <strong>51 Million+</strong>
            <p>Registered users as of Aug 18, 2025</p>
          </div>
          <div className="pe-stat-card">
            <span className="pe-stat-icon">🚚</span>
            <strong>71 Million+</strong>
            <p>Orders on PharmEasy till date</p>
          </div>
          <div className="pe-stat-card">
            <span className="pe-stat-icon">📦</span>
            <strong>60000+</strong>
            <p>Unique items sold last 6 months</p>
          </div>
          <div className="pe-stat-card">
            <span className="pe-stat-icon">📍</span>
            <strong>19000+</strong>
            <p>Pin codes serviced last 3 months</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pe-footer">
        <div className="pe-footer-cols">
          <div className="pe-footer-col">
            <h4>Company</h4>
            <Link to={`/app/${appId}`}>About Us</Link><Link to={`/app/${appId}`}>Careers</Link><Link to={`/app/${appId}`}>Blog</Link><Link to={`/app/${appId}`}>Partner with PharmEasy</Link>
          </div>
          <div className="pe-footer-col">
            <h4>Our Services</h4>
            <Link to={`/app/${appId}/chat/dietitian`}>Order Medicine</Link><Link to={`/app/${appId}/chat/physiotherapy`}>Healthcare Products</Link><Link to={`/app/${appId}/chat/dermatologist`}>Lab Tests</Link>
          </div>
          <div className="pe-footer-col">
            <h4>Featured Categories</h4>
            <Link to={`/app/${appId}/chat/general-surgery`}>Must Haves</Link><Link to={`/app/${appId}/chat/dietitian`}>Vitamin Store</Link><Link to={`/app/${appId}/chat/dermatologist`}>Personal Care</Link>
          </div>
        </div>
        <div className="pe-footer-bottom">
          <Link to={`/app/${appId}/chat/general-surgery`}>📱 ORDER ON WHATSAPP</Link>
          <span>AI Assistant only — not a replacement for real doctors. © 2026 PharmEasy</span>
        </div>
      </footer>
    </div>
  );
}

/* =================== Fallback =================== */
function FallbackHome({ appId }) {
  return (
    <div className="themed-page">
      <h1>App "{appId}" not found</h1>
      <Link to="/">← Back to App Selection</Link>
    </div>
  );
}
