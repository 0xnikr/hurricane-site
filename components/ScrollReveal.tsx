"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
  style?: React.CSSProperties;
  as?: "div" | "section";
  id?: string;
}

export default function ScrollReveal({
  children,
  className = "",
  stagger = false,
  style,
  as: Tag = "div",
  id,
}: ScrollRevealProps) {
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

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const revealClass = stagger ? "reveal-stagger" : "reveal";

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={`${revealClass} ${className}`}
      style={style}
      id={id}
    >
      {children}
    </Tag>
  );
}
