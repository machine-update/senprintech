"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function ConnexionPage() {
  const searchParams = useSearchParams();
  const callbackUrl = useMemo(() => searchParams.get("callbackUrl") ?? "/account", [searchParams]);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      identifier,
      password,
      callbackUrl,
      redirect: false,
    });

    setLoading(false);

    if (!result || result.error) {
      setError("Identifiants invalides.");
      return;
    }

    window.location.href = result.url ?? callbackUrl;
  }

  return (
    <main style={container}>
      <section style={card}>
        <p style={eyebrow}>Espace client</p>
        <h1 style={title}>Connexion</h1>
        <p style={subtitle}>Accedez a votre espace pour suivre vos commandes et vos designs.</p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginTop: 16 }}>
          <label style={label}>
            <span>Email ou numero</span>
            <input
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              style={input}
              type="text"
              placeholder="vous@entreprise.com"
              required
              autoComplete="username"
            />
          </label>

          <label style={label}>
            <span>Mot de passe</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              style={input}
              type="password"
              placeholder="********"
              required
              autoComplete="current-password"
            />
          </label>

          {error ? <p style={errorText}>{error}</p> : null}

          <button type="submit" style={primaryButton} disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div style={linksRow}>
          <Link href={`/mot-de-passe-oublie${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`} style={link}>
            Mot de passe oublie ?
          </Link>
          <Link href={`/inscription${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`} style={link}>
            Creer un compte
          </Link>
        </div>
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
  marginTop: 2,
};

const linksRow: React.CSSProperties = {
  marginTop: 14,
  display: "flex",
  justifyContent: "space-between",
  gap: 10,
  flexWrap: "wrap",
};

const link: React.CSSProperties = {
  textDecoration: "none",
  color: "#1d4ed8",
  fontWeight: 700,
  fontSize: 14,
};

const errorText: React.CSSProperties = {
  margin: 0,
  color: "#b91c1c",
  fontWeight: 600,
  fontSize: 13,
};
