import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getSurgeries } from "../../services/api";
import surgeryPlaceholder from "../../assets/medibuddy/icon-surgery.svg";

export default function SurgeryListing() {
  const { appId = "medibuddy" } = useParams();
  const [surgeries, setSurgeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getSurgeries();
        setSurgeries(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="mb-loading">Loading surgeries...</div>;

  return (
    <div className="mb-surgery-page">
      <div className="mb-page-header">
        <h1>🏥 Surgery Care</h1>
        <p>Expert surgical care with experienced specialists</p>
      </div>

      <div className="mb-surgery-grid">
        {surgeries.map((surg) => (
          <div key={surg.id} className="mb-surgery-card">
            <img
              className="mb-surgery-image"
              src={surg.image || surgeryPlaceholder}
              alt={surg.name}
              onError={(e) => {
                e.currentTarget.src = surgeryPlaceholder;
              }}
            />
            <h3>{surg.name}</h3>
            <p className="mb-surgery-desc">{surg.description}</p>
            <div className="mb-surgery-meta">
              <span>Recovery: ~{surg.recovery_days} days</span>
              <span>&#8377;{(surg.cost_min / 1000).toFixed(0)}K - &#8377;{(surg.cost_max / 1000).toFixed(0)}K</span>
            </div>
            <div className="mb-surgery-actions">
              <Link
                to={`/app/${appId}/doctors?specialty=${surg.specialist_slug}`}
                className="mb-btn-primary"
              >
                Book Consultation
              </Link>
              <Link
                to={`/app/${appId}/chat/${surg.specialist_slug}?context=surgery&name=${encodeURIComponent(surg.name)}`}
                className="mb-btn-secondary"
              >
                Ask AI about this
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
