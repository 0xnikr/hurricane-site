import ScrollReveal from "./ScrollReveal";
import Link from "next/link";

const cards = [
  {
    icon: "🌱",
    title: "For Peak Energy",
    description: "Natural supplements crafted to fuel your body and keep you going all day.",
  },
  {
    icon: "🤝",
    title: "Share What You Love",
    description: "Refer friends and family to experience the power of natural extracts.",
  },
  {
    icon: "🌿",
    title: "Pure Wellness",
    description: "Treat yourself to the cleanest, most effective supplements nature offers.",
  },
];

export default function CTABanner() {
  return (
    <section className="section" style={{ background: "var(--warm-cream)" }}>
      <div className="container">
        <ScrollReveal style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{
            fontFamily: "var(--font-bebas-neue), sans-serif",
            fontSize: "clamp(2rem, 4vw, 3.2rem)", letterSpacing: "0.03em",
            color: "var(--text-dark)", lineHeight: 1.1,
          }}>
            TRADITION MEETS THE POWER
            <br />
            <span style={{ color: "var(--hurricane-green)" }}>OF NATURE</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal stagger style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: "clamp(16px, 3vw, 32px)",
        }}>
          {cards.map((c, i) => (
            <div key={i} className="card-hover" style={{
              background: "var(--off-white)", borderRadius: "var(--radius-lg)",
              padding: "clamp(28px, 3vw, 40px)", textAlign: "center",
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "var(--sage-mist-light)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px", fontSize: "1.5rem",
              }}>
                {c.icon}
              </div>
              <h3 style={{
                fontFamily: "var(--font-playfair-display), serif",
                fontSize: "1.1rem", fontWeight: 600, color: "var(--text-dark)", marginBottom: 10,
              }}>
                {c.title}
              </h3>
              <p style={{
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 20,
              }}>
                {c.description}
              </p>
              <Link href="/products" className="btn-outline" style={{ fontSize: "0.82rem", padding: "10px 24px", textDecoration: "none" }}>
                Shop Now
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          ))}
        </ScrollReveal>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .container div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; max-width: 380px; margin: 0 auto; }
        }
      `}</style>
    </section>
  );
}
