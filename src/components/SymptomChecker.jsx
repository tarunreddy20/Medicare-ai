import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import specialties from "../data/specialties";
import { FaArrowRight, FaArrowLeft, FaCheckCircle } from "react-icons/fa";

const BODY_AREAS = [
  { id: "head", label: "Head & Neck", specs: ["neurologist", "ent-specialist"] },
  { id: "chest", label: "Chest & Heart", specs: ["cardiologist", "pulmonologist"] },
  { id: "stomach", label: "Stomach & Digestive", specs: ["gastroenterologist"] },
  { id: "bones", label: "Bones & Joints", specs: ["orthopedic"] },
  { id: "skin", label: "Skin & Hair", specs: ["dermatologist"] },
  { id: "mental", label: "Mind & Emotions", specs: ["psychiatrist"] },
  { id: "teeth", label: "Teeth & Mouth", specs: ["dentist"] },
  { id: "pregnancy", label: "Pregnancy & Women's Health", specs: ["obstetrician"] },
  { id: "child", label: "Child Health", specs: ["pediatrician"] },
  { id: "general", label: "General / Not Sure", specs: ["general-physician"] },
];

const DURATIONS = [
  { id: "today", label: "Just started today" },
  { id: "days", label: "A few days" },
  { id: "week", label: "About a week" },
  { id: "weeks", label: "2+ weeks" },
  { id: "months", label: "Months or longer" },
];

const SEVERITY = [
  { id: "mild", label: "Mild — manageable", color: "#16a34a" },
  { id: "moderate", label: "Moderate — uncomfortable", color: "#f59e0b" },
  { id: "severe", label: "Severe — very painful", color: "#ef4444" },
  { id: "emergency", label: "Emergency — life threatening", color: "#7f1d1d" },
];

export default function SymptomChecker() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [area, setArea] = useState(null);
  const [duration, setDuration] = useState(null);
  const [severity, setSeverity] = useState(null);

  const steps = ["Body Area", "Duration", "Severity", "Result"];

  const getRecommendedSpec = () => {
    if (severity === "emergency") return null; // show emergency message
    const areaData = BODY_AREAS.find((b) => b.id === area);
    const slug = areaData?.specs[0] || "general-physician";
    return specialties.find((s) => s.slug === slug) || specialties[0];
  };

  const goNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="symptom-checker" role="application" aria-label="Symptom checker wizard">
      <div className="sc-header">
        <Link to="/" className="back-button" aria-label="Back to home">← Home</Link>
        <h1>Symptom Checker</h1>
        <p>Answer 3 quick questions and we'll route you to the right specialist</p>
      </div>

      <div className="sc-progress" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={4}>
        {steps.map((s, i) => (
          <div key={s} className={`sc-step ${i <= step ? "active" : ""} ${i === step ? "current" : ""}`}>
            <span className="sc-step-num">{i + 1}</span>
            <span className="sc-step-label">{s}</span>
          </div>
        ))}
      </div>

      <div className="sc-body">
        {step === 0 && (
          <div className="sc-options" role="radiogroup" aria-label="Select body area">
            {BODY_AREAS.map((b) => (
              <button
                key={b.id}
                className={`sc-option ${area === b.id ? "selected" : ""}`}
                onClick={() => { setArea(b.id); goNext(); }}
                role="radio"
                aria-checked={area === b.id}
              >
                {b.label}
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="sc-options" role="radiogroup" aria-label="How long have you had symptoms?">
            {DURATIONS.map((d) => (
              <button
                key={d.id}
                className={`sc-option ${duration === d.id ? "selected" : ""}`}
                onClick={() => { setDuration(d.id); goNext(); }}
                role="radio"
                aria-checked={duration === d.id}
              >
                {d.label}
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="sc-options" role="radiogroup" aria-label="How severe are your symptoms?">
            {SEVERITY.map((s) => (
              <button
                key={s.id}
                className={`sc-option ${severity === s.id ? "selected" : ""}`}
                style={{ "--option-color": s.color }}
                onClick={() => { setSeverity(s.id); goNext(); }}
                role="radio"
                aria-checked={severity === s.id}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="sc-result">
            {severity === "emergency" ? (
              <div className="sc-emergency" role="alert">
                <h2>⚠️ Seek Immediate Help</h2>
                <p>Based on your answers, this may be a medical emergency.</p>
                <a href="tel:911" className="emergency-call-btn">Call 911 Now</a>
                <p className="sc-note">Do not rely on AI — call emergency services immediately.</p>
              </div>
            ) : (
              <div className="sc-recommendation">
                <FaCheckCircle className="sc-check-icon" />
                <h2>Recommended Specialist</h2>
                {(() => {
                  const spec = getRecommendedSpec();
                  const SpecIcon = spec?.icon;
                  return spec ? (
                    <div className="sc-spec-card">
                      <div className="sc-spec-icon" style={{ color: spec.color }}>
                        {SpecIcon && <SpecIcon />}
                      </div>
                      <h3>{spec.name}</h3>
                      <p>{spec.description}</p>
                      <button
                        className="sc-start-btn"
                        onClick={() => navigate(`/chat/${spec.slug}`)}
                      >
                        Start Consultation <FaArrowRight />
                      </button>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>
        )}
      </div>

      {step > 0 && step < 3 && (
        <div className="sc-nav">
          <button className="sc-back-btn" onClick={goBack}>
            <FaArrowLeft /> Back
          </button>
        </div>
      )}
    </div>
  );
}
