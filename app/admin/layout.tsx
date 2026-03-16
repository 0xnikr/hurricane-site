"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "📊" },
  { label: "Products", href: "/admin/products", icon: "📦" },
  { label: "Homepage", href: "/admin/homepage", icon: "🏠" },
  { label: "Orders", href: "/admin/orders", icon: "🧾" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Don't show sidebar on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function handleLogout() {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9fafb" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          background: "#1a2e1a",
          padding: "24px 0",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <Link
          href="/admin"
          style={{
            textDecoration: "none",
            padding: "0 24px 24px",
            borderBottom: "1px solid rgba(200,212,184,0.15)",
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-bebas-neue), sans-serif",
              fontSize: "1.3rem",
              letterSpacing: "0.04em",
              color: "#f5f2ea",
            }}
          >
            HURRICANE
          </span>{" "}
          <span
            style={{
              fontFamily: "var(--font-playfair-display), serif",
              fontSize: "0.65rem",
              fontStyle: "italic",
              color: "#c8d4b8",
            }}
          >
            admin
          </span>
        </Link>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: "0 12px" }}>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                  textDecoration: "none",
                  fontSize: "0.88rem",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#f5f2ea" : "rgba(200,212,184,0.7)",
                  background: isActive ? "rgba(200,212,184,0.15)" : "transparent",
                  marginBottom: 2,
                  transition: "all 0.15s ease",
                }}
              >
                <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(200,212,184,0.15)" }}>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              fontSize: "0.82rem",
              color: "rgba(200,212,184,0.6)",
              textDecoration: "none",
              marginBottom: 4,
            }}
          >
            ← Back to Site
          </Link>
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              fontSize: "0.82rem",
              color: "rgba(200,212,184,0.6)",
              background: "none",
              border: "none",
              cursor: "pointer",
              width: "100%",
              textAlign: "left",
            }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "32px 40px", overflow: "auto" }}>
        {children}
      </main>
    </div>
  );
}
