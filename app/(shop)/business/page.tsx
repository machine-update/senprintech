import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Building2,
  ClipboardCheck,
  CreditCard,
  Factory,
  FileText,
  Globe2,
  MapPin,
  PencilLine,
  Repeat2,
  ShieldCheck,
  Upload,
  Users2,
} from "lucide-react";

export default async function BusinessPage() {
  const quotes = await prisma.businessQuote.findMany({ orderBy: { createdAt: "desc" }, take: 8 });

  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: "34px 20px 52px" }}>
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(900px 320px at 80% -5%, rgba(96,165,250,0.24), rgba(96,165,250,0) 52%), linear-gradient(146deg, #061a3a 0%, #0f2c63 48%, #0e3a7a 100%)",
          borderRadius: 16,
          color: "#fff",
          padding: 28,
          boxShadow: "0 24px 44px -34px rgba(2,6,23,0.82)",
          border: "1px solid rgba(148,163,184,0.24)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.09,
            backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 0.45px, transparent 0.45px)",
            backgroundSize: "3px 3px",
          }}
        />
        <h1 style={{ margin: 0, fontSize: 44, lineHeight: 1.02, letterSpacing: -0.8 }}>Espace Entreprise</h1>
        <p style={{ margin: "10px 0 0", fontSize: 20, fontWeight: 600, maxWidth: 820 }}>
          Une plateforme concue pour les equipes qui scalent.
        </p>
        <p style={{ margin: "10px 0 0", maxWidth: 860, opacity: 0.9, lineHeight: 1.58, fontSize: 15 }}>
          Pilotage des volumes, centralisation des demandes, controle des couts et suivi de production
          en temps reel pour les operations marketing, RH et retail.
        </p>
        <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <span style={heroChip}>SLA operationnel</span>
          <span style={heroChip}>Support B2B prioritaire</span>
          <span style={heroChip}>🇸🇳 Hub strategique: Dakar - Senegal</span>
        </div>
        <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/contact" style={heroPrimaryCta}>
            Demander un devis entreprise
          </Link>
          <Link href="/account" style={heroSecondaryCta}>
            Creer un compte B2B
          </Link>
        </div>
      </section>

      <section style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 12 }}>
        {[
          { title: "Tarification volume", text: "Tarification dégressive selon les quantités.", icon: BarChart3, accent: "#0ea5e9" },
          { title: "Comptes multi-utilisateurs", text: "Gestion des profils equipe (option evolutive).", icon: Building2, accent: "#2563eb" },
          { title: "Facturation pro", text: "TVA, adresses multiples et export comptable.", icon: CreditCard, accent: "#0f766e" },
          { title: "Commandes récurrentes", text: "Réassort simplifié et modèles de design.", icon: Repeat2, accent: "#6d28d9" },
        ].map((item, index) => (
          <article key={item.title} className="hover-lift" style={card}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 999,
                  display: "inline-grid",
                  placeItems: "center",
                  background: `${item.accent}1A`,
                  color: item.accent,
                  border: `1px solid ${item.accent}55`,
                }}
              >
                <item.icon size={15} strokeWidth={2} />
              </span>
              <p style={{ margin: 0, fontSize: 12, color: "#64748b", fontWeight: 700 }}>Fonctionnalité {index + 1}</p>
            </div>
            <h3 style={{ margin: "10px 0 6px", fontSize: 28 / 2, letterSpacing: -0.2 }}>{item.title}</h3>
            <p style={{ margin: 0, color: "#475569", lineHeight: 1.5 }}>{item.text}</p>
          </article>
        ))}
      </section>

      <section style={{ marginTop: 20 }}>
        <h2 style={{ margin: "0 0 12px", fontSize: 34 / 2, letterSpacing: -0.2 }}>Comment ca marche</h2>
        <div style={{ position: "relative", marginTop: 2 }}>
          <div
            style={{
              position: "absolute",
              left: 26,
              right: 26,
              top: 34,
              height: 2,
              background: "linear-gradient(90deg, #bfdbfe 0%, #93c5fd 50%, #bfdbfe 100%)",
              zIndex: 0,
            }}
          />
          <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 12 }}>
            {[
              {
                step: "1",
                title: "Creation du compte entreprise",
                text: "Configuration des profils et droits d'acces pour les equipes.",
                icon: Users2,
              },
              {
                step: "2",
                title: "Import des designs ou gabarits",
                text: "Depot centralise des assets et validation des fichiers HD.",
                icon: Upload,
              },
              {
                step: "3",
                title: "Devis automatique ou personnalise",
                text: "Simulation instantanee ou chiffrage sur mesure selon vos besoins.",
                icon: ClipboardCheck,
              },
              {
                step: "4",
                title: "Production & suivi en temps reel",
                text: "Pilotage des commandes et tracking des livraisons jusqu'a reception.",
                icon: Activity,
              },
            ].map((item) => (
              <article key={item.title} className="hover-lift" style={{ ...card, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={stepDot}>
                    <item.icon size={14} strokeWidth={2} />
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: "#1d4ed8" }}>ETAPE {item.step}</span>
                </div>
                <h3 style={{ margin: "10px 0 6px", fontSize: 15 }}>{item.title}</h3>
                <p style={{ margin: 0, color: "#475569", lineHeight: 1.5 }}>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 12 }} className="mobile-stack">
        <article style={card}>
          <h2 style={{ margin: "0 0 10px", fontSize: 34 / 2, letterSpacing: -0.2 }}>Tarification entreprise</h2>
          <p style={{ margin: "0 0 10px", color: "#475569" }}>
            Tarification degressive automatique visible au panier, avec optimisation selon le volume.
          </p>
          <div style={{ border: "1px solid #dbe4f0", borderRadius: 12, overflow: "hidden" }}>
            <div style={pricingHeader}>
              <span>Quantite</span>
              <span>Remise</span>
            </div>
            {[
              { qty: "50+", discount: "-5%" },
              { qty: "100+", discount: "-10%" },
              { qty: "500+", discount: "-20%" },
            ].map((row) => (
              <div key={row.qty} style={pricingRow}>
                <span>{row.qty}</span>
                <strong style={{ color: "#166534" }}>{row.discount}</strong>
              </div>
            ))}
          </div>
        </article>

        <article style={card}>
          <h2 style={{ margin: "0 0 10px", fontSize: 34 / 2, letterSpacing: -0.2 }}>Pourquoi choisir l'Espace Entreprise ?</h2>
          <div style={{ display: "grid", gap: 8 }}>
            {[
              { icon: Building2, text: "Centralisation des commandes multi-equipes" },
              { icon: CreditCard, text: "Facturation consolidee et suivi financier" },
              { icon: Users2, text: "Gestion multi-utilisateurs et permissions" },
              { icon: ShieldCheck, text: "SLA prioritaire et support dedie B2B" },
              { icon: Factory, text: "Controle qualite certifie sur chaque production" },
              { icon: MapPin, text: "Hub strategique Dakar - Senegal, logistique internationale" },
            ].map((item) => (
              <p key={item.text} style={{ margin: 0, color: "#334155", display: "flex", alignItems: "center", gap: 8 }}>
                <item.icon size={14} color="#2563eb" />
                {item.text}
              </p>
            ))}
          </div>
        </article>
      </section>

      <section style={{ marginTop: 20 }}>
        <h2 style={{ margin: "0 0 10px", fontSize: 34 / 2, letterSpacing: -0.2 }}>Dernieres demandes de devis</h2>
        <div style={{ display: "grid", gap: 10 }}>
          {quotes.map((quote) => (
            <article key={quote.id} className="hover-lift" style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12, flexWrap: "wrap" }}>
                <div style={{ display: "grid", gridTemplateColumns: "34px 1fr", gap: 10, alignItems: "start" }}>
                  <span
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 999,
                      display: "inline-grid",
                      placeItems: "center",
                      background: "#eff6ff",
                      border: "1px solid #bfdbfe",
                      color: "#1d4ed8",
                    }}
                  >
                    <Building2 size={16} />
                  </span>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700 }}>{quote.companyName}</p>
                    <p style={{ margin: "3px 0 0", color: "#475569", fontSize: 14 }}>
                      {quote.quantity} unites • {quote.email}
                    </p>
                  </div>
                </div>
                <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
                  <span style={statusBadge(quote.status)}>{translateQuoteStatus(quote.status)}</span>
                  <p style={{ margin: 0, color: "#0f172a", fontWeight: 700, fontSize: 14 }}>
                    Montant estime: {formatFcfa(estimateQuoteAmount(quote.quantity))}
                  </p>
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                  {getQuoteTimeline(quote.status).map((step) => (
                    <span
                      key={step.label}
                      style={{
                        border: `1px solid ${step.active ? "#bfdbfe" : "#dbe4f0"}`,
                        background: step.active ? "#eff6ff" : "#f8fafc",
                        color: step.active ? "#1d4ed8" : "#64748b",
                        borderRadius: 999,
                        padding: "4px 8px",
                        fontSize: 11,
                        fontWeight: 700,
                        textAlign: "center",
                      }}
                    >
                      {step.label}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap", fontSize: 12, color: "#64748b" }}>
                <span style={metaChip}><FileText size={13} /> Devis structurable</span>
                <span style={metaChip}><Globe2 size={13} /> Production & logistique internationale</span>
              </div>
              <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button type="button" style={actionButton}>
                  <FileText size={14} /> Voir le devis
                </button>
                <button type="button" style={actionGhostButton}>
                  <PencilLine size={14} /> Modifier
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 18 }} className="surface-card">
        <div style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: "#64748b", fontWeight: 700 }}>ACTIVER LE CANAL B2B</p>
            <h3 style={{ margin: "6px 0 0", fontSize: 24, letterSpacing: -0.3 }}>Demarrer vos commandes volume en 24h</h3>
          </div>
          <Link href="/contact" style={finalCta}>
            Demander un devis entreprise
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}

