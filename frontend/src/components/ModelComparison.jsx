import { useEffect, useState } from "react";
import axios from "axios";

export default function ModelComparison() {
  const [models, setModels] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/models")
      .then(res => setModels(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!models) return null;

  const sorted = Object.entries(models.all_models)
    .sort((a, b) => b[1] - a[1]);

  const colors = ["#6c63ff", "#2ecc71", "#3498db", "#f39c12", "#e74c3c"];

  return (
    <div style={{
      background: "#1a1a2e",
      borderRadius: "16px",
      padding: "32px",
      marginBottom: "24px",
      border: "1px solid #2a2a4a"
    }}>
      <h2 style={{
        fontSize: "14px",
        color: "#888",
        textTransform: "uppercase",
        letterSpacing: "2px",
        marginBottom: "8px"
      }}>
        Model Comparison
      </h2>
      <p style={{
        fontSize: "12px",
        color: "#555",
        marginBottom: "20px"
      }}>
        Currently using: <span style={{ color: "#6c63ff" }}>
          {models.best_model}
        </span>
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {sorted.map(([name, acc], i) => (
          <div key={name}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "13px",
              marginBottom: "6px"
            }}>
              <span style={{
                color: name === models.best_model ? "#6c63ff" : "#aaa",
                fontWeight: name === models.best_model ? "bold" : "normal"
              }}>
                {name === models.best_model ? "🏆 " : ""}{name}
              </span>
              <span style={{ color: colors[i] }}>
                {(acc * 100).toFixed(2)}%
              </span>
            </div>
            <div style={{
              background: "#0f0f1a",
              borderRadius: "999px",
              height: "8px",
              overflow: "hidden"
            }}>
              <div style={{
                width: `${acc * 100}%`,
                height: "100%",
                background: colors[i],
                borderRadius: "999px",
                transition: "width 0.6s ease"
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}