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
        marginBottom: "20px"
      }}>
        Strength Analysis
      </h2>

      {/* Big label */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "20px"
      }}>
        <span style={{ fontSize: "32px" }}>{getEmoji()}</span>
        <div>
          <div style={{
            fontSize: "36px",
            fontWeight: "bold",
            color: color
          }}>
            {label}
          </div>
          <div style={{ fontSize: "14px", color: "#888" }}>
            {confidence}% confidence
          </div>
        </div>
      </div>

      {/* Animated strength bar */}
      <div style={{
        background: "#0f0f1a",
        borderRadius: "999px",
        height: "12px",
        overflow: "hidden",
        marginBottom: "24px"
      }}>
        <div style={{
          width: getBarWidth(),
          height: "100%",
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: "999px",
          transition: "width 0.5s ease, background 0.5s ease"
        }} />
      </div>

      {/* Probability bars for all 3 classes */}
      {all_probs && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            { name: "Weak",   color: "#e74c3c", prob: all_probs.Weak },
            { name: "Medium", color: "#f39c12", prob: all_probs.Medium },
            { name: "Strong", color: "#2ecc71", prob: all_probs.Strong },
          ].map(({ name, color: c, prob }) => (
            <div key={name}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "#888",
                marginBottom: "4px"
              }}>
                <span>{name}</span>
                <span>{prob}%</span>
              </div>
              <div style={{
                background: "#0f0f1a",
                borderRadius: "999px",
                height: "6px",
                overflow: "hidden"
              }}>
                <div style={{
                  width: `${prob}%`,
                  height: "100%",
                  background: c,
                  borderRadius: "999px",
                  transition: "width 0.4s ease"
                }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}