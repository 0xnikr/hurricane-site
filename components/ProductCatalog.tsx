"use client";

import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const categories = ["All Products", "Energy", "Recovery", "Immunity", "Focus", "Detox"];

const allProducts = [
  { name: "Holocena", price: "$17.50", category: "Energy" },
  { name: "Notorius", price: "$22.50", category: "Recovery" },
  { name: "Radiant", price: "$20.50", category: "Immunity" },
  { name: "Tempest Vigor", price: "$28.00", category: "Focus" },
  { name: "Gale Force", price: "$19.00", category: "Energy" },
  { name: "Eye of Storm", price: "$31.00", category: "Detox" },
];

export default function ProductCatalog() {
  const ref = useScrollReveal();
  const [active, setActive] = useState("All Products");

  const filtered = active === "All Products"
    ? allProducts
    : allProducts.filter((p) => p.category === active);

  return (
    <section ref={ref} id="products" className="section" style={{ background: "var(--warm-cream)" }}>
      <div className="container">
        <div className="reveal" style={{ textAlign: "center", marginBottom: 16 }}>
          <p
            style={{
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              fontSize: "0.8rem",
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--hurricane-green)",
              marginBottom: 12,
            }}
          >
            All Products
          </p>
          <h2
            style={{
              fontFamily: "var(--font-playfair-display), serif",
              fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
              fontWeight: 700,
              color: "var(--text-dark)",
              lineHeight: 1.2,
            }}
          >
            Premium Supplements &amp; Natural Extracts
          </h2>
        </div>

        {/* Filter Tabs */}
        <div
          className="reveal"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 48,
            marginTop: 28,
          }}
        >
          {categories.map((cat) => (
            <button
              id={`filter-${cat.toLowerCase().replace(" ", "-")}`}
              key={cat}
              onClick={() => setActive(cat)}
              style={{
                padding: "8px 20px",
                borderRadius: "var(--radius-pill)",
                border: "1.5px solid",
                borderColor: active === cat ? "var(--hurricane-green)" : "var(--sage-mist)",
                background: active === cat ? "var(--hurricane-green)" : "transparent",
                color: active === cat ? "var(--off-white)" : "var(--text-muted)",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                fontSize: "0.82rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(16px, 3vw, 32px)",
          }}
        >
          {filtered.map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className="card-hover"
              style={{
                background: "var(--off-white)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  aspectRatio: "1 / 1",
                  background: "linear-gradient(145deg, var(--sage-mist) 0%, var(--sage-mist-light) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: 12,
                  borderRadius: "var(--radius-md)",
                }}
              >
                <span style={{ fontSize: "3rem" }}>🌿</span>
              </div>
              <div style={{ padding: "16px 20px 20px" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-playfair-display), serif",
                    fontSize: "1.05rem",
                    fontWeight: 600,
                    color: "var(--text-dark)",
                    marginBottom: 4,
                  }}
                >
                  {p.name}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-inter), system-ui, sans-serif",
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                    marginBottom: 16,
                  }}
                >
                  {p.price}
                </p>
                <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "11px 20px", fontSize: "0.82rem" }}>
                  Shop Now
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          #products .container div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
            max-width: 360px;
            margin: 0 auto;
          }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          #products .container div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
