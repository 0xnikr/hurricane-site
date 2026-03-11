import ScrollReveal from "./ScrollReveal";

const testimonial = {
  quote:
    "The natural ingredients in Hurricane Extracts have transformed my daily routine. I've never felt more energized, and I love that it's all organic.",
  name: "Becky Nelson",
  rating: 5,
};

const avatarColors = ["#a8b89a", "#8fa882", "#c8d4b8", "#6d9a65", "#b5c4a8"];

export default function Testimonials() {
  return (
    <section className="section" style={{ background: "var(--off-white)", position: "relative", overflow: "hidden" }}>
      <div className="container" style={{ position: "relative" }}>
        <ScrollReveal style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{
            fontFamily: "var(--font-playfair-display), serif",
            fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 700,
            color: "var(--text-dark)", lineHeight: 1.2, marginBottom: 12,
          }}>
            What Our Clients Say
          </h2>
          <p style={{
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontSize: "0.9rem", color: "var(--text-muted)",
          }}>
            Our clients send us a bunch of smiles with our services, and we love them.
          </p>
        </ScrollReveal>

        <ScrollReveal style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>
          {avatarColors.map((color, i) => {
            const positions: Record<string, string>[] = [
              { top: "10%", left: "-15%" },
              { top: "60%", left: "-10%" },
              { top: "5%", right: "-15%" },
              { top: "55%", right: "-10%" },
              { top: "85%", left: "50%", transform: "translateX(-50%)" },
            ];
            return (
              <div key={i} style={{
                position: "absolute", width: i % 2 === 0 ? 48 : 40, height: i % 2 === 0 ? 48 : 40,
                borderRadius: "50%", background: color,
                border: "3px solid var(--off-white)", boxShadow: "var(--shadow-sm)",
                zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.9rem", ...positions[i],
              }}>
                👤
              </div>
            );
          })}
          <div style={{
            background: "var(--warm-cream)", borderRadius: "var(--radius-xl)",
            padding: "clamp(32px, 5vw, 56px)", textAlign: "center",
            boxShadow: "var(--shadow-sm)", position: "relative", zIndex: 2,
          }}>
            <p style={{
              fontFamily: "var(--font-playfair-display), serif",
              fontSize: "clamp(1rem, 2vw, 1.2rem)", fontStyle: "italic",
              color: "var(--text-dark)", lineHeight: 1.7, marginBottom: 24,
            }}>
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <p style={{
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              fontSize: "0.95rem", fontWeight: 600, color: "var(--text-dark)", marginBottom: 8,
            }}>
              {testimonial.name}
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <span key={i} style={{ color: "#d4a853", fontSize: "1rem" }}>★</span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
