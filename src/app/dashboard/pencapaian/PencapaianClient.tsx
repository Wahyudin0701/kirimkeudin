"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, ExternalLink, Loader2, ArrowLeft, X, Image as ImageIcon, UploadCloud } from "lucide-react";

type Achievement = { id: string; category: string | null; name: string; issuer: string | null; year: string | null; credential_url: string | null; photo_url: string | null; sort_order: number; };
const EMPTY: Omit<Achievement, "id" | "sort_order"> = { category: "certificate", name: "", issuer: "", year: "", credential_url: "", photo_url: "" };
const CATEGORIES = [{ value: "certificate", label: "Sertifikat" }, { value: "award", label: "Penghargaan" }, { value: "competition", label: "Kompetisi" }];
const CATEGORY_COLORS: Record<string, string> = { certificate: "bg-blue-100 text-blue-700", award: "bg-ku-yellow/20 text-amber-700", competition: "bg-purple-100 text-purple-700" };

function AchievementForm({ initial, onSave, onCancel }: { initial: Omit<Achievement, "id" | "sort_order"> | Achievement; onSave: (data: any) => Promise<void>; onCancel: () => void; }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));
  
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
      set("photo_url", fileUrl);
    } catch (err) {
      alert("Gagal mengunggah foto.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); await onSave(form); setSaving(false); };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-card w-full p-4 md:p-8 border border-black/4">
      <div className="flex items-start justify-between mb-5 md:mb-6 pb-4 md:pb-6 border-b border-gray-100">
        <div>
          <h2 className="font-montserrat font-extrabold text-lg md:text-2xl text-ku-navy">{"id" in form ? "Edit Pencapaian" : "Tambah Pencapaian"}</h2>
          <p className="font-jakarta text-xs md:text-sm text-text-muted mt-0.5 md:mt-1">Lengkapi informasi di bawah</p>
        </div>
        <button onClick={onCancel} className="font-jakarta font-semibold text-xs md:text-sm text-text-muted hover:text-ku-navy transition-colors mt-1">
          Kembali
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          <div><label className="block font-jakarta font-semibold text-xs md:text-sm text-ku-navy mb-1.5">Kategori</label><select value={form.category ?? "certificate"} onChange={(e) => set("category", e.target.value)} className="w-full font-jakarta text-sm px-4 py-2.5 md:py-3 rounded-xl border border-ku-navy/15 bg-ku-bg focus:outline-none focus:border-ku-navy transition-shadow">{CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
          <div><label className="block font-jakarta font-semibold text-xs md:text-sm text-ku-navy mb-1.5">Tahun</label><input value={form.year ?? ""} onChange={(e) => set("year", e.target.value)} className="w-full font-jakarta text-sm px-4 py-2.5 md:py-3 rounded-xl border border-ku-navy/15 bg-ku-bg focus:outline-none focus:border-ku-navy transition-shadow" placeholder="2026" /></div>
        </div>
        <div><label className="block font-jakarta font-semibold text-xs md:text-sm text-ku-navy mb-1.5">Nama Pencapaian *</label><input required value={form.name} onChange={(e) => set("name", e.target.value)} className="w-full font-jakarta text-sm px-4 py-2.5 md:py-3 rounded-xl border border-ku-navy/15 bg-ku-bg focus:outline-none focus:border-ku-navy transition-shadow" placeholder="Nama sertifikat / penghargaan" /></div>
        <div><label className="block font-jakarta font-semibold text-xs md:text-sm text-ku-navy mb-1.5">Dikeluarkan oleh</label><input value={form.issuer ?? ""} onChange={(e) => set("issuer", e.target.value)} className="w-full font-jakarta text-sm px-4 py-2.5 md:py-3 rounded-xl border border-ku-navy/15 bg-ku-bg focus:outline-none focus:border-ku-navy transition-shadow" placeholder="Google, Dicoding, Universitas..." /></div>
        <div><label className="block font-jakarta font-semibold text-xs md:text-sm text-ku-navy mb-1.5">Foto / Sertifikat (Opsional)</label>
          <label className={`flex flex-col items-center justify-center w-full gap-2 px-4 py-5 rounded-xl border-2 border-dashed transition-shadow cursor-pointer ${uploadingImage ? "border-ku-navy/30 bg-ku-navy/5 cursor-not-allowed" : "border-ku-navy/20 bg-ku-bg hover:border-ku-navy/50 hover:bg-ku-navy/5"}`}>
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="sr-only" />
            {uploadingImage ? (
              <div className="flex items-center gap-2 text-ku-navy">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-jakarta text-sm font-semibold">Mengunggah...</span>
              </div>
            ) : form.photo_url ? (
              <div className="w-full">
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 mb-2">
                  <img src={`/api/image?url=${encodeURIComponent(form.photo_url)}`} alt="Sertifikat preview" className="w-full h-full object-contain bg-gray-50" />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); set("photo_url", null); }}
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
                  <UploadCloud className="w-5 h-5 text-ku-navy" />
                </div>
                <div className="text-center">
                  <p className="font-jakarta text-sm font-semibold text-ku-navy">Klik atau drag foto ke sini</p>
                  <p className="font-jakarta text-xs text-text-muted mt-0.5">Maksimal 2MB (JPG, PNG)</p>
                </div>
              </>
            )}
          </label>
        </div>
        <div className="flex gap-2 md:gap-3 pt-4">
          <button type="button" onClick={onCancel} className="flex-1 font-jakarta font-semibold text-xs md:text-sm py-3 md:py-3.5 rounded-xl border-2 border-ku-navy/20 text-text-soft hover:border-ku-navy transition-shadow">Batal</button>
          <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 font-jakarta font-bold text-xs md:text-sm py-3 md:py-3.5 rounded-xl bg-ku-navy text-white hover:bg-ku-navy-light disabled:opacity-60 transition-shadow">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}</button>
        </div>
      </form>
    </motion.div>
  );
}

