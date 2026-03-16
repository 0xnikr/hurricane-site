import { createSupabaseServer } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServer();

  // Use admin client to read even inactive products
  const { createSupabaseAdmin } = await import("@/lib/supabase/server");
  const admin = createSupabaseAdmin();

  const { data: product } = await admin
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a1a1a", marginBottom: 32 }}>
        Edit Product
      </h1>
      <ProductForm product={product} mode="edit" />
    </div>
  );
}
