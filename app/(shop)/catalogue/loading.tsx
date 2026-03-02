export default function CatalogueLoading() {
  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: "34px 20px 48px" }}>
      <div className="surface-card" style={{ padding: 16, height: 140 }} />
      <div style={{ marginTop: 14 }} className="trust-grid">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="surface-card" style={{ height: 60 }} />
        ))}
      </div>
      <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 14 }}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="surface-card" style={{ height: 340 }} />
        ))}
      </div>
    </main>
  );
}
