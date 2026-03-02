"use client";

import { motion } from "framer-motion";

const trustItems = [
  { icon: "★", title: "4.8/5", subtitle: "Satisfaction client verifiee" },
  { icon: "↗", title: "Livraison 24-72h", subtitle: "Delais fiables et suivi transparent" },
  { icon: "⎈", title: "Paiement securise", subtitle: "Protection des transactions et donnees" },
  {
    icon: "🇸🇳",
    title: "Production locale au Senegal",
    subtitle: "Atelier certifie - Controle qualite international",
  },
  { icon: "◌", title: "Support expert", subtitle: "Accompagnement avant et apres commande" },
];

export default function TrustProofBar() {
  return (
    <section style={{ marginTop: 14 }} aria-label="Preuves de confiance">
      <div className="trust-grid">
        {trustItems.map((item) => (
          <motion.article
            key={item.title}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="surface-card hover-lift"
            style={{ padding: "10px 12px", display: "grid", gridTemplateColumns: "20px 1fr", gap: 10 }}
          >
            <span style={{ fontSize: 13, lineHeight: 1.4, color: "#0f172a" }}>{item.icon}</span>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{item.title}</p>
              <p style={{ margin: "3px 0 0", fontSize: 12, color: "#64748b", lineHeight: 1.4 }}>{item.subtitle}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
