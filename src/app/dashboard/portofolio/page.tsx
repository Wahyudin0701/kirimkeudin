"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Trophy, ArrowRight, Plus, Loader2, LayoutDashboard } from "lucide-react";

type Stats = {
  projects: number;
  journeys: number;
  achievements: number;
};

const sections = [
  {
    id: "karya",
    label: "Karya & Proyek",
    desc: "Dokumentasikan portofolio proyek, hasil karya, dan aplikasi yang pernah kamu buat.",
    href: "/dashboard/karya",
    icon: Briefcase,
    iconBg: "bg-ku-navy/10 text-ku-navy group-hover:bg-ku-navy group-hover:text-white",
    glowColor: "bg-ku-navy",
    countKey: "projects" as keyof Stats,
    unit: "Proyek",
  },
  {
    id: "perjalanan",
    label: "Perjalanan",
    desc: "Rekam jejak riwayat pendidikan, pengalaman kerja, dan aktivitas organisasimu.",
    href: "/dashboard/perjalanan",
    icon: MapPin,
    iconBg: "bg-blue-50 text-blue-600 group-hover:bg-blue-500 group-hover:text-white",
    glowColor: "bg-blue-500",
    countKey: "journeys" as keyof Stats,
    unit: "Riwayat",
  },
  {
    id: "pencapaian",
    label: "Pencapaian",
    desc: "Simpan dan pamerkan sertifikat, penghargaan, serta prestasi yang kamu raih.",
    href: "/dashboard/pencapaian",
    icon: Trophy,
    iconBg: "bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white",
    glowColor: "bg-amber-500",
    countKey: "achievements" as keyof Stats,
    unit: "Prestasi",
  },
];

export default function PortofolioHomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sequentially to prevent Vercel Serverless connection pool exhaustion
        const pRes = await fetch("/api/projects");
        const p = await pRes.json();
        
        const jRes = await fetch("/api/journeys");
        const j = await jRes.json();
        
        const aRes = await fetch("/api/achievements");
        const a = await aRes.json();

        setStats({
          projects: Array.isArray(p) ? p.length : 0,
          journeys: Array.isArray(j) ? j.length : 0,
          achievements: Array.isArray(a) ? a.length : 0,
        });
      } catch (e) {
        setStats({ projects: 0, journeys: 0, achievements: 0 });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const totalItems = stats
    ? stats.projects + stats.journeys + stats.achievements
    : 0;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-[calc(100vh-100px)] w-full">

      {/* ── Header ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 md:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <h1 className="font-montserrat font-extrabold text-2xl md:text-3xl text-ku-navy mb-1.5">
            Manajemen Portofolio
          </h1>
          <p className="font-jakarta text-sm text-text-muted max-w-lg">
            Pusat kendali untuk mengatur semua konten profesionalmu. Tambahkan, edit, dan kelola portofolio dengan mudah.
          </p>
        </div>

        {/* Total badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-3.5 shadow-sm self-start sm:self-auto shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-text-muted">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            {loading ? (
              <Loader2 className="w-5 h-5 text-ku-navy/40 animate-spin" />
            ) : (
              <p className="font-montserrat font-extrabold text-xl text-ku-navy leading-none">
                {totalItems}
              </p>
            )}
            <p className="font-jakarta text-[10px] font-semibold tracking-wide uppercase text-text-muted mt-1">Total Entri</p>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Section Cards — 3 kolom di desktop ────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-10">
        {sections.map((sec, i) => {
          const Icon = sec.icon;
          const count = stats?.[sec.countKey];
          return (
            <motion.div
              key={sec.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.09 }}
              className="h-full"
            >
              <Link
                href={sec.href}
                className="group relative bg-white rounded-[2rem] p-7 md:p-8 border border-gray-100 shadow-sm hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col h-full"
              >
                {/* Subtle background glow effect on hover */}
                <div className={`absolute top-0 right-0 w-40 h-40 rounded-bl-full opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none ${sec.glowColor}`} />

                {/* Top Row: Icon & Stat */}
                <div className="flex items-start justify-between mb-8 relative">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${sec.iconBg}`}>
                    <Icon className="w-6 h-6" strokeWidth={2.5} />
                  </div>
                  <div className="text-right">
                    {loading ? (
                      <Loader2 className="w-5 h-5 text-text-muted animate-spin ml-auto" />
                    ) : (
                      <span className="font-montserrat font-extrabold text-3xl md:text-4xl text-ku-navy">{count}</span>
                    )}
                    <p className="font-jakarta text-[10px] font-bold uppercase tracking-widest text-text-muted mt-0.5">{sec.unit}</p>
                  </div>
                </div>

                {/* Middle Row: Content */}
                <div className="flex-1 relative z-10">
                  <h3 className="font-montserrat font-extrabold text-lg md:text-xl text-ku-navy mb-2 group-hover:text-ku-navy transition-colors">
                    {sec.label}
                  </h3>
                  <p className="font-jakarta text-sm text-text-muted leading-relaxed">
                    {sec.desc}
                  </p>
                </div>

                {/* Bottom Row: Call to action */}
                <div className="mt-8 pt-5 border-t border-gray-50 flex items-center justify-between font-jakarta text-xs md:text-sm font-bold text-text-muted group-hover:text-ku-navy transition-colors relative z-10">
                  <span>Kelola {sec.label.toLowerCase()}</span>
                  <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-ku-navy/10 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* ── Quick Add Hint ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100">
          <span className="w-2 h-2 rounded-full bg-ku-navy animate-pulse" />
          <p className="font-jakarta text-xs text-text-muted">
            Pilih kategori di atas atau gunakan tombol <strong className="text-ku-navy mx-0.5"><Plus className="w-3 h-3 inline-block align-text-bottom" /> Tambah</strong> di setiap halaman
          </p>
        </div>
      </motion.div>
    </div>
  );
}