const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #dbe4f0",
  borderRadius: 14,
  padding: 14,
  boxShadow: "0 14px 28px -24px rgba(2,6,23,0.5)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
};

const heroChip: React.CSSProperties = {
  border: "1px solid rgba(191,219,254,0.42)",
  borderRadius: 999,
  padding: "6px 10px",
  fontSize: 12,
  color: "rgba(239,246,255,0.94)",
  background: "rgba(255,255,255,0.06)",
  fontWeight: 600,
};

const heroPrimaryCta: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  textDecoration: "none",
  borderRadius: 11,
  padding: "10px 13px",
  background: "linear-gradient(180deg, #ffffff 0%, #eff6ff 100%)",
  color: "#0f172a",
  fontWeight: 800,
  border: "1px solid rgba(255,255,255,0.8)",
  boxShadow: "0 12px 22px -18px rgba(2,6,23,0.78)",
};

const heroSecondaryCta: React.CSSProperties = {
  display: "inline-flex",
  textDecoration: "none",
  borderRadius: 11,
  padding: "10px 13px",
  border: "1px solid rgba(191,219,254,0.5)",
  color: "#f8fafc",
  background: "rgba(255,255,255,0.05)",
  fontWeight: 700,
};

const stepDot: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 999,
  display: "inline-grid",
  placeItems: "center",
  border: "1px solid #bfdbfe",
  background: "#eff6ff",
  color: "#1d4ed8",
};

