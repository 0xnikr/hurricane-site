"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function ProductCatalog() {
  const ref = useScrollReveal();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [active, setActive] = useState("All Products");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createSupabaseBrowser();
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("sort_order");

      if (data) {
        setProducts(data);
        const cats = [...new Set(data.map((p) => p.category).filter(Boolean))] as string[];
        setCategories(cats);
      }
      setLoaded(true);
    }
    load();
  }, []);

  const filtered =
    active === "All Products"
      ? products
      : products.filter((p) => p.category === active);

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
          {["All Products", ...categories].map((cat) => (
            <button
              id={`filter-${cat.toLowerCase().replace(/ /g, "-")}`}
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
          {loaded && filtered.length === 0 ? (
            <p style={{ gridColumn: "1/-1", textAlign: "center", color: "#9ca3af", padding: 40 }}>
              No products found.
            </p>
          ) : (
            filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
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
