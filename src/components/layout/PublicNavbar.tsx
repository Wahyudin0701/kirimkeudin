"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/kenalan", label: "Kenalan" },
  { href: "/karya", label: "Karya" },
  { href: "/perjalanan", label: "Perjalanan" },
  { href: "/pencapaian", label: "Pencapaian" },
];

export default function PublicNavbar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center px-6 md:px-14 py-3.5 md:py-4"
      style={{
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.8)",
      }}
    >
      {/* Left: Logo */}
      <div className="flex-1 flex justify-start">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-montserrat font-extrabold text-lg text-ku-navy tracking-tight hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-ku-yellow flex items-center justify-center overflow-hidden flex-shrink-0">
            <img 
              src="/Logo_Kirimkeudin.png?v=2" 
              alt="Logo" 
              className="object-cover w-full h-full"
              onError={(e) => { 
                (e.currentTarget as HTMLImageElement).style.display = "none"; 
                (e.currentTarget.parentElement as HTMLElement).innerHTML = '<span style="font-family:Montserrat;font-weight:800;font-size:14px;color:#0D2D6B">K</span>'; 
              }} 
            />
          </div>
          Kirim Ke Udin
        </Link>
      </div>

      {/* Center: Nav Links */}
      <div className="hidden md:flex items-center justify-center gap-6">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative font-jakarta font-bold text-[13px] md:text-sm transition-colors duration-200 py-1",
                isActive
                  ? "text-ku-navy"
                  : "text-text-soft hover:text-ku-navy"
              )}
            >
              {link.label}
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute left-0 right-0 bottom-0 h-[3px] bg-ku-yellow rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Right: CTA Button or Empty Space */}
      <div className="flex-1 flex justify-end">
        {pathname !== "/kirim" && (
          <Link
            href="/kirim"
            className="flex items-center gap-2 bg-ku-yellow text-ku-navy font-jakarta font-bold text-xs md:text-sm px-5 py-2 md:py-2.5 rounded-xl hover:bg-yellow-400 transition-all duration-300 shadow hover:shadow-md hover:-translate-y-0.5 group"
          >
            Kirim Sesuatu
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </Link>
        )}
      </div>
    </nav>
  );
}
