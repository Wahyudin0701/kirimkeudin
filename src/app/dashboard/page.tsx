import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Briefcase, MapPin, Trophy, Inbox, ArrowRight, Clock, FolderLock, File, Image as ImageIcon, FileText,
  History, Plus, Upload, Pencil, Trash2, LogIn, LogOut, Eye
} from "lucide-react";

export const dynamic = 'force-dynamic';

async function getStats() {
  try {
    const [projectCount, journeyCount, achievementCount, unreadCount, totalInbox, vaultFileCount] = await Promise.all([
      prisma.project.count(), 
      prisma.journey.count(), 
      prisma.achievement.count(),
      prisma.inboxSubmission.count({ where: { status: "unread" } }), 
      prisma.inboxSubmission.count(),
      prisma.vaultFile.count()
    ]);
    return { projectCount, journeyCount, achievementCount, unreadCount, totalInbox, vaultFileCount };
  } catch {
    return { projectCount: 0, journeyCount: 0, achievementCount: 0, unreadCount: 0, totalInbox: 0, vaultFileCount: 0 };
  }
}

async function getRecentInbox() {
  try { return await prisma.inboxSubmission.findMany({ orderBy: { created_at: "desc" }, take: 4 }); }
  catch { return []; }
}

async function getRecentVaultFiles() {
  try { return await prisma.vaultFile.findMany({ orderBy: { created_at: "desc" }, take: 4 }); }
  catch { return []; }
}

async function getRecentLogs() {
  try { return await prisma.activityLog.findMany({ orderBy: { created_at: "desc" }, take: 5 }); }
  catch { return []; }
}

const ACTION_ICON_MAP: Record<string, { icon: any; color: string; bg: string }> = {
  create: { icon: Plus,   color: "text-emerald-600", bg: "bg-emerald-50" },
  upload: { icon: Upload, color: "text-blue-600",    bg: "bg-blue-50" },
  update: { icon: Pencil, color: "text-amber-600",   bg: "bg-amber-50" },
  delete: { icon: Trash2, color: "text-red-500",     bg: "bg-red-50" },
  login:  { icon: LogIn,  color: "text-purple-600",  bg: "bg-purple-50" },
  logout: { icon: LogOut, color: "text-gray-500",    bg: "bg-gray-100" },
  read:   { icon: Eye,    color: "text-slate-500",   bg: "bg-slate-50" },
};

