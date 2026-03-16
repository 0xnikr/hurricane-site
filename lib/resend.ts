import { Resend } from "resend";
import type { Order, OrderItem } from "./types";

const resend = new Resend(process.env.RESEND_API_KEY);

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function buildItemsTable(items: OrderItem[]): string {
  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${item.title_snapshot}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${formatCurrency(item.line_total)}</td>
      </tr>`
    )
    .join("");

  return `
    <table width="100%" style="border-collapse:collapse;margin:16px 0;">
      <thead>
        <tr style="background:#f5f2ea;">
          <th style="padding:8px 12px;text-align:left;font-size:13px;">Item</th>
          <th style="padding:8px 12px;text-align:center;font-size:13px;">Qty</th>
          <th style="padding:8px 12px;text-align:right;font-size:13px;">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

// ═══════════════════════════════════════════════════════
// PAYMENT INSTRUCTIONS — Edit this one place to update everywhere
// ═══════════════════════════════════════════════════════
export const PAYMENT_INSTRUCTIONS = `
  <div style="background:#fef9c3;border:1px solid #fbbf24;border-radius:8px;padding:20px;margin:20px 0;">
    <h3 style="margin:0 0 12px;color:#92400e;font-size:16px;">💳 Payment Instructions</h3>
    <p style="margin:0 0 12px;color:#78350f;font-size:14px;">
      We currently accept the following payment methods. Please send payment to complete your order:
    </p>
    <ul style="margin:0;padding:0 0 0 20px;color:#78350f;font-size:14px;line-height:1.8;">
      <li><strong>Venmo:</strong> @YourVenmoHandle</li>
      <li><strong>Zelle:</strong> your-zelle@email.com</li>
      <li><strong>Cash App:</strong> $YourCashAppTag</li>
    </ul>
    <p style="margin:12px 0 0;color:#78350f;font-size:13px;">
      Please include your <strong>order number</strong> in the payment note. Your order will be processed once payment is confirmed.
    </p>
  </div>
`;

export async function sendOrderConfirmation(
  order: Order,
  items: OrderItem[]
): Promise<boolean> {
  try {
    await resend.emails.send({
      from: process.env.ORDER_FROM_EMAIL || "onboarding@resend.dev",
      to: order.customer_email,
      subject: `Hurricane Extracts — Order #${order.order_number} Confirmed`,
      html: `
        <div style="max-width:600px;margin:0 auto;font-family:-apple-system,system-ui,sans-serif;color:#1a1a1a;">
          <div style="background:#1a2e1a;padding:24px;text-align:center;">
            <h1 style="color:#f5f2ea;font-size:24px;margin:0;">HURRICANE <span style="color:#c8d4b8;font-style:italic;font-size:14px;">extracts</span></h1>
          </div>
          <div style="padding:32px 24px;">
            <h2 style="margin:0 0 8px;font-size:20px;">Thank you, ${order.customer_name}!</h2>
            <p style="color:#6b7280;margin:0 0 24px;">Your order has been received and is awaiting payment.</p>
            
            <div style="background:#f5f2ea;border-radius:8px;padding:16px;margin-bottom:24px;">
              <p style="margin:0;font-size:14px;"><strong>Order Number:</strong> ${order.order_number}</p>
            </div>

            ${buildItemsTable(items)}
            
            <div style="text-align:right;margin:16px 0 24px;">
              <p style="margin:4px 0;font-size:14px;">Subtotal: ${formatCurrency(order.subtotal)}</p>
              <p style="margin:4px 0;font-size:14px;">Tax: ${formatCurrency(order.tax_total)}</p>
              <p style="margin:4px 0;font-size:14px;">Shipping: ${formatCurrency(order.shipping_total)}</p>
              <p style="margin:8px 0 0;font-size:18px;font-weight:bold;">Total: ${formatCurrency(order.grand_total)}</p>
            </div>

            ${PAYMENT_INSTRUCTIONS}
          </div>
          <div style="background:#f5f2ea;padding:16px 24px;text-align:center;font-size:12px;color:#6b7280;">
            <p style="margin:0;">© ${new Date().getFullYear()} Hurricane Extracts. All rights reserved.</p>
          </div>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Failed to send order confirmation:", error);
    return false;
  }
}

export async function sendAdminNotification(
  order: Order,
  items: OrderItem[]
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return false;

  try {
    await resend.emails.send({
      from: process.env.ORDER_FROM_EMAIL || "onboarding@resend.dev",
      to: adminEmail,
      subject: `🔔 New Order #${order.order_number} — ${formatCurrency(order.grand_total)}`,
      html: `
        <div style="max-width:600px;margin:0 auto;font-family:-apple-system,system-ui,sans-serif;color:#1a1a1a;">
          <h2 style="margin:0 0 16px;">New Order Received</h2>
          <p><strong>Order:</strong> #${order.order_number}</p>
          <p><strong>Customer:</strong> ${order.customer_name} (${order.customer_email})</p>
          <p><strong>Total:</strong> ${formatCurrency(order.grand_total)}</p>
          <p><strong>Payment Status:</strong> ${order.payment_status}</p>
          ${buildItemsTable(items)}
          <p style="margin-top:24px;">
            <a href="${process.env.NEXT_PUBLIC_SUPABASE_URL ? "" : ""}${"/admin/orders/" + order.id}" 
               style="background:#2d5a27;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;">
              View Order in Admin
            </a>
          </p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Failed to send admin notification:", error);
    return false;
  }
}
