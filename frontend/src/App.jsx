import { useState, useEffect } from "react";
import PasswordInput from "./components/PasswordInput";
import StrengthMeter from "./components/StrengthMeter";
import FeatureBreakdown from "./components/FeatureBreakdown";
import Suggestions from "./components/Suggestions";
import ModelComparison from "./components/ModelComparison";
import "./App.css";

// Debounce helper — waits 300ms after typing stops before calling API
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function App() {
  const [password, setPassword]   = useState("");
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [activeTab, setActiveTab] = useState("analyze");

  const debouncedPassword = useDebounce(password, 300);

  // Call API whenever debounced password changes
  useEffect(() => {
    if (!debouncedPassword) {
      setResult(null);
      return;
    }

    setLoading(true);
    fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password: debouncedPassword })
    })
    .then(res => {
      if (!res.ok) throw new Error("API Server error");
      return res.json();
    })
    .then(data => {
      setResult(data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [debouncedPassword]);

  const tabs = [
    { id: "analyze",  label: "🔍 Analyze Strength" },
    { id: "models",   label: "🤖 Model Insights" },
  ];

  return (
    <div className="app-container">
      <div className="content-wrapper">

        {/* Header */}
        <header className="app-header">
          <div className="header-icon">🔐</div>
          <h1 className="header-title">Password Strength Predictor</h1>
          <p className="header-subtitle">
            AI-powered analysis and strength assessment using Machine Learning
          </p>
        </header>

        {/* Tabs */}
        <div className="tabs-container">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "analyze" && (
          <>
            <PasswordInput
              password={password}
              setPassword={setPassword}
            />

            {/* Loading indicator */}
            {loading && (
              <div className="loader-wrapper">
                <div className="spinner-icon"></div>
                <span>Analyzing password patterns...</span>
              </div>
            )}

            {result && !loading && (
              <>
                <StrengthMeter
                  result={result}
                  password={password}
                />
                <Suggestions
                  suggestions={result.suggestions}
                />
                <FeatureBreakdown
                  features={result.features}
                />
              </>
            )}

            {/* Empty state */}
            {!password && (
              <div className="empty-state">
                <div className="empty-state-icon">⌨️</div>
                <p className="empty-state-text">Start typing a password to begin analysis</p>
              </div>
            )}
          </>
        )}

        {activeTab === "models" && (
          <ModelComparison />
        )}

        {/* Footer */}
        <footer className="app-footer">
          Built with FastAPI + React + Scikit-Learn
        </footer>
      </div>
    </div>
  );
}