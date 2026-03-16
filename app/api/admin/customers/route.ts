import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import type { Order } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const supabase = createSupabaseAdmin();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Get all orders for this customer
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_email", email)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Build customer profile from most recent order
    const latest = orders[0];
    const totalSpent = (orders as Order[]).reduce((sum: number, o: Order) => sum + Number(o.grand_total), 0);

    const customer = {
      name: latest.customer_name,
      email: latest.customer_email,
      phone: latest.customer_phone,
      address: {
        address1: latest.shipping_address1,
        address2: latest.shipping_address2,
        city: latest.shipping_city,
        state: latest.shipping_state,
        postal_code: latest.shipping_postal_code,
        country: latest.shipping_country,
      },
      total_orders: orders.length,
      total_spent: totalSpent,
      first_order: orders[orders.length - 1].created_at,
      last_order: orders[0].created_at,
      orders: (orders as Order[]).map((o: Order) => ({
        id: o.id,
        order_number: o.order_number,
        grand_total: o.grand_total,
        payment_status: o.payment_status,
        order_status: o.order_status,
        created_at: o.created_at,
      })),
    };

    return NextResponse.json(customer);
  } catch {
    return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 });
  }
}
