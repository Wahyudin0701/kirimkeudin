"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Mail, Trash2, Archive, Eye, X, Clock, User } from "lucide-react";

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

// ── Detail Modal ────────────────────────────────────────────
function DetailModal({ item, onClose, onStatusChange, onDelete }: {
  item: Submission;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const action = async (fn: () => Promise<void>) => {
    setLoading(true);
    await fn();
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        className="bg-white rounded-2xl shadow-glass w-full max-w-lg max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-ku-bg gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-ku-navy flex items-center justify-center flex-shrink-0">
              <span className="font-montserrat font-extrabold text-sm text-white">{item.sender_name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h2 className="font-montserrat font-extrabold text-lg text-ku-navy">{item.sender_name}</h2>
              {item.sender_email && <p className="font-jakarta text-sm text-text-muted">{item.sender_email}</p>}
              {item.sender_contact && <p className="font-jakarta text-sm text-text-muted">{item.sender_contact}</p>}
            </div>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-ku-navy transition-colors flex-shrink-0"><X className="w-5 h-5" /></button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4 text-xs text-text-muted font-jakarta">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{timeAgo(item.created_at)}</span>
            {item.purpose && <span className="px-2 py-1 rounded-full bg-ku-yellow/20 text-amber-700 font-semibold">{item.purpose}</span>}
            <span className={`px-2 py-1 rounded-full font-semibold ${
              item.status === "unread" ? "bg-red-100 text-red-600" :
              item.status === "archived" ? "bg-gray-100 text-gray-500" : "bg-green-100 text-green-600"
            }`}>{item.status === "unread" ? "Belum dibaca" : item.status === "archived" ? "Arsip" : "Sudah dibaca"}</span>
          </div>

          <div className="p-4 rounded-xl bg-ku-bg">
            <p className="font-jakarta text-sm text-text-soft leading-relaxed whitespace-pre-wrap">{item.message}</p>
          </div>

          {item.files.length > 0 && (
            <div>
              <p className="font-jakarta font-semibold text-sm text-ku-navy mb-2">File Terlampir ({item.files.length})</p>
              <div className="space-y-2">
                {item.files.map((f) => (
                  <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl border border-ku-navy/10 bg-white">
                    <span className="font-jakarta text-sm text-text-soft flex-1 truncate">{f.original_name ?? "File"}</span>
                    {f.file_url && (
                      <a href={f.file_url} target="_blank" rel="noopener noreferrer"
                        className="font-jakarta text-xs font-semibold text-ku-navy hover:underline flex-shrink-0">Download</a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex gap-2 flex-wrap">
          {item.status !== "read" && (
            <button onClick={() => action(() => onStatusChange(item.id, "read"))} disabled={loading}
              className="flex items-center gap-1.5 font-jakarta font-semibold text-sm px-4 py-2.5 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
              <Eye className="w-4 h-4" /> Tandai Dibaca
            </button>
          )}
          {item.status !== "archived" && (
            <button onClick={() => action(() => onStatusChange(item.id, "archived"))} disabled={loading}
              className="flex items-center gap-1.5 font-jakarta font-semibold text-sm px-4 py-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              <Archive className="w-4 h-4" /> Arsipkan
            </button>
          )}
          {item.status === "archived" && (
            <button onClick={() => action(() => onStatusChange(item.id, "read"))} disabled={loading}
              className="flex items-center gap-1.5 font-jakarta font-semibold text-sm px-4 py-2.5 rounded-xl bg-ku-navy/10 text-ku-navy hover:bg-ku-navy/20 transition-colors">
              <Mail className="w-4 h-4" /> Pindah ke Inbox
            </button>
          )}
          <button onClick={() => action(() => onDelete(item.id))} disabled={loading}
            className="flex items-center gap-1.5 font-jakarta font-semibold text-sm px-4 py-2.5 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-colors ml-auto">
            <Trash2 className="w-4 h-4" /> Hapus
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────
export default function DashboardInboxPage() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [selected, setSelected] = useState<Submission | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const query = tab !== "all" ? `?status=${tab}` : "";
    const res = await fetch(`/api/inbox${query}`);
    setItems(await res.json());
    setLoading(false);
  }, [tab]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleStatusChange = async (id: string, status: string) => {
    await fetch(`/api/inbox/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/inbox/${id}`, { method: "DELETE" });
    fetchItems();
  };

  const handleOpen = async (item: Submission) => {
    setSelected(item);
    if (item.status === "unread") {
      await handleStatusChange(item.id, "read");
    }
  };

  return (
    <>
      <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-[calc(100vh-100px)] w-full">
        <div className="mb-8">
          <h1 className="font-montserrat font-extrabold text-3xl text-ku-navy">Inbox</h1>
          <p className="font-jakarta text-text-muted text-sm mt-1">Semua kiriman yang masuk dari halaman publik</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {STATUS_TABS.map((t) => (
            <button key={t.value} onClick={() => setTab(t.value)}
              className={`font-jakarta font-semibold text-sm px-4 py-2 rounded-xl transition-all ${
                tab === t.value ? "bg-ku-navy text-white" : "bg-white text-text-soft hover:text-ku-navy shadow-card"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-ku-navy animate-spin" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <Mail className="w-12 h-12 text-ku-navy/20 mx-auto mb-4" />
            <p className="font-montserrat font-extrabold text-2xl text-ku-navy/30 mb-2">Tidak ada kiriman</p>
            <p className="font-jakarta text-text-muted text-sm">Kiriman baru akan muncul di sini.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <motion.button key={item.id} layout onClick={() => handleOpen(item)}
                className={`w-full text-left p-5 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 flex items-start gap-4 group ${
                  item.status === "unread" ? "bg-white border-l-4 border-ku-navy" : "bg-white opacity-80"
                }`}>
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  item.status === "unread" ? "bg-red-500" : item.status === "archived" ? "bg-gray-300" : "bg-green-400"
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-jakarta font-bold text-sm ${item.status === "unread" ? "text-ku-navy" : "text-text-soft"}`}>
                        {item.sender_name}
                      </span>
                      {item.sender_email && <span className="font-jakarta text-xs text-text-muted">· {item.sender_email}</span>}
                    </div>
                    <span className="font-jakarta text-xs text-text-muted flex items-center gap-1 flex-shrink-0">
                      <Clock className="w-3 h-3" />{timeAgo(item.created_at)}
                    </span>
                  </div>
                  {item.purpose && (
                    <span className="font-jakarta text-xs font-semibold px-2 py-0.5 rounded-full bg-ku-yellow/20 text-amber-700 mr-2">
                      {item.purpose}
                    </span>
                  )}
                  <p className="font-jakarta text-sm text-text-muted truncate mt-1">{item.message}</p>
                  {item.files.length > 0 && (
                    <p className="font-jakarta text-xs text-ku-navy/60 mt-1">📎 {item.files.length} file terlampir</p>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <DetailModal
            item={selected}
            onClose={() => setSelected(null)}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        )}
      </AnimatePresence>
    </>
  );
}