export default function PencapaianClient({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState<Achievement[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [view, setViewRaw] = useState<"list" | "add" | Achievement>("list");

  useEffect(() => {
    const handlePop = () => setViewRaw("list");
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const setView = (newView: "list" | "add" | Achievement) => {
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
      const res = await fetch("/api/achievements"); 
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
    await fetch(isEdit ? `/api/achievements/${(view as Achievement).id}` : "/api/achievements", { method: isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setView("list"); fetchItems();
  };

  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeleting(id); 
    await fetch(`/api/achievements/${id}`, { method: "DELETE" }); 
    setDeleting(null); 
    setItemToDelete(null);
    fetchItems();
  };

  if (view !== "list") return <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-[calc(100vh-100px)] w-full"><AchievementForm initial={view === "add" ? EMPTY : view} onSave={handleSave} onCancel={() => setView("list")} /></div>;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-[calc(100vh-100px)] w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="font-montserrat font-extrabold text-2xl md:text-3xl text-ku-navy">Pencapaian</h1>
          <p className="font-jakarta text-xs md:text-sm text-text-muted mt-1">{items.length} data terdaftar</p>
        </div>
        <button onClick={() => setView("add")} className="flex items-center justify-center gap-2 bg-ku-navy text-white font-jakarta font-bold text-xs md:text-sm px-4 md:px-5 py-2.5 md:py-3 rounded-xl hover:bg-ku-navy-light transition-shadow shadow-sm">
          <Plus className="w-4 h-4" /> Tambah Pencapaian
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-ku-navy animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 md:py-20 glass-card rounded-2xl border border-black/4">
          <p className="font-montserrat font-extrabold text-xl md:text-2xl text-ku-navy/30 mb-2">Belum ada data</p>
          <p className="font-jakarta text-xs md:text-sm text-text-muted">Klik "Tambah Pencapaian" untuk mulai.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {items.map((item) => (
            <motion.div key={item.id} layout className="bg-white rounded-2xl p-4 md:p-5 border border-black/4 shadow-sm group hover:shadow-md transition-shadow flex flex-col justify-between min-h-[130px] md:min-h-[140px]">
              <div>
                <div className="flex items-start justify-between gap-2 md:gap-3 mb-2 md:mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-ku-navy/5 flex items-center justify-center flex-shrink-0 overflow-hidden border border-black/5">
                      {item.photo_url ? (
                        <img src={`/api/image?url=${encodeURIComponent(item.photo_url)}`} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-montserrat font-extrabold text-lg text-ku-navy/40">{item.name.charAt(0)}</span>
                      )}
                    </div>
                    <span className={`font-jakarta text-[10px] md:text-xs font-bold px-2.5 md:px-3 py-1 rounded-lg ${CATEGORY_COLORS[item.category ?? "certificate"] ?? "bg-gray-100 text-gray-600"}`}>
                      {CATEGORIES.find((c) => c.value === item.category)?.label ?? item.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 self-start flex-shrink-0 bg-ku-bg sm:bg-transparent p-1 sm:p-0 rounded-lg">
                    <button onClick={() => setView(item)} className="p-1.5 rounded-lg text-text-muted hover:text-ku-navy hover:bg-ku-navy/10"><Pencil className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                    <button onClick={() => setItemToDelete(item.id)} disabled={deleting === item.id} className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50">
                      {deleting === item.id ? <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" /> : <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                    </button>
                  </div>
                </div>
                <h3 className="font-montserrat font-extrabold text-base md:text-lg text-ku-navy leading-tight mb-1 truncate">{item.name}</h3>
                <p className="font-jakarta text-xs md:text-sm text-text-soft truncate">{item.issuer}</p>
              </div>
              {item.year && (
                <div className="mt-3 md:mt-4 pt-2 md:pt-3 border-t border-gray-100">
                  <span className="font-jakarta text-[10px] md:text-xs font-semibold text-text-muted">Tahun {item.year}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {itemToDelete && typeof document !== "undefined" && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-xl border border-black/5 p-6 w-full max-w-sm text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-montserrat font-extrabold text-lg text-ku-navy mb-2">Hapus Data?</h3>
              <p className="font-jakarta text-sm text-text-muted mb-6">
                Pencapaian ini akan dihapus secara permanen dan tidak dapat dikembalikan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setItemToDelete(null)}
                  disabled={deleting !== null}
                  className="flex-1 font-jakarta font-semibold text-sm py-2.5 rounded-xl bg-gray-100 text-text-soft hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDelete(itemToDelete)}
                  disabled={deleting !== null}
                  className="flex-1 font-jakarta font-semibold text-sm py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors flex justify-center items-center gap-2"
                >
                  {deleting !== null ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ya, Hapus"}
                </button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
      </AnimatePresence>
    </div>
  );
}
