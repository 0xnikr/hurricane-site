"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import type { Product } from "@/lib/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const supabase = createSupabaseBrowser();
    // Need admin access to see inactive products too
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });
    setProducts(data || []);
    setLoading(false);
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  }

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
          Products
        </h1>
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
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by title, SKU, or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          maxWidth: 400,
          padding: "10px 14px",
          border: "1.5px solid #d1d5db",
          borderRadius: 8,
          fontSize: "0.9rem",
          marginBottom: 20,
          outline: "none",
        }}
      />

      {loading ? (
        <p style={{ color: "#9ca3af" }}>Loading...</p>
      ) : (
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
                {["Image", "Title", "SKU", "Price", "Category", "Status", "Actions"].map(
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
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}
                  >
                    {search ? "No products match your search" : "No products yet. Create your first product!"}
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr
                    key={product.id}
                    style={{ borderBottom: "1px solid #f3f4f6" }}
                  >
                    <td style={{ padding: "10px 16px" }}>
                      {product.primary_image_url ? (
                        <img
                          src={product.primary_image_url}
                          alt={product.title}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 6,
                            objectFit: "cover",
                          }}
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
                            fontSize: "1rem",
                          }}
                        >
                          🌿
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>
                        {product.title}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "10px 16px",
                        fontSize: "0.82rem",
                        color: "#6b7280",
                        fontFamily: "monospace",
                      }}
                    >
                      {product.sku}
                    </td>
                    <td style={{ padding: "10px 16px", fontSize: "0.9rem" }}>
                      ${Number(product.price).toFixed(2)}
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      {product.category && (
                        <span
                          style={{
                            padding: "3px 10px",
                            borderRadius: 20,
                            fontSize: "0.75rem",
                            background: "#f0fdf4",
                            color: "#166534",
                          }}
                        >
                          {product.category}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        {product.active && (
                          <span
                            style={{
                              padding: "2px 8px",
                              borderRadius: 20,
                              fontSize: "0.7rem",
                              background: "#dcfce7",
                              color: "#166534",
                            }}
                          >
                            Active
                          </span>
                        )}
                        {!product.active && (
                          <span
                            style={{
                              padding: "2px 8px",
                              borderRadius: 20,
                              fontSize: "0.7rem",
                              background: "#f3f4f6",
                              color: "#6b7280",
                            }}
                          >
                            Inactive
                          </span>
                        )}
                        {product.featured && (
                          <span
                            style={{
                              padding: "2px 8px",
                              borderRadius: 20,
                              fontSize: "0.7rem",
                              background: "#fef9c3",
                              color: "#92400e",
                            }}
                          >
                            ★
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          style={{
                            fontSize: "0.82rem",
                            color: "#2d5a27",
                            textDecoration: "none",
                            fontWeight: 500,
                          }}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.title)}
                          style={{
                            fontSize: "0.82rem",
                            color: "#dc2626",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
