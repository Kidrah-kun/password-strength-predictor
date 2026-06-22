import { useState } from "react";

export default function PasswordInput({ password, setPassword }) {
  const [show, setShow] = useState(false);

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
        marginBottom: "16px"
      }}>
        Enter Password
      </h2>

      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Type your password here..."
          style={{
            width: "100%",
            padding: "16px 56px 16px 20px",
            fontSize: "20px",
            background: "#0f0f1a",
            border: "2px solid #2a2a4a",
            borderRadius: "12px",
            color: "#fff",
            outline: "none",
            letterSpacing: "2px",
            transition: "border-color 0.3s"
          }}
          onFocus={e => e.target.style.borderColor = "#6c63ff"}
          onBlur={e => e.target.style.borderColor = "#2a2a4a"}
        />

        {/* Show/Hide toggle */}
        <button
          onClick={() => setShow(!show)}
          style={{
            position: "absolute",
            right: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            color: "#888",
            cursor: "pointer",
            fontSize: "18px"
          }}
        >
          {show ? "🙈" : "👁️"}
        </button>
      </div>

      {/* Character count */}
      <div style={{
        marginTop: "8px",
        fontSize: "12px",
        color: "#555",
        textAlign: "right"
      }}>
        {password.length} characters
      </div>
    </div>
  );
}