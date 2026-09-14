"use client";

import { useEffect } from "react";

export default function MeshBackground() {
  // Mouse glow effect — ikuti kursor (hanya desktop)
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) return;

    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      {/* Blob Container */}
      <div
        className="fixed inset-0 -z-30 overflow-hidden"
        style={{ background: "#F4F6FA" }}
        aria-hidden="true"
      >
        {/* Blob 1 — Gold kiri atas */}
        <div className="mesh-blob blob-gold" />
        {/* Blob 2 — Navy kanan bawah */}
        <div className="mesh-blob blob-navy" />
        {/* Blob 3 — Light Blue kiri bawah */}
        <div className="mesh-blob blob-blue" />
      </div>

      {/* Background Image Overlay */}
      <div
        className="fixed inset-0 -z-20 opacity-[0.06] mix-blend-luminosity"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 30% 50%, rgba(13,45,107,0.15) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Mouse Glow */}
      <div
        className="pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-500 hidden md:block"
        style={{
          background:
            "radial-gradient(600px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.12), transparent 80%)",
        }}
        aria-hidden="true"
      />
    </>
  );
}
