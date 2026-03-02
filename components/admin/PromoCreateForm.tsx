"use client";

import { useState } from "react";

export default function PromoCreateForm() {
  const [payload, setPayload] = useState({ code: "", type: "PERCENT", value: "", minAmount: "" });
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/admin/promos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error ?? "Erreur creation coupon");
      return;
    }

    setMessage(`Coupon cree: ${data.coupon.code}`);
    setPayload({ code: "", type: "PERCENT", value: "", minAmount: "" });
  }

  return (
    <form onSubmit={onSubmit} style={{ marginTop: 14, background: "#fff", border: "1px solid #dbe4f0", borderRadius: 14, padding: 14, display: "grid", gap: 8 }}>
      <input value={payload.code} onChange={(e) => setPayload((p) => ({ ...p, code: e.target.value }))} placeholder="WELCOME10" style={input} required />
      <select value={payload.type} onChange={(e) => setPayload((p) => ({ ...p, type: e.target.value }))} style={input}>
        <option value="PERCENT">Pourcentage</option>
        <option value="FIXED">Montant fixe</option>
      </select>
      <input value={payload.value} onChange={(e) => setPayload((p) => ({ ...p, value: e.target.value }))} type="number" step="0.01" placeholder="Valeur" style={input} required />
      <input value={payload.minAmount} onChange={(e) => setPayload((p) => ({ ...p, minAmount: e.target.value }))} type="number" step="0.01" placeholder="Montant minimum" style={input} />
      <button type="submit" style={button}>Creer coupon</button>
      {message ? <p style={{ margin: 0, color: message.startsWith("Coupon cree") ? "#166534" : "#b91c1c" }}>{message}</p> : null}
    </form>
  );
}

const input: React.CSSProperties = {
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  padding: "8px 10px",
  font: "inherit",
};

const button: React.CSSProperties = {
  border: "none",
  borderRadius: 8,
  padding: "9px 12px",
  background: "#0f172a",
  color: "#fff",
  cursor: "pointer",
};
