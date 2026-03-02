"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CircleDot, Headset, Truck } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";

type HomeProduct = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  isNew?: boolean;
  leadTimeDays?: number;
  image?: string;
};

type HomeCategory = {
  id: string;
  name: string;
  slug: string;
  image: string;
};

type UspItem = {
  title: string;
  subtitle: string;
};

type ReviewItem = {
  author: string;
  text: string;
  rating: number;
};

type PremiumHomeClientProps = {
  products: HomeProduct[];
  categories: HomeCategory[];
  uspItems: UspItem[];
  reviewHighlights: ReviewItem[];
};

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

export default function PremiumHomeClient({ products, categories, uspItems, reviewHighlights }: PremiumHomeClientProps) {
  const uspDetails: Record<string, string> = {
    "Qualite atelier": "Calibrage machine quotidien et verification finale avant expedition.",
    "Livraison fiable": "Tracking en temps reel et engagement de delais pour particuliers et pros.",
    "Support expert": "Equipe dediee, reponse rapide et accompagnement de A a Z.",
  };
  const uspIcons = [CircleDot, Truck, Headset];
  const heroBadges = [
    { icon: "★", label: "4.8/5 satisfaction client" },
    { icon: "↗", label: "Livraison express FR/UE" },
    { icon: "⎈", label: "Paiement securise" },
    { icon: "🇸🇳", label: "Production locale au Senegal" },
  ];
  const trustPillars = [
    { icon: "★", title: "4.8/5", subtitle: "Satisfaction client verifiee" },
    { icon: "↗", title: "Livraison rapide", subtitle: "Delais fiables FR/UE et Senegal" },
    { icon: "⎈", title: "Paiement securise", subtitle: "Parcours de paiement chiffre et fiable" },
    {
      icon: "◉",
      title: "Production locale au Senegal",
      subtitle: "Hub strategique, atelier certifie, qualite internationale",
    },
  ];

  return (
    <main>
      <section
        style={{
          background:
            "radial-gradient(1200px 500px at 78% 10%, rgba(59,130,246,0.18), rgba(59,130,246,0) 42%), linear-gradient(132deg, rgba(2,6,23,0.95) 0%, rgba(3,20,45,0.93) 42%, rgba(8,47,73,0.88) 100%), url(https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1800&q=80&fm=webp) center/cover",
          color: "#f8fafc",
          padding: "118px 24px 110px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 0.36, y: 4 }}
          transition={{ duration: 3.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 25%, rgba(255,255,255,0.08), rgba(255,255,255,0) 34%), radial-gradient(circle at 82% 70%, rgba(255,255,255,0.06), rgba(255,255,255,0) 38%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(2,6,23,0.28), rgba(2,6,23,0.62)), radial-gradient(circle at 50% 48%, rgba(2,6,23,0), rgba(2,6,23,0.32))",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.08,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.65) 0.45px, transparent 0.45px), radial-gradient(rgba(255,255,255,0.35) 0.45px, transparent 0.45px)",
            backgroundSize: "3px 3px, 5px 5px",
            backgroundPosition: "0 0, 1px 1px",
          }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          style={{
            position: "absolute",
            right: -160,
            top: -160,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.14), rgba(255,255,255,0))",
          }}
        />

        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 26, position: "relative" }}>
          <motion.div initial="hidden" animate="visible" variants={reveal} transition={{ duration: 0.6, ease: "easeOut" }}>
            <p style={{ margin: 0, letterSpacing: 2.3, fontSize: 11, textTransform: "uppercase", opacity: 0.92, fontWeight: 700 }}>
              Plateforme e-commerce premium
            </p>
            <h1 style={{ margin: "14px 0 16px", fontSize: "clamp(44px, 7.4vw, 74px)", lineHeight: 0.95, maxWidth: 850, letterSpacing: -1.6 }}>
              Marquez plus fort.
              <br />
              Vendez plus vite.
            </h1>
            <p style={{ margin: 0, maxWidth: 760, fontSize: 20, opacity: 0.9, lineHeight: 1.52, fontWeight: 500 }}>
              Personalisation premium, execution rapide et logistique internationale.
              <br />
              🇸🇳 Production locale au Senegal, atelier certifie et controle qualite international.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 34 }}>
              <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                <Link href="/design" style={ctaPrimary}>
                  Creer mon design
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                <Link href="/catalogue" style={ctaSecondary}>
                  Voir les meilleures ventes
                </Link>
              </motion.div>
            </div>

            <div style={{ marginTop: 24, display: "flex", gap: 9, flexWrap: "wrap" }}>
              {heroBadges.map((item) => (
                <motion.span
                  key={item.label}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{
                    fontSize: 12,
                    border: "1px solid rgba(255,255,255,0.24)",
                    borderRadius: 999,
                    padding: "7px 12px",
                    background: "rgba(255,255,255,0.04)",
                    transition: "all 0.3s ease",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    color: "rgba(248,250,252,0.94)",
                  }}
                >
                  <span style={{ fontSize: 11, opacity: 0.95 }}>{item.icon}</span>
                  {item.label}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <div style={{ display: "grid", gap: 10 }}>
            {uspItems.map((item, index) => (
              (() => {
                const Icon = uspIcons[index] ?? CircleDot;
                return (
                  <motion.article
                    key={item.title}
                    initial={{ opacity: 0, x: 22, y: 8 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{
                      delay: 0.12 * index + 0.16,
                      duration: 0.52,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{
                      y: -4,
                      scale: 1.005,
                      borderColor: "rgba(191,219,254,0.52)",
                      boxShadow:
                        "0 26px 44px -34px rgba(2,6,23,0.92), 0 0 0 1px rgba(148,197,255,0.18), inset 0 1px 0 rgba(255,255,255,0.22)",
                    }}
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      background:
                        "linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 42%, rgba(255,255,255,0.03) 100%)",
                      backdropFilter: "blur(14px) saturate(120%)",
                      WebkitBackdropFilter: "blur(14px) saturate(120%)",
                      border: "1px solid rgba(191,219,254,0.34)",
                      borderRadius: 14,
                      padding: "17px 18px",
                      transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                      display: "grid",
                      gridTemplateColumns: "32px 1fr",
                      gap: 12,
                      alignItems: "start",
                      boxShadow:
                        "0 18px 38px -32px rgba(2,6,23,0.94), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(255,255,255,0.08)",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        background:
                          "linear-gradient(110deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 24%, rgba(255,255,255,0) 55%)",
                        opacity: 0.72,
                      }}
                    />
                    <motion.span
                      whileHover={{ y: -1 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        position: "relative",
                        display: "inline-grid",
                        placeItems: "center",
                        width: 28,
                        height: 28,
                        borderRadius: 999,
                        border: "1px solid rgba(191,219,254,0.38)",
                        background: "rgba(15,23,42,0.28)",
                        color: "#c7dcff",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
                      }}
                    >
                      <Icon size={14} strokeWidth={1.9} />
                    </motion.span>
                    <div style={{ position: "relative" }}>
                      <p style={{ margin: 0, fontWeight: 750, fontSize: 31 / 2, letterSpacing: -0.2 }}>{item.title}</p>
                      <p style={{ margin: "6px 0 0", opacity: 0.86, fontSize: 15, lineHeight: 1.5 }}>{item.subtitle}</p>
                      <p style={{ margin: "6px 0 0", opacity: 0.68, fontSize: 13, lineHeight: 1.45 }}>
                        {uspDetails[item.title] ?? "Processus premium, execution fiable et qualite constante."}
                      </p>
                    </div>
                  </motion.article>
                );
              })()
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "18px 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 10 }}>
            {trustPillars.map((item) => (
              <motion.article
                key={item.title}
                whileHover={{ y: -2, boxShadow: "0 12px 24px -22px rgba(2,6,23,0.45)" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.72)",
                  padding: "11px 12px",
                  display: "grid",
                  gridTemplateColumns: "20px 1fr",
                  gap: 10,
                  alignItems: "start",
                }}
              >
                <span style={{ color: "#1e293b", fontSize: 13, lineHeight: 1.4 }}>{item.icon}</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, color: "#0f172a", fontSize: 14 }}>{item.title}</p>
                  <p style={{ margin: "3px 0 0", fontSize: 12, color: "#64748b", lineHeight: 1.4 }}>{item.subtitle}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "42px 20px 34px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, gap: 10 }}>
          <h2 style={{ margin: 0, fontSize: 32 }}>Best-sellers qui convertissent le plus</h2>
          <Link href="/search" style={{ textDecoration: "none", color: "#1d4ed8", fontWeight: 800 }}>
            Recherche avancee
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 14 }}>
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={reveal}
              transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ background: "#f1f5f9", borderTop: "1px solid #dbe4f0", borderBottom: "1px solid #dbe4f0" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "30px 20px" }}>
          <h2 style={{ margin: "0 0 16px", fontSize: 30 }}>Categories populaires</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 12 }}>
            {categories.map((cat) => (
              <motion.div key={cat.id} whileHover={{ y: -4 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                <Link href={`/search?category=${encodeURIComponent(cat.slug)}`} style={categoryCard}>
                  <div style={{ height: 118 }}>
                    <img src={cat.image} alt={cat.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ padding: 12, display: "grid", gap: 4 }}>
                    <p style={{ margin: 0, fontWeight: 700 }}>{cat.name}</p>
                    <p style={{ margin: "5px 0 0", color: "#475569", fontSize: 13 }}>Voir les produits</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "40px 20px 30px" }}>
        <h2 style={{ margin: "0 0 16px", fontSize: 30 }}>Processus ultra simple en 3 etapes</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 12 }}>
          {[
            { title: "1. Choisir", desc: "Selectionne produit, quantite et options." },
            { title: "2. Personnaliser", desc: "Ajoute texte/logo, valide l'apercu HD." },
            { title: "3. Recevoir", desc: "Production rapide puis suivi jusqu'a livraison." },
          ].map((step) => (
            <motion.article
              key={step.title}
              whileHover={{ y: -4, borderColor: "#93c5fd", boxShadow: "0 14px 26px -24px rgba(2,6,23,0.5)" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ background: "#fff", borderRadius: 12, border: "1px solid #cbd5e1", padding: 14 }}
            >
              <p style={{ margin: 0, fontWeight: 800 }}>{step.title}</p>
              <p style={{ margin: "8px 0 0", color: "#334155", lineHeight: 1.5 }}>{step.desc}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "0 20px 36px" }}>
        <h2 style={{ margin: "0 0 14px", fontSize: 28 }}>Avis clients</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
          {reviewHighlights.map((review) => (
            <motion.article
              key={review.author}
              whileHover={{ y: -4, boxShadow: "0 12px 24px -20px rgba(2,6,23,0.45)" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ background: "#fff", border: "1px solid #dbe4f0", borderRadius: 12, padding: 14, transition: "all 0.3s ease" }}
            >
              <p style={{ margin: 0, fontWeight: 700 }}>{review.author}</p>
              <p style={{ margin: "4px 0 8px", color: "#475569", fontSize: 14 }}>{"★".repeat(review.rating)}</p>
              <p style={{ margin: 0, color: "#334155", lineHeight: 1.5 }}>{review.text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "0 20px 58px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          style={{
            background: "linear-gradient(128deg, #082f49 0%, #1e3a8a 100%)",
            borderRadius: 12,
            color: "#fff",
            padding: 24,
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr",
            gap: 14,
            alignItems: "center",
            boxShadow: "0 20px 40px -34px rgba(2,6,23,0.78)",
          }}
        >
          <div>
            <h2 style={{ margin: "0 0 8px", fontSize: 30 }}>Espace entreprise haute performance</h2>
            <p style={{ margin: 0, opacity: 0.92, lineHeight: 1.55 }}>
              Devis en volume, historique centralise, upload fichiers pro, production & logistique internationale.
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "end", gap: 10, flexWrap: "wrap" }}>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.3, ease: "easeOut" }}>
              <Link href="/business" style={{ ...ctaPrimary, background: "#fff", color: "#0f172a" }}>
                Espace entreprise
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.8, duration: 0.4, ease: "easeOut" }}
        style={{
          position: "fixed",
          bottom: 18,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 80,
          background: "rgba(15,23,42,0.95)",
          border: "1px solid rgba(148,163,184,0.5)",
          borderRadius: 999,
          padding: "8px 8px 8px 14px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          boxShadow: "0 10px 30px -22px rgba(2,6,23,0.82)",
        }}
      >
        <span style={{ color: "#e2e8f0", fontSize: 13 }}>Pret a lancer ton projet ?</span>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.3, ease: "easeOut" }}>
          <Link href="/design" style={{ ...ctaPrimary, padding: "9px 13px", fontSize: 13 }}>
            Demarrer maintenant
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}

const ctaPrimary: React.CSSProperties = {
  background: "linear-gradient(180deg, #ffffff 0%, #f3f6fb 100%)",
  color: "#0b1f3a",
  textDecoration: "none",
  padding: "12px 18px",
  borderRadius: 12,
  fontWeight: 800,
  display: "inline-block",
  transition: "all 0.3s ease",
  boxShadow: "0 14px 24px -20px rgba(2,6,23,0.8), inset 0 1px 0 rgba(255,255,255,0.9)",
  border: "1px solid rgba(255,255,255,0.84)",
};

const ctaSecondary: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.40)",
  color: "#f8fafc",
  textDecoration: "none",
  padding: "12px 18px",
  borderRadius: 12,
  fontWeight: 700,
  display: "inline-block",
  transition: "all 0.3s ease",
  background: "rgba(255,255,255,0.03)",
};

const categoryCard: React.CSSProperties = {
  textDecoration: "none",
  color: "#0f172a",
  background: "#fff",
  border: "1px solid #dbe4f0",
  borderRadius: 12,
  overflow: "hidden",
  display: "block",
  transition: "all 0.3s ease",
};
