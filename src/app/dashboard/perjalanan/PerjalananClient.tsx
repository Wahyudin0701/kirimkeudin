"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, MapPin, ArrowLeft } from "lucide-react";

type Journey = { id: string; category: string | null; institution: string | null; role: string | null; description: string | null; start_date: string | null; end_date: string | null; location: string | null; sort_order: number; };
const EMPTY: Omit<Journey, "id" | "sort_order"> = { category: "education", institution: "", role: "", description: "", start_date: "", end_date: "", location: "" };
const CATEGORIES = [{ value: "education", label: "Pendidikan" }, { value: "organization", label: "Organisasi" }, { value: "committee", label: "Kepanitiaan" }, { value: "experience", label: "Pengalaman" }];
const CATEGORY_COLORS: Record<string, string> = { education: "bg-blue-100 text-blue-700", organization: "bg-ku-navy/10 text-ku-navy", committee: "bg-ku-yellow/20 text-amber-700", experience: "bg-green-100 text-green-700" };

function JourneyForm({ initial, onSave, onCancel }: { initial: Omit<Journey, "id" | "sort_order"> | Journey; onSave: (data: any) => Promise<void>; onCancel: () => void; }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); await onSave(form); setSaving(false); };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-card w-full p-4 md:p-8 border border-black/4">
      <div className="flex items-start justify-between mb-5 md:mb-6 pb-4 md:pb-6 border-b border-gray-100">
        <div>
          <h2 className="font-montserrat font-extrabold text-lg md:text-2xl text-ku-navy">{"id" in form ? "Edit Entri" : "Tambah Entri"}</h2>
          <p className="font-jakarta text-xs md:text-sm text-text-muted mt-0.5 md:mt-1">Lengkapi informasi di bawah</p>
        </div>
        <button onClick={onCancel} className="font-jakarta font-semibold text-xs md:text-sm text-text-muted hover:text-ku-navy transition-colors mt-1">
          Kembali
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          <div><label className="block font-jakarta font-semibold text-xs md:text-sm text-ku-navy mb-1.5">Kategori</label><select value={form.category ?? "education"} onChange={(e) => set("category", e.target.value)} className="w-full font-jakarta text-sm px-4 py-2.5 md:py-3 rounded-xl border border-ku-navy/15 bg-ku-bg focus:outline-none focus:border-ku-navy transition-all">{CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
          <div><label className="block font-jakarta font-semibold text-xs md:text-sm text-ku-navy mb-1.5">Institusi / Tempat *</label><input required value={form.institution ?? ""} onChange={(e) => set("institution", e.target.value)} className="w-full font-jakarta text-sm px-4 py-2.5 md:py-3 rounded-xl border border-ku-navy/15 bg-ku-bg focus:outline-none focus:border-ku-navy transition-all" placeholder="Nama instansi" /></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          <div><label className="block font-jakarta font-semibold text-xs md:text-sm text-ku-navy mb-1.5">Peran / Posisi *</label><input required value={form.role ?? ""} onChange={(e) => set("role", e.target.value)} className="w-full font-jakarta text-sm px-4 py-2.5 md:py-3 rounded-xl border border-ku-navy/15 bg-ku-bg focus:outline-none focus:border-ku-navy transition-all" placeholder="Mahasiswa, Ketua..." /></div>
          <div><label className="block font-jakarta font-semibold text-xs md:text-sm text-ku-navy mb-1.5">Lokasi</label><input value={form.location ?? ""} onChange={(e) => set("location", e.target.value)} className="w-full font-jakarta text-sm px-4 py-2.5 md:py-3 rounded-xl border border-ku-navy/15 bg-ku-bg focus:outline-none focus:border-ku-navy transition-all" placeholder="Makassar / Remote" /></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          <div><label className="block font-jakarta font-semibold text-xs md:text-sm text-ku-navy mb-1.5">Mulai</label><input value={form.start_date ?? ""} onChange={(e) => set("start_date", e.target.value)} className="w-full font-jakarta text-sm px-4 py-2.5 md:py-3 rounded-xl border border-ku-navy/15 bg-ku-bg focus:outline-none focus:border-ku-navy transition-all" placeholder="2023" /></div>
          <div><label className="block font-jakarta font-semibold text-xs md:text-sm text-ku-navy mb-1.5">Selesai</label><input value={form.end_date ?? ""} onChange={(e) => set("end_date", e.target.value)} className="w-full font-jakarta text-sm px-4 py-2.5 md:py-3 rounded-xl border border-ku-navy/15 bg-ku-bg focus:outline-none focus:border-ku-navy transition-all" placeholder="Kosongkan jika masih aktif" /></div>
        </div>
        <div>
          <label className="block font-jakarta font-semibold text-xs md:text-sm text-ku-navy mb-1.5">Deskripsi</label>
          <textarea value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} rows={4} className="w-full font-jakarta text-sm px-4 py-2.5 md:py-3 rounded-xl border border-ku-navy/15 bg-ku-bg focus:outline-none focus:border-ku-navy transition-all resize-none" placeholder="Ceritakan detailnya..." />
        </div>
        <div className="flex gap-2 md:gap-3 pt-4">
          <button type="button" onClick={onCancel} className="flex-1 font-jakarta font-semibold text-xs md:text-sm py-3 md:py-3.5 rounded-xl border-2 border-ku-navy/20 text-text-soft hover:border-ku-navy transition-all">Batal</button>
          <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 font-jakarta font-bold text-xs md:text-sm py-3 md:py-3.5 rounded-xl bg-ku-navy text-white hover:bg-ku-navy-light disabled:opacity-60 transition-all">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}</button>
        </div>
      </form>
    </motion.div>
  );
}

