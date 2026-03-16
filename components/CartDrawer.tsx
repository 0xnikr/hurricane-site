"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartDrawer() {
  const { items, isCartOpen, setCartOpen, removeFromCart, updateQuantity, cartTotal } =
    useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setCartOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.3)",
          zIndex: 1100,
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: 380,
          maxWidth: "90vw",
          height: "100vh",
          background: "white",
          zIndex: 1101,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-8px 0 30px rgba(0,0,0,0.12)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-playfair-display), serif",
              fontSize: "1.2rem",
              fontWeight: 600,
              margin: 0,
            }}
          >
            Your Cart ({items.length})
          </h2>
          <button
            onClick={() => setCartOpen(false)}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
              padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflow: "auto", padding: "16px 24px" }}>
          {items.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                paddingTop: 60,
                color: "#9ca3af",
              }}
            >
              <p style={{ fontSize: "2rem", marginBottom: 12 }}>🛒</p>
              <p>Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product_id}
                style={{
                  display: "flex",
                  gap: 16,
                  padding: "16px 0",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                {/* Image */}
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 8,
                    flexShrink: 0,
                    background: item.image_url
                      ? `url(${item.image_url}) center/cover`
                      : "linear-gradient(145deg, #c8d4b8, #dfe6d5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {!item.image_url && <span>🌿</span>}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={() => setCartOpen(false)}
                    style={{
                      textDecoration: "none",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      color: "#1a1a1a",
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    {item.title}
                  </Link>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#6b7280",
                      margin: "0 0 8px",
                    }}
                  >
                    ${item.price.toFixed(2)}
                  </p>

                  {/* Quantity controls */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      style={{
                        width: 28,
                        height: 28,
                        border: "1px solid #d1d5db",
                        borderRadius: 6,
                        background: "white",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                      }}
                    >
                      −
                    </button>
                    <span style={{ fontSize: "0.88rem", minWidth: 20, textAlign: "center" }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      style={{
                        width: 28,
                        height: 28,
                        border: "1px solid #d1d5db",
                        borderRadius: 6,
                        background: "white",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                      }}
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      style={{
                        marginLeft: "auto",
                        background: "none",
                        border: "none",
                        color: "#dc2626",
                        fontSize: "0.78rem",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            style={{
              padding: "20px 24px",
              borderTop: "1px solid #e5e7eb",
              background: "#fafaf7",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <span style={{ fontWeight: 600, fontSize: "1rem" }}>Subtotal</span>
              <span style={{ fontWeight: 600, fontSize: "1rem" }}>
                ${cartTotal.toFixed(2)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setCartOpen(false)}
              className="btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                textDecoration: "none",
                padding: "14px 24px",
                display: "flex",
              }}
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
