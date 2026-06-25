export default function StrengthMeter({ result, password }) {
  if (!password) return null;

  const { label, confidence, color, all_probs } = result;

  const getBarWidth = () => {
    if (label === "Weak")   return "33%";
    if (label === "Medium") return "66%";
    if (label === "Strong") return "100%";
    return "0%";
  };

  const getEmoji = () => {
    if (label === "Weak")   return "🔴";
    if (label === "Medium") return "🟡";
    if (label === "Strong") return "🟢";
    return "⚪";
  };

  // Convert hex color to rgba for styling border/subtle glow
  const getSubtleColor = (hex) => {
    if (!hex) return "rgba(255, 255, 255, 0.05)";
    // simple mapping or generic conversion
    if (hex === "#e74c3c") return "rgba(231, 76, 60, 0.15)";
    if (hex === "#f39c12") return "rgba(243, 156, 18, 0.15)";
    if (hex === "#2ecc71") return "rgba(46, 204, 113, 0.15)";
    return "rgba(255, 255, 255, 0.05)";
  };

  return (
    <div className="glass-card" style={{ borderLeft: `5px solid ${color}` }}>
      <h2 className="card-title">Strength Analysis</h2>

      {/* Strength Summary */}
      <div className="strength-summary">
        <span className="strength-emoji">{getEmoji()}</span>
        <div>
          <div className="strength-label" style={{ color: color }}>
            {label}
          </div>
          <div className="confidence-text">
            {confidence}% prediction confidence
          </div>
        </div>
      </div>

      {/* Main progress bar */}
      <div className="progress-container">
        <div 
          className="progress-bar-fill" 
          style={{ 
            width: getBarWidth(),
            background: `linear-gradient(90deg, ${color}cc, ${color})`,
            boxShadow: `0 0 10px ${color}66`
          }} 
        />
      </div>

      {/* Probability breakdowns */}
      {all_probs && (
        <div className="metrics-list">
          {[
            { name: "Weak Probability",   color: "#e74c3c", prob: all_probs.Weak },
            { name: "Medium Probability", color: "#f39c12", prob: all_probs.Medium },
            { name: "Strong Probability", color: "#2ecc71", prob: all_probs.Strong },
          ].map(({ name, color: c, prob }) => (
            <div key={name} className="metric-row">
              <div className="metric-header">
                <span>{name}</span>
                <span style={{ color: c, fontWeight: 700 }}>{prob}%</span>
              </div>
              <div className="metric-track">
                <div 
                  className="metric-fill" 
                  style={{ 
                    width: `${prob}%`, 
                    background: c 
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}