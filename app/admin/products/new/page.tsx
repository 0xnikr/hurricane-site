import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a1a1a", marginBottom: 32 }}>
        New Product
      </h1>
      <ProductForm mode="create" />
    </div>
  );
}
