import ScrollReveal from "./ScrollReveal";
import { createSupabaseServer } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

export default async function FeaturedProducts() {
  const supabase = await createSupabaseServer();

  // Fetch featured products from homepage_featured_products table
  const { data: featured } = await supabase
    .from("homepage_featured_products")
    .select("*, product:products(*)")
    .eq("section_key", "featured")
    .eq("active", true)
    .order("sort_order");

  // Fallback: if no featured products configured, get products marked as featured
  let products: Product[] = [];
  if (featured && featured.length > 0) {
    products = featured
      .map((f: { product: Product | null }) => f.product)
      .filter(Boolean) as Product[];
  } else {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .eq("featured", true)
      .order("sort_order")
      .limit(3);
    products = data || [];
  }

  // Deduplicate by ID (a product could appear in both sources)
  const seen = new Set<string>();
  products = products.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  // If still no products, show nothing
  if (products.length === 0) return null;

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
          display: "grid", gridTemplateColumns: `repeat(${Math.min(products.length, 3)}, 1fr)`,
          gap: "clamp(16px, 3vw, 32px)",
        }}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} tag={p.featured ? "Featured" : null} />
          ))}
        </ScrollReveal>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .container div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; max-width: 360px; margin: 0 auto; }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          .container div[style*="grid-template-columns"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