const metaChip: React.CSSProperties = {
  display: "inline-flex",
  gap: 5,
  alignItems: "center",
  border: "1px solid #dbe4f0",
  borderRadius: 999,
  padding: "4px 9px",
  background: "#f8fafc",
};

const pricingHeader: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: 8,
  padding: "10px 12px",
  background: "#f8fafc",
  borderBottom: "1px solid #dbe4f0",
  fontSize: 12,
  color: "#64748b",
  fontWeight: 700,
};

const pricingRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: 8,
  padding: "10px 12px",
  borderBottom: "1px solid #eef2f7",
  color: "#0f172a",
  fontSize: 14,
};

const actionButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  border: "none",
  borderRadius: 10,
  padding: "8px 10px",
  background: "#0f172a",
  color: "#fff",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
};

const actionGhostButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  border: "1px solid #cbd5e1",
  borderRadius: 10,
  padding: "8px 10px",
  background: "#fff",
  color: "#0f172a",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
};

const finalCta: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  textDecoration: "none",
  borderRadius: 11,
  padding: "10px 14px",
  background: "#0f172a",
  color: "#fff",
  fontWeight: 800,
  boxShadow: "0 12px 24px -20px rgba(2,6,23,0.78)",
};

function statusBadge(status: string): React.CSSProperties {
  const normalized = status.toUpperCase();
  if (normalized === "IN_REVIEW") {
    return {
      border: "1px solid #bfdbfe",
      background: "#eff6ff",
      color: "#1d4ed8",
      borderRadius: 999,
      padding: "5px 9px",
      fontSize: 11,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: 0.3,
    };
  }
  if (normalized === "NEW") {
    return {
      border: "1px solid #c7d2fe",
      background: "#eef2ff",
      color: "#4338ca",
      borderRadius: 999,
      padding: "5px 9px",
      fontSize: 11,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: 0.3,
    };
  }
  return {
    border: "1px solid #dbe4f0",
    background: "#f8fafc",
    color: "#334155",
    borderRadius: 999,
    padding: "5px 9px",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  };
}

function translateQuoteStatus(status: string): string {
  const normalized = status.toUpperCase();
  if (normalized === "IN_REVIEW") return "En revue";
  if (normalized === "NEW") return "Nouveau";
  if (normalized === "APPROVED") return "Validé";
  return status.toLowerCase();
}

function estimateQuoteAmount(quantity: number): number {
  const base = quantity * 19.9;
  if (quantity >= 500) return Number((base * 0.8).toFixed(2));
  if (quantity >= 100) return Number((base * 0.9).toFixed(2));
  if (quantity >= 50) return Number((base * 0.95).toFixed(2));
  return Number(base.toFixed(2));
}

function getQuoteTimeline(status: string): Array<{ label: string; active: boolean }> {
  const normalized = status.toUpperCase();
  return [
    { label: "Nouveau", active: ["NEW", "IN_REVIEW", "APPROVED"].includes(normalized) },
    { label: "En revue", active: ["IN_REVIEW", "APPROVED"].includes(normalized) },
    { label: "Valide", active: ["APPROVED"].includes(normalized) },
  ];
}

function formatFcfa(amountEur: number): string {
  const amountXof = Math.round(amountEur * 655.957);
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(amountXof)} FCFA`;
}