function timeAgo(date: Date) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return `${diff}d lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}j lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

function getFileIcon(mime: string | null) {
  if (!mime) return File;
  if (mime.includes("image")) return ImageIcon;
  if (mime.includes("pdf") || mime.includes("text")) return FileText;
  return File;
}

export default async function DashboardPage() {
  const stats       = await getStats();
  const recentInbox = await getRecentInbox();
  const recentFiles = await getRecentVaultFiles();
  const recentLogs  = await getRecentLogs();
  const hour        = new Date().getHours();
  const greeting    = hour < 12 ? "Selamat Pagi" : hour < 17 ? "Selamat Siang" : "Selamat Malam";

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-[calc(100vh-100px)] w-full">

      {/* ── Welcome ─────────────────────────────────── */}
      <div className="glass-card p-6 md:p-8 mb-6 md:mb-8 shadow-glass relative overflow-hidden rounded-2xl md:rounded-3xl">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-[0.07]" style={{ background: "#F5C518" }} />
        <div className="absolute bottom-0 right-10 md:right-20 w-24 h-24 rounded-full opacity-[0.04]" style={{ background: "#0D2D6B" }} />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-jakarta text-text-muted text-sm mb-1">{greeting}</p>
            <h1 className="font-montserrat font-extrabold text-2xl md:text-3xl text-ku-navy mb-2 leading-tight">
              Selamat Datang di Dashboard
            </h1>
            <p className="font-jakarta text-text-soft text-sm md:text-base max-w-lg">
              Pusat kendali portofoliomu. Pantau pesan masuk dan kelola semua karya, perjalanan, serta pencapaianmu di satu tempat.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-6 md:mb-8">
        {[
          { icon: Briefcase, label: "Karya & Proyek",  value: stats.projectCount,     href: "/dashboard/karya",      iconBg: "bg-blue-50 text-blue-600" },
          { icon: MapPin,    label: "Perjalanan",      value: stats.journeyCount,     href: "/dashboard/perjalanan", iconBg: "bg-indigo-50 text-indigo-600" },
          { icon: Trophy,    label: "Pencapaian",      value: stats.achievementCount, href: "/dashboard/pencapaian", iconBg: "bg-amber-50 text-amber-600" },
          { icon: Inbox,     label: "Inbox Baru",      value: stats.unreadCount,      href: "/dashboard/inbox",      iconBg: "bg-red-50 text-red-500" },
        ].map((s) => (
          <Link key={s.label} href={s.href} className="glass-card p-4 md:p-6 rounded-2xl shadow-card flex flex-col justify-between group relative overflow-hidden h-full hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5">
            <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-ku-navy/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div className={`w-9 h-9 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${s.iconBg}`}>
                <s.icon className="w-4 h-4 md:w-6 md:h-6" strokeWidth={2.5} />
              </div>
              <h3 className="font-montserrat font-extrabold text-2xl md:text-4xl text-ku-navy">{s.value}</h3>
            </div>
            <p className="font-jakarta font-bold text-xs md:text-base text-text-soft">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* ── Bottom (Vault & Inbox) ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-5">
        
        {/* Vault Summary (Left) */}
        <div className="lg:col-span-2 glass-card p-5 md:p-6 shadow-card rounded-2xl flex flex-col">
          <div className="flex items-start justify-between mb-5 border-b border-gray-100 pb-4">
            <div>
              <h2 className="font-montserrat font-extrabold text-lg md:text-xl text-ku-navy">Penyimpanan Vault</h2>
              <p className="font-jakarta text-[10px] md:text-xs text-text-muted mt-1">{stats.vaultFileCount} total file tersimpan</p>
            </div>
            <Link href="/dashboard/vault" className="font-jakarta font-semibold text-xs md:text-sm text-text-muted hover:text-ku-navy transition-colors mt-0.5 md:mt-1">
              Buka Vault
            </Link>
          </div>

          <div className="flex-1">
            {recentFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[120px] text-center">
                <FolderLock className="w-10 h-10 text-ku-navy/15 mb-3" />
                <p className="font-jakarta text-xs md:text-sm text-text-muted">Vault masih kosong</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentFiles.map((file) => {
                  const FileIcon = getFileIcon(file.mime_type);
                  return (
                    <a 
                      key={file.id} 
                      href={file.file_url || "#"}
                      target={file.file_url ? "_blank" : undefined}
                      rel={file.file_url ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/60 border border-transparent hover:border-black/5 transition-colors cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-100 transition-colors">
                        <FileIcon className="w-4 h-4 text-teal-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-jakarta font-bold text-xs md:text-sm text-text-soft truncate group-hover:text-ku-navy transition-colors">{file.display_name || file.original_name}</p>
                        <p className="font-jakarta text-[10px] text-text-muted mt-0.5">{timeAgo(file.created_at)}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Inbox (Right) */}
        <div className="lg:col-span-3 glass-card p-5 md:p-6 shadow-card rounded-2xl flex flex-col">
          <div className="flex flex-wrap items-start justify-between mb-5 gap-2 border-b border-gray-100 pb-4">
            <div>
              <h2 className="font-montserrat font-extrabold text-lg md:text-xl text-ku-navy">Kiriman Terbaru</h2>
              <p className="font-jakarta text-[10px] md:text-xs text-text-muted mt-1">{stats.totalInbox} total pesan · {stats.unreadCount} belum dibaca</p>
            </div>
            <Link href="/dashboard/inbox" className="font-jakarta font-semibold text-xs md:text-sm text-text-muted hover:text-ku-navy transition-colors mt-0.5 md:mt-1">
              Lihat Semua
            </Link>
          </div>

          <div className="flex-1">
            {recentInbox.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[120px] text-center">
                <Inbox className="w-12 h-12 text-ku-navy/15 mb-3" />
                <p className="font-montserrat font-extrabold text-lg text-ku-navy/30 mb-1">Belum ada kiriman</p>
                <p className="font-jakarta text-xs md:text-sm text-text-muted">Pesan dari website publik akan muncul di sini.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentInbox.map((msg) => (
                  <Link key={msg.id} href="/dashboard/inbox" className="flex items-center gap-3 p-3 md:p-4 rounded-xl hover:bg-white/60 border border-transparent hover:border-black/5 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-ku-navy/10 flex items-center justify-center flex-shrink-0">
                      <span className="font-montserrat font-extrabold text-sm text-ku-navy">{msg.sender_name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`font-jakarta font-bold text-sm md:text-base truncate ${msg.status === "unread" ? "text-ku-navy" : "text-text-soft"}`}>{msg.sender_name}</span>
                        {msg.status === "unread" && <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />}
                      </div>
                      <p className="font-jakarta text-xs md:text-sm text-text-muted truncate">{msg.message}</p>
                    </div>
                    <span className="font-jakarta text-[10px] md:text-xs text-text-muted flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5 hidden md:block" />{timeAgo(msg.created_at)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Activity Log ──────────────────────────────── */}
      <div className="mt-4 md:mt-5 glass-card p-5 md:p-6 shadow-card rounded-2xl">
        <div className="flex items-start justify-between mb-5 border-b border-gray-100 pb-4">
          <div>
            <h2 className="font-montserrat font-extrabold text-lg md:text-xl text-ku-navy">
              Log Aktivitas Terbaru
            </h2>
            <p className="font-jakarta text-[10px] md:text-xs text-text-muted mt-1">Rekam jejak aktivitas di dashboard</p>
          </div>
          <Link href="/dashboard/log" className="font-jakarta font-semibold text-xs md:text-sm text-text-muted hover:text-ku-navy transition-colors mt-0.5 md:mt-1">
            Lihat Semua Log
          </Link>
        </div>

        {recentLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[100px] text-center">
            <History className="w-10 h-10 text-ku-navy/10 mb-3" />
            <p className="font-jakarta text-xs md:text-sm text-text-muted">Belum ada aktivitas tercatat</p>
          </div>
        ) : (
          <div className="space-y-1">
            {recentLogs.map((log) => {
              const config = ACTION_ICON_MAP[log.action] || ACTION_ICON_MAP.update;
              const LogIcon = config.icon;
              return (
                <div key={log.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/60 border border-transparent hover:border-black/5 transition-colors">
                  <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                    <LogIcon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-jakarta font-medium text-xs md:text-sm text-text-soft truncate">{log.description}</p>
                  </div>
                  <span className="font-jakarta text-[10px] md:text-xs text-text-muted flex items-center gap-1 flex-shrink-0 whitespace-nowrap">
                    <Clock className="w-3 h-3 hidden md:block" />{timeAgo(log.created_at)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
