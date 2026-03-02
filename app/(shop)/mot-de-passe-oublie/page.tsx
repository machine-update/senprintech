"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function MotDePasseOubliePage() {
  const searchParams = useSearchParams();
  const callbackUrl = useMemo(() => searchParams.get("callbackUrl") ?? "/account", [searchParams]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [debugLink, setDebugLink] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    setDebugLink("");

    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Impossible d'envoyer le lien.");
      return;
    }

    setMessage(data.message ?? "Si un compte existe, un lien a ete envoye.");
    if (data.debugResetLink) setDebugLink(data.debugResetLink);
  }

  return (
    <main style={container}>
      <section style={card}>
        <p style={eyebrow}>Recuperation</p>
        <h1 style={title}>Mot de passe oublie</h1>
        <p style={subtitle}>Recevez un lien de reinitialisation securise.</p>

        <form onSubmit={handleSubmit} style={{ marginTop: 16, display: "grid", gap: 12 }}>
          <label style={label}>
            <span>Email de connexion</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              style={input}
              type="email"
              placeholder="vous@entreprise.com"
              required
            />
          </label>

          {error ? <p style={errorText}>{error}</p> : null}
          {message ? <p style={successText}>{message}</p> : null}
          {debugLink ? (
            <p style={{ margin: 0, fontSize: 13, color: "#475569" }}>
              Lien de test:{" "}
              <Link href={debugLink} style={{ color: "#1d4ed8", textDecoration: "none", fontWeight: 700 }}>
                Ouvrir la reinitialisation
              </Link>
            </p>
          ) : null}

          <button type="submit" style={primaryButton} disabled={loading}>
            {loading ? "Envoi..." : "Envoyer le lien"}
          </button>
        </form>

        <p style={{ margin: "14px 0 0", color: "#64748b", fontSize: 14 }}>
          Retour a{" "}
          <Link href={`/connexion${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`} style={link}>
            la connexion
          </Link>
          .
        </p>
      </section>
    </main>
  );
}

const container: React.CSSProperties = {
  maxWidth: 1120,
  margin: "0 auto",
  padding: "44px 20px 58px",
};

const card: React.CSSProperties = {
  maxWidth: 520,
  margin: "0 auto",
  borderRadius: 16,
  background:
    "linear-gradient(160deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
  border: "1px solid #dbe4f0",
  boxShadow: "0 20px 42px -36px rgba(2, 6, 23, 0.58)",
  padding: 28,
};

const eyebrow: React.CSSProperties = {
  margin: 0,
  color: "#1d4ed8",
  fontSize: 12,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const title: React.CSSProperties = {
  margin: "6px 0 0",
  fontSize: 36,
  letterSpacing: -0.8,
};

const subtitle: React.CSSProperties = {
  margin: "10px 0 0",
  color: "#475569",
  lineHeight: 1.45,
};

const label: React.CSSProperties = {
  display: "grid",
  gap: 6,
  color: "#334155",
  fontWeight: 600,
  fontSize: 14,
};

const input: React.CSSProperties = {
  border: "1px solid #cbd5e1",
  borderRadius: 10,
  padding: "11px 12px",
  background: "#fff",
  color: "#0f172a",
  fontSize: 15,
};

const primaryButton: React.CSSProperties = {
  border: "none",
  borderRadius: 12,
  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  color: "#fff",
  fontWeight: 800,
  fontSize: 15,
  padding: "12px 14px",
  cursor: "pointer",
};

const link: React.CSSProperties = {
  textDecoration: "none",
  color: "#1d4ed8",
  fontWeight: 700,
};

const errorText: React.CSSProperties = {
  margin: 0,
  color: "#b91c1c",
  fontWeight: 600,
  fontSize: 13,
};

const successText: React.CSSProperties = {
  margin: 0,
  color: "#166534",
  fontWeight: 600,
  fontSize: 13,
};
