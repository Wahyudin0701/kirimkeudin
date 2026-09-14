"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  Trophy,
  Code2,
  Users,
  MapPin,
  Calendar,
  Award,
  ArrowRight,
  Mail,
  Send,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────
type Project = {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  tech_stack: string[];
  project_url: string | null;
  start_date: string | null;
  end_date: string | null;
};

type Achievement = {
  id: string;
  name: string;
  issuer: string | null;
  category: string | null;
  year: number | null;
  photo_url: string | null;
};

type Journey = {
  id: string;
  category: string | null;
  institution: string | null;
  role: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
};

type Props = {
  projects: Project[];
  achievements: Achievement[];
  journeys: Journey[];
  stats: { projectCount: number; journeyCount: number; achievementCount: number };
  settings?: any;
};

// ── Shared animation variants ──────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

// ── Category config for journeys ───────────────────────────
const JOURNEY_CATEGORY: Record<string, { label: string; Icon: typeof GraduationCap; color: string; bg: string }> = {
  education:    { label: "Pendidikan",  Icon: GraduationCap, color: "text-blue-600",    bg: "bg-blue-50" },
  organization: { label: "Organisasi",  Icon: Users,         color: "text-ku-navy",     bg: "bg-ku-navy/8" },
  committee:    { label: "Kepanitiaan", Icon: Calendar,      color: "text-amber-600",   bg: "bg-amber-50" },
  experience:   { label: "Pengalaman",  Icon: Award,         color: "text-emerald-600", bg: "bg-emerald-50" },
};

