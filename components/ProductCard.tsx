"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";

interface ProductCardProps {
  product: Product;
  tag?: string | null;
}

export default function ProductCard({ product, tag }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div
      className="card-hover"
      style={{
        background: "var(--off-white)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      <Link href={`/products/${product.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
        <div
          style={{
            aspectRatio: "1 / 1",
            background: product.primary_image_url
              ? `url(${product.primary_image_url}) center/cover`
              : "linear-gradient(145deg, var(--sage-mist) 0%, var(--sage-mist-light) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            margin: 12,
            borderRadius: "var(--radius-md)",
          }}
        >
          {tag && (
            <span
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                padding: "4px 12px",
                background: "var(--hurricane-green)",
                color: "var(--off-white)",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                fontSize: "0.7rem",
                fontWeight: 600,
                borderRadius: "var(--radius-pill)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {tag}
            </span>
          )}
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                padding: "4px 10px",
                background: "#dc2626",
                color: "white",
                fontSize: "0.7rem",
                fontWeight: 600,
                borderRadius: "var(--radius-pill)",
              }}
            >
              Sale
            </span>
          )}
          {!product.primary_image_url && (
            <span style={{ fontSize: "3rem" }}>🌿</span>
          )}
        </div>
        <div style={{ padding: "8px 20px 4px" }}>
          <h3
            style={{
              fontFamily: "var(--font-playfair-display), serif",
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "var(--text-dark)",
              marginBottom: 4,
            }}
          >
            {product.title}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <p
              style={{
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                fontSize: "0.95rem",
                color: "var(--text-muted)",
                margin: 0,
              }}
            >
              ${Number(product.price).toFixed(2)}
            </p>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <p
                style={{
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                  fontSize: "0.82rem",
                  color: "#9ca3af",
                  textDecoration: "line-through",
                  margin: 0,
                }}
              >
                ${Number(product.compare_at_price).toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </Link>
      <div style={{ padding: "8px 20px 20px" }}>
        <button
          className="btn-primary"
          onClick={(e) => {
            e.preventDefault();
            addToCart({
              product_id: product.id,
              title: product.title,
              price: Number(product.price),
              image_url: product.primary_image_url,
              slug: product.slug,
              quantity: 1,
            });
          }}
          style={{
            width: "100%",
            justifyContent: "center",
            padding: "12px 24px",
            fontSize: "0.85rem",
          }}
        >
          Add to Cart
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
