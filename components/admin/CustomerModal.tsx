"use client";

import { useState, useEffect } from "react";

interface CustomerOrder {
  id: string;
  order_number: string;
  grand_total: number;
  payment_status: string;
  order_status: string;
  created_at: string;
}

interface CustomerData {
  name: string;
  email: string;
  phone: string | null;
  address: {
    address1: string;
    address2: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  total_orders: number;
  total_spent: number;
  first_order: string;
  last_order: string;
  orders: CustomerOrder[];
}

export default function CustomerModal({
  email,
  onClose,
}: {
  email: string;
  onClose: () => void;
}) {
  const [data, setData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch on mount
  useEffect(() => {
    fetch(`/api/admin/customers?email=${encodeURIComponent(email)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setData(d);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load customer");
        setLoading(false);
      });
  }, [email]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          zIndex: 1200,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 560,
          maxWidth: "90vw",
          maxHeight: "85vh",
          overflow: "auto",
          background: "white",
          borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          zIndex: 1201,
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
            position: "sticky",
            top: 0,
            background: "white",
            borderRadius: "16px 16px 0 0",
          }}
        >
          <h2 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>
            Customer Details
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
              padding: 4,
              color: "#6b7280",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "24px" }}>
          {loading && (
            <p style={{ color: "#9ca3af", textAlign: "center", padding: 40 }}>
              Loading...
            </p>
          )}

          {error && (
            <p style={{ color: "#dc2626", textAlign: "center", padding: 40 }}>
              {error}
            </p>
          )}

          {data && (
            <>
              {/* Profile */}
              <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: "#f0fdf4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.3rem",
                    flexShrink: 0,
                  }}
                >
                  {data.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600, margin: "0 0 4px" }}>
                    {data.name}
                  </h3>
                  <p style={{ fontSize: "0.88rem", color: "#6b7280", margin: 0 }}>
                    {data.email}
                  </p>
                  {data.phone && (
                    <p style={{ fontSize: "0.85rem", color: "#6b7280", margin: "2px 0 0" }}>
                      {data.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 12,
                  marginBottom: 24,
                }}
              >
                {[
                  { label: "Orders", value: data.total_orders.toString() },
                  { label: "Total Spent", value: `$${data.total_spent.toFixed(2)}` },
                  {
                    label: "Customer Since",
                    value: new Date(data.first_order).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    }),
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      background: "#f9fafb",
                      borderRadius: 10,
                      padding: "14px 16px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1a2e1a" }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: 2 }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Address */}
              <div
                style={{
                  background: "#f9fafb",
                  borderRadius: 10,
                  padding: 16,
                  marginBottom: 24,
                }}
              >
                <h4 style={{ fontSize: "0.82rem", fontWeight: 600, color: "#6b7280", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Shipping Address
                </h4>
                <p style={{ fontSize: "0.88rem", lineHeight: 1.6, margin: 0, color: "#374151" }}>
                  {data.address.address1}
                  {data.address.address2 && <><br />{data.address.address2}</>}
                  <br />
                  {data.address.city}, {data.address.state} {data.address.postal_code}
                  <br />
                  {data.address.country}
                </p>
              </div>

              {/* Order History */}
              <h4 style={{ fontSize: "0.82rem", fontWeight: 600, color: "#6b7280", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Order History
              </h4>
              <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #e5e7eb" }}>
                {data.orders.map((order, i) => (
                  <a
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      borderBottom: i < data.orders.length - 1 ? "1px solid #f3f4f6" : "none",
                      textDecoration: "none",
                      color: "inherit",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div>
                      <span style={{ fontWeight: 500, fontSize: "0.88rem", color: "#2d5a27" }}>
                        #{order.order_number}
                      </span>
                      <span style={{ fontSize: "0.78rem", color: "#9ca3af", marginLeft: 12 }}>
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: 20,
                          fontSize: "0.7rem",
                          fontWeight: 500,
                          background: order.payment_status === "paid" ? "#dcfce7" : "#fef9c3",
                          color: order.payment_status === "paid" ? "#166534" : "#92400e",
                        }}
                      >
                        {order.payment_status}
                      </span>
                      <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                        ${Number(order.grand_total).toFixed(2)}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
