import { useEffect, useState } from "react";

export default function ModelComparison() {
  const [models, setModels] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/models")
      .then(res => {
        if (!res.ok) throw new Error("API Server error");
        return res.json();
      })
      .then(data => setModels(data))
      .catch(err => console.error(err));
  }, []);

  if (!models) {
    return (
      <div className="loader-wrapper">
        <div className="spinner-icon"></div>
        <span>Loading model performance data...</span>
      </div>
    );
  }

  const sorted = Object.entries(models.all_models)
    .sort((a, b) => b[1] - a[1]);

  const colors = ["#6366f1", "#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

  return (
    <div className="glass-card">
      <h2 className="card-title">Model Insights</h2>
      
      <p style={{
        fontSize: "14px",
        color: "#9ca3af",
        marginBottom: "24px",
        fontWeight: 500
      }}>
        Currently using: <span style={{ color: "#818cf8", fontWeight: 700 }}>
          {models.best_model}
        </span>
      </p>

      <div className="metrics-list">
        {sorted.map(([name, acc], i) => (
          <div key={name} className="metric-row">
            <div className="metric-header" style={{ fontSize: "14px", marginBottom: "2px" }}>
              <span style={{
                color: name === models.best_model ? "#fff" : "#9ca3af",
                fontWeight: name === models.best_model ? "700" : "500"
              }}>
                {name === models.best_model ? "🏆 " : ""}{name}
              </span>
              <span style={{ color: colors[i % colors.length], fontWeight: 700 }}>
                {(acc * 100).toFixed(2)}% Accuracy
              </span>
            </div>
            
            <div className="metric-track" style={{ height: "10px" }}>
              <div 
                className="metric-fill" 
                style={{ 
                  width: `${acc * 100}%`, 
                  background: name === models.best_model 
                    ? `linear-gradient(90deg, #6366f1, #818cf8)` 
                    : colors[i % colors.length]
                }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}