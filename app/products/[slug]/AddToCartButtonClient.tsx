"use client";

import { useCart } from "@/lib/cart-context";

export default function AddToCartButtonClient({
  product,
}: {
  product: {
    id: string;
    title: string;
    price: number;
    primary_image_url: string | null;
    slug: string;
  };
}) {
  const { addToCart } = useCart();

  return (
    <button
      className="btn-primary"
      onClick={() =>
        addToCart({
          product_id: product.id,
          title: product.title,
          price: Number(product.price),
          image_url: product.primary_image_url,
          slug: product.slug,
          quantity: 1,
        })
      }
      style={{
        padding: "16px 40px",
        fontSize: "1rem",
        width: "100%",
        maxWidth: 340,
        justifyContent: "center",
      }}
    >
      Add to Cart
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M3 8h10M9 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
