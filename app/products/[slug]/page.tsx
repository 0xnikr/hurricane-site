import { createSupabaseServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import AddToCartButtonClient from "./AddToCartButtonClient";
import type { ProductImage } from "@/lib/types";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createSupabaseServer();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (!product) notFound();

  // Fetch additional images
  const { data: images } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", product.id)
    .order("sort_order");

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 20px 60px" }}>
      <Link
        href="/products"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          textDecoration: "none",
          color: "var(--hurricane-green)",
          fontSize: "0.88rem",
          fontWeight: 500,
          marginBottom: 32,
        }}
      >
        ← Back to Products
      </Link>

      <ScrollReveal
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(32px, 5vw, 64px)",
          alignItems: "start",
        }}
      >
        {/* Image */}
        <div>
          <div
            style={{
              aspectRatio: "1/1",
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
              background: product.primary_image_url
                ? `url(${product.primary_image_url}) center/cover`
                : "linear-gradient(145deg, var(--sage-mist), var(--sage-mist-light))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {!product.primary_image_url && (
              <span style={{ fontSize: "5rem" }}>🌿</span>
            )}
          </div>

          {/* Gallery thumbnails */}
          {images && images.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 16,
                overflowX: "auto",
              }}
            >
              {(images as ProductImage[]).map((img) => (
                <div
                  key={img.id}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 8,
                    flexShrink: 0,
                    background: `url(${img.image_url}) center/cover`,
                    border: "2px solid var(--sage-mist)",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.category && (
            <span
              style={{
                display: "inline-block",
                padding: "4px 12px",
                background: "var(--sage-mist-light)",
                color: "var(--hurricane-green)",
                borderRadius: "var(--radius-pill)",
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 12,
              }}
            >
              {product.category}
            </span>
          )}

          <h1
            style={{
              fontFamily: "var(--font-playfair-display), serif",
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              fontWeight: 700,
              color: "var(--text-dark)",
              lineHeight: 1.2,
              marginBottom: 16,
            }}
          >
            {product.title}
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <span
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--hurricane-green)",
              }}
            >
              ${Number(product.price).toFixed(2)}
            </span>
            {product.compare_at_price &&
              product.compare_at_price > product.price && (
                <span
                  style={{
                    fontSize: "1rem",
                    color: "#9ca3af",
                    textDecoration: "line-through",
                  }}
                >
                  ${Number(product.compare_at_price).toFixed(2)}
                </span>
              )}
          </div>

          {product.short_description && (
            <p
              style={{
                fontSize: "1rem",
                color: "var(--text-muted)",
                lineHeight: 1.7,
                marginBottom: 24,
              }}
            >
              {product.short_description}
            </p>
          )}

          {product.full_description && (
            <div
              style={{
                fontSize: "0.95rem",
                color: "var(--text-muted)",
                lineHeight: 1.75,
                marginBottom: 32,
                whiteSpace: "pre-line",
              }}
            >
              {product.full_description}
            </div>
          )}

          <AddToCartButtonClient product={product} />

          {/* Details list */}
          <div
            style={{
              marginTop: 32,
              paddingTop: 24,
              borderTop: "1px solid var(--sage-mist)",
            }}
          >
            {[
              { label: "SKU", value: product.sku },
              { label: "Category", value: product.category },
              {
                label: "Availability",
                value:
                  product.stock !== null
                    ? product.stock > 0
                      ? "In Stock"
                      : "Out of Stock"
                    : "In Stock",
              },
            ].map(
              (detail) =>
                detail.value && (
                  <div
                    key={detail.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      fontSize: "0.88rem",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    <span style={{ color: "#6b7280" }}>{detail.label}</span>
                    <span style={{ fontWeight: 500 }}>{detail.value}</span>
                  </div>
                )
            )}
          </div>
        </div>
      </ScrollReveal>

      <style>{`
        @media (max-width: 768px) {
          .reveal[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
