"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/use-cart-store";
import { computeTotals, estimateShipping } from "@/lib/pricing";
import { formatFcfa } from "@/lib/currency";
import TrustProofBar from "@/components/shop/TrustProofBar";

const defaultAddress = {
  fullName: "",
  line1: "",
  city: "",
  postalCode: "",
  country: "France",
  email: "",
};

const checkoutSteps = [
  { id: 1, label: "Adresse" },
  { id: 2, label: "Livraison" },
  { id: 3, label: "Paiement" },
  { id: 4, label: "Confirmation" },
];

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [address, setAddress] = useState(defaultAddress);
  const [payment, setPayment] = useState("wave");
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");
  const [triedAddressStep, setTriedAddressStep] = useState(false);
  const [paymentRef] = useState(() => `SENP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);

  const subtotal = useMemo(() => items.reduce((acc, item) => acc + item.price * item.quantity, 0), [items]);
  const totals = useMemo(
    () => computeTotals({ subtotal, shipping: estimateShipping(subtotal, shippingMethod), discount: 0 }),
    [subtotal, shippingMethod]
  );
  const directNumberDisplay = "+33 7 67 52 89 06";
  const directNumberHref = "+33767528906";
  const paymentPayload = useMemo(() => {
    if (!["wave", "orange_money"].includes(payment)) return "";
    const provider = payment === "wave" ? "Wave Senegal" : "Orange Money Senegal";
    return [
      "SENPRINTECH",
      `Methode: ${provider}`,
      `Montant: ${formatFcfa(totals.total)}`,
      `Reference: ${paymentRef}`,
      `Numero: ${directNumberDisplay}`,
    ].join(" | ");
  }, [payment, totals.total, paymentRef]);
  const qrCodeUrl = paymentPayload
    ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(paymentPayload)}`
    : "";

  const addressErrors = {
    fullName: address.fullName.trim().length < 3,
    line1: address.line1.trim().length < 5,
    city: address.city.trim().length < 2,
    postalCode: address.postalCode.trim().length < 2,
    country: address.country.trim().length < 2,
    email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email.trim()),
  };
  const isAddressValid = !Object.values(addressErrors).some(Boolean);

  async function placeOrder() {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingMethod,
          paymentMethod: payment,
          shippingAddress: address,
          userEmail: address.email,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Erreur de paiement");
      setOrderId(data.order.id);
      clearCart();
      setStep(4);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de paiement");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mobile-with-sticky" style={{ maxWidth: 1080, margin: "0 auto", padding: "34px 20px 48px" }}>
      <h1 style={{ margin: 0, fontSize: 40 }}>Paiement sécurisé</h1>
      <p style={{ margin: "8px 0 0", color: "#475569" }}>Paiement Wave et Orange Money integre, montants affiches en FCFA.</p>
      <TrustProofBar />

      <div style={{ display: "flex", gap: 8, marginTop: 14, marginBottom: 16, flexWrap: "wrap" }}>
        {checkoutSteps.map((item) => {
          const active = item.id === step;
          const done = item.id < step;
          return (
            <div
              key={item.id}
              style={{
                border: `1px solid ${active ? "#1d4ed8" : "#cbd5e1"}`,
                background: done ? "#dbeafe" : "#fff",
                color: active ? "#1d4ed8" : "#334155",
                borderRadius: 999,
                padding: "7px 12px",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {item.label}
            </div>
          );
        })}
      </div>

      {step !== 4 ? (
        <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 16, alignItems: "start" }}>
          <section className="surface-card" style={{ borderRadius: 12, padding: 16 }}>
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div key="step-address" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                  <h2 style={{ margin: "0 0 10px" }}>Adresse de livraison</h2>
                  <p style={{ margin: "0 0 10px", fontSize: 13, color: "#64748b" }}>Tous les champs sont requis pour confirmer la commande.</p>
                  <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
                    {Object.entries(address).map(([key, value]) => (
                      <label key={key} style={{ display: "grid", gap: 4, gridColumn: key === "line1" ? "1 / -1" : undefined }}>
                        <span style={{ fontSize: 13, color: "#475569" }}>{formatLabel(key)}</span>
                        <input
                          value={value}
                          onChange={(e) => setAddress((prev) => ({ ...prev, [key]: e.target.value }))}
                          aria-invalid={triedAddressStep && addressErrors[key as keyof typeof addressErrors] ? "true" : "false"}
                          style={{
                            ...input,
                            borderColor: triedAddressStep && addressErrors[key as keyof typeof addressErrors] ? "#dc2626" : "#cbd5e1",
                            background: triedAddressStep && addressErrors[key as keyof typeof addressErrors] ? "#fef2f2" : "#fff",
                          }}
                        />
                        {triedAddressStep && addressErrors[key as keyof typeof addressErrors] ? (
                          <span style={{ color: "#b91c1c", fontSize: 12 }}>Champ invalide</span>
                        ) : null}
                      </label>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "end", marginTop: 12 }}>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      style={primaryButton}
                      onClick={() => {
                        setTriedAddressStep(true);
                        if (isAddressValid) setStep(2);
                      }}
                      disabled={!isAddressValid && triedAddressStep}
                    >
                      Continuer
                    </motion.button>
                  </div>
                </motion.div>
              ) : null}

              {step === 2 ? (
                <motion.div key="step-shipping" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                  <h2 style={{ margin: "0 0 10px" }}>Mode de livraison</h2>
                  <p style={{ margin: "0 0 10px", fontSize: 13, color: "#64748b" }}>Selectionne l'option la plus adaptee a ton urgence.</p>
                  <div style={{ display: "grid", gap: 10 }}>
                    {[
                      { id: "standard", title: "Standard", text: "72h ouvrees" },
                      { id: "express", title: "Express", text: "24-48h" },
                      { id: "pickup", title: "Retrait atelier", text: "Gratuit" },
                    ].map((option) => {
                      const active = shippingMethod === option.id;
                      return (
                        <motion.button
                          key={option.id}
                          type="button"
                          whileHover={{ y: -2 }}
                          onClick={() => setShippingMethod(option.id)}
                          style={{
                            textAlign: "left",
                            border: active ? "1px solid #2563eb" : "1px solid #cbd5e1",
                            borderRadius: 12,
                            padding: "12px 13px",
                            background: active ? "#eff6ff" : "#fff",
                            cursor: "pointer",
                            boxShadow: active ? "0 12px 24px -24px rgba(29,78,216,0.8)" : undefined,
                          }}
                        >
                          <p style={{ margin: 0, fontWeight: 800 }}>{option.title}</p>
                          <p style={{ margin: "4px 0 0", color: "#475569" }}>{option.text}</p>
                        </motion.button>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button style={ghostButton} onClick={() => setStep(1)}>
                      Retour
                    </button>
                    <motion.button whileTap={{ scale: 0.98 }} style={primaryButton} onClick={() => setStep(3)}>
                      Continuer
                    </motion.button>
                  </div>
                </motion.div>
              ) : null}

              {step === 3 ? (
                <motion.div key="step-payment" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                  <h2 style={{ margin: "0 0 10px" }}>Paiement</h2>
                  <p style={{ margin: "0 0 10px", color: "#475569", fontSize: 14 }}>
                    Choisissez votre mode de paiement pour le Senegal. Paiement en FCFA, reference unique incluse.
                  </p>
                  <div style={{ display: "grid", gap: 8 }}>
                    {[
                      { id: "wave", title: "Wave", text: "Paiement mobile instantane" },
                      { id: "orange_money", title: "Orange Money", text: "Paiement mobile securise" },
                      { id: "direct", title: "Numero direct", text: "Envoi direct avec reference manuelle" },
                    ].map((option) => {
                      const active = payment === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setPayment(option.id)}
                          style={{
                            textAlign: "left",
                            border: active ? "1px solid #ea580c" : "1px solid #cbd5e1",
                            borderRadius: 12,
                            padding: "10px 12px",
                            background: active ? "#fff7ed" : "#fff",
                            cursor: "pointer",
                            boxShadow: active ? "0 12px 24px -24px rgba(234,88,12,0.8)" : undefined,
                          }}
                        >
                          <p style={{ margin: 0, fontWeight: 800 }}>{option.title}</p>
                          <p style={{ margin: "4px 0 0", color: "#475569", fontSize: 13 }}>{option.text}</p>
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: 12, border: "1px dashed #cbd5e1", borderRadius: 12, padding: 12 }}>
                    <p style={{ margin: "0 0 6px", fontSize: 13, color: "#475569" }}>
                      Numero direct:{" "}
                      <a href={`tel:${directNumberHref}`} style={{ color: "#1d4ed8", textDecoration: "none", fontWeight: 700 }}>
                        {directNumberDisplay}
                      </a>
                    </p>
                    <p style={{ margin: "0 0 6px", fontSize: 13, color: "#475569" }}>
                      Reference de paiement: <strong>{paymentRef}</strong>
                    </p>
                    <p style={{ margin: 0, fontSize: 13, color: "#475569" }}>Montant a regler: <strong>{formatFcfa(totals.total)}</strong></p>
                  </div>
                  {qrCodeUrl ? (
                    <div style={{ marginTop: 12, display: "grid", justifyItems: "start", gap: 8 }}>
                      <p style={{ margin: 0, fontWeight: 700 }}>Code QR ({payment === "wave" ? "Wave" : "Orange Money"})</p>
                      <img src={qrCodeUrl} alt="Code QR de paiement" width={220} height={220} style={{ borderRadius: 10, border: "1px solid #e2e8f0" }} />
                      <p style={{ margin: 0, color: "#64748b", fontSize: 12 }}>Scannez le QR, validez le montant, puis confirmez.</p>
                    </div>
                  ) : null}
                  {error ? (
                    <p style={{ margin: "10px 0 0", color: "#b91c1c", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "8px 10px" }}>
                      {error}
                    </p>
                  ) : null}
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button style={ghostButton} onClick={() => setStep(2)}>
                      Retour
                    </button>
                    <motion.button whileTap={{ scale: 0.98 }} style={primaryButton} onClick={placeOrder} disabled={isLoading || items.length === 0}>
                      {isLoading ? "Traitement..." : "Payer et confirmer"}
                    </motion.button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </section>

          <aside
            className="surface-card mobile-sticky-aside"
            style={{
              borderRadius: 12,
              padding: 16,
              height: "fit-content",
              position: "sticky",
              top: 92,
            }}
          >
            <h3 style={{ margin: "0 0 10px" }}>Recapitulatif</h3>
            <div style={{ display: "grid", gap: 6 }}>
              {items.map((item) => (
                <p key={item.id} style={{ margin: 0, color: "#334155", fontSize: 14 }}>
                  {item.quantity} x {item.name}
                </p>
              ))}
            </div>
            <hr style={{ margin: "12px 0", borderColor: "#e2e8f0" }} />
            <p style={row}>
              <span>Sous-total</span>
              <strong>{formatFcfa(totals.subtotal)}</strong>
            </p>
            <p style={row}>
              <span>Livraison</span>
              <strong>{formatFcfa(totals.shipping)}</strong>
            </p>
            <p style={row}>
              <span>TVA</span>
              <strong>{formatFcfa(totals.taxes)}</strong>
            </p>
            <p style={{ ...row, fontSize: 18, marginTop: 2 }}>
              <span>Total</span>
              <strong>{formatFcfa(totals.total)}</strong>
            </p>

            <div style={{ marginTop: 14, borderTop: "1px dashed #cbd5e1", paddingTop: 12, display: "grid", gap: 7 }}>
              <p style={{ margin: 0, fontSize: 13, color: "#475569" }}>Paiement securise</p>
              <p style={{ margin: 0, fontSize: 13, color: "#475569" }}>Assistance client prioritaire</p>
              <p style={{ margin: 0, fontSize: 13, color: "#475569" }}>Suivi commande en temps reel</p>
              <p style={{ margin: 0, fontSize: 13, color: "#475569" }}>Production locale au Senegal</p>
              <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>Atelier certifie - Controle qualite international</p>
            </div>
          </aside>
        </div>
      ) : (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: "#fff", border: "1px solid #dbe4f0", borderRadius: 16, padding: 20 }}
        >
          <h2 style={{ marginTop: 0 }}>Commande confirmee</h2>
          <p style={{ color: "#334155" }}>
            Merci pour votre achat. Numero de commande: <strong>{orderId}</strong>
          </p>
          <Link href={`/orders/${orderId}`} style={{ color: "#1d4ed8", textDecoration: "none", fontWeight: 700 }}>
            Suivre ma commande
          </Link>
        </motion.section>
      )}

      {step !== 4 && items.length > 0 ? (
        <div className="mobile-sticky-action">
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>Total a regler</p>
            <p style={{ margin: "2px 0 0", fontWeight: 800, color: "#0f172a" }}>{formatFcfa(totals.total)}</p>
          </div>
          <button
            type="button"
            onClick={step === 3 ? placeOrder : () => setStep((prev) => Math.min(3, prev + 1))}
            style={{ border: "none", borderRadius: 10, padding: "10px 12px", background: "#0f172a", color: "#fff", fontWeight: 700 }}
          >
            {step === 3 ? "Confirmer" : "Continuer"}
          </button>
        </div>
      ) : null}
    </main>
  );
}

function formatLabel(key: string) {
  const map: Record<string, string> = {
    fullName: "Nom complet",
    line1: "Adresse",
    city: "Ville",
    postalCode: "Code postal",
    country: "Pays",
    email: "Email",
  };
  return map[key] ?? key;
}

const input: React.CSSProperties = {
  width: "100%",
  border: "1px solid #cbd5e1",
  borderRadius: 10,
  padding: "10px 11px",
  background: "#fff",
};

const row: React.CSSProperties = {
  margin: "0 0 6px",
  display: "flex",
  justifyContent: "space-between",
};

const primaryButton: React.CSSProperties = {
  border: "none",
  borderRadius: 12,
  padding: "10px 14px",
  background: "#0f172a",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};

const ghostButton: React.CSSProperties = {
  border: "1px solid #cbd5e1",
  borderRadius: 12,
  padding: "10px 14px",
  background: "#fff",
  cursor: "pointer",
};
