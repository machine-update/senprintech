"use client";

import { useEffect, useState } from "react";

const KEY = "senprintech-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(KEY);
    setVisible(!accepted);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentement cookies"
      style={{
        position: "fixed",
        bottom: 14,
        right: 14,
        maxWidth: 420,
        background: "#0f172a",
        color: "#fff",
        borderRadius: 12,
        padding: 14,
        zIndex: 100,
      }}
    >
      <p style={{ margin: 0, fontSize: 14 }}>
        Nous utilisons des cookies essentiels pour panier, session et mesures UX.
      </p>
      <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem(KEY, "accepted");
            setVisible(false);
          }}
          style={{ border: "none", borderRadius: 8, padding: "8px 10px", background: "#fff", color: "#0f172a", cursor: "pointer", fontWeight: 700 }}
        >
          Accepter
        </button>
        <button
          type="button"
          onClick={() => setVisible(false)}
          style={{ border: "1px solid rgba(255,255,255,0.4)", borderRadius: 8, padding: "8px 10px", background: "transparent", color: "#fff", cursor: "pointer" }}
        >
          Plus tard
        </button>
      </div>
    </div>
  );
}
