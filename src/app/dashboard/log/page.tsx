"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus, Upload, Pencil, Trash2, LogIn, LogOut, Eye, Clock,
  Filter, ChevronDown, Loader2, History, Monitor, Smartphone, Tablet
} from "lucide-react";

type ActivityLog = {
  id: string;
  action: string;
  entity: string;
  entity_id: string | null;
  description: string;
  metadata: any;
  created_at: string;
};

const ACTION_CONFIG: Record<string, { icon: any; color: string; bg: string }> = {
  create: { icon: Plus,   color: "text-emerald-600", bg: "bg-emerald-50" },
  upload: { icon: Upload, color: "text-blue-600",    bg: "bg-blue-50" },
  update: { icon: Pencil, color: "text-amber-600",   bg: "bg-amber-50" },
  delete: { icon: Trash2, color: "text-red-500",     bg: "bg-red-50" },
  login:  { icon: LogIn,  color: "text-purple-600",  bg: "bg-purple-50" },
  logout: { icon: LogOut, color: "text-gray-500",    bg: "bg-gray-100" },
  read:   { icon: Eye,    color: "text-slate-500",   bg: "bg-slate-50" },
};

const ENTITY_FILTERS = [
  { value: "",             label: "Semua" },
  { value: "project",     label: "Proyek" },
  { value: "journey",     label: "Perjalanan" },
  { value: "achievement", label: "Pencapaian" },
  { value: "vault_file",  label: "File Vault" },
  { value: "vault_folder",label: "Folder Vault" },
  { value: "inbox",       label: "Inbox" },
  { value: "auth",        label: "Login/Logout" },
  { value: "profile",     label: "Profil" },
];

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff} detik lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
  });
}

function getDeviceIcon(device: string) {
  const d = device?.toLowerCase() || "";
  if (d.includes("mobile")) return Smartphone;
  if (d.includes("tablet")) return Tablet;
  return Monitor;
}

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [entityFilter, setEntityFilter] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const fetchLogs = useCallback(async (pageNum: number, filter: string, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const params = new URLSearchParams({ page: String(pageNum), limit: "20" });
      if (filter) params.set("entity", filter);

      const res = await fetch(`/api/activity-log?${params}`);
      const data = await res.json();

      setLogs(prev => append ? [...prev, ...data.logs] : data.logs);
      setTotalPages(data.totalPages);
      setTotal(data.total);
      setPage(pageNum);
    } catch (err) {
      console.error("Gagal memuat log:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs(1, entityFilter);
  }, [entityFilter, fetchLogs]);

  const loadMore = () => {
    if (page < totalPages) {
      fetchLogs(page + 1, entityFilter, true);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-[calc(100vh-100px)] w-full">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-montserrat font-extrabold text-2xl md:text-3xl text-ku-navy flex items-center gap-3">
              <History className="w-7 h-7 text-ku-navy/70" />
              Log Aktivitas
            </h1>
            <p className="font-jakarta text-xs md:text-sm text-text-muted mt-1">
              {total} total aktivitas tercatat
            </p>
          </div>

          {/* Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-ku-navy/15 bg-white font-jakarta font-semibold text-sm text-text-soft hover:border-ku-navy/30 transition-colors"
            >
              <Filter className="w-4 h-4" />
              {ENTITY_FILTERS.find(f => f.value === entityFilter)?.label || "Semua"}
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilter ? "rotate-180" : ""}`} />
            </button>
            {showFilter && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl border border-black/10 shadow-lg py-2 z-50 min-w-[180px]">
                {ENTITY_FILTERS.map(f => (
                  <button
                    key={f.value}
                    onClick={() => { setEntityFilter(f.value); setShowFilter(false); }}
                    className={`w-full text-left px-4 py-2 font-jakarta text-sm transition-colors ${
                      entityFilter === f.value
                        ? "bg-ku-navy/5 text-ku-navy font-bold"
                        : "text-text-soft hover:bg-gray-50"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Log Timeline */}
      <div className="bg-white rounded-2xl md:rounded-3xl border border-black/5 shadow-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-ku-navy/30" />
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <History className="w-16 h-16 text-ku-navy/10 mb-4" />
            <p className="font-montserrat font-extrabold text-lg text-ku-navy/20 mb-1">Belum ada aktivitas</p>
            <p className="font-jakarta text-sm text-text-muted">Log aktivitas akan muncul setelah kamu menggunakan dashboard.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {logs.map((log, i) => {
              const config = ACTION_CONFIG[log.action] || ACTION_CONFIG.update;
              const Icon = config.icon;
              const isAuth = log.entity === "auth";
              const meta = log.metadata;

              return (
                <div key={log.id} className="flex gap-4 p-4 md:p-5 hover:bg-gray-50/50 transition-colors">
                  {/* Timeline line + icon */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-9 h-9 rounded-xl ${config.bg} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    {i < logs.length - 1 && (
                      <div className="w-px flex-1 bg-gray-100 mt-2" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <p className="font-jakarta text-sm text-text-soft leading-relaxed">
                      {log.description}
                    </p>

                    {/* Device info for login/logout */}
                    {isAuth && meta && (
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-jakarta text-xs text-text-muted">
                        {(() => {
                          const DevIcon = getDeviceIcon(meta.device);
                          return <DevIcon className="w-3.5 h-3.5" />;
                        })()}
                        <span>{meta.browser || "?"}</span>
                        <span className="text-gray-300">·</span>
                        <span>{meta.os || "?"}</span>
                        <span className="text-gray-300">·</span>
                        <span>IP: {meta.ip || "?"}</span>
                      </div>
                    )}

                    <p className="font-jakarta text-[11px] text-text-muted mt-1.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timeAgo(log.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More */}
        {!loading && page < totalPages && (
          <div className="p-4 border-t border-gray-50">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="w-full py-3 rounded-xl bg-ku-bg hover:bg-ku-navy/5 font-jakarta font-bold text-sm text-text-soft transition-colors flex items-center justify-center gap-2"
            >
              {loadingMore ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Memuat...</>
              ) : (
                "Muat Lebih Banyak"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
