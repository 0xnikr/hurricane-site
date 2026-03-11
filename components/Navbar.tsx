"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      id="navbar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? "12px 0" : "20px 0",
        background: scrolled ? "rgba(245, 242, 234, 0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(200, 212, 184, 0.4)" : "1px solid transparent",
        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(20px, 5vw, 80px)",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: 4 }}>
          <span
            style={{
              fontFamily: "var(--font-bebas-neue), sans-serif",
              fontSize: "1.75rem",
              letterSpacing: "0.04em",
              color: scrolled ? "var(--deep-forest)" : "#f0e8d8",
              transition: "color 0.3s ease",
            }}
          >
            HURRICANE
          </span>
          <span
            style={{
              fontFamily: "var(--font-playfair-display), serif",
              fontSize: "0.85rem",
              fontStyle: "italic",
              color: scrolled ? "var(--hurricane-green)" : "#d4c9a8",
              transition: "color 0.3s ease",
            }}
          >
            extracts
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 36,
          }}
          className="nav-links-desktop"
        >
          {["Products", "About", "Contact Us"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="nav-link"
              style={{
                textDecoration: "none",
                fontFamily: "var(--font-inter), -apple-system, system-ui, sans-serif",
                fontSize: "0.9rem",
                fontWeight: 400,
                color: scrolled ? "var(--text-dark)" : "#f0e8d8",
                transition: "color 0.2s ease",
                letterSpacing: "0.01em",
              }}
            >
              {item}
            </Link>
          ))}
          <button className="btn-primary" style={{ padding: "10px 24px", fontSize: "0.85rem" }}>
            Shop Now
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            flexDirection: "column",
            gap: 5,
          }}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
        >
          <span style={{
            display: "block", width: 24, height: 2,
            background: scrolled ? "var(--deep-forest)" : "#f0e8d8",
            borderRadius: 2,
            transition: "all 0.3s ease",
            transform: mobileOpen ? "rotate(45deg) translateY(7px)" : "none",
          }} />
          <span style={{
            display: "block", width: 24, height: 2,
            background: scrolled ? "var(--deep-forest)" : "#f0e8d8",
            borderRadius: 2,
            transition: "all 0.3s ease",
            opacity: mobileOpen ? 0 : 1,
          }} />
          <span style={{
            display: "block", width: 24, height: 2,
            background: scrolled ? "var(--deep-forest)" : "#f0e8d8",
            borderRadius: 2,
            transition: "all 0.3s ease",
            transform: mobileOpen ? "rotate(-45deg) translateY(-7px)" : "none",
          }} />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          right: 0,
          width: "280px",
          height: "100vh",
          background: "var(--warm-cream)",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.1)",
          padding: "80px 32px 32px",
          flexDirection: "column",
          gap: 24,
          transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          zIndex: 999,
        }}
        className="mobile-drawer"
      >
        {["Products", "About", "Contact Us"].map((item) => (
          <Link
            key={item}
            href={`#${item.toLowerCase().replace(" ", "-")}`}
            onClick={() => setMobileOpen(false)}
            style={{
              textDecoration: "none",
              fontFamily: "var(--font-inter), -apple-system, system-ui, sans-serif",
              fontSize: "1.1rem",
              fontWeight: 500,
              color: "var(--text-dark)",
            }}
          >
            {item}
          </Link>
        ))}
        <button className="btn-primary" style={{ marginTop: 8 }}>
          Shop Now
        </button>
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 998,
          }}
        />
      )}

      <style>{`
        .nav-link:hover { color: var(--hurricane-green) !important; }
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .mobile-drawer { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
