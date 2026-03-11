"use client";

import { useEffect, useRef } from "react";

export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    // Observe the element itself and any reveal children
    const targets = el.querySelectorAll(".reveal, .reveal-stagger");
    targets.forEach((t) => observer.observe(t));
    if (el.classList.contains("reveal") || el.classList.contains("reveal-stagger")) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return ref;
}
