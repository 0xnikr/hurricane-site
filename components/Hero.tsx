import ScrollReveal from "./ScrollReveal";

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "linear-gradient(135deg, var(--deep-forest) 0%, #1f3d1f 40%, var(--hurricane-green) 100%)",
      }}
    >
      {/* Subtle radial overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.08,
          backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(200,212,184,0.4) 0%, transparent 60%),
                            radial-gradient(ellipse at 80% 20%, rgba(45,90,39,0.3) 0%, transparent 50%)`,
          pointerEvents: "none",
        }}
      />

      <div
        className="container hero-grid"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "120px clamp(20px, 5vw, 80px) 80px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(32px, 5vw, 80px)",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Left: Text */}
        <ScrollReveal style={{ zIndex: 1 }}>
          <p style={{
            fontFamily: "var(--font-inter), -apple-system, system-ui, sans-serif",
            fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "var(--sage-mist)", marginBottom: 20,
          }}>
            Premium Natural Supplements
          </p>
          <h1 style={{
            fontFamily: "var(--font-bebas-neue), sans-serif",
            fontSize: "clamp(3rem, 6vw, 5.5rem)", lineHeight: 1.0,
            letterSpacing: "0.02em", color: "var(--off-white)", marginBottom: 24,
          }}>
            FUEL YOUR BODY{" "}
            <span style={{ color: "var(--sage-mist)" }}>WITH NATURE&apos;S</span>{" "}
            BEST EXTRACTS
          </h1>
          <p style={{
            fontFamily: "var(--font-playfair-display), serif",
            fontSize: "clamp(1rem, 1.5vw, 1.2rem)", lineHeight: 1.7,
            color: "rgba(200, 212, 184, 0.85)", marginBottom: 40, maxWidth: 480,
            fontStyle: "italic",
          }}>
            Harness the raw power of nature. Our lab-tested, premium extracts
            deliver unmatched purity for your energy, recovery, and wellness.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button className="btn-primary" style={{ fontSize: "1rem", padding: "16px 36px" }}>
              Shop Now
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 4 }}>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="btn-outline" style={{
              borderColor: "var(--sage-mist)", color: "var(--sage-mist)", padding: "14px 32px",
            }}>
              Learn More
            </button>
          </div>
        </ScrollReveal>

        {/* Right: Product placeholder */}
        <ScrollReveal style={{
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1,
        }}>
          <div style={{
            width: "100%", maxWidth: 440, aspectRatio: "3 / 4",
            borderRadius: "var(--radius-xl)",
            background: "linear-gradient(145deg, var(--sage-mist) 0%, var(--sage-mist-light) 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden",
            boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
          }}>
            <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "rgba(45, 90, 39, 0.12)", top: -40, right: -40 }} />
            <div style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", background: "rgba(45, 90, 39, 0.08)", bottom: 40, left: -20 }} />
            <div style={{ textAlign: "center", padding: 32, position: "relative", zIndex: 1 }}>
              <div style={{ fontFamily: "var(--font-bebas-neue), sans-serif", fontSize: "4rem", color: "var(--deep-forest)", lineHeight: 1, marginBottom: 8 }}>
                🌿
              </div>
              <p style={{
                fontFamily: "var(--font-inter), -apple-system, system-ui, sans-serif",
                fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500,
                letterSpacing: "0.05em", textTransform: "uppercase",
              }}>
                Your Product Image Here
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; text-align: center; padding-top: 100px !important; }
          .hero-grid > div:last-child { order: -1; }
          .hero-grid > div:last-child > div { max-width: 280px !important; margin: 0 auto; }
        }
      `}</style>
    </section>
  );
}
