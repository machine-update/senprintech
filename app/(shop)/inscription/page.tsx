"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function InscriptionPage() {
  const searchParams = useSearchParams();
  const callbackUrl = useMemo(() => searchParams.get("callbackUrl") ?? "/account", [searchParams]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        acceptedTerms,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      setLoading(false);
      setError(data.error ?? "Impossible de creer le compte.");
      return;
    }

    const login = await signIn("credentials", {
      identifier: email,
      password,
      callbackUrl,
      redirect: false,
    });

    setLoading(false);

    if (!login || login.error) {
      window.location.href = "/connexion";
      return;
    }

    window.location.href = login.url ?? callbackUrl;
  }

  return (
    <main style={container}>
      <section style={card}>
        <p style={eyebrow}>Nouveau compte</p>
        <h1 style={title}>Inscription</h1>
        <p style={subtitle}>Creer votre espace client pour commander, personnaliser et suivre vos productions.</p>

        <form onSubmit={handleSubmit} style={{ marginTop: 16, display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
            <label style={label}>
              <span>Prenom</span>
              <input value={firstName} onChange={(event) => setFirstName(event.target.value)} style={input} required />
            </label>
            <label style={label}>
              <span>Nom</span>
              <input value={lastName} onChange={(event) => setLastName(event.target.value)} style={input} required />
            </label>
          </div>

          <label style={label}>
            <span>Email</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              style={input}
              type="email"
              required
              autoComplete="email"
            />
          </label>

          <label style={label}>
            <span>Mot de passe</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              style={input}
              type="password"
              required
              autoComplete="new-password"
            />
          </label>

          <label style={label}>
            <span>Confirmation du mot de passe</span>
            <input
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              style={input}
              type="password"
              required
              autoComplete="new-password"
            />
          </label>

          <label style={checkboxLabel}>
            <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} required />
            <span>J'accepte les CGU et la politique de confidentialite.</span>
          </label>

          {error ? <p style={errorText}>{error}</p> : null}

          <button type="submit" style={primaryButton} disabled={loading}>
            {loading ? "Creation..." : "Creer mon compte"}
          </button>
        </form>

        <p style={{ margin: "14px 0 0", color: "#64748b", fontSize: 14 }}>
          Deja inscrit ?{" "}
          <Link href={`/connexion${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`} style={link}>
            Se connecter
          </Link>
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
  maxWidth: 620,
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

const checkboxLabel: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  color: "#334155",
  fontSize: 14,
  fontWeight: 500,
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
