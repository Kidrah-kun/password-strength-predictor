import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import PasswordInput from "./components/PasswordInput";
import StrengthMeter from "./components/StrengthMeter";
import FeatureBreakdown from "./components/FeatureBreakdown";
import Suggestions from "./components/Suggestions";
import ModelComparison from "./components/ModelComparison";

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
    axios.post("http://localhost:8000/predict", {
      password: debouncedPassword
    })
    .then(res => {
      setResult(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [debouncedPassword]);

  const tabs = [
    { id: "analyze",  label: "🔍 Analyze" },
    { id: "models",   label: "🤖 Models" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f0f1a",
      padding: "40px 20px"
    }}>
      <div style={{
        maxWidth: "800px",
        margin: "0 auto"
      }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔐</div>
          <h1 style={{
            fontSize: "32px",
            fontWeight: "800",
            background: "linear-gradient(135deg, #6c63ff, #3ecfcf)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "8px"
          }}>
            Password Strength Predictor
          </h1>
          <p style={{ color: "#555", fontSize: "14px" }}>
            AI-powered analysis using Machine Learning
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex",
          gap: "8px",
          marginBottom: "24px",
          background: "#1a1a2e",
          borderRadius: "12px",
          padding: "6px"
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                background: activeTab === tab.id ? "#6c63ff" : "transparent",
                color: activeTab === tab.id ? "#fff" : "#888",
                transition: "all 0.2s"
              }}
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
              <div style={{
                textAlign: "center",
                color: "#6c63ff",
                padding: "20px",
                fontSize: "14px"
              }}>
                Analyzing...
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
              <div style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#333"
              }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                  ⌨️
                </div>
                <p>Start typing to analyze your password</p>
              </div>
            )}
          </>
        )}

        {activeTab === "models" && (
          <ModelComparison />
        )}

        {/* Footer */}
        <div style={{
          textAlign: "center",
          marginTop: "40px",
          color: "#333",
          fontSize: "12px"
        }}>
          Built with FastAPI + React + scikit-learn
        </div>
      </div>
    </div>
  );
}