"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, cartTotal, clearCart, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [billingSame, setBillingSame] = useState(true);

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_first_name: "",
    shipping_last_name: "",
    shipping_address1: "",
    shipping_address2: "",
    shipping_city: "",
    shipping_state: "",
    shipping_postal_code: "",
    shipping_country: "US",
    billing_first_name: "",
    billing_last_name: "",
    billing_address1: "",
    billing_address2: "",
    billing_city: "",
    billing_state: "",
    billing_postal_code: "",
    billing_country: "US",
    notes: "",
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          billing_same_as_shipping: billingSame,
          items: items.map((i) => ({
            product_id: i.product_id,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      clearCart();
      router.push(`/order-confirmation/${data.order_id}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <p style={{ fontSize: "2rem", marginBottom: 16 }}>🛒</p>
        <p style={{ color: "#6b7280", marginBottom: 24 }}>Your cart is empty</p>
        <Link href="/" className="btn-primary" style={{ textDecoration: "none" }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    border: "1.5px solid #d1d5db",
    borderRadius: 8,
    fontSize: "0.9rem",
    outline: "none",
    fontFamily: "inherit",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.82rem",
    fontWeight: 500,
    color: "#374151",
    marginBottom: 6,
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "120px 20px 60px" }}>
      <h1 style={{ fontFamily: "var(--font-playfair-display), serif", fontSize: "1.8rem", fontWeight: 700, marginBottom: 40 }}>
        Checkout
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 40, alignItems: "start" }}>
          {/* Left: Form */}
          <div>
            {/* Contact */}
            <div style={{ background: "white", borderRadius: 12, padding: 24, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: 20 }}>Contact Information</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input style={inputStyle} value={form.customer_name} onChange={(e) => updateField("customer_name", e.target.value)} required placeholder="John Doe" />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input type="email" style={inputStyle} value={form.customer_email} onChange={(e) => updateField("customer_email", e.target.value)} required placeholder="john@email.com" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input type="tel" style={inputStyle} value={form.customer_phone} onChange={(e) => updateField("customer_phone", e.target.value)} placeholder="(555) 123-4567" />
              </div>
            </div>

            {/* Shipping */}
            <div style={{ background: "white", borderRadius: 12, padding: 24, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: 20 }}>Shipping Address</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={labelStyle}>First Name</label>
                  <input style={inputStyle} value={form.shipping_first_name} onChange={(e) => updateField("shipping_first_name", e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Last Name</label>
                  <input style={inputStyle} value={form.shipping_last_name} onChange={(e) => updateField("shipping_last_name", e.target.value)} />
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Address *</label>
                <input style={inputStyle} value={form.shipping_address1} onChange={(e) => updateField("shipping_address1", e.target.value)} required placeholder="123 Main St" />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Address Line 2</label>
                <input style={inputStyle} value={form.shipping_address2} onChange={(e) => updateField("shipping_address2", e.target.value)} placeholder="Apt, Suite, etc." />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>City *</label>
                  <input style={inputStyle} value={form.shipping_city} onChange={(e) => updateField("shipping_city", e.target.value)} required />
                </div>
                <div>
                  <label style={labelStyle}>State *</label>
                  <input style={inputStyle} value={form.shipping_state} onChange={(e) => updateField("shipping_state", e.target.value)} required placeholder="CA" />
                </div>
                <div>
                  <label style={labelStyle}>ZIP *</label>
                  <input style={inputStyle} value={form.shipping_postal_code} onChange={(e) => updateField("shipping_postal_code", e.target.value)} required placeholder="90210" />
                </div>
              </div>
            </div>

            {/* Billing */}
            <div style={{ background: "white", borderRadius: 12, padding: 24, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: "0.9rem" }}>
                <input type="checkbox" checked={billingSame} onChange={(e) => setBillingSame(e.target.checked)} style={{ width: 18, height: 18 }} />
                Billing address same as shipping
              </label>
              {!billingSame && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={labelStyle}>First Name</label>
                      <input style={inputStyle} value={form.billing_first_name} onChange={(e) => updateField("billing_first_name", e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Last Name</label>
                      <input style={inputStyle} value={form.billing_last_name} onChange={(e) => updateField("billing_last_name", e.target.value)} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={labelStyle}>Address</label>
                    <input style={inputStyle} value={form.billing_address1} onChange={(e) => updateField("billing_address1", e.target.value)} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={labelStyle}>City</label>
                      <input style={inputStyle} value={form.billing_city} onChange={(e) => updateField("billing_city", e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>State</label>
                      <input style={inputStyle} value={form.billing_state} onChange={(e) => updateField("billing_state", e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>ZIP</label>
                      <input style={inputStyle} value={form.billing_postal_code} onChange={(e) => updateField("billing_postal_code", e.target.value)} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <label style={labelStyle}>Order Notes</label>
              <textarea
                style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Any special instructions..."
              />
            </div>
          </div>

          {/* Right: Order Summary */}
          <div style={{ position: "sticky", top: 100 }}>
            <div style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: 20 }}>Order Summary</h3>
              {items.map((item) => (
                <div key={item.product_id} style={{ padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", marginBottom: 6 }}>
                    <span style={{ fontWeight: 500, flex: 1, paddingRight: 8 }}>{item.title}</span>
                    <span style={{ whiteSpace: "nowrap" }}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      style={{
                        width: 26, height: 26, border: "1px solid #d1d5db", borderRadius: 6,
                        background: "white", cursor: "pointer", fontSize: "0.85rem",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >−</button>
                    <span style={{ fontSize: "0.85rem", minWidth: 18, textAlign: "center" }}>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      style={{
                        width: 26, height: 26, border: "1px solid #d1d5db", borderRadius: 6,
                        background: "white", cursor: "pointer", fontSize: "0.85rem",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >+</button>
                    <span style={{ fontSize: "0.78rem", color: "#9ca3af", marginLeft: 4 }}>
                      × ${item.price.toFixed(2)} each
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product_id)}
                      style={{
                        marginLeft: "auto", background: "none", border: "none",
                        color: "#dc2626", fontSize: "0.75rem", cursor: "pointer", padding: 0,
                      }}
                    >Remove</button>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #e5e7eb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", marginBottom: 8 }}>
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", marginBottom: 8, color: "#6b7280" }}>
                  <span>Tax (est.)</span>
                  <span>${(cartTotal * 0.08).toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", marginBottom: 16, color: "#6b7280" }}>
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem", fontWeight: 700, paddingTop: 12, borderTop: "1px solid #e5e7eb" }}>
                  <span>Total</span>
                  <span>${(cartTotal * 1.08).toFixed(2)}</span>
                </div>
              </div>

              {error && (
                <div style={{ padding: "10px 12px", background: "#fef2f2", color: "#dc2626", borderRadius: 8, fontSize: "0.82rem", marginTop: 16 }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  marginTop: 20,
                  padding: "14px",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>

              <p style={{ fontSize: "0.75rem", color: "#9ca3af", textAlign: "center", marginTop: 12 }}>
                Payment is manual (Venmo/Zelle/Cash App). Instructions will be provided after placing your order.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
