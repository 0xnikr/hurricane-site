import ScrollReveal from "./ScrollReveal";

const products = [
  { name: "Storm Blend", price: "$29", tag: "Best Seller" },
  { name: "Typhoon Energy", price: "$24", tag: null },
  { name: "Cyclone Recovery", price: "$32", tag: "New" },
];

export default function FeaturedProducts() {
  return (
    <section className="section" style={{ background: "var(--warm-cream)" }}>
      <div className="container">
        <ScrollReveal style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{
            fontFamily: "var(--font-inter), -apple-system, system-ui, sans-serif",
            fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.15em",
            textTransform: "uppercase", color: "var(--hurricane-green)", marginBottom: 12,
          }}>
            Our Featured Products
          </p>
          <h2 style={{
            fontFamily: "var(--font-playfair-display), serif",
            fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 700,
            color: "var(--text-dark)", lineHeight: 1.2,
          }}>
            Premium Supplements,<br />
            Natural &amp; Certified Organic
          </h2>
        </ScrollReveal>

        <ScrollReveal stagger style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: "clamp(16px, 3vw, 32px)",
        }}>
          {products.map((p, i) => (
            <div key={i} className="card-hover" style={{
              background: "var(--off-white)", borderRadius: "var(--radius-lg)",
              overflow: "hidden", cursor: "pointer",
            }}>
              <div style={{
                aspectRatio: "1 / 1",
                background: "linear-gradient(145deg, var(--sage-mist) 0%, var(--sage-mist-light) 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", margin: 12, borderRadius: "var(--radius-md)",
              }}>
                {p.tag && (
                  <span style={{
                    position: "absolute", top: 12, left: 12, padding: "4px 12px",
                    background: "var(--hurricane-green)", color: "var(--off-white)",
                    fontFamily: "var(--font-inter), system-ui, sans-serif",
                    fontSize: "0.7rem", fontWeight: 600, borderRadius: "var(--radius-pill)",
                    letterSpacing: "0.05em", textTransform: "uppercase",
                  }}>
                    {p.tag}
                  </span>
                )}
                <span style={{ fontSize: "3rem" }}>🌿</span>
              </div>
              <div style={{ padding: "16px 20px 20px" }}>
                <h3 style={{
                  fontFamily: "var(--font-playfair-display), serif",
                  fontSize: "1.1rem", fontWeight: 600, color: "var(--text-dark)", marginBottom: 4,
                }}>
                  {p.name}
                </h3>
                <p style={{
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                  fontSize: "0.95rem", color: "var(--text-muted)", marginBottom: 16,
                }}>
                  {p.price}
                </p>
                <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px 24px", fontSize: "0.85rem" }}>
                  Shop Now
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </ScrollReveal>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .container div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; max-width: 360px; margin: 0 auto; }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          .container div[style*="grid-template-columns: repeat(3"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
