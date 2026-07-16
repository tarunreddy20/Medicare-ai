import { useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getDoctors, getOrCreateUserId } from "../../services/api";
import doctorPlaceholder from "../../assets/medibuddy/doctor-placeholder.svg";

export default function DoctorListing() {
  const { appId = "medibuddy" } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [specialty, setSpecialty] = useState(searchParams.get("specialty") || "");
  const [search, setSearch] = useState("");

  const specialties = [
    { slug: "", label: "All Specialties" },
    { slug: "cardiologist", label: "Cardiologist" },
    { slug: "dermatologist", label: "Dermatologist" },
    { slug: "orthopedics", label: "Orthopedics" },
    { slug: "general-surgery", label: "General Surgery" },
    { slug: "gynecologist", label: "Gynecologist" },
    { slug: "neurosurgeon", label: "Neurosurgeon" },
    { slug: "pediatrician", label: "Pediatrician" },
    { slug: "psychiatrist", label: "Psychiatrist" },
    { slug: "ent", label: "ENT Specialist" },
    { slug: "dentist", label: "Dentist" },
    { slug: "dietitian", label: "Dietitian" },
    { slug: "physiotherapy", label: "Physiotherapy" },
  ];

  useEffect(() => {
    fetchDoctors();
  }, [specialty]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (specialty) filters.specialty = specialty;
      if (search) filters.search = search;
      const data = await getDoctors(filters);
      setDoctors(data);
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  return (
    <div className="mb-doctor-listing">
      <div className="mb-page-header">
        <h1>Find Doctors</h1>
        <p>Book appointments with top-rated specialists</p>
      </div>

      <div className="mb-filters-bar">
        <form onSubmit={handleSearch} className="mb-search-form">
          <input
            type="text"
            placeholder="Search by doctor name or hospital..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-search-input"
          />
          <button type="submit" className="mb-search-btn">Search</button>
        </form>
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="mb-filter-select"
        >
          {specialties.map((s) => (
            <option key={s.slug} value={s.slug}>{s.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="mb-doctor-grid mb-skeleton-grid">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="mb-doctor-card mb-skeleton-card">
              <div className="mb-doctor-avatar mb-skeleton-block mb-skeleton-avatar" />
              <div className="mb-doctor-info">
                <div className="mb-skeleton-line mb-skeleton-line-title" />
                <div className="mb-skeleton-line mb-skeleton-line-mid" />
                <div className="mb-skeleton-line mb-skeleton-line-short" />
                <div className="mb-skeleton-line mb-skeleton-line-mid" />
              </div>
              <div className="mb-doctor-actions">
                <div className="mb-skeleton-line mb-skeleton-btn" />
                <div className="mb-skeleton-line mb-skeleton-btn" />
              </div>
            </div>
          ))}
        </div>
      ) : doctors.length === 0 ? (
        <div className="mb-empty">No doctors found. Try a different filter.</div>
      ) : (
        <div className="mb-doctor-grid">
          {doctors.map((doc) => (
            <div key={doc.id} className="mb-doctor-card">
              <div className="mb-doctor-avatar">
                <img
                  src={doc.image || doctorPlaceholder}
                  alt={doc.name}
                  onError={(e) => {
                    e.currentTarget.src = doctorPlaceholder;
                  }}
                />
              </div>
              <div className="mb-doctor-info">
                <h3>{doc.name}</h3>
                <p className="mb-doctor-specialty">{doc.specialty.replace("-", " ")}</p>
                <p className="mb-doctor-hospital">{doc.hospital}, {doc.city}</p>
                <div className="mb-doctor-meta">
                  <span className="mb-doctor-exp">{doc.experience} yrs exp</span>
                  <span className="mb-doctor-rating">&#9733; {doc.rating}</span>
                </div>
                <p className="mb-doctor-fee">&#8377;{doc.fee} consultation fee</p>
              </div>
              <div className="mb-doctor-actions">
                <Link to={`/app/${appId}/doctors/${doc.id}/book`} className="mb-btn-primary">
                  Book Appointment
                </Link>
                <Link
                  to={`/app/${appId}/chat/${doc.specialty}?context=doctor&name=${encodeURIComponent(doc.name)}`}
                  className="mb-btn-secondary"
                >
                  Ask AI
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