export default function PerjalananClient({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState<Journey[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [view, setViewRaw] = useState<"list" | "add" | Journey>("list");

  useEffect(() => {
    const handlePop = () => setViewRaw("list");
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const setView = (newView: "list" | "add" | Journey) => {
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

  const fetchItems = useCallback(async () => { 
    setLoading(true); 
    try {
      const res = await fetch("/api/journeys"); 
      const data = await res.json();
      if (Array.isArray(data)) {
        setItems(data); 
      } else {
        console.error("API error:", data);
        setItems([]);
      }
    } catch (e) {
      console.error("Fetch error:", e);
      setItems([]);
    }
    setLoading(false); 
  }, []);

  const handleSave = async (data: any) => {
    const isEdit = view !== "add" && view !== "list" && "id" in view;
    await fetch(isEdit ? `/api/journeys/${(view as Journey).id}` : "/api/journeys", { method: isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setView("list"); fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus data ini?")) return;
    setDeleting(id); await fetch(`/api/journeys/${id}`, { method: "DELETE" }); setDeleting(null); fetchItems();
  };

  if (view !== "list") return <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-[calc(100vh-100px)] w-full"><JourneyForm initial={view === "add" ? EMPTY : view} onSave={handleSave} onCancel={() => setView("list")} /></div>;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-[calc(100vh-100px)] w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="font-montserrat font-extrabold text-2xl md:text-3xl text-ku-navy">Perjalanan</h1>
          <p className="font-jakarta text-xs md:text-sm text-text-muted mt-1">{items.length} entry terdaftar</p>
        </div>
        <button onClick={() => setView("add")} className="flex items-center justify-center gap-2 bg-ku-navy text-white font-jakarta font-bold text-xs md:text-sm px-4 md:px-5 py-2.5 md:py-3 rounded-xl hover:bg-ku-navy-light transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Tambah Entry
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-ku-navy animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 md:py-20 glass-card rounded-2xl border border-black/4">
          <p className="font-montserrat font-extrabold text-xl md:text-2xl text-ku-navy/30 mb-2">Belum ada entry</p>
          <p className="font-jakarta text-xs md:text-sm text-text-muted">Klik "Tambah Entry" untuk mulai mendokumentasikan.</p>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {items.map((item) => (
            <motion.div key={item.id} layout className="bg-white rounded-2xl p-4 md:p-6 border border-black/4 shadow-sm flex flex-col md:flex-row items-start gap-4 md:gap-5 group hover:shadow-md transition-shadow">
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 md:gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-2">
                      <span className={`font-jakarta text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-lg ${CATEGORY_COLORS[item.category ?? "education"] ?? "bg-gray-100 text-gray-600"}`}>
                        {CATEGORIES.find((c) => c.value === item.category)?.label ?? item.category}
                      </span>
                      {item.location && <span className="flex items-center gap-1 font-jakarta text-[10px] md:text-xs text-text-muted bg-ku-bg px-2 py-1 rounded-lg truncate"><MapPin className="w-3 h-3 flex-shrink-0" />{item.location}</span>}
                    </div>
                    <h3 className="font-montserrat font-extrabold text-base md:text-lg text-ku-navy truncate">{item.role}</h3>
                    <p className="font-jakarta font-semibold text-xs md:text-sm text-text-soft mt-0.5 truncate">{item.institution}</p>
                    <p className="font-jakarta text-[10px] md:text-xs text-text-muted mt-1">{item.start_date}{item.end_date ? ` — ${item.end_date}` : item.start_date ? " — sekarang" : ""}</p>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2 self-start sm:self-auto flex-shrink-0 bg-ku-bg sm:bg-transparent p-1.5 sm:p-0 rounded-lg">
                    <button onClick={() => setView(item)} className="p-1.5 md:p-2 rounded-lg text-text-muted hover:text-ku-navy hover:bg-ku-navy/10"><Pencil className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id} className="p-1.5 md:p-2 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50">
                      {deleting === item.id ? <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" /> : <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                    </button>
                  </div>
                </div>
                {item.description && <p className="font-jakarta text-xs md:text-sm text-text-soft mt-3 md:mt-4 leading-relaxed line-clamp-3">{item.description}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
