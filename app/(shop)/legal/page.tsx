export default function LegalPage() {
  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 40px" }}>
      <h1 style={{ margin: 0, fontSize: 34 }}>CGU & Confidentialite</h1>
      <section style={{ marginTop: 14, background: "#fff", border: "1px solid #dbe4f0", borderRadius: 12, padding: 14 }}>
        <h2 style={{ margin: "0 0 8px" }}>RGPD</h2>
        <p style={{ margin: 0, color: "#334155" }}>
          Les donnees personnelles sont utilisees pour traitement commande, facturation et suivi SAV. Droit d'acces/suppression sur demande.
        </p>
      </section>
      <section style={{ marginTop: 10, background: "#fff", border: "1px solid #dbe4f0", borderRadius: 12, padding: 14 }}>
        <h2 style={{ margin: "0 0 8px" }}>Conditions de vente</h2>
        <p style={{ margin: 0, color: "#334155" }}>
          Production lancee apres validation paiement/fichiers. Delais indicatifs selon charge atelier. Retours geres via support.
        </p>
      </section>
    </main>
  );
}
