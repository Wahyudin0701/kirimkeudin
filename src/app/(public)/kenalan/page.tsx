"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, GraduationCap, Github, Instagram, Mail, ArrowRight, Briefcase, ChevronRight, Quote , Users, Calendar, Award } from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

// Data Skill Terkategori
const skillCategories = [
  {
    title: "Frontend Development",
    items: [
      { name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/000000" },
      { name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
      { name: "Tailwind CSS", icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4" },
    ]
  },
  {
    title: "Backend & Database",
    items: [
      { name: "Laravel", icon: "https://cdn.simpleicons.org/laravel/FF2D20" },
      { name: "Python", icon: "https://cdn.simpleicons.org/python/3776AB" },
      { name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql/4169E1" },
      { name: "REST API", icon: "https://cdn.simpleicons.org/nodedotjs/339933" },
    ]
  },
  {
    title: "Tools & Lainnya",
    items: [
      { name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
      { name: "Git", icon: "https://cdn.simpleicons.org/git/F05032" },
      { name: "Figma", icon: "https://cdn.simpleicons.org/figma/F24E1E" },
      { name: "Linux", icon: "https://cdn.simpleicons.org/linux/000000" },
      { name: "Machine Learning", icon: "https://cdn.simpleicons.org/tensorflow/FF6F00" },
    ]
  }
];



export default function KenalanPage() {
  const [settings, setSettings] = useState<any>(null);
  const [journeys, setJourneys] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch((err) => console.error("Error fetching settings:", err));
      
    fetch("/api/journeys")
      .then((res) => res.json())
      .then((data) => setJourneys(data))
      .catch((err) => console.error("Error fetching journeys:", err));
  }, []);

  const name = settings?.name || "Wahyudin";
  const avatarUrl = settings?.avatar_url;

  return (
    <section className="min-h-screen pt-28 pb-16 px-6 md:px-14">
      <div className="max-w-6xl mx-auto w-full">
        
        {/* Header Animasi */}
        <motion.div className="mb-12 text-center md:text-left" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <h1 className="font-montserrat font-extrabold text-4xl md:text-5xl text-ku-navy mb-4 tracking-tight">
            Lebih Dekat dengan <span className="text-ku-yellow">Udin</span>
          </h1>
          <p className="font-jakarta text-text-soft text-base md:text-lg max-w-2xl mx-auto md:mx-0">
            Sebuah ruang untuk membagikan cerita, latar belakang, dan apa yang sedang saya kerjakan saat ini.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-start">
          
          {/* ==========================================================
              KIRI: SIDEBAR PROFIL
              ========================================================== */}
          <motion.div className="lg:col-span-4" initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            <div className="glass-card rounded-[2rem] shadow-card overflow-hidden flex flex-col">
              
              {/* Foto Profil (Full Width) */}
              <div className="w-full aspect-square bg-ku-navy/5 relative overflow-hidden group">
                {avatarUrl ? (
                  <img src={`/api/image?url=${encodeURIComponent(avatarUrl)}`} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-ku-navy to-blue-900 text-white text-9xl font-montserrat font-extrabold">
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
                {/* Subtle overlay for hover effect only */}
                <div className="absolute inset-0 bg-ku-navy/0 group-hover:bg-ku-navy/10 transition-colors duration-500" />
              </div>

              {/* Konten Text (Dengan Padding) */}
              <div className="p-6 md:p-8 flex flex-col">

                {/* Info Detail - Minimalist Elegant */}
                <div className="flex flex-col gap-4 mb-8 px-2">
                  <div className="flex items-start gap-4">
                    <div className="text-ku-yellow mt-0.5"><Quote className="w-5 h-5" /></div>
                    <div>
                      <p className="font-jakarta text-xs text-text-muted uppercase tracking-wider mb-0.5">Moto Hidup</p>
                      <p className="font-montserrat font-bold text-sm text-ku-navy"> Belajar • Bertumbuh • Bermanfaat</p>
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-gradient-to-r from-gray-200 to-transparent" />
                  
                  <div className="flex items-start gap-4">
                    <div className="text-ku-yellow mt-0.5"><GraduationCap className="w-5 h-5" /></div>
                    <div>
                      <p className="font-jakarta text-xs text-text-muted uppercase tracking-wider mb-0.5">Pendidikan</p>
                      <p className="font-montserrat font-bold text-sm text-ku-navy">Sistem Informasi '23 | Universitas Jambi</p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Link href="/kirim" className="w-full flex items-center justify-center bg-ku-yellow text-ku-navy font-jakarta font-extrabold text-sm py-3.5 rounded-xl hover:bg-yellow-400 transition-all shadow hover:shadow-md hover:-translate-y-0.5 mt-10">
                  Kirim Pesan Sekarang
                </Link>
              </div>
            </div>
          </motion.div>


          {/* ==========================================================
              KANAN: KONTEN UTAMA (Cerita, Skill, Timeline)
              ========================================================== */}
          <motion.div className="lg:col-span-8 space-y-10" initial="hidden" animate="visible" variants={fadeUp} custom={2}>
            
            {/* Bagian Cerita */}
            <div className="glass-card p-8 md:p-10 rounded-[2rem] shadow-card">
              <div className="mb-8 border-b border-gray-100 pb-6">
                <h3 className="font-montserrat font-extrabold text-2xl text-ku-navy mb-2">
                  {name}
                </h3>
                <p className="font-jakarta text-ku-yellow font-bold text-xs md:text-sm uppercase tracking-wider">
                  Mahasiswa SI · Web Developer · Freelancer · Content Creator
                </p>
              </div>
              <div className="space-y-5 font-jakarta text-text-soft leading-loose text-base md:text-lg">
                <p>
                  Halo! Saya Wahyudin, namun teman-teman lebih akrab memanggil saya <strong>Udin</strong>. Saya adalah mahasiswa Sistem Informasi '23 di Universitas Jambi yang memiliki ketertarikan mendalam pada pengembangan web dan teknologi.
                </p>
                <p>
                  Bagi saya, barisan kode bukan sekadar bahasa mesin, melainkan <span className="bg-ku-yellow/20 px-2 py-0.5 rounded font-semibold text-ku-navy">jembatan untuk memecahkan masalah nyata</span>. Itulah mengapa saya sangat menikmati proses membangun aplikasi — mulai dari proyek freelance untuk klien, hingga sistem yang memberikan kemudahan bagi banyak orang.
                </p>
                <p>
                  Di luar layar komputer, saya aktif di organisasi kemahasiswaan di kampus, serta mengekspresikan diri melalui konten vlog di media sosial. Bertukar ide dan tumbuh bersama orang-orang sekitar adalah bagian yang saya nikmati dari perjalanan ini.
                </p>
              </div>
            </div>

            {/* Bagian Skills (Terkategori) */}
            <div className="glass-card p-8 md:p-10 rounded-[2rem] shadow-card">
              <h3 className="font-montserrat font-extrabold text-2xl text-ku-navy mb-8">Senjata & Peralatan</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {skillCategories.map((category) => (
                  <div key={category.title}>
                    <p className="font-jakarta font-bold text-sm text-text-muted mb-4 uppercase tracking-wider">{category.title}</p>
                    <div className="flex flex-wrap gap-3">
                      {category.items.map((skill) => (
                        <motion.div
                          key={skill.name}
                          whileHover={{ scale: 1.05, y: -2 }}
                          className="font-jakarta font-semibold text-sm px-4 py-2.5 rounded-xl bg-white border border-gray-100 text-text-soft hover:border-ku-yellow hover:text-ku-navy shadow-sm transition-colors cursor-default flex items-center gap-2.5 group"
                        >
                          <img src={skill.icon} alt={skill.name} className="w-5 h-5 object-contain group-hover:scale-110 transition-transform" onError={(e) => (e.currentTarget.style.display = "none")} />
                          <span>{skill.name}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>


          </motion.div>
        </div>
      </div>
    </section>
  );
}
