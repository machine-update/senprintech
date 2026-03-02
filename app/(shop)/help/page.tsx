export default function HelpPage() {
  const faq = [
    ["Quels formats sont acceptes ?", "PNG, JPG, SVG, PDF. Pour impression: 300 DPI recommande."],
    ["Comment suivre ma commande ?", "Depuis l'espace compte ou via l'email de confirmation."],
    ["Puis-je modifier une commande ?", "Oui avant le statut PRODUCTION."],
  ];

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 40px" }}>
      <h1 style={{ margin: 0, fontSize: 34 }}>Aide / FAQ</h1>
      <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
        {faq.map(([q, a]) => (
          <article key={q} style={{ background: "#fff", border: "1px solid #dbe4f0", borderRadius: 12, padding: 14 }}>
            <h2 style={{ margin: "0 0 6px", fontSize: 20 }}>{q}</h2>
            <p style={{ margin: 0, color: "#334155" }}>{a}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
