import ScrollReveal from "./ScrollReveal";

export default function Newsletter() {
  return (
    <section className="section" style={{ background: "var(--off-white)" }}>
      <div className="container">
        <ScrollReveal style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "clamp(32px, 5vw, 64px)", alignItems: "center",
          background: "linear-gradient(135deg, var(--deep-forest) 0%, #1f3d1f 100%)",
          borderRadius: "var(--radius-xl)", padding: "clamp(40px, 5vw, 64px)",
          overflow: "hidden", position: "relative",
        }}>
          {/* Decorative glow */}
          <div style={{
            position: "absolute", width: 300, height: 300, borderRadius: "50%",
            background: "rgba(200, 212, 184, 0.06)", top: -80, right: -80,
            pointerEvents: "none",
          }} />

          {/* Left: Image placeholder */}
          <div style={{
            width: "100%", aspectRatio: "3 / 4", maxWidth: 300,
            borderRadius: "var(--radius-lg)",
            background: "linear-gradient(145deg, var(--sage-mist) 0%, #a8b89a 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
          }}>
            <span style={{ fontSize: "3rem" }}>🌿</span>
          </div>

          {/* Right: Form */}
          <div>
            <h2 style={{
              fontFamily: "var(--font-bebas-neue), sans-serif",
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", letterSpacing: "0.03em",
              color: "var(--off-white)", lineHeight: 1.1, marginBottom: 16,
            }}>
              SUBSCRIBE TO GET 10% OFF
            </h2>
            <p style={{
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              fontSize: "0.9rem", color: "rgba(200, 212, 184, 0.8)",
              lineHeight: 1.6, marginBottom: 28,
            }}>
              Enter your email below for daily updates, exclusive deals, and early
              access to new products.
            </p>
            <form style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Drop Your Email Here"
                aria-label="Email address"
                style={{
                  flex: "1 1 200px", padding: "14px 20px",
                  borderRadius: "var(--radius-pill)",
                  border: "1.5px solid rgba(200, 212, 184, 0.3)",
                  background: "rgba(255,255,255,0.08)",
                  color: "var(--off-white)",
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                  fontSize: "0.9rem", outline: "none",
                }}
              />
              <button
                id="newsletter-subscribe"
                className="btn-primary"
                type="submit"
                style={{ background: "var(--sage-mist)", color: "var(--deep-forest)", fontWeight: 600 }}
              >
                Subscribe
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          </div>
        </ScrollReveal>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .container .reveal[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          .container .reveal[style*="grid-template-columns: 1fr 1fr"] > div:first-child { display: none; }
        }
        #newsletter-email::placeholder { color: rgba(200, 212, 184, 0.5); }
      `}</style>
    </section>
  );
}
