export default function ProductLoading() {
  return (
    <main style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 20px 52px" }}>
      <div style={{ height: 16, width: 240, background: "#e2e8f0", borderRadius: 999, marginBottom: 12 }} />
      <div className="trust-grid">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="surface-card" style={{ height: 60 }} />
        ))}
      </div>
      <section className="mobile-stack" style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
        <div className="surface-card" style={{ height: 540 }} />
        <div style={{ display: "grid", gap: 12 }}>
          <div className="surface-card" style={{ height: 220 }} />
          <div className="surface-card" style={{ height: 320 }} />
        </div>
      </section>
    </main>
  );
}
