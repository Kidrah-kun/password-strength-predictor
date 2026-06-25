export default function Suggestions({ suggestions }) {
  if (!suggestions || suggestions.length === 0) return null;

  const isPositive = suggestions.length === 1 &&
    suggestions[0].includes("strong");

  return (
    <div className="glass-card">
      <h2 className="card-title">
        {isPositive ? "Security Status" : "Actionable Suggestions"}
      </h2>

      <div className="suggestions-grid">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className="suggestion-card"
            style={{ 
              borderLeftColor: isPositive ? "#2ecc71" : "#f39c12",
              animationDelay: `${i * 100}ms`
            }}
          >
            <span className="suggestion-icon">
              {isPositive ? "🎉" : "💡"}
            </span>
            <span className="suggestion-text">
              {s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}