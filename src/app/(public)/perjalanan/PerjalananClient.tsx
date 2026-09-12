"use client";

import { useState } from "react";
import { GraduationCap, Users, Calendar, Award, MapPin, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Journey = {
  id: string;
  category: string | null;
  institution: string | null;
  role: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  sort_order: number;
};

// ── Konfigurasi kategori ──────────────────────────────────────
const CATEGORY = {
  education: {
    label: "Pendidikan",
    Icon: GraduationCap,
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-600 border-blue-100",
    ring: "ring-blue-400",
    line: "from-blue-400",
  },
  organization: {
    label: "Organisasi",
    Icon: Users,
    dot: "bg-ku-navy",
    badge: "bg-ku-navy/5 text-ku-navy border-ku-navy/10",
    ring: "ring-ku-navy",
    line: "from-ku-navy",
  },
  committee: {
    label: "Kepanitiaan",
    Icon: Calendar,
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 border-amber-100",
    ring: "ring-amber-400",
    line: "from-amber-400",
  },
  experience: {
    label: "Pengalaman",
    Icon: Award,
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    ring: "ring-emerald-400",
    line: "from-emerald-400",
  },
} as const;

type CategoryKey = keyof typeof CATEGORY;

const FILTERS: { key: "all" | CategoryKey; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "education", label: "Pendidikan" },
  { key: "organization", label: "Organisasi" },
  { key: "committee", label: "Kepanitiaan" },
  { key: "experience", label: "Pengalaman" },
];

// Peta warna icon per kategori (untuk style inline)
const ICON_COLORS: Record<CategoryKey, string> = {
  education:    "#3b82f6",
  organization: "#0D2D6B",
  committee:    "#d97706",
  experience:   "#10b981",
};

// ── Komponen Item Timeline ──────────────────────────────────────
function TimelineItem({
  item,
  isLast,
  index,
}: {
  item: Journey;
  isLast: boolean;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const catKey = (item.category ?? "experience") as CategoryKey;
  const cat = CATEGORY[catKey] ?? CATEGORY.experience;
  const Icon = cat.Icon;
  const iconColor = ICON_COLORS[catKey] ?? ICON_COLORS.experience;

  const dateLabel = item.start_date
    ? item.end_date
      ? `${item.start_date} — ${item.end_date}`
      : `${item.start_date} — sekarang`
    : null;

  return (
    <motion.div
      className="relative flex gap-5 md:gap-8"
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* ── Garis & Titik Timeline ── */}
      <div className="relative flex flex-col items-center flex-shrink-0 w-10">
        {/* Titik bulat dengan icon */}
        <div
          className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center bg-white ring-2 ${cat.ring} shadow-sm flex-shrink-0`}
        >
          <Icon className="w-[18px] h-[18px]" style={{ color: iconColor }} />
        </div>
        {/* Garis penghubung ke bawah */}
        {!isLast && (
          <div className={`w-0.5 flex-1 mt-1 bg-gradient-to-b ${cat.line} to-transparent min-h-[2rem]`} />
        )}
      </div>

      {/* ── Card Konten ── */}
      <div className="flex-1 pb-10">
        <button
          onClick={() => item.description && setExpanded((v) => !v)}
          className={`w-full text-left group ${item.description ? "cursor-pointer" : "cursor-default"}`}
        >
          <div className="glass-card rounded-2xl px-5 py-4 shadow-card hover:shadow-card-hover transition-all duration-300 border border-white/80">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              {/* Kiri: Role & Institusi */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className={`font-jakarta text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${cat.badge}`}>
                    {cat.label}
                  </span>
                </div>
                <h3 className="font-montserrat font-extrabold text-base md:text-lg text-ku-navy mt-1 leading-snug">
                  {item.role}
                </h3>
                <p className="font-jakarta font-semibold text-sm text-text-soft mt-0.5">
                  {item.institution}
                </p>
              </div>

              {/* Kanan: Tanggal & chevron */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                {dateLabel && (
                  <span className="font-jakarta text-xs font-semibold text-text-muted bg-ku-bg px-2.5 py-1 rounded-lg whitespace-nowrap">
                    {dateLabel}
                  </span>
                )}
                {item.description && (
                  <ChevronDown
                    className={`w-4 h-4 text-text-muted transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                  />
                )}
              </div>
            </div>

            {/* Lokasi (selalu tampil) */}
            {item.location && (
              <div className="flex items-center gap-1 mt-2">
                <MapPin className="w-3 h-3 text-text-muted flex-shrink-0" />
                <span className="font-jakarta text-xs text-text-muted">{item.location}</span>
              </div>
            )}

            {/* Deskripsi (expandable) */}
            <AnimatePresence initial={false}>
              {expanded && item.description && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="font-jakarta text-sm text-text-soft leading-relaxed mt-3 pt-3 border-t border-ku-navy/6">
                    {item.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </button>
      </div>
    </motion.div>
  );
}

