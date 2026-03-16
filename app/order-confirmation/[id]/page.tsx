import { createSupabaseAdmin } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PAYMENT_INSTRUCTIONS } from "@/lib/resend";
import type { OrderItem } from "@/lib/types";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createSupabaseAdmin();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (!order) notFound();

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id);

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "120px 20px 60px" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: "3rem", marginBottom: 16 }}>✅</div>
        <h1
          style={{
            fontFamily: "var(--font-playfair-display), serif",
            fontSize: "1.8rem",
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Thank You for Your Order!
        </h1>
        <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>
          Your order has been received and is awaiting payment.
        </p>
      </div>

      {/* Order Number */}
      <div
        style={{
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: 12,
          padding: 20,
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        <p style={{ fontSize: "0.82rem", color: "#166534", marginBottom: 4 }}>
          Order Number
        </p>
        <p
          style={{
            fontSize: "1.4rem",
            fontWeight: 700,
            color: "#166534",
            fontFamily: "monospace",
            margin: 0,
          }}
        >
          {order.order_number}
        </p>
      </div>

      {/* Order Summary */}
      <div
        style={{
          background: "white",
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: 16 }}>
          Order Summary
        </h3>
        {(items as OrderItem[])?.map((item: OrderItem) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid #f3f4f6",
              fontSize: "0.88rem",
            }}
          >
            <span>
              {item.title_snapshot} × {item.quantity}
            </span>
            <span>${Number(item.line_total).toFixed(2)}</span>
          </div>
        ))}
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #e5e7eb" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.88rem",
              marginBottom: 4,
            }}
          >
            <span>Subtotal</span>
            <span>${Number(order.subtotal).toFixed(2)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.88rem",
              marginBottom: 4,
              color: "#6b7280",
            }}
          >
            <span>Tax</span>
            <span>${Number(order.tax_total).toFixed(2)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "1.1rem",
              fontWeight: 700,
              paddingTop: 8,
              borderTop: "1px solid #e5e7eb",
              marginTop: 8,
            }}
          >
            <span>Total</span>
            <span>${Number(order.grand_total).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      <div dangerouslySetInnerHTML={{ __html: PAYMENT_INSTRUCTIONS }} />

      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Link
          href="/"
          className="btn-primary"
          style={{ textDecoration: "none", padding: "14px 32px" }}
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
