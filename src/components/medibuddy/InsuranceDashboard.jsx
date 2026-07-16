import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const MOCK_ECARD = {
  policyNumber: "MB-2026-4821-7739",
  memberName: "Demo User",
  companyName: "TechCorp Solutions Pvt. Ltd.",
  validFrom: "01 Jan 2026",
  validTo: "31 Dec 2026",
  sumInsured: "₹5,00,000",
  coverType: "Family Floater",
  members: ["Demo User", "Spouse", "Child 1"],
};

const MOCK_CLAIMS = [
  { id: "CLM-001", date: "15 Mar 2026", hospital: "Apollo Hospital", amount: "₹12,450", status: "approved" },
  { id: "CLM-002", date: "28 Apr 2026", hospital: "Fortis Healthcare", amount: "₹8,200", status: "approved" },
  { id: "CLM-003", date: "10 May 2026", hospital: "Max Hospital", amount: "₹45,000", status: "pending" },
  { id: "CLM-004", date: "22 May 2026", hospital: "Manipal Hospital", amount: "₹3,500", status: "rejected" },
];

const MOCK_HOSPITALS = [
  { name: "Apollo Hospital", city: "Bangalore", specialties: "Multi-specialty", beds: 500, phone: "080-26304050" },
  { name: "Fortis Hospital", city: "Delhi", specialties: "Cardiology, Orthopedics", beds: 300, phone: "011-42776222" },
  { name: "Max Hospital", city: "Mumbai", specialties: "Oncology, Neurology", beds: 400, phone: "022-26571234" },
  { name: "Manipal Hospital", city: "Bangalore", specialties: "Multi-specialty", beds: 600, phone: "080-25024444" },
  { name: "Narayana Health", city: "Bangalore", specialties: "Cardiology, Cardiac Surgery", beds: 350, phone: "080-71222222" },
  { name: "Columbia Asia", city: "Bangalore", specialties: "Multi-specialty", beds: 150, phone: "080-71171717" },
  { name: "Medanta Hospital", city: "Gurgaon", specialties: "Multi-specialty", beds: 800, phone: "0124-4141414" },
  { name: "KIMS Hospital", city: "Hyderabad", specialties: "Multi-specialty", beds: 450, phone: "040-44885000" },
];

export default function InsuranceDashboard() {
  const { appId = "medibuddy" } = useParams();
  const [activeTab, setActiveTab] = useState("ecard");

  const tabs = [
    { id: "ecard", label: "E-Card" },
    { id: "claims", label: "Claims" },
    { id: "network", label: "Network Hospitals" },
    { id: "empanel", label: "Empanel" },
  ];

  return (
    <div className="mb-insurance-page">
      <div className="mb-page-header">
        <h1>Insurance Services</h1>
        <p>Manage your health insurance in one place</p>
      </div>

      <div className="mb-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`mb-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-tab-content">
        {activeTab === "ecard" && (
          <div className="mb-ecard-section">
            <div className="mb-ecard">
              <div className="mb-ecard-header">
                <span className="mb-ecard-logo">MediBuddy</span>
                <span className="mb-ecard-type">{MOCK_ECARD.coverType}</span>
              </div>
              <div className="mb-ecard-body">
                <div className="mb-ecard-row">
                  <label>Policy Number</label>
                  <strong>{MOCK_ECARD.policyNumber}</strong>
                </div>
                <div className="mb-ecard-row">
                  <label>Member Name</label>
                  <strong>{MOCK_ECARD.memberName}</strong>
                </div>
                <div className="mb-ecard-row">
                  <label>Company</label>
                  <strong>{MOCK_ECARD.companyName}</strong>
                </div>
                <div className="mb-ecard-row">
                  <label>Sum Insured</label>
                  <strong className="mb-ecard-amount">{MOCK_ECARD.sumInsured}</strong>
                </div>
                <div className="mb-ecard-row">
                  <label>Validity</label>
                  <strong>{MOCK_ECARD.validFrom} — {MOCK_ECARD.validTo}</strong>
                </div>
                <div className="mb-ecard-row">
                  <label>Members Covered</label>
                  <strong>{MOCK_ECARD.members.join(", ")}</strong>
                </div>
              </div>
            </div>
            <Link to={`/app/${appId}/chat/cardiologist?context=insurance&topic=coverage`} className="mb-btn-secondary">
              Ask AI about your coverage
            </Link>
          </div>
        )}

        {activeTab === "claims" && (
          <div className="mb-claims-section">
            <div className="mb-claims-list">
              {MOCK_CLAIMS.map((claim) => (
                <div key={claim.id} className="mb-claim-card">
                  <div className="mb-claim-info">
                    <h4>{claim.hospital}</h4>
                    <p>{claim.date} • Claim ID: {claim.id}</p>
                  </div>
                  <div className="mb-claim-right">
                    <span className="mb-claim-amount">{claim.amount}</span>
                    <span className={`mb-claim-status mb-status-${claim.status}`}>{claim.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link to={`/app/${appId}/chat/general-surgery?context=insurance&topic=claims`} className="mb-btn-secondary">
              Ask AI about claims process
            </Link>
          </div>
        )}

        {activeTab === "network" && (
          <div className="mb-hospitals-section">
            <div className="mb-hospitals-list">
              {MOCK_HOSPITALS.map((h) => (
                <div key={h.name} className="mb-hospital-card">
                  <div className="mb-hospital-info">
                    <h4>{h.name}</h4>
                    <p>{h.city} &bull; {h.specialties}</p>
                    <p>{h.beds} beds &bull; {h.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "empanel" && (
          <div className="mb-empanel-section">
            <div className="mb-empanel-info">
              <h3>Hospital Empanelment</h3>
              <p>Want your hospital to join the MediBuddy network? Apply for empanelment.</p>
              <div className="mb-empanel-steps">
                <div className="mb-step">
                  <span className="mb-step-num">1</span>
                  <span>Submit Application</span>
                </div>
                <div className="mb-step">
                  <span className="mb-step-num">2</span>
                  <span>Verification & Audit</span>
                </div>
                <div className="mb-step">
                  <span className="mb-step-num">3</span>
                  <span>Agreement & Onboarding</span>
                </div>
              </div>
              <Link to={`/app/${appId}/chat/general-surgery?context=insurance&topic=empanelment`} className="mb-btn-primary">
                Enquire with AI Assistant
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
