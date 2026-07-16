import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getMedicines, addToCart, getOrCreateUserId } from "../../services/api";
import medicinePlaceholder from "../../assets/medibuddy/medicine-placeholder.svg";

export default function MedicineCatalog() {
  const { appId = "medibuddy" } = useParams();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [addedItems, setAddedItems] = useState({});
  const userId = getOrCreateUserId();

  const categories = [
    "All", "Pain Relief", "Vitamins", "Antibiotics", "Allergy",
    "Digestive Health", "Diabetes", "Heart & BP", "Respiratory",
    "First Aid", "Ayurvedic", "Thyroid"
  ];

  useEffect(() => {
    fetchMedicines();
  }, [category]);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (category && category !== "All") filters.category = category;
      if (search) filters.search = search;
      const data = await getMedicines(filters);
      setMedicines(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMedicines();
  };

  const handleAddToCart = async (med) => {
    try {
      await addToCart(userId, med.id, "medicine", 1);
      setAddedItems((prev) => ({ ...prev, [med.id]: true }));
      setTimeout(() => setAddedItems((prev) => ({ ...prev, [med.id]: false })), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const discount = (med) => Math.round(((med.price - med.discounted_price) / med.price) * 100);

  return (
    <div className="mb-medicine-catalog">
      <div className="mb-page-header">
        <h1>💊 Medicines & Health Products</h1>
        <p>Get genuine medicines delivered to your doorstep</p>
      </div>

      <div className="mb-filters-bar">
        <form onSubmit={handleSearch} className="mb-search-form">
          <input
            type="text"
            placeholder="Search medicines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-search-input"
          />
          <button type="submit" className="mb-search-btn">Search</button>
        </form>
      </div>

      <div className="mb-catalog-layout">
        <aside className="mb-category-sidebar">
          <h3>Categories</h3>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`mb-cat-btn ${category === cat || (cat === "All" && !category) ? "active" : ""}`}
              onClick={() => setCategory(cat === "All" ? "" : cat)}
            >
              {cat}
            </button>
          ))}
        </aside>

        <div className="mb-medicine-grid">
          {loading ? (
            [...Array(8)].map((_, idx) => (
              <div key={idx} className="mb-medicine-card mb-skeleton-card">
                <div className="mb-med-image mb-skeleton-block" />
                <div className="mb-skeleton-line mb-skeleton-line-title" />
                <div className="mb-skeleton-line mb-skeleton-line-short" />
                <div className="mb-skeleton-line mb-skeleton-line-mid" />
                <div className="mb-skeleton-line mb-skeleton-line-mid" />
                <div className="mb-med-actions">
                  <div className="mb-skeleton-line mb-skeleton-btn" />
                </div>
              </div>
            ))
          ) : medicines.length === 0 ? (
            <div className="mb-empty">No medicines found.</div>
          ) : (
            medicines.map((med) => (
              <div key={med.id} className="mb-medicine-card">
                <img
                  className="mb-med-image"
                  src={med.image || medicinePlaceholder}
                  alt={med.name}
                  onError={(e) => {
                    e.currentTarget.src = medicinePlaceholder;
                  }}
                />
                {med.requires_prescription && (
                  <span className="mb-rx-badge">&#8478; Prescription</span>
                )}
                <h3>{med.name}</h3>
                <p className="mb-med-mfr">{med.manufacturer}</p>
                <p className="mb-med-desc">{med.description}</p>
                <div className="mb-med-pricing">
                  <span className="mb-med-price">&#8377;{med.discounted_price}</span>
                  <span className="mb-med-original">&#8377;{med.price}</span>
                  <span className="mb-med-discount">{discount(med)}% OFF</span>
                </div>
                <div className="mb-med-actions">
                  <button
                    className={`mb-btn-primary ${addedItems[med.id] ? "added" : ""}`}
                    onClick={() => handleAddToCart(med)}
                    disabled={addedItems[med.id]}
                  >
                    {addedItems[med.id] ? "Added" : "Add to Cart"}
                  </button>
                  <Link
                    to={`/app/${appId}/chat/dietitian?context=medicine&item=${encodeURIComponent(med.name)}`}
                    className="mb-btn-link"
                  >
                    Ask AI
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mb-cart-float">
        <Link to={`/app/${appId}/cart`} className="mb-btn-primary">
          Go to Cart
        </Link>
      </div>
    </div>
  );
}
