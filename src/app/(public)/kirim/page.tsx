"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, X, FileText, Image, File, Mail } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return <Image className="w-4 h-4" />;
  if (type === "application/pdf" || type.includes("document")) return <FileText className="w-4 h-4" />;
  return <File className="w-4 h-4" />;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function KirimPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nama: "", email: "", kontak: "", keperluan: "", pesan: "",
  });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files).slice(0, 10);
    setFiles((prev) => [...prev, ...dropped].slice(0, 10));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const picked = Array.from(e.target.files).slice(0, 10);
    setFiles((prev) => [...prev, ...picked].slice(0, 10));
  };

  const removeFile = (i: number) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama.trim() || !form.pesan.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_name: form.nama,
          sender_email: form.email || null,
          sender_contact: form.kontak || null,
          purpose: form.keperluan || null,
          message: form.pesan,
        }),
      });

      if (!res.ok) throw new Error("Gagal mengirim");
      setSubmitted(true);
    } catch {
      alert("Maaf, terjadi kesalahan. Coba lagi ya!");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
        <motion.div
          className="glass-card p-12 shadow-glass text-center max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-16 h-16 rounded-2xl bg-ku-green/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-ku-green" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="font-montserrat font-extrabold text-2xl text-ku-navy mb-3">Terkirim! 🎉</h2>
          <p className="font-jakarta text-text-soft leading-relaxed">
            Makasih ya sudah mengirim sesuatu ke Udin. Akan segera dilihat dan ditindaklanjuti!
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm({ nama: "", email: "", kontak: "", keperluan: "", pesan: "" }); setFiles([]); }}
            className="mt-8 font-jakarta font-bold text-sm text-ku-navy underline underline-offset-4 hover:text-ku-navy-light transition-colors"
          >
            Kirim lagi
          </button>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-32 pb-24 px-6 md:px-14 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-40 left-10 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 right-10 w-96 h-96 bg-ku-yellow/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto w-full relative z-10">
        
        {/* Header / Intro */}
        <motion.div className="text-center mb-10 md:mb-14" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <h1 className="font-montserrat font-extrabold text-4xl md:text-5xl lg:text-6xl text-ku-navy mb-5 tracking-tight leading-[1.1]">
            Kirim Sesuatu <span className="text-ku-yellow">ke Udin.</span>
          </h1>
          <p className="font-jakarta text-text-soft text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Punya tawaran kolaborasi, tugas kelompok, atau sekadar ingin menyapa? Jangan ragu untuk mengirimkan pesan dan file secara langsung melalui kotak masuk eksklusif ini.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-ku-yellow/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />

              <form onSubmit={handleSubmit} className="relative z-10 space-y-7">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nama */}
                  <div className="space-y-2">
                    <label className="block font-jakarta font-bold text-sm text-ku-navy ml-1">
                      Nama Lengkap <span className="text-ku-red">*</span>
                    </label>
                    <input
                      type="text" required
                      placeholder="Masukkan nama kamu"
                      value={form.nama}
                      onChange={(e) => setForm({ ...form, nama: e.target.value })}
                      className="w-full font-jakarta text-sm px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-ku-navy focus:ring-4 focus:ring-ku-navy/10 transition-all placeholder:text-text-muted/70"
                    />
                  </div>
                  
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block font-jakarta font-bold text-sm text-text-soft ml-1">
                      Alamat Email <span className="text-text-muted font-normal font-medium">(Opsional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="email@kamu.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full font-jakarta text-sm px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-ku-navy focus:ring-4 focus:ring-ku-navy/10 transition-all placeholder:text-text-muted/70"
                    />
                  </div>
                </div>

                {/* Keperluan */}
                <div className="space-y-2">
                  <label className="block font-jakarta font-bold text-sm text-text-soft ml-1">
                    Keperluan <span className="text-text-muted font-normal font-medium">(Opsional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: Penawaran Project, Tugas Kelompok, dll."
                    value={form.keperluan}
                    onChange={(e) => setForm({ ...form, keperluan: e.target.value })}
                    className="w-full font-jakarta text-sm px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-ku-navy focus:ring-4 focus:ring-ku-navy/10 transition-all placeholder:text-text-muted/70"
                  />
                </div>

                {/* Pesan */}
                <div className="space-y-2">
                  <label className="block font-jakarta font-bold text-sm text-ku-navy ml-1">
                    Isi Pesan <span className="text-ku-red">*</span>
                  </label>
                  <textarea
                    required rows={5}
                    placeholder="Tuliskan detail pesanmu di sini secara lengkap..."
                    value={form.pesan}
                    onChange={(e) => setForm({ ...form, pesan: e.target.value })}
                    className="w-full font-jakarta text-sm px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-ku-navy focus:ring-4 focus:ring-ku-navy/10 transition-all placeholder:text-text-muted/70 resize-none"
                  />
                </div>

                {/* Dropzone */}
                <div className="space-y-2">
                  <label className="block font-jakarta font-bold text-sm text-text-soft ml-1">
                    Lampiran File <span className="text-text-muted font-normal font-medium">(Maks. 10 File)</span>
                  </label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("file-input")?.click()}
                    className={`relative w-full rounded-2xl border-2 border-dashed p-8 md:p-10 text-center cursor-pointer transition-all duration-300 ${
                      dragging ? "border-ku-navy bg-ku-navy/5 scale-[1.02]" : "border-gray-300 hover:border-gray-400 bg-gray-50/50 hover:bg-gray-50"
                    }`}
                  >
                    <input id="file-input" type="file" multiple className="hidden" onChange={handleFileInput} accept="*/*" />
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors ${dragging ? "bg-ku-navy text-white" : "bg-white border border-gray-200 text-text-muted shadow-sm"}`}>
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="font-jakarta font-bold text-sm text-ku-navy mb-1">Seret & lepas file ke kotak ini</p>
                    <p className="font-jakarta text-xs text-text-muted">atau klik untuk menelusuri dari perangkat</p>
                  </div>

                  {/* File list */}
                  {files.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {files.map((f, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 shadow-sm group">
                          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-ku-navy shrink-0 border border-gray-100">
                            {getFileIcon(f.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-jakarta text-sm font-semibold text-ku-navy truncate">{f.name}</p>
                            <p className="font-jakarta text-xs text-text-muted">{formatBytes(f.size)}</p>
                          </div>
                          <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-red-50 hover:text-ku-red transition-colors shrink-0">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <div className="pt-6 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={loading || !form.nama.trim() || !form.pesan.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-ku-yellow text-ku-navy font-jakarta font-extrabold text-base py-4 rounded-2xl hover:bg-[#F2C94C] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 group"
                  >
                    {loading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Menyiapkan Penerbangan...
                      </>
                    ) : (
                      <>
                        Terbangkan Pesan Sekarang
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform">
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                      </>
                    )}
                  </button>
                  <p className="text-center font-jakarta text-xs text-text-muted mt-4">
                    Dengan mengirim, kamu memastikan bahwa seluruh file & pesan aman dari konten berbahaya.
                  </p>
                </div>
              </form>
            </div>
          </motion.div>

      </div>
    </section>
  );
}
