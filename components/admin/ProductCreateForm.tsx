"use client";

import { useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function ProductCreateForm({ categories }: { categories: Category[] }) {
  const [payload, setPayload] = useState({
    slug: "",
    name: "",
    shortDesc: "",
    description: "",
    basePrice: "",
    categorySlug: categories[0]?.slug ?? "vetements",
  });
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Erreur creation produit");
      return;
    }

    setMessage(`Produit cree: ${data.product.name}`);
    setPayload((prev) => ({ ...prev, slug: "", name: "", shortDesc: "", description: "", basePrice: "" }));
  }

  return (
    <form onSubmit={onSubmit} style={{ background: "#fff", border: "1px solid #dbe4f0", borderRadius: 14, padding: 14, display: "grid", gap: 8 }}>
      <input value={payload.slug} onChange={(e) => setPayload((p) => ({ ...p, slug: e.target.value }))} placeholder="slug-produit" style={input} required />
      <input value={payload.name} onChange={(e) => setPayload((p) => ({ ...p, name: e.target.value }))} placeholder="Nom" style={input} required />
      <input value={payload.shortDesc} onChange={(e) => setPayload((p) => ({ ...p, shortDesc: e.target.value }))} placeholder="Accroche" style={input} />
      <textarea value={payload.description} onChange={(e) => setPayload((p) => ({ ...p, description: e.target.value }))} placeholder="Description" rows={4} style={input} required />
      <input value={payload.basePrice} onChange={(e) => setPayload((p) => ({ ...p, basePrice: e.target.value }))} type="number" step="0.01" placeholder="Base price" style={input} required />
      <select value={payload.categorySlug} onChange={(e) => setPayload((p) => ({ ...p, categorySlug: e.target.value }))} style={input}>
        {categories.map((category) => (
          <option value={category.slug} key={category.id}>{category.name}</option>
        ))}
      </select>
      <button type="submit" style={button}>Creer produit</button>
      {message ? <p style={{ margin: 0, color: message.startsWith("Produit cree") ? "#166534" : "#b91c1c" }}>{message}</p> : null}
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
