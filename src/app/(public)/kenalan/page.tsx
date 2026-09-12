"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, GraduationCap, Github, Instagram, Mail, ArrowRight, Briefcase, ChevronRight, Quote } from "lucide-react";
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

const timeline = [
  {
    year: "Sekarang",
    title: "Mahasiswa Informatika",
    subtitle: "Universitas",
    desc: "Sedang menyelesaikan studi S1 dengan fokus riset pada pengembangan teknologi dan Machine Learning. Aktif di berbagai kepanitiaan dan organisasi kampus.",
    icon: GraduationCap,
    color: "text-blue-600",
    bg: "bg-blue-100"
  },
  {
    year: "2023 - Sekarang",
    title: "Freelance Web Developer",
    subtitle: "Self-Employed",
    desc: "Membangun berbagai aplikasi berbasis web untuk klien lokal menggunakan tumpukan teknologi modern seperti Next.js dan Laravel.",
    icon: Briefcase,
    color: "text-amber-600",
    bg: "bg-amber-100"
  }
];

export default function KenalanPage() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch((err) => console.error("Error fetching settings:", err));
  }, []);

  const name = settings?.name || "Wahyudin";
  const avatarUrl = settings?.avatar_url;

  return (
    <section className="min-h-screen pt-32 pb-24 px-6 md:px-14">
      <div className="max-w-7xl mx-auto w-full">
        
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
              <div className="w-full aspect-[4/5] bg-ku-navy/5 relative overflow-hidden group">
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

                {/* Sosial Media (Expanding Hover Style) */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                  {/* GitHub */}
                  <a href="https://github.com/Wahyudin0701" target="_blank" className="group h-12 flex items-center bg-white border border-gray-100 rounded-full text-text-soft hover:bg-[#333] hover:text-white hover:border-[#333] transition-all duration-300 shadow-sm overflow-hidden px-3.5">
                    <Github className="w-5 h-5 flex-shrink-0" />
                    <span className="font-jakarta font-semibold text-sm whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-[200px] group-hover:ml-2.5 transition-all duration-500 ease-out">
                      Wahyudin0701
                    </span>
                  </a>
                  
                  {/* Instagram */}
                  <a href="https://instagram.com/why.udin_" target="_blank" className="group h-12 flex items-center bg-white border border-gray-100 rounded-full text-text-soft hover:bg-[#E1306C] hover:text-white hover:border-[#E1306C] transition-all duration-300 shadow-sm overflow-hidden px-3.5">
                    <Instagram className="w-5 h-5 flex-shrink-0" />
                    <span className="font-jakarta font-semibold text-sm whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-[200px] group-hover:ml-2.5 transition-all duration-500 ease-out">
                      @why.udin_
                    </span>
                  </a>

                  {/* TikTok */}
                  <a href="https://tiktok.com/@why.udin_" target="_blank" className="group h-12 flex items-center bg-white border border-gray-100 rounded-full text-text-soft hover:bg-black hover:text-white hover:border-black transition-all duration-300 shadow-sm overflow-hidden px-3.5">
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a3 3 0 0 1-3-3" />
                    </svg>
                    <span className="font-jakarta font-semibold text-sm whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-[200px] group-hover:ml-2.5 transition-all duration-500 ease-out">
                      @why.udin_
                    </span>
                  </a>

                  {/* Email */}
                  <a href="mailto:muhammadwahyudin0701@gmail.com" className="group h-12 flex items-center bg-white border border-gray-100 rounded-full text-text-soft hover:bg-ku-navy hover:text-white hover:border-ku-navy transition-all duration-300 shadow-sm overflow-hidden px-3.5">
                    <Mail className="w-5 h-5 flex-shrink-0" />
                    <span className="font-jakarta font-semibold text-sm whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-[300px] group-hover:ml-2.5 transition-all duration-500 ease-out">
                      muhammadwahyudin0701@gmail.com
                    </span>
                  </a>
                </div>

                {/* CTA Button */}
                <Link href="/kirim" className="w-full flex items-center justify-center bg-ku-navy text-white font-jakarta font-bold text-sm py-3.5 rounded-xl hover:bg-ku-navy-light transition-all shadow-md mt-auto">
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
                  Developer & Mahasiswa
                </p>
              </div>
              <div className="space-y-5 font-jakarta text-text-soft leading-loose text-base md:text-lg">
                <p>
                  Halo! Saya Wahyudin, namun teman-teman lebih akrab memanggil saya <strong>Udin</strong>. Saya adalah mahasiswa Informatika yang memiliki ketertarikan mendalam pada pengembangan produk digital, organisasi kepemudaan, dan riset teknologi.
                </p>
                <p>
                  Bagi saya, barisan kode bukan sekadar bahasa mesin, melainkan <span className="bg-ku-yellow/20 px-2 py-0.5 rounded font-semibold text-ku-navy">jembatan untuk memecahkan masalah nyata</span>. Itulah mengapa saya sangat menikmati proses membangun aplikasi—mulai dari alat bantu sederhana untuk teman kampus hingga sistem yang berpotensi memiliki dampak sosial yang lebih luas.
                </p>
                <p>
                  Di luar layar komputer, saya juga aktif mengambil peran dalam berbagai organisasi kemahasiswaan dan kepanitiaan. Bertemu dengan banyak orang, bertukar ide, dan tumbuh bersama komunitas memberikan keseimbangan yang sempurna dalam perjalanan hidup saya.
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

            {/* Bagian Perjalanan (Timeline) */}
            <div className="glass-card p-8 md:p-10 rounded-[2rem] shadow-card">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-montserrat font-extrabold text-2xl text-ku-navy">Jejak Langkah</h3>
                <Link href="/perjalanan" className="text-ku-navy font-jakarta font-bold text-sm flex items-center hover:text-ku-yellow transition-colors">
                  Lihat Semua <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                {timeline.map((item, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    
                    {/* Timeline Dot (Icon) */}
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white ${item.bg} ${item.color} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    
                    {/* Timeline Card */}
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl bg-white border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-montserrat font-bold text-ku-navy">{item.title}</h4>
                      </div>
                      <p className="font-jakarta text-xs font-bold text-ku-yellow uppercase tracking-wider mb-3">{item.year} — {item.subtitle}</p>
                      <p className="font-jakarta text-sm text-text-soft leading-relaxed">{item.desc}</p>
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