// ── Halaman Utama ──────────────────────────────────────────────
export default function PerjalananClient({ journeys }: { journeys: Journey[] }) {
  const [filter, setFilter] = useState<"all" | CategoryKey>("all");

  // Urutkan dari terbaru ke terlama berdasarkan start_date
  const sorted = [...journeys].sort((a, b) => {
    const ya = parseInt(a.start_date ?? "0") || 0;
    const yb = parseInt(b.start_date ?? "0") || 0;
    return yb - ya;
  });

  const filtered =
    filter === "all" ? sorted : sorted.filter((j) => j.category === filter);

  // Hitung jumlah per kategori
  const countOf = (key: CategoryKey) =>
    journeys.filter((j) => j.category === key).length;

  return (
    <section className="min-h-screen pt-28 pb-16 px-6 md:px-14">
      <div className="max-w-6xl mx-auto w-full">

        {/* ── Header ── */}
        <motion.div
          className="mb-12 text-center md:text-left"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-montserrat font-extrabold text-4xl md:text-5xl text-ku-navy mb-4 tracking-tight">
            Jejak <span className="text-ku-yellow">Langkah</span>
          </h1>
          <p className="font-jakarta text-text-soft text-base md:text-lg max-w-2xl mx-auto md:mx-0">
            Setiap langkah membentuk versi saya hari ini — dari bangku sekolah, ruang rapat organisasi, hingga panggung kepanitiaan.
          </p>

          {/* ── Stat Ringkas ── */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
            {(Object.entries(CATEGORY) as [CategoryKey, (typeof CATEGORY)[CategoryKey]][]).map(
              ([key, cfg]) => {
                const count = countOf(key);
                if (count === 0) return null;
                const Icon = cfg.Icon;
                return (
                  <div key={key} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${cfg.badge} font-jakarta text-xs font-semibold`}>
                    <Icon className="w-3 h-3" />
                    {count} {cfg.label}
                  </div>
                );
              }
            )}
          </div>
        </motion.div>

        {/* ── Filter Tabs ── */}
        <motion.div
          className="flex flex-wrap gap-2 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`font-jakarta text-sm font-semibold px-4 py-2 rounded-full border transition-all duration-200 ${
                filter === key
                  ? "bg-ku-navy text-white border-ku-navy shadow-sm"
                  : "bg-white text-text-muted border-ku-navy/10 hover:border-ku-navy/30 hover:text-ku-navy"
              }`}
            >
              {label}
            </button>
          ))}
        </motion.div>

        {/* ── Timeline ── */}
        {journeys.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-montserrat font-extrabold text-3xl text-ku-navy/20 mb-3">
              Segera hadir
            </p>
            <p className="font-jakarta text-text-muted">
              Perjalanan sedang didokumentasikan. Nantikan ya!
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="font-jakarta text-text-muted">
              Belum ada entri untuk kategori ini.
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {filtered.map((item, i) => (
                <TimelineItem
                  key={item.id}
                  item={item}
                  isLast={i === filtered.length - 1}
                  index={i}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
