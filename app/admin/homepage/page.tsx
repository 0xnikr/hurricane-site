"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import type { Product } from "@/lib/types";

interface FeaturedItem {
  id: string;
  product_id: string;
  section_key: string;
  sort_order: number;
  active: boolean;
  product?: Product;
}

export default function AdminHomepagePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [featured, setFeatured] = useState<FeaturedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [section, setSection] = useState("featured");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const supabase = createSupabaseBrowser();

    const { data: products } = await supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("title");

    const { data: featuredData } = await supabase
      .from("homepage_featured_products")
      .select("*, product:products(*)")
      .order("sort_order");

    setAllProducts(products || []);
    setFeatured(featuredData || []);
    setLoading(false);
  }

  async function handleAdd() {
    if (!selectedProduct) return;
    setSaving(true);

    const res = await fetch("/api/admin/homepage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: selectedProduct,
        section_key: section,
        sort_order: featured.filter((f) => f.section_key === section).length,
      }),
    });

    if (res.ok) {
      setSelectedProduct("");
      await loadData();
    }
    setSaving(false);
  }

  async function handleRemove(id: string) {
    const res = await fetch(`/api/admin/homepage?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      await loadData();
    }
  }

  async function handleMove(id: string, direction: "up" | "down") {
    const sectionItems = featured
      .filter((f) => f.section_key === section)
      .sort((a, b) => a.sort_order - b.sort_order);

    const idx = sectionItems.findIndex((f) => f.id === id);
    if (
      (direction === "up" && idx === 0) ||
      (direction === "down" && idx === sectionItems.length - 1)
    )
      return;

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;

    await fetch("/api/admin/homepage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        updates: [
          { id: sectionItems[idx].id, sort_order: sectionItems[swapIdx].sort_order },
          { id: sectionItems[swapIdx].id, sort_order: sectionItems[idx].sort_order },
        ],
      }),
    });

    await loadData();
  }

  const sections = ["featured", "catalog"];
  const sectionItems = featured
    .filter((f) => f.section_key === section)
    .sort((a, b) => a.sort_order - b.sort_order);

  if (loading) return <p style={{ color: "#9ca3af" }}>Loading...</p>;

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
        Homepage Management
      </h1>
      <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: 32 }}>
        Choose which products appear on the homepage and in what order.
      </p>

      {/* Section Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {sections.map((s) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "1.5px solid",
              borderColor: section === s ? "#2d5a27" : "#d1d5db",
              background: section === s ? "#2d5a27" : "white",
              color: section === s ? "white" : "#374151",
              fontSize: "0.85rem",
              fontWeight: 500,
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {s} Section
          </button>
        ))}
      </div>

      {/* Add Product */}
      <div
        style={{
          background: "white",
          borderRadius: 12,
          padding: 20,
          marginBottom: 24,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          display: "flex",
          gap: 12,
          alignItems: "flex-end",
        }}
      >
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 500, color: "#374151", marginBottom: 6 }}>
            Add product to {section} section
          </label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              border: "1.5px solid #d1d5db",
              borderRadius: 8,
              fontSize: "0.9rem",
            }}
          >
            <option value="">Select product...</option>
            {allProducts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} — ${Number(p.price).toFixed(2)}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAdd}
          disabled={!selectedProduct || saving}
          style={{
            padding: "10px 20px",
            background: !selectedProduct || saving ? "#9ca3af" : "#2d5a27",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: "0.85rem",
            fontWeight: 500,
            cursor: !selectedProduct ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {saving ? "Adding..." : "+ Add"}
        </button>
      </div>

      {/* Current Items */}
      <div
        style={{
          background: "white",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        {sectionItems.length === 0 ? (
          <p style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>
            No products in this section yet.
          </p>
        ) : (
          sectionItems.map((item, idx) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "12px 20px",
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <span style={{ color: "#9ca3af", fontSize: "0.85rem", width: 24 }}>
                {idx + 1}
              </span>
              {item.product?.primary_image_url ? (
                <img
                  src={item.product.primary_image_url}
                  alt={item.product?.title || ""}
                  style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 6,
                    background: "#f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  🌿
                </div>
              )}
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>
                  {item.product?.title || "Unknown product"}
                </span>
                <span style={{ color: "#6b7280", fontSize: "0.82rem", marginLeft: 12 }}>
                  ${Number(item.product?.price || 0).toFixed(2)}
                </span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => handleMove(item.id, "up")}
                  disabled={idx === 0}
                  style={{
                    padding: "4px 8px",
                    background: "none",
                    border: "1px solid #d1d5db",
                    borderRadius: 4,
                    cursor: idx === 0 ? "not-allowed" : "pointer",
                    opacity: idx === 0 ? 0.3 : 1,
                  }}
                >
                  ▲
                </button>
                <button
                  onClick={() => handleMove(item.id, "down")}
                  disabled={idx === sectionItems.length - 1}
                  style={{
                    padding: "4px 8px",
                    background: "none",
                    border: "1px solid #d1d5db",
                    borderRadius: 4,
                    cursor: idx === sectionItems.length - 1 ? "not-allowed" : "pointer",
                    opacity: idx === sectionItems.length - 1 ? 0.3 : 1,
                  }}
                >
                  ▼
                </button>
                <button
                  onClick={() => handleRemove(item.id)}
                  style={{
                    padding: "4px 8px",
                    background: "none",
                    border: "1px solid #fca5a5",
                    borderRadius: 4,
                    color: "#dc2626",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
