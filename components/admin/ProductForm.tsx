"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";

interface ProductFormProps {
  product?: Product;
  mode: "create" | "edit";
}

export default function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(product?.primary_image_url || "");
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: product?.title || "",
    slug: product?.slug || "",
    sku: product?.sku || "",
    short_description: product?.short_description || "",
    full_description: product?.full_description || "",
    price: product?.price?.toString() || "",
    compare_at_price: product?.compare_at_price?.toString() || "",
    taxable: product?.taxable ?? true,
    active: product?.active ?? true,
    featured: product?.featured ?? false,
    category: product?.category || "",
    stock: product?.stock?.toString() || "",
    sort_order: product?.sort_order?.toString() || "0",
    primary_image_url: product?.primary_image_url || "",
  });

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Auto-generate slug from title
  function handleTitleChange(title: string) {
    updateField("title", title);
    if (mode === "create" || !product?.slug) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      updateField("slug", slug);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (data.url) {
        setImagePreview(data.url);
        updateField("primary_image_url", data.url);
      } else {
        setError("Image upload failed: " + (data.error || "Unknown error"));
      }
    } catch {
      setError("Image upload failed");
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
        stock: form.stock ? parseInt(form.stock) : null,
        sort_order: parseInt(form.sort_order) || 0,
        ...(mode === "edit" && product ? { id: product.id } : {}),
      };

      const res = await fetch("/api/admin/products", {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setSaving(false);
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Failed to save product");
      setSaving(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    border: "1.5px solid #d1d5db",
    borderRadius: 8,
    fontSize: "0.9rem",
    outline: "none",
    background: "white",
    transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.82rem",
    fontWeight: 500,
    color: "#374151",
    marginBottom: 6,
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32, alignItems: "start" }}>
        {/* Left Column — Main Fields */}
        <div>
          <div style={{ background: "white", borderRadius: 12, padding: 24, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: 20, color: "#1a1a1a" }}>
              Basic Info
            </h3>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Title *</label>
              <input
                style={inputStyle}
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="e.g. Storm Blend Energy Formula"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Slug *</label>
                <input
                  style={inputStyle}
                  value={form.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  required
                  placeholder="storm-blend-energy"
                />
              </div>
              <div>
                <label style={labelStyle}>SKU *</label>
                <input
                  style={inputStyle}
                  value={form.sku}
                  onChange={(e) => updateField("sku", e.target.value)}
                  required
                  placeholder="HE-STORM-001"
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Short Description</label>
              <input
                style={inputStyle}
                value={form.short_description}
                onChange={(e) => updateField("short_description", e.target.value)}
                placeholder="Brief tagline for product cards"
              />
            </div>

            <div>
              <label style={labelStyle}>Full Description</label>
              <textarea
                style={{ ...inputStyle, minHeight: 120, resize: "vertical" }}
                value={form.full_description}
                onChange={(e) => updateField("full_description", e.target.value)}
                placeholder="Detailed product description..."
              />
            </div>
          </div>

          {/* Pricing */}
          <div style={{ background: "white", borderRadius: 12, padding: 24, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: 20, color: "#1a1a1a" }}>
              Pricing & Inventory
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  style={inputStyle}
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  required
                  placeholder="29.99"
                />
              </div>
              <div>
                <label style={labelStyle}>Compare At ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  style={inputStyle}
                  value={form.compare_at_price}
                  onChange={(e) => updateField("compare_at_price", e.target.value)}
                  placeholder="39.99"
                />
              </div>
              <div>
                <label style={labelStyle}>Stock</label>
                <input
                  type="number"
                  min="0"
                  style={inputStyle}
                  value={form.stock}
                  onChange={(e) => updateField("stock", e.target.value)}
                  placeholder="100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column — Image & Settings */}
        <div>
          {/* Image */}
          <div style={{ background: "white", borderRadius: 12, padding: 24, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: 20, color: "#1a1a1a" }}>
              Product Image
            </h3>
            {imagePreview ? (
              <div style={{ marginBottom: 12 }}>
                <img
                  src={imagePreview}
                  alt="Product preview"
                  style={{ width: "100%", borderRadius: 8, aspectRatio: "1/1", objectFit: "cover" }}
                />
              </div>
            ) : (
              <div
                style={{
                  aspectRatio: "1/1",
                  background: "#f3f4f6",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                  color: "#9ca3af",
                  fontSize: "0.85rem",
                }}
              >
                No image
              </div>
            )}
            <label
              style={{
                display: "block",
                padding: "10px",
                textAlign: "center",
                background: "#f5f2ea",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: "0.85rem",
                color: "#2d5a27",
                fontWeight: 500,
              }}
            >
              {uploading ? "Uploading..." : "Upload Image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
                disabled={uploading}
              />
            </label>
          </div>

          {/* Settings */}
          <div style={{ background: "white", borderRadius: 12, padding: 24, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: 20, color: "#1a1a1a" }}>
              Settings
            </h3>

            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Category</label>
              <select
                style={inputStyle}
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
              >
                <option value="">Select category</option>
                {["Energy", "Recovery", "Immunity", "Focus", "Detox"].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Sort Order</label>
              <input
                type="number"
                style={inputStyle}
                value={form.sort_order}
                onChange={(e) => updateField("sort_order", e.target.value)}
              />
            </div>

            {[
              { key: "active", label: "Active (visible on site)" },
              { key: "featured", label: "Featured product" },
              { key: "taxable", label: "Taxable" },
            ].map(({ key, label }) => (
              <label
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 0",
                  cursor: "pointer",
                  fontSize: "0.88rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={form[key as keyof typeof form] as boolean}
                  onChange={(e) => updateField(key, e.target.checked)}
                  style={{ width: 18, height: 18 }}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            background: "#fef2f2",
            color: "#dc2626",
            borderRadius: 8,
            fontSize: "0.85rem",
            marginTop: 16,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          style={{
            padding: "10px 24px",
            background: "white",
            border: "1.5px solid #d1d5db",
            borderRadius: 8,
            fontSize: "0.88rem",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          style={{
            padding: "10px 24px",
            background: saving ? "#9ca3af" : "#2d5a27",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: "0.88rem",
            fontWeight: 600,
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Saving..." : mode === "create" ? "Create Product" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
