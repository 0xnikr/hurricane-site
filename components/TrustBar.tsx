import ScrollReveal from "./ScrollReveal";

const benefits = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 8v4c0 1-1 4-5 6m5-10v4c0 1 1 4 5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="16" cy="22" r="2" fill="currentColor" />
      </svg>
    ),
    title: "100% Natural",
    description: "We source only the finest natural ingredients, carefully extracted to preserve maximum potency.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M10 26V14l6-8 6 8v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 26v-6h4v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 14h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Lab Tested",
    description: "Every batch undergoes rigorous third-party testing to ensure purity, safety, and efficacy.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M4 16l6 6L26 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="2" y="6" width="28" height="20" rx="4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: "Fast Shipping",
    description: "Order today and receive your supplements quickly, with free shipping on orders over $50.",
  },
];

export default function TrustBar() {
  return (
    <section className="section" style={{ background: "var(--off-white)" }}>
      <ScrollReveal stagger style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(24px, 4vw, 48px)", maxWidth: 1200, margin: "0 auto" }}>
        {benefits.map((b, i) => (
          <div key={i} style={{ textAlign: "center", padding: "32px 24px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 64, height: 64, borderRadius: "50%",
              background: "var(--sage-mist-light)", color: "var(--hurricane-green)", marginBottom: 20,
            }}>
              {b.icon}
            </div>
            <h3 style={{
              fontFamily: "var(--font-playfair-display), serif",
              fontSize: "1.2rem", fontWeight: 600, color: "var(--text-dark)", marginBottom: 10,
            }}>
              {b.title}
            </h3>
            <p style={{
              fontFamily: "var(--font-inter), -apple-system, system-ui, sans-serif",
              fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 280, margin: "0 auto",
            }}>
              {b.description}
            </p>
          </div>
        ))}
      </ScrollReveal>
      <style>{`
        @media (max-width: 640px) {
          .section > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
