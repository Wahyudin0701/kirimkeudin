"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, X, FileText, Image, File } from "lucide-react";

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
    <section className="min-h-screen pt-28 pb-16 px-6 md:px-14">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <motion.div className="text-center mb-10" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <p className="font-jakarta font-semibold text-text-muted text-xs md:text-sm uppercase tracking-widest mb-2 md:mb-3">
            Punya sesuatu buat Udin?
          </p>
          <h1 className="font-montserrat font-extrabold text-3xl md:text-4xl text-ku-navy mb-3 md:mb-4">
            Kirim ke Udin
          </h1>
          <p className="font-jakarta text-text-soft text-sm md:text-base">
            Kirimkan file, dokumen, atau pesan langsung ke inbox digital Udin.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div className="glass-card p-8 shadow-glass" initial="hidden" animate="visible" variants={fadeUp} custom={1}>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Nama + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-jakarta font-semibold text-sm text-ku-navy mb-1.5">
                  Nama <span className="text-ku-red">*</span>
                </label>
                <input
                  type="text" required
                  placeholder="Nama kamu"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full font-jakarta text-sm px-4 py-3 rounded-xl border border-ku-navy/15 bg-white/60 focus:outline-none focus:border-ku-navy focus:ring-2 focus:ring-ku-navy/10 transition-all placeholder:text-text-muted"
                />
              </div>
              <div>
                <label className="block font-jakarta font-semibold text-sm text-text-soft mb-1.5">
                  Email <span className="text-text-muted font-normal">(opsional)</span>
                </label>
                <input
                  type="email"
                  placeholder="email@kamu.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full font-jakarta text-sm px-4 py-3 rounded-xl border border-ku-navy/15 bg-white/60 focus:outline-none focus:border-ku-navy focus:ring-2 focus:ring-ku-navy/10 transition-all placeholder:text-text-muted"
                />
              </div>
            </div>

            {/* Keperluan */}
            <div>
              <label className="block font-jakarta font-semibold text-sm text-text-soft mb-1.5">
                Keperluan <span className="text-text-muted font-normal">(opsional)</span>
              </label>
              <input
                type="text"
                placeholder="Misal: tugas kelompok, berkas acara, proposal, dll"
                value={form.keperluan}
                onChange={(e) => setForm({ ...form, keperluan: e.target.value })}
                className="w-full font-jakarta text-sm px-4 py-3 rounded-xl border border-ku-navy/15 bg-white/60 focus:outline-none focus:border-ku-navy focus:ring-2 focus:ring-ku-navy/10 transition-all placeholder:text-text-muted"
              />
            </div>

            {/* Pesan */}
            <div>
              <label className="block font-jakarta font-semibold text-sm text-ku-navy mb-1.5">
                Pesan <span className="text-ku-red">*</span>
              </label>
              <textarea
                required rows={4}
                placeholder="Tulis pesanmu di sini..."
                value={form.pesan}
                onChange={(e) => setForm({ ...form, pesan: e.target.value })}
                className="w-full font-jakarta text-sm px-4 py-3 rounded-xl border border-ku-navy/15 bg-white/60 focus:outline-none focus:border-ku-navy focus:ring-2 focus:ring-ku-navy/10 transition-all placeholder:text-text-muted resize-none"
              />
            </div>

            {/* Dropzone */}
            <div>
              <label className="block font-jakarta font-semibold text-sm text-text-soft mb-1.5">
                File <span className="text-text-muted font-normal">(opsional, maks. 10 file · 50MB/file)</span>
              </label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-input")?.click()}
                className={`relative w-full rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 ${
                  dragging ? "border-ku-navy bg-ku-navy/5" : "border-ku-navy/20 hover:border-ku-navy/40 hover:bg-white/40"
                }`}
              >
                <input id="file-input" type="file" multiple className="hidden" onChange={handleFileInput} accept="*/*" />
                <Upload className={`w-8 h-8 mx-auto mb-3 transition-colors ${dragging ? "text-ku-navy" : "text-text-muted"}`} />
                <p className="font-jakarta font-semibold text-sm text-ku-navy">Seret & lepas file di sini</p>
                <p className="font-jakarta text-xs text-text-muted mt-1">atau klik untuk pilih file</p>
              </div>

              {/* File list */}
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/60 border border-ku-navy/10">
                      <span className="text-ku-navy">{getFileIcon(f.type)}</span>
                      <span className="font-jakarta text-sm text-text-soft flex-1 truncate">{f.name}</span>
                      <span className="font-jakarta text-xs text-text-muted">{formatBytes(f.size)}</span>
                      <button type="button" onClick={() => removeFile(i)} className="text-text-muted hover:text-ku-red transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !form.nama.trim() || !form.pesan.trim()}
              className="w-full flex items-center justify-center gap-2 bg-ku-navy text-white font-jakarta font-bold text-base py-4 rounded-xl hover:bg-ku-navy-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glass-sm"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Mengirim...
                </>
              ) : (
                <>
                  Kirim Sekarang
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </>
              )}
            </button>

            <p className="text-center font-jakarta text-xs text-text-muted">
              Dengan mengirim, kamu setuju bahwa file yang dikirim sesuai keperluan yang wajar.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
