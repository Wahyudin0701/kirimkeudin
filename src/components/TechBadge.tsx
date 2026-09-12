"use client";

import { resolveTech } from "@/lib/tech-icons";
import { useState } from "react";

/**
 * TechBadge — Menampilkan icon teknologi dengan tooltip label.
 * Jika icon tidak ditemukan di mapping, fallback ke text badge.
 */
export function TechBadge({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const { label, iconUrl } = resolveTech(name);
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  // Fallback: text badge jika tidak ada icon
  if (!iconUrl || imgError) {
    return (
      <span
        className="font-jakarta text-xs font-semibold px-3 py-1.5 rounded-full bg-ku-yellow/20 text-ku-navy"
        title={label}
      >
        {label}
      </span>
    );
  }

  return (
    <div className="group/tech relative flex items-center justify-center" title={label}>
      <img
        src={iconUrl}
        alt={label}
        className={`${sizeClasses[size]} object-contain transition-transform duration-200 group-hover/tech:scale-110`}
        onError={() => setImgError(true)}
        loading="lazy"
      />
      {/* Tooltip */}
      <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-ku-navy text-white text-[10px] font-jakarta font-semibold px-2 py-0.5 rounded-md opacity-0 group-hover/tech:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
        {label}
      </span>
    </div>
  );
}

/**
 * TechIconRow — Baris icon tech stack dengan tooltip.
 */
export function TechIconRow({
  techStack,
  size = "md",
}: {
  techStack: string[];
  size?: "sm" | "md" | "lg";
}) {
  if (techStack.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {techStack.map((t) => (
        <TechBadge key={t} name={t} size={size} />
      ))}
    </div>
  );
}
