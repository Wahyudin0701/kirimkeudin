"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Mail, Trash2, Archive, Eye, Clock, User, ArrowLeft, Download, CheckCircle2, ChevronRight } from "lucide-react";

type InboxFile = { id: string; original_name: string | null; file_url: string | null; file_size: bigint | null; mime_type: string | null; };
type Submission = {
  id: string; sender_name: string; sender_email: string | null;
  sender_contact: string | null; purpose: string | null; message: string;
  status: string; created_at: string; files: InboxFile[];
};

const STATUS_TABS = [
  { value: "all",      label: "Semua"    },
  { value: "unread",   label: "Belum Dibaca" },
  { value: "read",     label: "Sudah Dibaca" },
  { value: "archived", label: "Arsip"    },
];

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}d lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}j lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

function fullDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
  });
}

// ── Detail Pane ────────────────────────────────────────────
function DetailPane({ item, onClose, onStatusChange, onDelete }: {
  item: Submission;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const action = async (fn: () => Promise<void>) => {
    setLoading(true);
    await fn();
    setLoading(false);
  };

  const actionAndClose = async (fn: () => Promise<void>) => {
    setLoading(true);
    await fn();
    setLoading(false);
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header Actions (Sticky) */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white z-10">
        <button onClick={onClose} className="md:hidden flex items-center gap-2 text-text-muted hover:text-ku-navy transition-colors font-jakarta text-sm">
          <ArrowLeft className="w-5 h-5" /> Kembali
        </button>
        <div className="hidden md:flex items-center gap-2 text-text-muted font-jakarta text-sm px-2">
          Detail Pesan
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {item.status !== "read" && (
            <button onClick={() => action(() => onStatusChange(item.id, "read"))} disabled={loading} title="Tandai Dibaca"
              className="p-2 rounded-lg text-text-muted hover:bg-green-50 hover:text-green-600 transition-colors">
              <CheckCircle2 className="w-5 h-5" />
            </button>
          )}
          {item.status !== "archived" && (
            <button onClick={() => actionAndClose(() => onStatusChange(item.id, "archived"))} disabled={loading} title="Arsipkan"
              className="p-2 rounded-lg text-text-muted hover:bg-gray-100 hover:text-gray-700 transition-colors">
              <Archive className="w-5 h-5" />
            </button>
          )}
          {item.status === "archived" && (
            <button onClick={() => actionAndClose(() => onStatusChange(item.id, "read"))} disabled={loading} title="Pindah ke Inbox"
              className="p-2 rounded-lg text-text-muted hover:bg-ku-navy/10 hover:text-ku-navy transition-colors">
              <Mail className="w-5 h-5" />
            </button>
          )}
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <button onClick={() => setShowDeleteConfirm(true)} disabled={loading} title="Hapus"
            className="p-2 rounded-lg text-text-muted hover:bg-red-50 hover:text-red-600 transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-card border border-black/5 p-6 w-full max-w-sm text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-montserrat font-extrabold text-lg text-ku-navy mb-2">Hapus Pesan?</h3>
              <p className="font-jakarta text-sm text-text-muted mb-6">
                Pesan ini akan dihapus secara permanen dan tidak dapat dikembalikan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={loading}
                  className="flex-1 font-jakarta font-semibold text-sm py-2.5 rounded-xl bg-gray-100 text-text-soft hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => actionAndClose(() => onDelete(item.id))}
                  disabled={loading}
                  className="flex-1 font-jakarta font-semibold text-sm py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors flex justify-center items-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ya, Hapus"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-3xl mx-auto">
          {/* Sender Info */}
          <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-ku-navy flex items-center justify-center flex-shrink-0 text-white font-montserrat font-extrabold text-xl shadow-md">
              {item.sender_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                <h2 className="font-montserrat font-extrabold text-xl text-ku-navy truncate">{item.sender_name}</h2>
                <span className="font-jakarta text-xs text-text-muted flex items-center gap-1.5 flex-shrink-0">
                  <Clock className="w-3.5 h-3.5" /> {fullDate(item.created_at)}
                </span>
              </div>
              <div className="space-y-0.5">
                {item.sender_email && (
                  <p className="font-jakarta text-sm text-text-soft flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-text-muted" />
                    <a href={`mailto:${item.sender_email}`} className="hover:text-ku-navy hover:underline">{item.sender_email}</a>
                  </p>
                )}
                {item.sender_contact && (
                  <p className="font-jakarta text-sm text-text-soft flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-text-muted" />
                    {item.sender_contact}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {item.purpose && (
              <span className="px-3 py-1.5 rounded-lg bg-ku-yellow/10 text-amber-700 font-jakarta font-semibold text-xs border border-ku-yellow/20">
                Topik: {item.purpose}
              </span>
            )}
            <span className={`px-3 py-1.5 rounded-lg font-jakarta font-semibold text-xs border ${
              item.status === "unread" ? "bg-red-50 text-red-600 border-red-100" :
              item.status === "archived" ? "bg-gray-50 text-gray-600 border-gray-100" : "bg-green-50 text-green-600 border-green-100"
            }`}>
              {item.status === "unread" ? "Belum dibaca" : item.status === "archived" ? "Diarsipkan" : "Sudah dibaca"}
            </span>
          </div>

          {/* Message Body */}
          <div className="prose prose-sm md:prose-base max-w-none font-jakarta text-text-soft leading-relaxed whitespace-pre-wrap bg-ku-bg/50 p-6 rounded-2xl border border-gray-100 mb-8">
            {item.message}
          </div>

          {/* Attachments */}
          {item.files.length > 0 && (
            <div>
              <h3 className="font-montserrat font-bold text-sm text-ku-navy mb-3 flex items-center gap-2">
                <Archive className="w-4 h-4" /> Lampiran ({item.files.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {item.files.map((f) => (
                  <a key={f.id} href={f.file_url || "#"} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-white hover:border-ku-navy/30 hover:shadow-sm transition-all group">
                    <div className="w-10 h-10 rounded-lg bg-ku-bg flex items-center justify-center flex-shrink-0 text-ku-navy group-hover:bg-ku-navy/5">
                      <Download className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-jakarta text-sm font-semibold text-ku-navy truncate">{f.original_name ?? "File"}</p>
                      <p className="font-jakarta text-xs text-text-muted truncate">
                        {f.file_size ? `${(Number(f.file_size) / 1024 / 1024).toFixed(2)} MB` : "Unknown size"}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────
export default function InboxClient({ initialItems }: { initialItems: Submission[] }) {
  const [items, setItems] = useState<Submission[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("all");
  const [selected, setSelected] = useState<Submission | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const query = tab !== "all" ? `?status=${tab}` : "";
    try {
      const res = await fetch(`/api/inbox${query}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setItems(data);
        if (selected) {
          const updated = data.find((i: Submission) => i.id === selected.id);
          if (updated) setSelected(updated);
          else setSelected(null);
        }
      } else {
        setItems([]);
      }
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [tab, selected]); // Added selected to deps so it can update correctly

  useEffect(() => { 
    setLoading(true);
    const query = tab !== "all" ? `?status=${tab}` : "";
    fetch(`/api/inbox${query}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          setItems([]);
        }
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [tab]); // Only re-run when tab changes

  const handleStatusChange = async (id: string, status: string) => {
    // Optimistic update
    setItems(prev => prev.map(item => item.id === id ? { ...item, status } : item));
    if (selected && selected.id === id) {
      setSelected({ ...selected, status });
    }
    
    await fetch(`/api/inbox/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    
    // Refresh to get exact truth
    const query = tab !== "all" ? `?status=${tab}` : "";
    const res = await fetch(`/api/inbox${query}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      setItems(data);
    } else {
      setItems([]);
    }
  };

  const handleDelete = async (id: string) => {
    // Optimistic update
    setItems(prev => prev.filter(item => item.id !== id));
    if (selected && selected.id === id) {
      setSelected(null);
    }
    
    await fetch(`/api/inbox/${id}`, { method: "DELETE" });
  };

  const handleOpen = async (item: Submission) => {
    setSelected(item);
    if (item.status === "unread") {
      await handleStatusChange(item.id, "read");
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto h-[calc(100vh-80px)] w-full">
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-card border border-black/5 flex flex-col md:flex-row h-full overflow-hidden">
        
        {/* ── Left Pane (List) ── */}
        <div className={`w-full ${selected ? 'hidden md:flex md:w-[400px] lg:w-[450px]' : 'flex'} flex-col h-full border-r border-gray-100 bg-white flex-shrink-0`}>
          {/* Header */}
          <div className="p-5 md:p-6 pb-4 border-b border-gray-100">
            <h1 className="font-montserrat font-extrabold text-2xl text-ku-navy mb-4">Inbox</h1>
            
            {/* Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {STATUS_TABS.map((t) => (
                <button key={t.value} onClick={() => { setTab(t.value); setSelected(null); }}
                  className={`font-jakarta font-semibold text-xs px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    tab === t.value ? "bg-ku-navy text-white shadow-md" : "bg-ku-bg text-text-soft hover:text-ku-navy hover:bg-gray-100"
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto">
            {loading && items.length === 0 ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-ku-navy/50 animate-spin" /></div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-ku-bg flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-ku-navy/20" />
                </div>
                <p className="font-montserrat font-bold text-lg text-ku-navy/50 mb-1">Tidak ada kiriman</p>
                <p className="font-jakarta text-text-muted text-xs">Kosong melompong! Belum ada pesan baru di kategori ini.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {items.map((item) => (
                  <button key={item.id} onClick={() => handleOpen(item)}
                    className={`w-full text-left p-4 md:p-5 transition-all flex items-start gap-4 hover:bg-gray-50 ${
                      selected?.id === item.id ? "bg-blue-50/50 hover:bg-blue-50/50" : ""
                    }`}>
                    <div className="w-10 h-10 rounded-full bg-ku-navy/5 flex items-center justify-center flex-shrink-0 text-ku-navy font-montserrat font-bold text-sm">
                      {item.sender_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`font-jakarta font-bold text-sm truncate ${
                          item.status === "unread" ? "text-ku-navy" : "text-text-soft"
                        }`}>
                          {item.sender_name}
                        </span>
                        <span className={`font-jakarta text-[10px] whitespace-nowrap flex-shrink-0 ${
                          item.status === "unread" ? "text-ku-yellow font-bold" : "text-text-muted"
                        }`}>
                          {timeAgo(item.created_at)}
                        </span>
                      </div>
                      <p className={`font-jakarta text-xs truncate mb-1.5 ${
                        item.status === "unread" ? "text-ku-navy font-semibold" : "text-text-muted"
                      }`}>
                        {item.purpose || "Tanpa Topik"}
                      </p>
                      <p className="font-jakarta text-xs text-text-muted truncate">
                        {item.message}
                      </p>
                    </div>
                    {item.status === "unread" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-ku-yellow flex-shrink-0 mt-3 shadow-sm" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right Pane (Detail) ── */}
        <div className={`w-full ${!selected ? 'hidden md:flex' : 'flex'} flex-col flex-1 h-full bg-gray-50/30`}>
          {selected ? (
            <DetailPane 
              item={selected} 
              onClose={() => setSelected(null)} 
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-50">
              <Mail className="w-20 h-20 text-text-muted/30 mb-6" />
              <h2 className="font-montserrat font-bold text-xl text-text-soft mb-2">Pilih pesan untuk dibaca</h2>
              <p className="font-jakarta text-sm text-text-muted max-w-xs">
                Klik salah satu pesan di daftar sebelah kiri untuk melihat detailnya di sini.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
