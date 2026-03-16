import { createSupabaseAdmin } from "@/lib/supabase/server";
import Link from "next/link";
import type { Order } from "@/lib/types";

export default async function AdminOrdersPage() {
  const supabase = createSupabaseAdmin();

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a1a1a", marginBottom: 24 }}>
        Orders
      </h1>

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
              {["Order", "Customer", "Email", "Total", "Payment", "Status", "Date"].map(
                (h) => (
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
                )
              )}
            </tr>
          </thead>
          <tbody>
            {(!orders || orders.length === 0) ? (
              <tr>
                <td colSpan={7} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>
                  No orders yet.
                </td>
              </tr>
            ) : (
              (orders as Order[]).map((order: Order) => (
                <tr key={order.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
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
                  <td style={{ padding: "12px 16px", fontSize: "0.82rem", color: "#6b7280" }}>
                    {order.customer_email}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "0.9rem", fontWeight: 500 }}>
                    ${Number(order.grand_total).toFixed(2)}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        background: order.payment_status === "paid" ? "#dcfce7" : "#fef9c3",
                        color: order.payment_status === "paid" ? "#166534" : "#92400e",
                      }}
                    >
                      {order.payment_status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        background:
                          order.order_status === "shipped" ? "#dbeafe" :
                          order.order_status === "delivered" ? "#dcfce7" :
                          "#f3f4f6",
                        color:
                          order.order_status === "shipped" ? "#1e40af" :
                          order.order_status === "delivered" ? "#166534" :
                          "#374151",
                      }}
                    >
                      {order.order_status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "0.82rem", color: "#6b7280" }}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
