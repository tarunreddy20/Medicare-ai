import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getLabTests, getOrCreateUserId } from "../../services/api";

export default function LabTests() {
  const { appId = "medibuddy" } = useParams();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getLabTests();
        setTests(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    })();
  }, []);

  const discount = (t) => Math.round(((t.price - t.discounted_price) / t.price) * 100);

  if (loading) {
    return (
      <div className="mb-lab-tests-page">
        <div className="mb-page-header">
          <h1>Lab Tests & Health Packages</h1>
          <p>Book tests with free home sample collection</p>
        </div>
        <div className="mb-lab-grid mb-skeleton-grid">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="mb-lab-card mb-skeleton-card">
              <div className="mb-skeleton-line mb-skeleton-line-title" />
              <div className="mb-skeleton-line mb-skeleton-line-mid" />
              <div className="mb-skeleton-line mb-skeleton-line-short" />
              <div className="mb-skeleton-line mb-skeleton-line-mid" />
              <div className="mb-skeleton-line mb-skeleton-btn" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-lab-tests-page">
      <div className="mb-page-header">
        <h1>Lab Tests & Health Packages</h1>
        <p>Book tests with free home sample collection</p>
      </div>

      <div className="mb-lab-grid">
        {tests.map((test) => (
          <div key={test.id} className="mb-lab-card">
            <div className="mb-lab-card-header">
              <h3>{test.name}</h3>
              <span className="mb-lab-discount">{discount(test)}% OFF</span>
            </div>
            <p className="mb-lab-desc">{test.description}</p>
            <div className="mb-lab-meta">
              <span>Sample: {test.sample_type}</span>
              <span>⏱️ Report in {test.report_time}</span>
              <span>{test.tests_included.length} tests included</span>
            </div>

            {expanded === test.id && (
              <div className="mb-lab-details">
                <h4>Tests Included:</h4>
                <ul>
                  {test.tests_included.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <p className="mb-lab-prep"><strong>Preparation:</strong> {test.preparation}</p>
              </div>
            )}

            <div className="mb-lab-pricing">
              <div className="mb-lab-prices">
                <span className="mb-lab-new-price">₹{test.discounted_price}</span>
                <span className="mb-lab-old-price">₹{test.price}</span>
              </div>
              <button
                className="mb-btn-link"
                onClick={() => setExpanded(expanded === test.id ? null : test.id)}
              >
                {expanded === test.id ? "Hide Details ▲" : "View Details ▼"}
              </button>
            </div>

            <div className="mb-lab-actions">
              <Link to={`/app/${appId}/lab-tests/${test.id}/book`} className="mb-btn-primary">
                Book Now
              </Link>
              <Link
                to={`/app/${appId}/chat/dermatologist?context=labtest&test=${encodeURIComponent(test.name)}`}
                className="mb-btn-secondary"
              >
                Need Guidance?
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
