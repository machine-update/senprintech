"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCartStore } from "@/store/use-cart-store";
import { estimateShipping, computeTotals } from "@/lib/pricing";
import { formatFcfa } from "@/lib/currency";
import TrustProofBar from "@/components/shop/TrustProofBar";

export default function CartPage() {
  const { items, removeItem, clearCart } = useCartStore();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [message, setMessage] = useState("");

  const subtotal = useMemo(() => items.reduce((acc, item) => acc + item.price * item.quantity, 0), [items]);
  const shipping = useMemo(() => estimateShipping(subtotal, shippingMethod), [subtotal, shippingMethod]);
  const totals = useMemo(() => computeTotals({ subtotal, shipping, discount }), [subtotal, shipping, discount]);

  async function applyCoupon() {
    setMessage("");
    if (!coupon.trim()) return;

    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: coupon.trim(), amount: subtotal }),
    });

    const data = await res.json();
    if (!res.ok || !data.valid) {
      setDiscount(0);
      setMessage(data.error ?? "Coupon invalide");
      return;
    }

    setDiscount(data.discountAmount);
    setMessage(`Coupon applique: -${formatFcfa(data.discountAmount)}`);
  }

  return (
    <main className="mobile-with-sticky" style={{ maxWidth: 1120, margin: "0 auto", padding: "34px 20px 48px" }}>
      <h1 style={{ margin: 0, fontSize: 36, letterSpacing: -0.4 }}>Panier</h1>
      <p style={{ margin: "8px 0 0", color: "#475569" }}>{items.length} article(s) • Validation rapide et paiement securise</p>
      <TrustProofBar />

      {items.length === 0 ? (
        <div className="surface-card" style={{ marginTop: 14, padding: 18 }}>
          <p style={{ marginTop: 0 }}>Ton panier est vide.</p>
          <Link href="/catalogue" style={{ textDecoration: "none", color: "#1d4ed8", fontWeight: 700 }}>
            Explorer le catalogue
          </Link>
        </div>
      ) : (
        <div className="mobile-stack" style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
          <section style={{ display: "grid", gap: 10 }}>
            {items.map((item) => (
              <article key={item.id} className="surface-card hover-lift" style={{ padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
                  <div>
                    <h2 style={{ margin: "0 0 6px", fontSize: 19 }}>{item.name}</h2>
                    <p style={{ margin: "0 0 5px", color: "#475569" }}>
                      {item.quantity} x {formatFcfa(item.price)}
                    </p>
                    <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>{Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(" • ")}</p>
                  </div>
                  <button onClick={() => removeItem(item.id)} style={ghostButton}>
                    Retirer
                  </button>
                </div>
              </article>
            ))}
            <article className="surface-card" style={{ padding: 14 }}>
              <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>Suggestion conversion</p>
              <p style={{ margin: "4px 0 0", color: "#475569", fontSize: 14 }}>
                Ajoute un produit complementaire pour optimiser tes frais de livraison.
              </p>
              <Link href="/catalogue" style={{ display: "inline-block", marginTop: 8, textDecoration: "none", color: "#1d4ed8", fontWeight: 700 }}>
                Voir les meilleures ventes
              </Link>
            </article>
          </section>

          <aside className="surface-card mobile-sticky-aside" style={{ padding: 14, height: "fit-content", position: "sticky", top: 92 }}>
              <h3 style={{ margin: "0 0 12px", fontSize: 22 }}>Résumé</h3>

            <div style={{ display: "grid", gap: 8, fontSize: 14 }}>
              <label style={{ display: "grid", gap: 4 }}>
                <span>Code promo</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={coupon} onChange={(e) => setCoupon(e.target.value)} style={input} placeholder="WELCOME10" />
                  <button onClick={applyCoupon} style={ghostButton} type="button">
                    Appliquer
                  </button>
                </div>
                <span style={{ fontSize: 12, color: "#64748b" }}>Le code est valide uniquement a l'etape panier.</span>
              </label>
              {message ? (
                <p
                  style={{
                    margin: 0,
                    color: message.includes("applique") ? "#166534" : "#b91c1c",
                    background: message.includes("applique") ? "#ecfdf3" : "#fef2f2",
                    border: `1px solid ${message.includes("applique") ? "#bbf7d0" : "#fecaca"}`,
                    borderRadius: 10,
                    padding: "7px 10px",
                  }}
                >
                  {message}
                </p>
              ) : null}

              <label style={{ display: "grid", gap: 4 }}>
                <span>Livraison</span>
                <select value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value)} style={input}>
                  <option value="standard">Standard 72h</option>
                  <option value="express">Express 24-48h</option>
                  <option value="pickup">Retrait atelier</option>
                </select>
              </label>
            </div>

            <div style={{ marginTop: 12, borderTop: "1px dashed #cbd5e1", paddingTop: 10, display: "grid", gap: 6 }}>
              <p style={row}><span>Sous-total</span><strong>{formatFcfa(totals.subtotal)}</strong></p>
              <p style={row}><span>Livraison</span><strong>{formatFcfa(totals.shipping)}</strong></p>
              <p style={row}><span>Reduction</span><strong>-{formatFcfa(totals.discount)}</strong></p>
              <p style={row}><span>TVA</span><strong>{formatFcfa(totals.taxes)}</strong></p>
              <p style={{ ...row, fontSize: 18 }}><span>Total</span><strong>{formatFcfa(totals.total)}</strong></p>
            </div>

            <Link href="/checkout" style={{ ...primaryLink, marginTop: 12, display: "inline-block" }}>
              Passer au paiement
            </Link>
            <button onClick={clearCart} style={{ ...ghostButton, marginTop: 8, width: "100%" }}>Vider le panier</button>
          </aside>
        </div>
      )}

      {items.length > 0 ? (
        <div className="mobile-sticky-action">
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>Total</p>
            <p style={{ margin: "2px 0 0", fontWeight: 800, color: "#0f172a" }}>{formatFcfa(totals.total)}</p>
          </div>
          <Link href="/checkout" style={{ ...primaryLink, marginTop: 0, padding: "10px 12px" }}>
            Paiement
          </Link>
        </div>
      ) : null}
    </main>
  );
}

const input: React.CSSProperties = {
  width: "100%",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  padding: "8px 10px",
};

const row: React.CSSProperties = {
  margin: 0,
  display: "flex",
  justifyContent: "space-between",
};

const ghostButton: React.CSSProperties = {
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  padding: "7px 10px",
  background: "#fff",
  cursor: "pointer",
};

const primaryLink: React.CSSProperties = {
  textDecoration: "none",
  background: "#0f172a",
  color: "#fff",
  borderRadius: 10,
  padding: "10px 12px",
  fontWeight: 700,
  textAlign: "center",
};
