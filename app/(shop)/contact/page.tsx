export default function ContactPage() {
  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px 40px" }}>
      <h1 style={{ margin: 0, fontSize: 34 }}>Contact</h1>
      <p style={{ margin: "8px 0 16px", color: "#475569" }}>Support commercial, technique et SAV.</p>
      <form style={{ display: "grid", gap: 10, background: "#fff", border: "1px solid #dbe4f0", borderRadius: 14, padding: 16 }}>
        <input placeholder="Nom" style={input} />
        <input placeholder="Email" type="email" style={input} />
        <input placeholder="Sujet" style={input} />
        <textarea placeholder="Message" rows={6} style={input} />
        <button type="button" style={button}>Envoyer (simulation)</button>
      </form>
    </main>
  );
}

const input: React.CSSProperties = {
  border: "1px solid #cbd5e1",
  borderRadius: 10,
  padding: "10px 12px",
  font: "inherit",
};

const button: React.CSSProperties = {
  border: "none",
  background: "#0f172a",
  color: "#fff",
  borderRadius: 10,
  padding: "10px 14px",
  fontWeight: 700,
  cursor: "pointer",
};
