"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import type { Order, OrderItem } from "@/lib/types";
import CustomerModal from "@/components/admin/CustomerModal";

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createSupabaseBrowser();

      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      const { data: itemsData } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", id);

      setOrder(orderData);
      setItems(itemsData || []);
      setLoading(false);
    }
    load();
  }, [id]);

  async function updateStatus(field: "payment_status" | "order_status", value: string) {
    setSaving(true);
    await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, [field]: value }),
    });

    setOrder((prev) => (prev ? { ...prev, [field]: value } : null));
    setSaving(false);
  }

  if (loading) return <p style={{ color: "#9ca3af" }}>Loading...</p>;
  if (!order) return <p>Order not found.</p>;

  const statusLabel: React.CSSProperties = {
    fontSize: "0.82rem",
    fontWeight: 500,
    color: "#374151",
    marginBottom: 6,
    display: "block",
  };

  const selectStyle: React.CSSProperties = {
    padding: "8px 12px",
    border: "1.5px solid #d1d5db",
    borderRadius: 8,
    fontSize: "0.88rem",
    background: "white",
  };

  return (
    <div>
      <button
        onClick={() => router.push("/admin/orders")}
        style={{
          background: "none",
          border: "none",
          color: "#2d5a27",
          cursor: "pointer",
          fontSize: "0.88rem",
          marginBottom: 24,
          padding: 0,
        }}
      >
        ← Back to Orders
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 4px" }}>
            Order #{order.order_number}
          </h1>
          <p style={{ color: "#6b7280", fontSize: "0.88rem", margin: 0 }}>
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>

        {/* Status updates */}
        <div style={{ display: "flex", gap: 16 }}>
          <div>
            <label style={statusLabel}>Payment Status</label>
            <select
              value={order.payment_status}
              onChange={(e) => updateStatus("payment_status", e.target.value)}
              disabled={saving}
              style={selectStyle}
            >
              {["pending_payment", "paid", "refunded"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={statusLabel}>Order Status</label>
            <select
              value={order.order_status}
              onChange={(e) => updateStatus("order_status", e.target.value)}
              disabled={saving}
              style={selectStyle}
            >
              {["pending_payment", "processing", "shipped", "delivered", "cancelled"].map(
                (s) => <option key={s} value={s}>{s}</option>
              )}
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Customer Info */}
        <div style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: 16 }}>Customer</h3>
          <p style={{ fontSize: "0.9rem", marginBottom: 4 }}>
            <button
              onClick={() => setCustomerEmail(order.customer_email)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 600, fontSize: "0.9rem", color: "#2d5a27", textDecoration: "underline" }}
            >
              {order.customer_name}
            </button>
          </p>
          <p style={{ fontSize: "0.88rem", color: "#6b7280", marginBottom: 4 }}>{order.customer_email}</p>
          {order.customer_phone && <p style={{ fontSize: "0.88rem", color: "#6b7280" }}>{order.customer_phone}</p>}
        </div>

        {/* Shipping */}
        <div style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: 16 }}>Shipping Address</h3>
          <p style={{ fontSize: "0.88rem", lineHeight: 1.6, color: "#374151" }}>
            {order.shipping_first_name} {order.shipping_last_name}<br />
            {order.shipping_address1}<br />
            {order.shipping_address2 && <>{order.shipping_address2}<br /></>}
            {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}<br />
            {order.shipping_country}
          </p>
        </div>
      </div>

      {/* Order Items */}
      <div style={{ background: "white", borderRadius: 12, padding: 24, marginTop: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: 16 }}>Items</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
              {["Item", "SKU", "Unit Price", "Qty", "Total"].map((h) => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "10px 12px", fontSize: "0.9rem" }}>{item.title_snapshot}</td>
                <td style={{ padding: "10px 12px", fontSize: "0.82rem", color: "#6b7280", fontFamily: "monospace" }}>{item.sku_snapshot}</td>
                <td style={{ padding: "10px 12px", fontSize: "0.88rem" }}>${Number(item.unit_price_snapshot).toFixed(2)}</td>
                <td style={{ padding: "10px 12px", fontSize: "0.88rem" }}>{item.quantity}</td>
                <td style={{ padding: "10px 12px", fontSize: "0.88rem", fontWeight: 500 }}>${Number(item.line_total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ textAlign: "right", marginTop: 16, paddingTop: 16, borderTop: "1px solid #e5e7eb" }}>
          <p style={{ fontSize: "0.88rem", marginBottom: 4 }}>Subtotal: ${Number(order.subtotal).toFixed(2)}</p>
          <p style={{ fontSize: "0.88rem", marginBottom: 4, color: "#6b7280" }}>Tax: ${Number(order.tax_total).toFixed(2)}</p>
          <p style={{ fontSize: "0.88rem", marginBottom: 4, color: "#6b7280" }}>Shipping: ${Number(order.shipping_total).toFixed(2)}</p>
          <p style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: 8 }}>Total: ${Number(order.grand_total).toFixed(2)}</p>
        </div>
      </div>

      {order.notes && (
        <div style={{ background: "white", borderRadius: 12, padding: 24, marginTop: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: 12 }}>Notes</h3>
          <p style={{ fontSize: "0.88rem", color: "#374151", whiteSpace: "pre-wrap" }}>{order.notes}</p>
        </div>
      )}

      {customerEmail && (
        <CustomerModal email={customerEmail} onClose={() => setCustomerEmail(null)} />
      )}
    </div>
  );
}
