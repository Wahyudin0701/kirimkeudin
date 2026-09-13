"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, X, Github, ExternalLink, Loader2, ArrowLeft } from "lucide-react";
import { resolveTech } from "@/lib/tech-icons";
import { TechBadge } from "@/components/TechBadge";

type Project = {
  id: string; title: string; description: string | null;
  thumbnail_url: string | null;
  tech_stack: string[]; project_url: string | null;
  github_url: string | null; start_date: string | null;
  end_date: string | null; sort_order: number;
};
const EMPTY: Omit<Project, "id" | "sort_order"> = { title: "", description: "", thumbnail_url: "", tech_stack: [], project_url: "", github_url: "", start_date: "", end_date: "" };

function ProjectForm({ initial, onSave, onCancel }: { initial: Omit<Project, "id" | "sort_order"> | Project; onSave: (data: any) => Promise<void>; onCancel: () => void; }) {
  const [form, setForm] = useState(initial);
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));
  const addTech = () => { const t = techInput.trim(); if (t && !(form.tech_stack as string[]).includes(t)) { set("tech_stack", [...(form.tech_stack as string[]), t]); setTechInput(""); } };
  const removeTech = (t: string) => set("tech_stack", (form.tech_stack as string[]).filter((x) => x !== t));
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); await onSave(form); setSaving(false); };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Gagal mengunggah file");
      const { fileUrl } = await res.json();
      set("thumbnail_url", fileUrl);
    } catch (err) {
      alert("Gagal mengunggah foto.");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-card w-full p-4 md:p-8 border border-black/4">
      <div className="flex items-start justify-between mb-5 md:mb-6 pb-4 md:pb-6 border-b border-gray-100">
        <div>
          <h2 className="font-montserrat font-extrabold text-lg md:text-2xl text-ku-navy">{"id" in form ? "Edit Proyek" : "Tambah Proyek"}</h2>
          <p className="font-jakarta text-xs md:text-sm text-text-muted mt-0.5 md:mt-1">Lengkapi informasi di bawah</p>
        </div>
        <button onClick={onCancel} className="font-jakarta font-semibold text-xs md:text-sm text-text-muted hover:text-ku-navy transition-colors mt-1">
          Kembali
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 w-full">
        <div>
          <label className="block font-jakarta font-semibold text-xs md:text-sm text-ku-navy mb-1.5">Judul Proyek *</label>
          <input required value={form.title} onChange={(e) => set("title", e.target.value)} className="w-full font-jakarta text-sm px-4 py-2.5 md:py-3 rounded-xl border border-ku-navy/15 bg-ku-bg focus:outline-none focus:border-ku-navy focus:ring-2 focus:ring-ku-navy/10 transition-all" placeholder="Nama proyek" />
        </div>
        <div>
          <label className="block font-jakarta font-semibold text-xs md:text-sm text-ku-navy mb-1.5">Deskripsi</label>
          <textarea value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} rows={4} className="w-full font-jakarta text-sm px-4 py-2.5 md:py-3 rounded-xl border border-ku-navy/15 bg-ku-bg focus:outline-none focus:border-ku-navy focus:ring-2 focus:ring-ku-navy/10 transition-all resize-none" placeholder="Ceritakan proyeknya..." />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          <div><label className="block font-jakarta font-semibold text-xs md:text-sm text-ku-navy mb-1.5">Mulai</label><input value={form.start_date ?? ""} onChange={(e) => set("start_date", e.target.value)} className="w-full font-jakarta text-sm px-4 py-2.5 md:py-3 rounded-xl border border-ku-navy/15 bg-ku-bg focus:outline-none focus:border-ku-navy focus:ring-2 focus:ring-ku-navy/10 transition-all" placeholder="2025" /></div>
          <div><label className="block font-jakarta font-semibold text-xs md:text-sm text-ku-navy mb-1.5">Selesai</label><input value={form.end_date ?? ""} onChange={(e) => set("end_date", e.target.value)} className="w-full font-jakarta text-sm px-4 py-2.5 md:py-3 rounded-xl border border-ku-navy/15 bg-ku-bg focus:outline-none focus:border-ku-navy focus:ring-2 focus:ring-ku-navy/10 transition-all" placeholder="Kosongkan jika ongoing" /></div>
        </div>
        <div>
          <label className="block font-jakarta font-semibold text-xs md:text-sm text-ku-navy mb-1.5">Tech Stack</label>
          <div className="flex gap-2 mb-2 md:mb-3">
            <input value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech(); } }} className="flex-1 font-jakarta text-sm px-4 py-2.5 md:py-3 rounded-xl border border-ku-navy/15 bg-ku-bg focus:outline-none focus:border-ku-navy transition-all" placeholder="React, Node.js..." />
            <button type="button" onClick={addTech} className="px-4 md:px-5 py-2.5 md:py-3 bg-ku-navy/10 text-ku-navy rounded-xl font-jakarta text-sm font-bold hover:bg-ku-navy/20 transition-colors">Tambah</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(form.tech_stack as string[]).map((t) => {
              const tech = resolveTech(t);
              return (
                <span key={t} className="flex items-center gap-1.5 font-jakarta text-[10px] md:text-xs font-semibold px-2.5 py-1 md:px-3 md:py-1.5 rounded-full bg-ku-yellow/20 text-ku-navy">
                  {tech.iconUrl && <img src={tech.iconUrl} alt="" className="w-4 h-4 object-contain" />}
                  {tech.label} <button type="button" onClick={() => removeTech(t)} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                </span>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          <div className="md:col-span-1">
            <label className="block font-jakarta font-semibold text-xs md:text-sm text-ku-navy mb-1.5">Foto / Thumbnail (Opsional)</label>
            <label className={`flex flex-col items-center justify-center w-full gap-2 px-4 py-5 rounded-xl border-2 border-dashed transition-all cursor-pointer ${uploadingImage ? "border-ku-navy/30 bg-ku-navy/5 cursor-not-allowed" : "border-ku-navy/20 bg-ku-bg hover:border-ku-navy/50 hover:bg-ku-navy/5"}`}>
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="sr-only" />
              {uploadingImage ? (
                <div className="flex items-center gap-2 text-ku-navy">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-jakarta text-sm font-semibold">Mengunggah...</span>
                </div>
              ) : form.thumbnail_url ? (
                <div className="w-full">
                  <div className="relative w-full h-36 rounded-lg overflow-hidden border border-gray-200 mb-2">
                    <img src={`/api/image?url=${encodeURIComponent(form.thumbnail_url)}`} alt="Thumbnail preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); set("thumbnail_url", null); }}
                      className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-lg shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="font-jakarta text-xs text-center text-text-muted">Klik untuk ganti foto</p>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-ku-navy/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-ku-navy/60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="font-jakarta text-sm font-semibold text-ku-navy">Pilih foto</p>
                    <p className="font-jakarta text-xs text-text-muted mt-0.5">PNG, JPG, WEBP hingga 10MB</p>
                  </div>
                </>
              )}
            </label>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 content-start">
            <div><label className="block font-jakarta font-semibold text-xs md:text-sm text-ku-navy mb-1.5">URL Live Demo</label><input value={form.project_url ?? ""} onChange={(e) => set("project_url", e.target.value)} className="w-full font-jakarta text-sm px-4 py-2.5 md:py-3 rounded-xl border border-ku-navy/15 bg-ku-bg focus:outline-none focus:border-ku-navy transition-all" placeholder="https://..." /></div>
            <div><label className="block font-jakarta font-semibold text-xs md:text-sm text-ku-navy mb-1.5">URL GitHub</label><input value={form.github_url ?? ""} onChange={(e) => set("github_url", e.target.value)} className="w-full font-jakarta text-sm px-4 py-2.5 md:py-3 rounded-xl border border-ku-navy/15 bg-ku-bg focus:outline-none focus:border-ku-navy transition-all" placeholder="https://github.com/..." /></div>
          </div>
        </div>
        <div className="flex gap-2 md:gap-3 pt-4">
          <button type="button" onClick={onCancel} className="flex-1 font-jakarta font-semibold text-xs md:text-sm py-3 md:py-3.5 rounded-xl border-2 border-ku-navy/20 text-text-soft hover:border-ku-navy hover:text-ku-navy transition-all">Batal</button>
          <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 font-jakarta font-bold text-xs md:text-sm py-3 md:py-3.5 rounded-xl bg-ku-navy text-white hover:bg-ku-navy-light disabled:opacity-60 transition-all">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan</> : "Simpan"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default function DashboardKaryaPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setViewRaw] = useState<"list" | "add" | Project>("list");

  useEffect(() => {
    const handlePop = () => setViewRaw("list");
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const setView = (newView: "list" | "add" | Project) => {
    if (newView !== "list" && view === "list") {
      window.history.pushState({ formOpen: true }, "");
      setViewRaw(newView);
    } else if (newView === "list" && view !== "list") {
      window.history.back();
    } else {
      setViewRaw(newView);
    }
  };
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        console.error("API error:", data);
        setProjects([]);
      }
    } catch (e) {
      console.error("Fetch error:", e);
      setProjects([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const handleSave = async (data: any) => {
    const isEdit = view !== "add" && view !== "list" && "id" in view;
    await fetch(isEdit ? `/api/projects/${(view as Project).id}` : "/api/projects", { method: isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setView("list"); fetchProjects();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus proyek ini?")) return;
    setDeleting(id);
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setDeleting(null);
    fetchProjects();
  };

  if (view !== "list") {
    return (
      <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-[calc(100vh-100px)] w-full">
        <ProjectForm initial={view === "add" ? EMPTY : view} onSave={handleSave} onCancel={() => setView("list")} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-[calc(100vh-100px)] w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="font-montserrat font-extrabold text-2xl md:text-3xl text-ku-navy">Karya & Proyek</h1>
          <p className="font-jakarta text-xs md:text-sm text-text-muted mt-1">{projects.length} proyek terdaftar</p>
        </div>
        <button onClick={() => setView("add")} className="flex items-center justify-center gap-2 bg-ku-navy text-white font-jakarta font-bold text-xs md:text-sm px-4 md:px-5 py-2.5 md:py-3 rounded-xl hover:bg-ku-navy-light transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Tambah Proyek
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-ku-navy animate-spin" /></div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 md:py-20 glass-card rounded-2xl border border-black/4">
          <p className="font-montserrat font-extrabold text-xl md:text-2xl text-ku-navy/30 mb-2">Belum ada proyek</p>
          <p className="font-jakarta text-xs md:text-sm text-text-muted">Klik "Tambah Proyek" untuk menambahkan portofoliomu.</p>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {projects.map((p) => (
            <motion.div key={p.id} layout className="bg-white rounded-2xl p-4 md:p-6 border border-black/4 shadow-sm flex flex-col md:flex-row items-start gap-4 md:gap-5 group hover:shadow-md transition-shadow">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-ku-navy/8 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {p.thumbnail_url ? (
                  <img src={`/api/image?url=${encodeURIComponent(p.thumbnail_url)}`} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-montserrat font-extrabold text-xl md:text-2xl text-ku-navy/40">{p.title.charAt(0)}</span>
                )}
              </div>
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 md:gap-3">
                  <div className="min-w-0">
                    <h3 className="font-montserrat font-extrabold text-base md:text-lg text-ku-navy truncate">{p.title}</h3>
                    <p className="font-jakarta text-[10px] md:text-xs font-semibold text-text-muted mt-0.5">
                      {p.start_date}{p.end_date ? ` — ${p.end_date}` : p.start_date ? " — sekarang" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2 self-start sm:self-auto flex-shrink-0 bg-ku-bg sm:bg-transparent p-1.5 sm:p-0 rounded-lg">
                    {p.project_url && <a href={p.project_url} target="_blank" className="p-1.5 md:p-2 rounded-lg text-text-muted hover:text-ku-navy hover:bg-ku-navy/10"><ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" /></a>}
                    {p.github_url && <a href={p.github_url} target="_blank" className="p-1.5 md:p-2 rounded-lg text-text-muted hover:text-ku-navy hover:bg-ku-navy/10"><Github className="w-3.5 h-3.5 md:w-4 md:h-4" /></a>}
                    <button onClick={() => setView(p)} className="p-1.5 md:p-2 rounded-lg text-text-muted hover:text-ku-navy hover:bg-ku-navy/10"><Pencil className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                    <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} className="p-1.5 md:p-2 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50">
                      {deleting === p.id ? <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" /> : <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                    </button>
                  </div>
                </div>
                {p.description && <p className="font-jakarta text-xs md:text-sm text-text-soft mt-2 md:mt-3 line-clamp-3 leading-relaxed">{p.description}</p>}
                {p.tech_stack.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-3 md:mt-4">
                    {p.tech_stack.map((t) => <TechBadge key={t} name={t} size="sm" />)}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
