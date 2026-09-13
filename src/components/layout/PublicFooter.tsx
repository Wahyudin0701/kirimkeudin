"use client";

import { Github, Instagram, Mail, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer className="bg-ku-navy text-white pt-16 pb-8 mt-20 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-ku-yellow/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl relative z-10">
        
        {/* Top Section: CTA & Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand & Bio */}
          <div className="md:col-span-2 lg:col-span-5">
            <Link href="/" className="inline-block mb-6">
              <h2 className="font-montserrat font-extrabold text-3xl text-white tracking-tight">
                Kirim ke <span className="text-ku-yellow">Udin.</span>
              </h2>
            </Link>
            <p className="font-jakarta text-white/70 leading-relaxed max-w-md mb-8">
              Mahasiswa Sistem Informasi yang berfokus pada pengembangan web dan teknologi untuk memecahkan masalah nyata. Tersedia untuk proyek freelance dan kolaborasi.
            </p>
            <Link href="/kirim" className="inline-flex items-center gap-2 font-jakarta font-bold text-ku-yellow hover:text-white transition-colors group">
              Kirim Sesuatu
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1 lg:col-span-3">
            <h3 className="font-montserrat font-bold text-lg text-white mb-6">Jelajahi</h3>
            <ul className="space-y-4 font-jakarta text-white/70">
              <li><Link href="/" className="hover:text-ku-yellow transition-colors">Beranda</Link></li>
              <li><Link href="/kenalan" className="hover:text-ku-yellow transition-colors">Kenalan Dulu</Link></li>
              <li><Link href="/perjalanan" className="hover:text-ku-yellow transition-colors">Perjalanan</Link></li>
              <li><Link href="/pencapaian" className="hover:text-ku-yellow transition-colors">Pencapaian</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-1 lg:col-span-4">
            <h3 className="font-montserrat font-bold text-lg text-white mb-6">Terhubung</h3>
            <div className="flex flex-col gap-4">
              <a href="https://github.com/Wahyudin0701" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#333] transition-colors"><Github className="w-4 h-4" /></div>
                <span className="font-jakarta text-sm">Wahyudin0701</span>
              </a>
              <a href="https://instagram.com/why.udin_" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#E1306C] transition-colors"><Instagram className="w-4 h-4" /></div>
                <span className="font-jakarta text-sm">why.udin_</span>
              </a>
              <a href="https://tiktok.com/@why.udin_" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-black transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </div>
                <span className="font-jakarta text-sm">why.udin_</span>
              </a>
              <a href="mailto:muhammadwahyudin7105@gmail.com" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-ku-yellow group-hover:text-ku-navy transition-colors"><Mail className="w-4 h-4" /></div>
                <span className="font-jakarta text-sm">muhammadwahyudin7105@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-jakarta text-white/50 text-sm">
            © {new Date().getFullYear()} Wahyudin.
          </p>
          <p className="font-jakarta text-white/50 text-sm">
            Seluruh Hak Cipta Dilindungi.
          </p>
        </div>

      </div>
    </footer>
  );
}
