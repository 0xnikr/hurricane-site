import { createSupabaseServer } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createSupabaseServer();

  // Get counts
  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  const { count: orderCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, order_number, customer_name, grand_total, payment_status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const cards = [
    { label: "Products", value: productCount ?? 0, href: "/admin/products", icon: "📦" },
    { label: "Orders", value: orderCount ?? 0, href: "/admin/orders", icon: "🧾" },
  ];

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
        Dashboard
      </h1>
      <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: 32 }}>
        Welcome to the Hurricane Extracts admin panel.
      </p>

      {/* Quick Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 40 }}>
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            style={{
              background: "white",
              borderRadius: 12,
              padding: "24px",
              textDecoration: "none",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              transition: "box-shadow 0.2s",
            }}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>{card.icon}</div>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#1a2e1a" }}>
              {card.value}
            </div>
            <div style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: 4 }}>
              {card.label}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: "flex", gap: 12, marginBottom: 40 }}>
        <Link
          href="/admin/products/new"
          style={{
            padding: "10px 20px",
            background: "#2d5a27",
            color: "white",
            borderRadius: 8,
            textDecoration: "none",
            fontSize: "0.85rem",
            fontWeight: 500,
          }}
        >
          + New Product
        </Link>
        <Link
          href="/admin/homepage"
          style={{
            padding: "10px 20px",
            background: "white",
            color: "#2d5a27",
            border: "1.5px solid #2d5a27",
            borderRadius: 8,
            textDecoration: "none",
            fontSize: "0.85rem",
            fontWeight: 500,
          }}
        >
          Edit Homepage
        </Link>
      </div>

      {/* Recent Orders */}
      <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 16 }}>Recent Orders</h2>
      {recentOrders && recentOrders.length > 0 ? (
        <div
          style={{
            background: "white",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                {["Order", "Customer", "Total", "Status", "Date"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  style={{ borderBottom: "1px solid #f3f4f6" }}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      style={{ color: "#2d5a27", textDecoration: "none", fontWeight: 500, fontSize: "0.88rem" }}
                    >
                      #{order.order_number}
                    </Link>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "0.88rem" }}>
                    {order.customer_name}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "0.88rem" }}>
                    ${Number(order.grand_total).toFixed(2)}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        background:
                          order.payment_status === "paid"
                            ? "#dcfce7"
                            : "#fef9c3",
                        color:
                          order.payment_status === "paid"
                            ? "#166534"
                            : "#92400e",
                      }}
                    >
                      {order.payment_status}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: "0.82rem",
                      color: "#6b7280",
                    }}
                  >
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
          No orders yet. They&apos;ll appear here once customers start ordering.
        </p>
      )}
    </div>
  );
}
