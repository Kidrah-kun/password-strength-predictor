import { useState } from "react";

export default function PasswordInput({ password, setPassword }) {
  const [show, setShow] = useState(false);

  return (
    <div className="glass-card">
      <h2 className="card-title">Enter Password</h2>

      <div className="input-wrapper">
        <input
          type={show ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Type your password here..."
          className="password-field"
        />

        {/* Show/Hide toggle */}
        <button
          onClick={() => setShow(!show)}
          className="toggle-visibility-btn"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? "🙈" : "👁️"}
        </button>
      </div>

      {/* Character count */}
      <div className="char-counter">
        {password.length} {password.length === 1 ? "character" : "characters"}
      </div>
    </div>
  );
}