"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X, Home, User, Briefcase, MapPin, Trophy, Send } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/kenalan", label: "Kenalan", icon: User },
  { href: "/karya", label: "Karya", icon: Briefcase },
  { href: "/perjalanan", label: "Perjalanan", icon: MapPin },
  { href: "/pencapaian", label: "Pencapaian", icon: Trophy },
];

export default function PublicNavbar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center px-4 md:px-14 py-3.5 md:py-4"
        style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.8)",
        }}
      >
        {/* Left: Hamburger (mobile) + Logo */}
        <div className="flex-1 flex justify-start items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-ku-navy/5 hover:bg-ku-navy/10 text-ku-navy transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link
            href="/"
            className="flex items-center gap-2.5 font-montserrat font-extrabold text-lg text-ku-navy tracking-tight hover:opacity-80 transition-opacity whitespace-nowrap"
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

        {/* Center: Nav Links — desktop only */}
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

        {/* Right: CTA Button */}
        <div className="flex-1 flex justify-end">
          {pathname !== "/kirim" && (
            <Link
              href="/kirim"
              className="flex items-center gap-2 bg-ku-yellow text-ku-navy font-jakarta font-bold text-xs md:text-sm px-3 md:px-5 py-2 md:py-2.5 rounded-xl hover:bg-yellow-400 transition-all duration-300 shadow hover:shadow-md hover:-translate-y-0.5 group"
            >
              {/* Label: hidden on mobile */}
              <span className="hidden md:inline">Kirim Sesuatu</span>
              {/* Icon: always shown */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </Link>
          )}
        </div>
      </nav>

      {/* ── Sidebar Overlay (mobile) ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[60] bg-ku-navy/40 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar panel */}
            <motion.div
              className="fixed top-0 left-0 bottom-0 z-[70] w-72 bg-white shadow-2xl flex flex-col md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <Link
                  href="/"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-2.5 font-montserrat font-extrabold text-base text-ku-navy"
                >
                  <div className="w-8 h-8 rounded-lg bg-ku-yellow flex items-center justify-center flex-shrink-0 overflow-hidden">
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
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-text-soft transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          "flex items-center gap-3.5 px-4 py-3 rounded-2xl font-jakarta font-bold text-sm transition-all",
                          isActive
                            ? "bg-ku-navy text-white shadow-md"
                            : "text-text-soft hover:bg-ku-navy/5 hover:text-ku-navy"
                        )}
                      >
                        <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-text-muted")} />
                        {link.label}
                        {isActive && (
                          <div className="ml-auto w-2 h-2 rounded-full bg-white" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Sidebar Footer CTA */}
              <div className="px-4 pb-8">
                <Link
                  href="/kirim"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center justify-center gap-2.5 w-full bg-ku-yellow text-ku-navy font-jakarta font-extrabold text-sm py-3.5 rounded-2xl hover:bg-yellow-400 transition-all shadow"
                >
                  <Send className="w-4 h-4" />
                  Kirim Sesuatu
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
