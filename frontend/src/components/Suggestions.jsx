export default function Suggestions({ suggestions }) {
  if (!suggestions || suggestions.length === 0) return null;

  const isPositive = suggestions.length === 1 &&
    suggestions[0].includes("strong");

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
        {isPositive ? "All Good" : "Suggestions"}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {suggestions.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              padding: "12px 16px",
              background: "#0f0f1a",
              borderRadius: "10px",
              border: `1px solid ${isPositive ? "#2ecc7133" : "#f39c1233"}`
            }}
          >
            <span style={{ fontSize: "16px", marginTop: "1px" }}>
              {isPositive ? "🎉" : "→"}
            </span>
            <span style={{
              fontSize: "14px",
              color: "#ccc",
              lineHeight: "1.5"
            }}>
              {s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}