import ScrollReveal from "./ScrollReveal";

export default function AboutSection() {
  return (
    <section id="about" className="section" style={{ background: "var(--off-white)" }}>
      <div className="container" style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "clamp(32px, 5vw, 80px)", alignItems: "center",
      }}>
        <ScrollReveal>
          <div style={{
            width: "100%", aspectRatio: "4 / 3", borderRadius: "var(--radius-xl)",
            background: "linear-gradient(145deg, var(--sage-mist) 0%, #a8b89a 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", boxShadow: "var(--shadow-md)", position: "relative",
          }}>
            <div style={{
              position: "absolute", bottom: -20, right: -20,
              width: 140, height: 140, borderRadius: "50%",
              background: "rgba(45, 90, 39, 0.12)",
            }} />
            <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
              <span style={{ fontSize: "4rem" }}>🍃</span>
              <p style={{
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500,
                textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 8,
              }}>
                Brand Image Here
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <h2 style={{
            fontFamily: "var(--font-playfair-display), serif",
            fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 700,
            color: "var(--text-dark)", lineHeight: 1.2, marginBottom: 24,
          }}>
            About Us
          </h2>
          <p style={{
            fontFamily: "var(--font-inter), -apple-system, system-ui, sans-serif",
            fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.75, marginBottom: 16,
          }}>
            The products offered, whose benefits have been scientifically confirmed,
            are 100% natural and allow you to take care of your body and mind.
            Energizing infusions, anti-inflammatory essential oils, and premium
            supplement extracts — crafted to support your journey.
          </p>
          <p style={{
            fontFamily: "var(--font-inter), -apple-system, system-ui, sans-serif",
            fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.75, marginBottom: 32,
          }}>
            At Hurricane Extracts, we believe the best supplements start with the
            best ingredients. Every batch is third-party lab tested for purity,
            potency, and safety.
          </p>
          <button className="btn-outline">
            Read More
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </ScrollReveal>
      </div>
      <style>{`
        @media (max-width: 768px) {
          #about .container { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
