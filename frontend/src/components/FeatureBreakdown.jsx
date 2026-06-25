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
      display: typeof features.shannon_entropy === 'number' ? features.shannon_entropy.toFixed(2) : "0.00"
    },
    {
      key: "char_diversity_ratio",
      label: "Diversity",
      value: features.char_diversity_ratio,
      good: features.char_diversity_ratio >= 0.7,
      ok: features.char_diversity_ratio >= 0.5,
      display: typeof features.char_diversity_ratio === 'number' ? `${(features.char_diversity_ratio * 100).toFixed(0)}%` : "0%"
    },
    {
      key: "has_common_pattern",
      label: "Common Pattern",
      value: features.has_common_pattern,
      good: features.has_common_pattern === 0,
      ok: features.has_common_pattern === 0,
      display: features.has_common_pattern ? "Detected" : "None"
    },
    {
      key: "has_dictionary_word",
      label: "Dictionary Word",
      value: features.has_dictionary_word,
      good: features.has_dictionary_word === 0,
      ok: features.has_dictionary_word === 0,
      display: features.has_dictionary_word ? "Detected" : "None"
    },
    {
      key: "keyboard_pattern",
      label: "Keyboard Pattern",
      value: features.keyboard_pattern,
      good: features.keyboard_pattern === 0,
      ok: features.keyboard_pattern === 0,
      display: features.keyboard_pattern ? "Detected" : "None"
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
    <div className="glass-card">
      <h2 className="card-title">Feature Breakdown</h2>

      <div className="features-grid">
        {items.map(item => (
          <div
            key={item.key}
            className="feature-badge"
            style={{ borderBottom: `3px solid ${getColor(item)}` }}
          >
            <span className="feature-label">{item.label}</span>
            <div className="feature-value-wrapper">
              <span className="feature-value">{item.display}</span>
              <span 
                className="feature-status-icon"
                style={{ color: getColor(item) }}
              >
                {getIcon(item)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}