import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { sendOrderConfirmation, sendAdminNotification } from "@/lib/resend";

const TAX_RATE = 0.08; // 8% tax — adjust as needed

interface ProductRow {
  id: string;
  title: string;
  sku: string;
  price: number;
  taxable: boolean;
  active: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createSupabaseAdmin();
    const body = await req.json();

    // Validate required fields
    const required = ["customer_name", "customer_email", "shipping_address1", "shipping_city", "shipping_state", "shipping_postal_code", "items"];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Fetch current prices from DB (never trust client prices)
    const productIds = body.items.map((i: { product_id: string }) => i.product_id);
    const { data: products, error: fetchError } = await supabase
      .from("products")
      .select("id, title, sku, price, taxable, active")
      .in("id", productIds);

    if (fetchError || !products) {
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }

    // Validate all products are active
    const productMap = new Map((products as ProductRow[]).map((p: ProductRow) => [p.id, p]));
    for (const item of body.items) {
      const product = productMap.get(item.product_id);
      if (!product || !product.active) {
        return NextResponse.json(
          { error: `Product "${item.product_id}" is not available` },
          { status: 400 }
        );
      }
    }

    // Calculate totals server-side
    let subtotal = 0;
    let taxTotal = 0;
    const orderItems = body.items.map((item: { product_id: string; quantity: number }) => {
      const product = productMap.get(item.product_id)!;
      const lineTotal = Number(product.price) * item.quantity;
      subtotal += lineTotal;

      if (product.taxable) {
        taxTotal += lineTotal * TAX_RATE;
      }

      return {
        product_id: product.id,
        sku_snapshot: product.sku,
        title_snapshot: product.title,
        unit_price_snapshot: product.price,
        taxable_snapshot: product.taxable,
        quantity: item.quantity,
        line_total: lineTotal,
      };
    });

    taxTotal = Math.round(taxTotal * 100) / 100;
    const shippingTotal = 0; // Free shipping for now
    const grandTotal = Math.round((subtotal + taxTotal + shippingTotal) * 100) / 100;

    // Generate sequential order number starting at 1001
    const { data: lastOrder } = await supabase
      .from("orders")
      .select("order_number")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    let nextNumber = 1001;
    if (lastOrder?.order_number) {
      const match = lastOrder.order_number.match(/HE-(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }
    const orderNumber = `HE-${nextNumber}`;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: body.customer_name,
        customer_email: body.customer_email,
        customer_phone: body.customer_phone || null,
        shipping_first_name: body.shipping_first_name || null,
        shipping_last_name: body.shipping_last_name || null,
        shipping_address1: body.shipping_address1,
        shipping_address2: body.shipping_address2 || null,
        shipping_city: body.shipping_city,
        shipping_state: body.shipping_state,
        shipping_postal_code: body.shipping_postal_code,
        shipping_country: body.shipping_country || "US",
        billing_same_as_shipping: body.billing_same_as_shipping ?? true,
        billing_first_name: body.billing_first_name || null,
        billing_last_name: body.billing_last_name || null,
        billing_address1: body.billing_address1 || null,
        billing_address2: body.billing_address2 || null,
        billing_city: body.billing_city || null,
        billing_state: body.billing_state || null,
        billing_postal_code: body.billing_postal_code || null,
        billing_country: body.billing_country || null,
        subtotal,
        tax_total: taxTotal,
        shipping_total: shippingTotal,
        grand_total: grandTotal,
        payment_status: "pending_payment",
        order_status: "pending_payment",
        notes: body.notes || null,
      })
      .select()
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    // Create order items
    const itemsWithOrderId = orderItems.map((item: Record<string, unknown>) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsWithOrderId);

    if (itemsError) {
      console.error("Failed to create order items:", itemsError);
    }

    // Send emails (non-blocking)
    sendOrderConfirmation(order, itemsWithOrderId).catch(console.error);
    sendAdminNotification(order, itemsWithOrderId).catch(console.error);

    return NextResponse.json({
      order_id: order.id,
      order_number: orderNumber,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