// ── Skills ─────────────────────────────────────────────────
const skillsData = [
  { name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/000000" },
  { name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
  { name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
  { name: "Python", icon: "https://cdn.simpleicons.org/python/3776AB" },
  { name: "Laravel", icon: "https://cdn.simpleicons.org/laravel/FF2D20" },
  { name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql/4169E1" },
  { name: "Tailwind CSS", icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4" },
  { name: "Figma", icon: "https://cdn.simpleicons.org/figma/F24E1E" },
  { name: "Git", icon: "https://cdn.simpleicons.org/git/F05032" },
  { name: "Linux", icon: "https://cdn.simpleicons.org/linux/000000" },
  { name: "REST API", icon: "https://cdn.simpleicons.org/nodedotjs/339933" },
  { name: "Machine Learning", icon: "https://cdn.simpleicons.org/tensorflow/FF6F00" },
];



// ── Section Header Component ───────────────────────────────
function SectionHeader({
  tag,
  title,
  description,
  href,
  linkText,
}: {
  tag: string;
  title: string;
  description: string;
  href?: string;
  linkText?: string;
}) {
  return (
    <motion.div
      className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      variants={fadeUp}
      custom={0}
    >
      <div>
        <p className="font-jakarta font-semibold text-ku-yellow text-xs md:text-sm uppercase tracking-widest mb-2">{tag}</p>
        <h2 className="font-montserrat font-extrabold text-3xl md:text-4xl text-ku-navy mb-2">{title}</h2>
        <p className="font-jakarta text-text-soft text-sm md:text-base max-w-lg">{description}</p>
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-2 font-jakarta font-bold text-sm text-ku-navy hover:text-ku-navy-light transition-colors flex-shrink-0 group"
        >
          {linkText}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════
// ── MAIN LANDING CLIENT ──────────────────────────────────────
// ══════════════════════════════════════════════════════════════
export default function LandingClient({ projects, achievements, journeys, stats, settings }: Props) {
  const router = useRouter();
  const name = settings?.name || "Wahyudin";

  // ── Deteksi Mobile — matikan semua spring physics di HP ──
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // ── Scroll-based parallax for background blobs ──
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  // Di mobile, transform ini tidak akan dipakai (style dihilangkan di JSX)
  const bgY1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  // ── Mouse-tracking parallax motion values ──
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 100, mass: 1 };
  
  // Element 1 (Top Left Yellow Orb)
  const x1 = useSpring(useTransform(mouseX, [-0.5, 0.5], [40, -40]), springConfig);
  const y1 = useSpring(useTransform(mouseY, [-0.5, 0.5], [40, -40]), springConfig);
  const floatY1 = useSpring(useTransform(scrollYProgress, [0, 1], [0, 150]), springConfig);

  // Element 2 (Right Mid Navy Ring)
  const x2 = useSpring(useTransform(mouseX, [-0.5, 0.5], [-25, 25]), springConfig);
  const y2 = useSpring(useTransform(mouseY, [-0.5, 0.5], [-25, 25]), springConfig);
  const floatY2 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -100]), springConfig);

  // Element 3 (Left Bottom Blue Dot)
  const x3 = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);
  const y3 = useSpring(useTransform(mouseY, [-0.5, 0.5], [-15, 15]), springConfig);
  const floatY3 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -200]), springConfig);

  // Element 4 (Top Right Star/Plus)
  const x4 = useSpring(useTransform(mouseX, [-0.5, 0.5], [30, -30]), springConfig);
  const y4 = useSpring(useTransform(mouseY, [-0.5, 0.5], [30, -30]), springConfig);
  const floatY4 = useSpring(useTransform(scrollYProgress, [0, 1], [0, 80]), springConfig);

  // Element 5 (Bottom Right Yellow Square)
  const x5 = useSpring(useTransform(mouseX, [-0.5, 0.5], [-50, 50]), springConfig);
  const y5 = useSpring(useTransform(mouseY, [-0.5, 0.5], [-50, 50]), springConfig);
  const floatY5 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -250]), springConfig);

  // Di mobile, jangan tracking mouse sama sekali
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || typeof window === "undefined") return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX / innerWidth - 0.5);
    mouseY.set(clientY / innerHeight - 0.5);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div ref={containerRef}>

      {/* ═══════════════════════════════════════════════════════
          SECTION 1 — HERO (Soft, friendly, center-aligned)
          ═══════════════════════════════════════════════════════ */}
      <section 
        className="relative flex flex-col items-center justify-start px-5 md:px-14 pt-24 pb-6 md:pt-40 md:pb-0 md:min-h-screen overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >

        {/* Soft warm gold blob — top left — hidden on mobile (too heavy) */}
        {!isMobile && (
          <motion.div
            className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(245,197,24,0.22) 0%, rgba(245,197,24,0.06) 50%, transparent 70%)",
              filter: "blur(40px)",
              y: bgY1,
            }}
          />
        )}
        {/* Soft navy blob — bottom right — hidden on mobile */}
        {!isMobile && (
          <motion.div
            className="absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(13,45,107,0.10) 0%, rgba(13,45,107,0.03) 50%, transparent 70%)",
              filter: "blur(50px)",
              y: bgY2,
            }}
          />
        )}
        {/* Subtle center glow — hidden on mobile */}
        {!isMobile && (
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] pointer-events-none"
            style={{
              background: "radial-gradient(ellipse, rgba(245,197,24,0.07) 0%, rgba(13,45,107,0.04) 40%, transparent 70%)",
              filter: "blur(30px)",
            }}
          />
        )}

        {/* ── Floating Parallax Decorations — hanya tampil di Desktop ── */}
        {!isMobile && (
          <>
            {/* 1. Yellow orb — top left */}
            <motion.div
              className="absolute top-20 left-[10%] md:top-40 md:left-[15%] w-8 h-8 md:w-12 md:h-12 rounded-full bg-ku-yellow/20 backdrop-blur-md border border-white/50 shadow-[0_8px_32px_rgba(245,197,24,0.1)] pointer-events-none"
              style={{ x: x1, y: floatY1, translateY: y1 }}
            />

            {/* 2. Navy ring — right middle */}
            <motion.div
              className="absolute top-[20%] right-[5%] md:top-[40%] md:right-[10%] w-12 h-12 md:w-16 md:h-16 rounded-full border-[3px] border-ku-navy/10 pointer-events-none"
              style={{ x: x2, y: floatY2, translateY: y2 }}
            />

            {/* 3. Small blue dot — left mid-bottom */}
            <motion.div
              className="absolute bottom-1/4 left-[15%] md:bottom-1/3 md:left-[20%] w-3 h-3 md:w-4 md:h-4 rounded-full bg-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)] pointer-events-none"
              style={{ x: x3, y: floatY3, translateY: y3 }}
            />

            {/* 4. Plus / star icon — top right */}
            <motion.svg
              className="absolute top-32 right-[20%] md:top-28 md:right-[22%] w-5 h-5 md:w-7 md:h-7 text-ku-yellow/70 pointer-events-none"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
              style={{ x: x4, y: floatY4, translateY: y4 }}
              animate={{ rotate: [0, 90, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d="M12 2v20" /><path d="M2 12h20" />
            </motion.svg>

            {/* 5. Small yellow square — bottom right */}
            <motion.div
              className="absolute bottom-[15%] right-[20%] md:bottom-[25%] md:right-[25%] w-5 h-5 md:w-6 md:h-6 bg-ku-yellow/30 rounded-md rotate-12 backdrop-blur-sm pointer-events-none"
              style={{ x: x5, y: floatY5, translateY: y5 }}
              animate={{ rotate: [12, 45, 12] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
          </>
        )}


        {/* ── Center Content ── */}
        <div className="relative z-10 w-full max-w-4xl mx-auto">

          {/* ─── MOBILE LAYOUT ─── */}
          <div className="md:hidden flex flex-col items-start gap-0">
            
            {/* Heading — left-aligned, mobile-optimized size */}
            <motion.h1
              className="font-montserrat font-extrabold text-4xl sm:text-5xl leading-[1.15] text-ku-navy mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Halo, <br />
              <span>
                Saya{" "}
                <span className="relative inline-block">
                  <span
                    className="relative z-10"
                    style={{
                      background: "linear-gradient(135deg, #0D2D6B 0%, #1a3f8f 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {name}.
                  </span>
                  <motion.span
                    className="absolute -bottom-0.5 left-0 right-0 h-[4px] rounded-full"
                    style={{ background: "linear-gradient(90deg, #F5C518, #fde68a, #F5C518)" }}
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  />
                </span>
              </span>
            </motion.h1>

            {/* Subtitle / Role — single line with dot separators */}
            <motion.p
              className="font-jakarta font-semibold text-xs text-text-muted mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Mahasiswa SI &middot; Web Developer &middot; Freelancer
            </motion.p>

            {/* Description */}
            <motion.p
              className="font-jakarta text-text-soft text-[13px] leading-relaxed mb-6 max-w-[320px]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
            >
              Ruang digital saya — tempat menampilkan karya, mendokumentasikan perjalanan, dan menerima sesuatu dari kamu.
            </motion.p>

            {/* CTA buttons — side by side, equal width */}
            <motion.div
              className="flex w-full gap-3 mb-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
            >
              <Link
                href="/karya"
                className="flex-1 flex items-center justify-center gap-2 bg-ku-navy text-white font-jakarta font-bold text-sm py-3.5 rounded-2xl shadow-lg group"
              >
                <span>Lihat Karya</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/kirim"
                className="flex-1 flex items-center justify-center gap-2 bg-white/80 border border-ku-navy/10 text-ku-navy font-jakarta font-bold text-sm py-3.5 rounded-2xl shadow-sm"
                style={{ backdropFilter: "blur(8px)" }}
              >
                Kirim Sesuatu
              </Link>
            </motion.div>


          </div>

          {/* ─── DESKTOP LAYOUT ─── */}
          <div className="hidden md:flex flex-col items-center text-center pb-10">
            
            {/* Eyebrow badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-white/70 border border-ku-navy/10 rounded-full px-4 py-2 mb-8 shadow-card"
              style={{ backdropFilter: "blur(16px)" }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="w-2 h-2 rounded-full bg-ku-yellow animate-pulse" />
              <span className="font-jakarta font-semibold text-text-muted text-sm tracking-widest uppercase">
                Personal Digital Hub
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              className="font-montserrat font-extrabold text-6xl lg:text-7xl leading-[1.05] text-ku-navy mb-5"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              Halo, Saya{" "}
              <span className="relative inline-block">
                <span
                  className="relative z-10"
                  style={{
                    background: "linear-gradient(135deg, #0D2D6B 0%, #1a3f8f 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {name}.
                </span>
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-[6px] rounded-full"
                  style={{ background: "linear-gradient(90deg, #F5C518, #fde68a, #F5C518)", backgroundSize: "200% 100%" }}
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                />
              </span>
            </motion.h1>

            {/* Role tags */}
            <motion.div
              className="flex flex-wrap justify-center gap-2 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {[
                { label: "Mahasiswa SI", highlight: true },
                { label: "Web Developer", highlight: false },
                { label: "Freelancer", highlight: false },
                { label: "Content Creator", highlight: false },
              ].map(({ label, highlight }) => (
                <span
                  key={label}
                  className={`font-jakarta font-semibold text-sm px-4 py-2 rounded-full ${
                    highlight
                      ? "bg-ku-yellow/20 text-ku-navy border border-ku-yellow/40"
                      : "bg-white/60 text-text-soft border border-ku-navy/10"
                  }`}
                  style={{ backdropFilter: "blur(8px)" }}
                >
                  {label}
                </span>
              ))}
            </motion.div>

            {/* Description */}
            <motion.p
              className="font-jakarta text-text-soft text-base leading-relaxed max-w-lg mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              Ruang digital saya — tempat menampilkan karya, mendokumentasikan perjalanan,
              dan menerima sesuatu dari kamu.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              className="flex items-center justify-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative">
                <div
                  className="absolute -inset-1.5 rounded-full opacity-30 blur-lg"
                  style={{
                    background: "linear-gradient(90deg, #0D2D6B, #F5C518, #0D2D6B)",
                    backgroundSize: "200% 200%",
                    animation: "gradientMove 3s infinite linear",
                  }}
                />
                <Link
                  href="/karya"
                  className="relative flex items-center gap-2.5 bg-ku-navy text-white font-jakarta font-bold text-sm px-7 py-3.5 rounded-full shadow-glass-sm hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 group"
                >
                  <span>Lihat Karya</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <Link
                href="/kirim"
                className="flex items-center gap-2 bg-white/70 border border-ku-navy/15 text-ku-navy font-jakarta font-bold text-sm px-6 py-3.5 rounded-full hover:bg-white hover:shadow-card transition-all duration-300"
                style={{ backdropFilter: "blur(8px)" }}
              >
                Kirim Sesuatu
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator — desktop only */}{/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <span className="font-jakarta text-text-muted/50 text-[11px] uppercase tracking-widest">Scroll</span>
          <motion.div
            className="w-0.5 h-8 bg-gradient-to-b from-ku-navy/30 to-transparent"
            animate={{ scaleY: [0.5, 1, 0.5], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </section>


      {/* ═══════════════════════════════════════════════════════
          SECTION 2 — ABOUT / TENTANG
          ═══════════════════════════════════════════════════════ */}
      <section className="relative pt-4 pb-14 md:py-20 px-5 md:px-14 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            tag="Tentang Saya"
            title="Kenalan Dulu"
            description="Mahasiswa Sistem Informasi yang berfokus pada pengembangan web dan teknologi untuk memecahkan masalah nyata."
            href="/kenalan"
            linkText="Selengkapnya"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            {/* Premium Bio Card */}
            <motion.div
              className="order-2 lg:order-1 lg:col-span-7 xl:col-span-8 glass-card p-8 md:p-10 shadow-card rounded-[2rem] flex flex-col justify-center relative overflow-hidden group"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
              variants={fadeUp}
              custom={1}
            >
              {/* Decorative Blur */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-ku-yellow/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
              <h3 className="font-montserrat font-bold text-2xl text-ku-navy mb-1.5 relative z-10">
                Halo, saya <span className="text-ku-yellow">{name}</span>
              </h3>
              <p className="font-jakarta text-text-soft font-medium text-sm md:text-base mb-6 relative z-10">
                Mahasiswa SI · Web Developer · Freelancer · Content Creator
              </p>
              
              <p className="font-jakarta text-text-soft text-base md:text-lg leading-relaxed mb-10 relative z-10 max-w-2xl">
                Saya percaya bahwa teknologi seharusnya memudahkan kehidupan nyata.
                Itulah mengapa saya berfokus membangun solusi web yang berdampak langsung
                — mulai dari proyek freelance, konten di media sosial, hingga sistem yang memberikan kemudahan bagi banyak orang.
              </p>

              {/* Premium Skills Pills */}
              <div className="relative z-10 mt-auto">
                <h4 className="font-montserrat font-bold text-sm text-ku-navy mb-4">Core Skills & Teknologi</h4>
                <div className="flex flex-wrap gap-3">
                  {skillsData.map((skill) => (
                    <motion.div
                      key={skill.name}
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      className="font-jakarta font-semibold text-xs md:text-sm px-4 py-2.5 rounded-xl bg-white border border-gray-100 text-text-soft hover:border-ku-yellow hover:text-ku-navy shadow-sm hover:shadow-lg hover:shadow-ku-yellow/20 transition-colors cursor-default flex items-center gap-2.5 group"
                    >
                      <img 
                        src={skill.icon} 
                        alt={skill.name} 
                        className="w-4 h-4 md:w-5 md:h-5 object-contain group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} 
                      />
                      <span>{skill.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Premium Big Photo Card */}
            <motion.div
              className="order-1 lg:order-2 lg:col-span-5 xl:col-span-4 relative rounded-[2rem] overflow-hidden shadow-card group min-h-[350px] md:min-h-[450px] flex flex-col justify-end p-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
              variants={fadeUp}
              custom={2}
            >
              {/* Background Image Layer */}
              <div className="absolute inset-0 z-0">
                {settings?.avatar_url ? (
                  <>
                    <img 
                      src={`/api/image?url=${encodeURIComponent(settings.avatar_url)}`} 
                      alt={name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    {/* Subtle Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-ku-navy/80 via-ku-navy/20 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500" />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-ku-navy to-blue-900 text-white text-9xl font-montserrat font-extrabold">
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              {/* Floating Action Button (Hover Reveal) */}
              <div className="relative z-10 w-full bg-white/80 backdrop-blur-md border border-white/50 p-4 rounded-2xl flex items-center justify-between shadow-xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="font-jakarta font-extrabold text-ku-navy text-sm truncate">Lihat Profil Lengkap</p>
                  <p className="font-jakarta text-text-soft text-xs truncate">Kenali udin lebih jauh</p>
                </div>
                <Link href="/kenalan" className="w-10 h-10 flex-shrink-0 rounded-xl bg-ku-yellow flex items-center justify-center text-ku-navy hover:scale-110 transition-transform shadow-md cursor-pointer pointer-events-auto">
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3 — PROYEK / KARYA
          ═══════════════════════════════════════════════════════ */}
      <section className="relative py-14 md:py-20 px-5 md:px-14 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            tag="Karya & Proyek"
            title="Yang Sudah Dibuat"
            description="Proyek-proyek yang pernah dan sedang dikerjakan."
            href="/karya"
            linkText="Lihat Semua Karya"
          />

          {projects.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-montserrat font-extrabold text-2xl text-ku-navy/20 mb-2">Segera hadir</p>
              <p className="font-jakarta text-text-muted text-sm">Proyek-proyek sedang disiapkan. Nantikan ya!</p>
            </div>
          ) : (
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 pb-6 md:pb-0 -mx-5 px-5 md:mx-0 md:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  onClick={() => router.push("/karya")}
                  className="min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center glass-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300 group flex flex-col cursor-pointer"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={fadeUp}
                  custom={i + 1}
                >
                  {/* Thumbnail */}
                  <div className="w-full aspect-[16/10] bg-gradient-to-br from-ku-navy/8 to-ku-navy/3 flex items-center justify-center overflow-hidden">
                    {project.thumbnail_url ? (
                      <img
                        src={`/api/image?url=${encodeURIComponent(project.thumbnail_url)}`}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <Briefcase className="w-10 h-10 text-ku-navy/15" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-montserrat font-extrabold text-base text-ku-navy mb-1.5 group-hover:text-ku-navy-light transition-colors">
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="font-jakarta text-text-muted text-xs leading-relaxed mb-3 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {project.tech_stack.slice(0, 4).map((tech) => (
                        <span key={tech} className="font-jakarta text-[10px] font-semibold px-2 py-1 rounded-md bg-ku-navy/6 text-ku-navy/70">
                          {tech}
                        </span>
                      ))}
                      {project.tech_stack.length > 4 && (
                        <span className="font-jakarta text-[10px] font-semibold px-2 py-1 rounded-md bg-ku-navy/6 text-ku-navy/70">
                          +{project.tech_stack.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 4 — PENCAPAIAN
          ═══════════════════════════════════════════════════════ */}
      <section className="relative py-14 md:py-20 px-5 md:px-14 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            tag="Pencapaian"
            title="Yang Berhasil Diraih"
            description="Sertifikat, penghargaan, dan pencapaian yang menjadi bagian dari perjalanan."
            href="/pencapaian"
            linkText="Lihat Semua"
          />

          {achievements.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-montserrat font-extrabold text-2xl text-ku-navy/20 mb-2">Segera hadir</p>
              <p className="font-jakarta text-text-muted text-sm">Pencapaian sedang disiapkan.</p>
            </div>
          ) : (
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-5 pb-6 md:pb-0 -mx-5 px-5 md:mx-0 md:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {achievements.map((ach, i) => (
                <motion.div
                  key={ach.id}
                  onClick={() => router.push("/pencapaian")}
                  className="min-w-[75vw] sm:min-w-[250px] md:min-w-0 snap-center glass-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300 group cursor-pointer"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={fadeUp}
                  custom={i + 1}
                >
                  {/* Photo */}
                  <div className="w-full aspect-[4/3] bg-gradient-to-br from-ku-yellow/10 to-ku-navy/5 flex items-center justify-center overflow-hidden">
                    {ach.photo_url ? (
                      <img
                        src={`/api/image?url=${encodeURIComponent(ach.photo_url)}`}
                        alt={ach.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <Trophy className="w-8 h-8 text-ku-yellow/30" />
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-montserrat font-extrabold text-sm text-ku-navy mb-1 line-clamp-2">{ach.name}</h3>
                    <p className="font-jakarta text-text-muted text-xs">
                      {ach.issuer}{ach.year ? ` · ${ach.year}` : ""}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 5 — PERJALANAN (Mini Timeline)
          ═══════════════════════════════════════════════════════ */}
      <section className="relative py-14 md:py-20 px-5 md:px-14 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            tag="Perjalanan"
            title="Jejak Langkah"
            description="Pendidikan, organisasi, dan pengalaman yang membentuk saya hari ini."
            href="/perjalanan"
            linkText="Lihat Jejak Lengkap"
          />

          {journeys.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-montserrat font-extrabold text-2xl text-ku-navy/20 mb-2">Segera hadir</p>
              <p className="font-jakarta text-text-muted text-sm">Perjalanan sedang didokumentasikan.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[20px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-ku-navy/20 via-ku-yellow/30 to-transparent" />

              <div className="space-y-8">
                {journeys.map((j, i) => {
                  const catKey = (j.category ?? "experience") as string;
                  const cat = JOURNEY_CATEGORY[catKey] ?? JOURNEY_CATEGORY.experience;
                  const Icon = cat.Icon;
                  const dateLabel = j.start_date
                    ? j.end_date ? `${j.start_date} — ${j.end_date}` : `${j.start_date} — sekarang`
                    : null;

                  return (
                    <motion.div
                      key={j.id}
                      onClick={() => router.push("/perjalanan")}
                      className={`relative flex items-center justify-start md:justify-between gap-4 md:gap-0 cursor-pointer group ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.1 }}
                      variants={fadeUp}
                      custom={i + 1}
                    >
                      {/* Mobile Timeline dot */}
                      <div className="relative flex flex-col items-center flex-shrink-0 w-10 md:hidden">
                        <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center bg-white ring-2 ring-ku-navy/20 shadow-sm group-hover:scale-110 transition-transform`}>
                          <Icon className={`w-[18px] h-[18px] ${cat.color}`} />
                        </div>
                      </div>

                      {/* Content card */}
                      <div className="glass-card p-5 shadow-card group-hover:shadow-card-hover transition-all flex-1 md:flex-none md:w-[calc(50%-2.5rem)]">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-jakarta font-semibold border ${cat.bg} ${cat.color}`}>
                            {cat.label}
                          </span>
                          {dateLabel && (
                            <span className="font-jakarta text-[11px] text-text-muted">{dateLabel}</span>
                          )}
                        </div>
                        <h3 className="font-montserrat font-extrabold text-base text-ku-navy">{j.role || j.institution}</h3>
                        {j.institution && j.role && (
                          <p className="font-jakarta text-text-muted text-xs mt-0.5">{j.institution}</p>
                        )}
                      </div>

                      {/* Desktop Center Timeline dot */}
                      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 flex-col items-center flex-shrink-0">
                        <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center bg-white ring-2 ring-ku-navy/20 shadow-sm`}>
                          <Icon className={`w-[18px] h-[18px] ${cat.color}`} />
                        </div>
                      </div>

                      {/* Desktop Spacer */}
                      <div className="hidden md:block md:w-[calc(50%-2.5rem)]" />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 6 — CTA / HUBUNGI
          ═══════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6 md:px-14 overflow-hidden">
        <div className="max-w-5xl mx-auto relative">
          <motion.div
            className="bg-ku-navy text-white p-8 md:p-14 shadow-2xl rounded-[2.5rem] text-center relative overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            variants={fadeUp}
            custom={0}
          >
            {/* Dark Mode Decorative elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-ku-yellow/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />
            
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />

            <div className="relative z-10">
              <motion.div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ku-yellow to-yellow-500 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(245,197,24,0.3)] border border-yellow-400/50"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Send className="w-7 h-7 text-ku-navy" />
              </motion.div>

              <h2 className="font-montserrat font-extrabold text-3xl md:text-5xl text-white mb-4 tracking-tight">
                Punya Sesuatu untuk Udin?
              </h2>
              <p className="font-jakarta text-white/80 text-sm md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                Kirimkan file, dokumen, tawaran proyek, atau sekadar menyapa langsung. Udin akan segera meresponnya!
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-10">
                <Link
                  href="/kirim"
                  className="flex items-center gap-2.5 bg-ku-yellow text-ku-navy font-jakarta font-extrabold text-sm md:text-base px-8 py-4 rounded-full shadow-[0_8px_20px_rgba(245,197,24,0.2)] hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(245,197,24,0.4)] transition-all duration-300 group"
                >
                  <span>Kirim ke Udin</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/kenalan"
                  className="flex items-center gap-2 border-2 border-white/20 text-white font-jakarta font-bold text-sm md:text-base px-8 py-4 rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                >
                  Kenalan Dulu
                </Link>
              </div>

              {/* Contact links */}
              <div className="flex flex-wrap justify-center gap-4 md:gap-6 pt-6 border-t border-white/10">
                <a
                  href={`mailto:${settings?.email || "muhammadwahyudin7105@gmail.com"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-jakarta text-sm font-semibold text-white/60 hover:text-ku-yellow transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>{settings?.email || "muhammadwahyudin7105@gmail.com"}</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer spacer */}
      <div className="h-8" />
    </div>
  );
}
