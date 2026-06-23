export default function FeatureBreakdown({ features }) {
  if (!features || Object.keys(features).length === 0) return null;

  const items = [
    {
      key: "length",
      label: "Length",
      value: features.length,
      good: features.length >= 12,
      ok: features.length >= 8,
      display: `${features.length} chars`
    },
    {
      key: "uppercase_count",
      label: "Uppercase",
      value: features.uppercase_count,
      good: features.uppercase_count >= 1,
      ok: features.uppercase_count >= 1,
      display: features.uppercase_count
    },
    {
      key: "lowercase_count",
      label: "Lowercase",
      value: features.lowercase_count,
      good: features.lowercase_count >= 1,
      ok: features.lowercase_count >= 1,
      display: features.lowercase_count
    },
    {
      key: "digit_count",
      label: "Digits",
      value: features.digit_count,
      good: features.digit_count >= 2,
      ok: features.digit_count >= 1,
      display: features.digit_count
    },
    {
      key: "special_char_count",
      label: "Special Chars",
      value: features.special_char_count,
      good: features.special_char_count >= 2,
      ok: features.special_char_count >= 1,
      display: features.special_char_count
    },
    {
      key: "shannon_entropy",
      label: "Entropy",
      value: features.shannon_entropy,
      good: features.shannon_entropy >= 3.5,
      ok: features.shannon_entropy >= 2.5,
      display: features.shannon_entropy.toFixed(2)
    },
    {
      key: "char_diversity_ratio",
      label: "Diversity",
      value: features.char_diversity_ratio,
      good: features.char_diversity_ratio >= 0.7,
      ok: features.char_diversity_ratio >= 0.5,
      display: `${(features.char_diversity_ratio * 100).toFixed(0)}%`
    },
    {
      key: "has_common_pattern",
      label: "Common Pattern",
      value: features.has_common_pattern,
      good: features.has_common_pattern === 0,
      ok: features.has_common_pattern === 0,
      display: features.has_common_pattern ? "Detected ⚠️" : "None ✓"
    },
    {
      key: "has_dictionary_word",
      label: "Dictionary Word",
      value: features.has_dictionary_word,
      good: features.has_dictionary_word === 0,
      ok: features.has_dictionary_word === 0,
      display: features.has_dictionary_word ? "Detected ⚠️" : "None ✓"
    },
    {
      key: "keyboard_pattern",
      label: "Keyboard Pattern",
      value: features.keyboard_pattern,
      good: features.keyboard_pattern === 0,
      ok: features.keyboard_pattern === 0,
      display: features.keyboard_pattern ? "Detected ⚠️" : "None ✓"
    },
    {
      key: "consecutive_chars",
      label: "Max Consecutive",
      value: features.consecutive_chars,
      good: features.consecutive_chars <= 1,
      ok: features.consecutive_chars <= 2,
      display: features.consecutive_chars
    },
  ];

  const getColor = (item) => {
    if (item.good) return "#2ecc71";
    if (item.ok)   return "#f39c12";
    return "#e74c3c";
  };

  const getIcon = (item) => {
    if (item.good) return "✓";
    if (item.ok)   return "~";
    return "✗";
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
        Feature Breakdown
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: "12px"
      }}>
        {items.map(item => (
          <div
            key={item.key}
            style={{
              background: "#0f0f1a",
              borderRadius: "12px",
              padding: "16px",
              border: `1px solid ${getColor(item)}33`,
              transition: "all 0.3s"
            }}
          >
            <div style={{
              fontSize: "11px",
              color: "#888",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "8px"
            }}>
              {item.label}
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <span style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#fff"
              }}>
                {item.display}
              </span>
              <span style={{
                fontSize: "16px",
                color: getColor(item),
                fontWeight: "bold"
              }}>
                {getIcon(item)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}