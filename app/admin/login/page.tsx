"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createSupabaseBrowser();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      // Check if user is in admin_users table
      const { data: adminUser } = await supabase
        .from("admin_users")
        .select("id, active")
        .eq("email", email)
        .single();

      if (!adminUser?.active) {
        await supabase.auth.signOut();
        setError("You do not have admin access");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f2ea",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "white",
          borderRadius: 16,
          padding: 40,
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1
            style={{
              fontFamily: "var(--font-bebas-neue), sans-serif",
              fontSize: "1.8rem",
              letterSpacing: "0.04em",
              color: "#1a2e1a",
              margin: 0,
            }}
          >
            HURRICANE{" "}
            <span
              style={{
                fontFamily: "var(--font-playfair-display), serif",
                fontSize: "0.7rem",
                fontStyle: "italic",
                color: "#2d5a27",
              }}
            >
              extracts
            </span>
          </h1>
          <p
            style={{
              color: "#6b7280",
              fontSize: "0.85rem",
              marginTop: 8,
            }}
          >
            Admin Dashboard
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 500,
                color: "#374151",
                marginBottom: 6,
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1.5px solid #d1d5db",
                borderRadius: 8,
                fontSize: "0.9rem",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              placeholder="admin@example.com"
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 500,
                color: "#374151",
                marginBottom: 6,
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1.5px solid #d1d5db",
                borderRadius: 8,
                fontSize: "0.9rem",
                outline: "none",
              }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p
              style={{
                color: "#dc2626",
                fontSize: "0.82rem",
                marginBottom: 16,
                padding: "8px 12px",
                background: "#fef2f2",
                borderRadius: 6,
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: loading ? "#9ca3af" : "#2d5a27",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
