import Link from "next/link";

const footerLinks = {
  Products: ["Energy", "Recovery", "Immunity", "Focus", "Detox"],
  Company: ["About Us", "Our Story", "Lab Reports", "Careers"],
  Support: ["Contact", "FAQ", "Shipping", "Returns"],
};

export default function Footer() {
  return (
    <footer
      id="contact-us"
      style={{
        background: "var(--deep-forest)",
        padding: "clamp(48px, 6vw, 80px) clamp(20px, 5vw, 80px) 32px",
      }}
    >
      <div
        className="container footer-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "2fr repeat(3, 1fr)",
          gap: "clamp(24px, 4vw, 56px)",
          marginBottom: 48,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 16 }}>
            <span style={{
              fontFamily: "var(--font-bebas-neue), sans-serif",
              fontSize: "1.5rem", letterSpacing: "0.04em", color: "var(--off-white)",
            }}>
              HURRICANE
            </span>
            <span style={{
              fontFamily: "var(--font-playfair-display), serif",
              fontSize: "0.75rem", fontStyle: "italic", color: "var(--sage-mist)",
            }}>
              extracts
            </span>
          </div>
          <p style={{
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontSize: "0.85rem", color: "rgba(200, 212, 184, 0.6)",
            lineHeight: 1.7, maxWidth: 280,
          }}>
            Premium natural supplement extracts, lab-tested for purity and potency.
            Fuel your body with the raw power of nature.
          </p>
        </div>

        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 style={{
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "var(--off-white)", marginBottom: 20,
            }}>
              {title}
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {links.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="footer-link"
                    style={{
                      textDecoration: "none",
                      fontFamily: "var(--font-inter), system-ui, sans-serif",
                      fontSize: "0.85rem",
                      color: "rgba(200, 212, 184, 0.55)",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{
        borderTop: "1px solid rgba(200, 212, 184, 0.15)",
        paddingTop: 24,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 12, maxWidth: 1200, margin: "0 auto",
      }}>
        <p style={{
          fontFamily: "var(--font-inter), system-ui, sans-serif",
          fontSize: "0.78rem", color: "rgba(200, 212, 184, 0.4)",
        }}>
          © 2025 Hurricane Extracts. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy", "Terms"].map((item) => (
            <Link key={item} href="#" className="footer-link" style={{
              textDecoration: "none", fontFamily: "var(--font-inter), system-ui, sans-serif",
              fontSize: "0.78rem", color: "rgba(200, 212, 184, 0.4)",
              transition: "color 0.2s ease",
            }}>
              {item}
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .footer-link:hover { color: var(--sage-mist) !important; }
        @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 480px) { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}
