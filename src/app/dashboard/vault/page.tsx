"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDropzone } from "react-dropzone";
import {
  Folder, FileText, UploadCloud, Trash2, ChevronRight, ChevronDown,
  Loader2, FolderOpen, Home, Pencil, Check,
  Download, X, LayoutGrid, AlignJustify, Table2,
  HardDrive, Image as ImageIcon, Film, Music, Archive,
  FileSpreadsheet, File as FileIcon, MoreVertical
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import JSZip from "jszip";
import { saveAs } from "file-saver";

type VaultFolder = { id: string; name: string; parent_id: string | null; created_at: string; size?: string; };
type VaultFile   = { id: string; original_name: string; file_url: string; file_size: string; mime_type: string; created_at: string; };
type Breadcrumb  = { id: string | null; name: string };
type ViewMode    = "large" | "medium" | "list" | "details";

// ── Utilities ─────────────────────────────────────────────
function formatBytes(bytes: string | number, decimals = 2) {
  const n = Number(bytes);
  if (!n) return "0 B";
  const k = 1024, dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(n) / Math.log(k));
  return parseFloat((n / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" }) + " " + 
         d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function getFileIcon(mime: string, className = "w-8 h-8") {
  if (mime?.startsWith("image/"))       return <ImageIcon className={cn(className, "text-pink-500")} />;
  if (mime?.startsWith("video/"))       return <Film      className={cn(className, "text-purple-500")} />;
  if (mime?.startsWith("audio/"))       return <Music     className={cn(className, "text-blue-400")} />;
  if (mime?.includes("pdf"))            return <FileText  className={cn(className, "text-red-500")} />;
  if (mime?.includes("spreadsheet") || mime?.includes("excel") || mime?.includes("sheet")) return <FileSpreadsheet className={cn(className, "text-green-600")} />;
  if (mime?.includes("wordprocessingml") || mime?.includes("word") || mime?.includes("document")) return <FileText className={cn(className, "text-blue-600")} />;
  if (mime?.includes("zip") || mime?.includes("rar") || mime?.includes("archive")) return <Archive className={cn(className, "text-amber-500")} />;
  return <FileIcon className={cn(className, "text-gray-400")} />;
}

function getFileTypeStr(mime: string) {
  if (!mime) return "File";
  if (mime.includes("pdf")) return "PDF Document";
  if (mime.includes("zip") || mime.includes("rar") || mime.includes("archive")) return "Archive";
  if (mime.includes("spreadsheet") || mime.includes("excel")) return "Excel Worksheet";
  if (mime.includes("wordprocessingml") || mime.includes("word")) return "Word Document";
  if (mime.startsWith("image/jpeg") || mime.startsWith("image/jpg")) return "JPEG File";
  if (mime.startsWith("image/png")) return "PNG File";
  if (mime.startsWith("image/")) return "Image File";
  if (mime.startsWith("video/")) return "Video File";
  if (mime.startsWith("audio/")) return "Audio File";
  if (mime.includes("application/x-msdownload") || mime.includes("exe")) return "Application";
  return "File";
}

// ── Storage Banner ─────────────────────────────────────────
const R2_FREE_LIMIT = 10 * 1024 * 1024 * 1024; // 10 GB

function StorageBanner({ totalBytes }: { totalBytes: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const MAX_BYTES = 10 * 1024 * 1024 * 1024;
  const usedPct = Math.min((totalBytes / MAX_BYTES) * 100, 100);
  const barColor =
    usedPct < 60 ? "bg-green-400" :
    usedPct < 85 ? "bg-amber-400" : "bg-red-500";
  const textColor =
    usedPct < 60 ? "text-green-600" :
    usedPct < 85 ? "text-amber-600" : "text-red-600";

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm mb-6 overflow-hidden">
      {/* Header yang selalu tampil & bisa diklik */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 md:p-5 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-ku-navy/8 flex items-center justify-center flex-shrink-0">
            <HardDrive className="w-5 h-5 text-ku-navy" />
          </div>
          <div>
            <p className="font-jakarta font-bold text-sm text-ku-navy">Penyimpanan Vault</p>
            <p className="font-jakarta text-[10px] text-text-muted">Cloudflare R2 — Batas gratis 10 GB</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className={cn("font-montserrat font-extrabold text-lg md:text-xl", textColor)}>
              {formatBytes(totalBytes)}
            </p>
            <p className="font-jakarta text-[10px] text-text-muted">digunakan dari 10 GB</p>
          </div>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/80 text-gray-500 transition-colors hover:bg-gray-200 flex-shrink-0">
            <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isExpanded && "rotate-180")} />
          </div>
        </div>
      </div>

      {/* Area yang bisa dibuka tutup (Hanya progress bar) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 md:px-5 pb-4 md:pb-5"
          >
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${usedPct}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={cn("h-full rounded-full transition-colors", barColor)}
              />
            </div>
            <div className="flex justify-between items-start mt-2">
              <span className="font-jakarta text-[10px] text-text-muted">{formatBytes(totalBytes)}</span>
              <span className={cn("font-jakarta text-[10px] font-bold mt-1", textColor)}>
                {usedPct > 0 && usedPct < 0.1 ? "< 0.1" : usedPct.toFixed(1)}% terpakai
              </span>
              <span className="font-jakarta text-[10px] text-text-muted">10 GB</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
function VaultPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlFolderId = searchParams.get("folderId");

  const [folders, setFolders]       = useState<VaultFolder[]>([]);
  const [files, setFiles]           = useState<VaultFile[]>([]);
  const [loading, setLoading]       = useState(true);
  const [totalBytes, setTotalBytes] = useState(0);

  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs]     = useState<Breadcrumb[]>([{ id: null, name: "Home" }]);

  // Sinkronisasi URL (sidebar) ke State Utama
  useEffect(() => {
    setCurrentFolder(urlFolderId);
  }, [urlFolderId]);

  const [viewMode, setViewMode]               = useState<ViewMode>("list"); // Default ke List
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isUploading, setIsUploading]         = useState(false);
  const [newFolderName, setNewFolderName]     = useState("");
  const [uploadProgress, setUploadProgress]   = useState<{ [key: string]: number }>({});

  const fetchData = useCallback(async (folderId: string | null, silent: boolean = false) => {
    if (!silent) setLoading(true);
    try {
      const res  = await fetch(`/api/vault${folderId ? `?folderId=${folderId}` : ""}`);
      const data = await res.json();
      setFolders(data.folders || []);
      setFiles(data.files || []);
      
      // Rekonstruksi breadcrumb yang benar (dari data hirarki asli) untuk menghindari 'Folder Aktif'
      if (data.allFolders && folderId) {
        const buildCrumbs = (id: string, all: any[]): Breadcrumb[] => {
          const folder = all.find(f => f.id === id);
          if (!folder) return [];
          const parentCrumbs = folder.parent_id ? buildCrumbs(folder.parent_id, all) : [{ id: null, name: "Home" }];
          return [...parentCrumbs, { id: folder.id, name: folder.name }];
        };
        setBreadcrumbs(buildCrumbs(folderId, data.allFolders));
      } else if (!folderId) {
        setBreadcrumbs([{ id: null, name: "Home" }]);
      }
    } catch (e: any) { 
      if (e.message !== "Failed to fetch") {
        console.error(e); 
      }
    }
    finally { if (!silent) setLoading(false); }
  }, []);

  const fetchTotal = useCallback(async () => {
    try {
      const res  = await fetch("/api/vault");
      const data = await res.json();
      const sum  = (data.files || []).reduce((acc: number, f: VaultFile) => acc + Number(f.file_size), 0);
      setTotalBytes(sum);
    } catch (e: any) {
      if (e.message !== "Failed to fetch") console.error(e);
    }
  }, []);

  useEffect(() => { fetchData(currentFolder); fetchTotal(); }, [currentFolder, fetchData, fetchTotal]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const tempId = Math.random().toString(36).substring(7);
      setUploadProgress(p => ({ ...p, [tempId]: 10 }));
      try {
        const resUrl = await fetch("/api/vault/files", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, contentType: file.type || "application/octet-stream", size: file.size, folderId: currentFolder }),
        });
        if (!resUrl.ok) throw new Error("Gagal minta link upload");
        const { uploadUrl } = await resUrl.json();
        setUploadProgress(p => ({ ...p, [tempId]: 40 }));
        
        const uploadRes = await fetch(uploadUrl, { method: "PUT", headers: { "Content-Type": file.type || "application/octet-stream" }, body: file });
        if (!uploadRes.ok) throw new Error("Gagal upload ke Storage");
        
        setUploadProgress(p => ({ ...p, [tempId]: 100 }));
      } catch (err) {
        console.error("Upload error:", err);
        alert(`Gagal upload ${file.name}`);
      } finally {
        setTimeout(() => {
          setUploadProgress(p => { const n = { ...p }; delete n[tempId]; return n; });
          fetchData(currentFolder, true);
          fetchTotal();
        }, 1000);
      }
    }
  }, [currentFolder, fetchData, fetchTotal]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true });

  const enterFolder = (f: VaultFolder) => {
    // Navigasi melalui URL agar Sidebar dapat merespons dan tersinkronisasi.
    // Breadcrumbs akan dikalkulasi ulang secara otomatis setelah data folder dimuat.
    router.push(`/dashboard/vault?folderId=${f.id}`);
  };
  
  const navigateCrumb = (idx: number) => {
    const t = breadcrumbs[idx];
    router.push(t.id ? `/dashboard/vault?folderId=${t.id}` : `/dashboard/vault`);
    setBreadcrumbs(breadcrumbs.slice(0, idx + 1));
  };
  
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    await fetch("/api/vault/folders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newFolderName, parent_id: currentFolder }) });
    setNewFolderName(""); setIsCreatingFolder(false); 
    fetchData(currentFolder, true);
    window.dispatchEvent(new Event("vault-folders-updated"));
  };
  
  const handleDeleteFolder = async (id: string) => {
    if (!confirm("Yakin ingin menghapus folder ini? (Folder harus kosong)")) return;
    const res = await fetch(`/api/vault/folders/${id}`, { method: "DELETE" });
    if (!res.ok) { const d = await res.json(); alert(d.error || "Gagal menghapus"); }
    else {
      fetchData(currentFolder, true);
      window.dispatchEvent(new Event("vault-folders-updated"));
    }
  };
  
  const handleDeleteFile = async (id: string) => {
    if (!confirm("Hapus file ini permanen?")) return;
    await fetch(`/api/vault/files/${id}`, { method: "DELETE" });
    fetchData(currentFolder, true); fetchTotal();
  };

  // ── Rename Logic ─────────────────────────────────────────
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemName, setEditingItemName] = useState("");
  const [editingItemType, setEditingItemType] = useState<"folder" | "file" | null>(null);

  const startRename = (id: string, currentName: string, type: "folder" | "file") => {
    setEditingItemId(id);
    setEditingItemName(currentName);
    setEditingItemType(type);
  };

  const cancelRename = () => {
    setEditingItemId(null);
    setEditingItemName("");
    setEditingItemType(null);
  };

  const executeRename = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingItemId || !editingItemType || !editingItemName.trim()) {
      cancelRename();
      return;
    }

    try {
      const res = await fetch("/api/vault/rename", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingItemId, type: editingItemType, newName: editingItemName })
      });
      if (res.ok) {
        fetchData(currentFolder, true);
        if (editingItemType === "folder") {
          window.dispatchEvent(new Event("vault-folders-updated"));
        }
      } else {
        const data = await res.json();
        alert(data.error || "Gagal mengubah nama");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem saat mengubah nama");
    } finally {
      cancelRename();
    }
  };

  // ── Drag and Drop Logic ──────────────────────────────────
  const [dragHoverId, setDragHoverId] = useState<string | null>(null);
  const [movingItemId, setMovingItemId] = useState<string | null>(null);

  // ── Card Action Menu (mobile-friendly dropdown) ───────────
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenMenuId(prev => prev === id ? null : id);
  };
  // Tutup menu saat klik di luar
  useEffect(() => {
    if (!openMenuId) return;
    const handler = () => setOpenMenuId(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [openMenuId]);

  // ── Folder Download (Client-Side ZIP) ────────────────────
  const [downloadingFolderId, setDownloadingFolderId] = useState<string | null>(null);
  const [downloadPhase, setDownloadPhase]             = useState<string>("");

  const handleDownloadFolder = async (
    e: React.MouseEvent,
    folderId: string,
    folderName: string
  ) => {
    e.stopPropagation();
    if (downloadingFolderId) return; // Cegah download ganda

    setDownloadingFolderId(folderId);
    try {
      // Fase 1: Minta daftar file + presigned URL dari server
      setDownloadPhase("Mengumpulkan daftar file...");
      const res = await fetch(`/api/vault/folders/${folderId}/download-urls`);
      if (!res.ok) throw new Error("Gagal mengambil daftar file");

      const { folderName: name, files } = await res.json() as {
        folderName: string;
        files: { name: string; archivePath: string; presignedUrl: string }[];
      };

      if (!files || files.length === 0) {
        alert("Folder ini kosong, tidak ada yang bisa diunduh.");
        return;
      }

      // Fase 2: Fetch setiap file dari R2 secara paralel (max 5 concurrency)
      const zip = new JSZip();
      const CONCURRENCY = 5;
      let fetched = 0;

      const fetchFile = async (file: { name: string; archivePath: string; presignedUrl: string }) => {
        const fileRes = await fetch(file.presignedUrl);
        if (!fileRes.ok) {
          console.warn(`Gagal mengunduh: ${file.name} (${fileRes.status})`);
          return;
        }
        const blob = await fileRes.blob();
        zip.file(file.archivePath, blob);
        fetched++;
        setDownloadPhase(`Mengumpulkan file... (${fetched}/${files.length})`);
      };

      // Jalankan dengan batasan concurrency
      for (let i = 0; i < files.length; i += CONCURRENCY) {
        const batch = files.slice(i, i + CONCURRENCY);
        await Promise.all(batch.map(fetchFile));
      }

      // Fase 3: Kompres di browser
      setDownloadPhase("Mengompresi...");
      const zipBlob = await zip.generateAsync(
        { type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } },
        (meta) => {
          setDownloadPhase(`Mengompresi... ${Math.round(meta.percent)}%`);
        }
      );

      // Fase 4: Simpan ke perangkat
      const safeName = (name || folderName).replace(/[/\\?%*:|"<>]/g, "_");
      saveAs(zipBlob, `${safeName}.zip`);
      setDownloadPhase("Selesai ✓");
      setTimeout(() => setDownloadPhase(""), 2000);

    } catch (err: any) {
      console.error("Download folder error:", err);
      alert(`Gagal mengunduh folder: ${err.message}`);
    } finally {
      setDownloadingFolderId(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string, type: "folder" | "file") => {
    e.dataTransfer.setData("itemId", id);
    e.dataTransfer.setData("itemType", type);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, targetFolderId: string | null) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    // Gunakan "root" jika targetnya adalah Home (null) agar tidak bertabrakan dengan state awal dragHoverId (null)
    const hoverId = targetFolderId === null ? "root" : targetFolderId;
    if (dragHoverId !== hoverId) {
      setDragHoverId(hoverId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragHoverId(null);
  };

  const handleDrop = async (e: React.DragEvent, targetFolderId: string | null) => {
    e.preventDefault();
    e.stopPropagation(); // Cegah event bocor ke react-dropzone jika ini adalah drag item internal
    setDragHoverId(null);
    
    const itemId = e.dataTransfer.getData("itemId");
    const itemType = e.dataTransfer.getData("itemType");
    
    if (!itemId || !itemType) return;
    // Cegah folder memindahkan dirinya ke dalam dirinya sendiri
    if (itemType === "folder" && itemId === targetFolderId) return;
    // Cegah memindahkan ke folder tempat item itu sudah berada saat ini
    if (targetFolderId === currentFolder) return;

    setMovingItemId(itemId);
    try {
      const res = await fetch("/api/vault/move", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemId, type: itemType, targetFolderId })
      });
      if (res.ok) {
        fetchData(currentFolder, true);
        window.dispatchEvent(new Event("vault-folders-updated"));
      } else {
        const data = await res.json();
        alert(data.error || "Gagal memindahkan item");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem saat memindahkan item");
    } finally {
      setMovingItemId(null);
    }
  };

  // ── Grid Layout helpers ──────────────────────────────────
  const isListView = viewMode === "list" || viewMode === "details";
  const gridClass = isListView 
    ? "flex flex-col bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden" 
    : {
        large:   "grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4",
        medium:  "grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-3",
      }[viewMode as "large"|"medium"];

  const cardH = { large: "h-full min-h-[8.5rem] md:min-h-[10rem]", medium: "h-full min-h-[6.5rem] md:min-h-[8rem]" }[viewMode as "large"|"medium"];
  const iconSz = { large: "w-10 h-10", medium: "w-7 h-7", list: "w-6 h-6", details: "w-5 h-5" }[viewMode];

  return (
    <div {...getRootProps()} className={cn("p-4 md:p-8 max-w-6xl mx-auto min-h-[calc(100vh-100px)] relative transition-colors duration-300", isDragActive && "bg-ku-navy/5")}>
      <input {...getInputProps()} />

      {/* Drag Overlay */}
      <AnimatePresence>
        {isDragActive && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-ku-navy/80 backdrop-blur-sm flex flex-col items-center justify-center border-4 border-dashed border-ku-yellow/50 m-4 rounded-3xl">
            <UploadCloud className="w-20 h-20 text-ku-yellow animate-bounce" />
            <h2 className="font-montserrat font-extrabold text-2xl text-white mt-5">Lepaskan file di sini</h2>
            <p className="font-jakarta text-white/60 mt-2 text-sm">File akan diunggah ke folder saat ini.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <StorageBanner totalBytes={totalBytes} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="flex flex-wrap items-center gap-1.5 md:gap-2 font-montserrat font-extrabold text-2xl md:text-3xl text-ku-navy">
            {breadcrumbs.map((c, i) => (
              <span key={c.id || "root"} className="flex items-center gap-1.5 md:gap-2">
                <button 
                  onClick={() => navigateCrumb(i)} 
                  onDragOver={(e) => handleDragOver(e, c.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, c.id)}
                  className={cn(
                    "hover:text-ku-navy transition-all px-2 py-1 rounded-md truncate max-w-[150px] md:max-w-xs", 
                    i < breadcrumbs.length - 1 ? "text-ku-navy/50" : "text-ku-navy",
                    dragHoverId === (c.id === null ? "root" : c.id) ? "bg-blue-50 outline outline-2 outline-dashed outline-blue-400 -outline-offset-2" : ""
                  )}
                  title={c.name}
                >
                  {i === 0 ? "Home" : c.name}
                </button>
                {i < breadcrumbs.length - 1 && <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-ku-navy/30" strokeWidth={3} />}
              </span>
            ))}
          </h1>
        </div>

        <div className="flex items-center gap-2">
            {/* View Switcher Toggle */}
            <button 
              onClick={() => setViewMode(viewMode === "list" ? "large" : "list")}
              className="flex items-center gap-1.5 font-jakarta font-semibold text-xs text-text-soft bg-white border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 shadow-sm transition-all"
              title={viewMode === "list" ? "Ubah ke Tampilan Ikon" : "Ubah ke Tampilan List"}
            >
              {viewMode === "list" ? <LayoutGrid className="w-4 h-4" /> : <AlignJustify className="w-4 h-4" />}
              <span className="hidden sm:inline">{viewMode === "list" ? "Icons" : "List"}</span>
            </button>

          <button onClick={() => setIsCreatingFolder(true)} className="flex items-center gap-1.5 font-jakarta font-semibold text-xs text-ku-navy border border-ku-navy/20 bg-white px-3 py-2 rounded-xl hover:bg-ku-navy/5 transition-all shadow-sm">
            <FolderOpen className="w-4 h-4 text-ku-yellow" /> <span className="hidden sm:inline">Folder Baru</span>
          </button>
          <label className="flex items-center gap-1.5 font-jakarta font-semibold text-xs text-white bg-ku-navy px-4 py-2 rounded-xl hover:bg-ku-navy-light cursor-pointer shadow-sm transition-all">
            <UploadCloud className="w-4 h-4" /> <span className="hidden sm:inline">Unggah File</span>
            <input type="file" multiple className="hidden" onChange={e => { if (e.target.files) onDrop(Array.from(e.target.files)); }} />
          </label>
        </div>
      </div>

      <AnimatePresence>
        {isCreatingFolder && (
          <motion.form initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}
            onSubmit={handleCreateFolder} className="mb-5">
            <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-sm border border-ku-navy/10 w-full">
              {/* Ikon folder kuning */}
              <div className="w-8 h-8 flex items-center justify-center bg-ku-yellow/15 rounded-lg flex-shrink-0">
                <Folder className="w-4 h-4 text-ku-yellow" fill="currentColor" />
              </div>
              {/* Input */}
              <input
                autoFocus
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                placeholder="Nama folder baru..."
                className="flex-1 font-jakarta font-medium text-sm text-ku-navy placeholder:text-text-muted/50 outline-none bg-transparent py-0.5"
              />
              {/* Tombol Buat */}
              <button
                type="submit"
                disabled={!newFolderName.trim()}
                className="font-jakarta text-xs font-bold bg-ku-navy text-white px-4 py-2 rounded-xl hover:bg-ku-navy-light disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
              >
                Buat
              </button>
              {/* Tombol tutup */}
              <button type="button" onClick={() => { setIsCreatingFolder(false); setNewFolderName(""); }} className="w-8 h-8 flex items-center justify-center text-text-muted hover:bg-gray-100 rounded-lg flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {Object.keys(uploadProgress).length > 0 && (
        <div className="mb-5 space-y-2">
          {Object.entries(uploadProgress).map(([id, pct]) => (
            <div key={id} className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-card border border-ku-navy/10 text-xs font-jakarta">
              <Loader2 className="w-4 h-4 text-ku-navy animate-spin flex-shrink-0" />
              <div className="flex-1">
                <p className="font-bold text-ku-navy mb-1">Mengunggah file...</p>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-ku-yellow transition-all duration-300" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <span className="font-bold text-ku-navy">{pct}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Indikator Download Folder */}
      {downloadingFolderId && downloadPhase && (
        <div className="mb-5">
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-card border border-ku-navy/10 text-xs font-jakarta">
            {downloadPhase.startsWith("Selesai") ? (
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            ) : (
              <Loader2 className="w-4 h-4 text-ku-navy animate-spin flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className={cn("font-bold mb-0.5", downloadPhase.startsWith("Selesai") ? "text-green-600" : "text-ku-navy")}>
                Mengunduh Folder sebagai ZIP
              </p>
              <p className="text-text-muted">{downloadPhase}</p>
            </div>
          </div>
        </div>
      )}

      {isListView && !loading && (folders.length > 0 || files.length > 0) && (
        <div className="grid grid-cols-[1fr_70px] sm:grid-cols-[1fr_130px_100px_80px_110px] gap-3 px-5 py-3 mb-2 bg-white rounded-xl border border-black/5 shadow-sm">
          <span className="font-jakarta text-xs font-bold text-text-muted">Name</span>
          <span className="font-jakarta text-xs font-bold text-text-muted hidden sm:block">Date modified</span>
          <span className="font-jakarta text-xs font-bold text-text-muted hidden sm:block">Type</span>
          <span className="font-jakarta text-xs font-bold text-text-muted text-right hidden sm:block">Size</span>
          <span className="font-jakarta text-xs font-bold text-text-muted text-right pr-2">Action</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-ku-navy animate-spin" /></div>
      ) : folders.length === 0 && files.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 md:h-56 text-center glass-card rounded-3xl border border-black/5">
          <UploadCloud className="w-12 h-12 text-ku-navy/20 mb-4" />
          <p className="font-montserrat font-extrabold text-xl text-ku-navy/40 mb-1">Vault masih kosong</p>
          <p className="font-jakarta text-xs md:text-sm text-text-muted">Tarik & lepas file, atau klik "Unggah File".</p>
        </div>
      ) : (
        <div className={gridClass}>
          {folders.map(f => (
            <div key={f.id} 
              className={cn(
                "relative group rounded-xl transition-colors",
                dragHoverId === f.id ? "bg-blue-50 outline outline-2 outline-dashed outline-blue-400 -outline-offset-2 z-10" : "",
                movingItemId === f.id ? "opacity-50 pointer-events-none" : ""
              )}
              draggable
              onDragStart={(e) => handleDragStart(e, f.id, "folder")}
              onDragOver={(e) => handleDragOver(e, f.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, f.id)}
            >
              {isListView ? (
                <div
                  onDoubleClick={() => { if (editingItemId !== f.id) enterFolder(f); }}
                  onClick={() => { if(window.innerWidth < 768 && editingItemId !== f.id) enterFolder(f); }}
                  className="flex items-center sm:grid sm:grid-cols-[1fr_130px_100px_80px_110px] gap-3 px-4 py-3 transition-all cursor-pointer hover:bg-gray-50/50 border-b border-gray-100 last:border-0 rounded-xl"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Folder className={cn(iconSz, "text-ku-yellow flex-shrink-0")} fill="currentColor" />
                    {editingItemId === f.id && editingItemType === "folder" ? (
                      <form onSubmit={executeRename} className="flex items-center gap-1.5 flex-1 min-w-0 pr-2" onClick={e => e.stopPropagation()}>
                        <input autoFocus value={editingItemName} onChange={e => setEditingItemName(e.target.value)} className="flex-1 min-w-0 font-jakarta font-medium text-sm text-ku-navy px-2 py-0.5 border border-blue-400 rounded outline-none" />
                        <button type="submit" className="p-1 rounded text-green-600 hover:bg-green-50"><Check className="w-4 h-4" /></button>
                        <button type="button" onClick={cancelRename} className="p-1 rounded text-red-500 hover:bg-red-50"><X className="w-4 h-4" /></button>
                      </form>
                    ) : (
                      <div className="flex items-center min-w-0 gap-2">
                        <span className="font-jakarta font-medium text-sm text-ku-navy truncate">{f.name}</span>
                        {movingItemId === f.id && <Loader2 className="w-3.5 h-3.5 text-ku-navy/50 animate-spin flex-shrink-0" />}
                      </div>
                    )}
                  </div>
                  <span className="font-jakarta text-[11px] text-text-muted hidden sm:block">{formatDate(f.created_at)}</span>
                  <span className="font-jakarta text-[11px] text-text-muted hidden sm:block">File folder</span>
                  <span className="font-jakarta text-[11px] text-text-muted text-right hidden sm:block">
                    {f.size && f.size !== "0" ? formatBytes(f.size) : "-"}
                  </span>
                  
                  <div className="flex items-center justify-end gap-1 ml-auto sm:ml-0">
                     <button
                        onClick={(e) => handleDownloadFolder(e, f.id, f.name)}
                        disabled={downloadingFolderId === f.id}
                        className="p-1.5 rounded-md text-text-muted hover:text-ku-navy hover:bg-ku-navy/8 transition-all disabled:opacity-50 disabled:cursor-wait"
                        title="Unduh Folder (ZIP)"
                      >
                        {downloadingFolderId === f.id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Download className="w-4 h-4" />}
                      </button>
                    <button onClick={(e) => { e.stopPropagation(); startRename(f.id, f.name, "folder"); }} className="p-1.5 rounded-md text-text-muted hover:text-ku-navy hover:bg-gray-100 transition-all" title="Ubah Nama">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteFolder(f.id); }} className="p-1.5 rounded-md text-text-muted hover:text-red-500 hover:bg-red-50 transition-all" title="Hapus">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onDoubleClick={() => { if (editingItemId !== f.id) enterFolder(f); }}
                  onClick={() => { if(window.innerWidth < 768 && editingItemId !== f.id) enterFolder(f); }}
                  className={cn(
                    "w-full bg-white rounded-2xl p-3 shadow-sm border border-black/5 hover:shadow-card hover:border-ku-navy/20 transition-all flex flex-col items-center justify-center text-center gap-2 relative cursor-pointer",
                    cardH
                  )}
                >
                  <Folder className={cn("text-ku-yellow drop-shadow-sm group-hover:scale-110 transition-transform duration-300", viewMode === "large" ? "w-12 h-12" : "w-8 h-8")} fill="currentColor" />
                  
                  {editingItemId === f.id && editingItemType === "folder" ? (
                    <form onSubmit={executeRename} className="flex flex-col items-center gap-1 w-full px-1" onClick={e => e.stopPropagation()}>
                      <input autoFocus value={editingItemName} onChange={e => setEditingItemName(e.target.value)} className="w-full font-jakarta font-medium text-xs text-center text-ku-navy px-1 py-0.5 border border-blue-400 rounded outline-none" />
                      <div className="flex items-center gap-1">
                        <button type="submit" className="p-1 rounded text-green-600 hover:bg-green-50"><Check className="w-3 h-3" /></button>
                        <button type="button" onClick={cancelRename} className="p-1 rounded text-red-500 hover:bg-red-50"><X className="w-3 h-3" /></button>
                      </div>
                    </form>
                  ) : (
                    <span className="font-jakarta font-semibold text-xs md:text-sm text-ku-navy line-clamp-2 break-all w-full px-1" title={f.name}>
                      {movingItemId === f.id && <Loader2 className="w-3 h-3 text-ku-navy/50 animate-spin inline-block mr-1 align-middle" />}
                      <span className="align-middle">{f.name}</span>
                    </span>
                  )}

                  {viewMode === "large" && f.size && f.size !== "0" ? (
                    <span className="font-jakarta text-[9px] text-text-muted mt-auto pt-1">{formatBytes(f.size)}</span>
                  ) : viewMode === "large" ? (
                    <span className="font-jakarta text-[9px] text-text-muted mt-auto pt-1">-</span>
                  ) : null}
                  {/* ── Tombol menu 3 titik — selalu terlihat (mobile-friendly) ─ */}
                  <div className="absolute top-1.5 right-1.5" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={(e) => toggleMenu(e, f.id)}
                      className={cn(
                        "p-1 rounded-lg transition-colors",
                        openMenuId === f.id ? "bg-ku-navy/10 text-ku-navy" : "bg-black/5 text-gray-400 hover:bg-ku-navy/8 hover:text-ku-navy"
                      )}
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>

                    {/* Dropdown */}
                    {openMenuId === f.id && (
                      <div className="absolute top-full right-0 mt-1 z-50 bg-white rounded-xl shadow-lg border border-black/8 py-1 min-w-[130px]">
                        <button
                          onClick={(e) => { handleDownloadFolder(e, f.id, f.name); setOpenMenuId(null); }}
                          disabled={downloadingFolderId === f.id}
                          className="flex items-center gap-2 w-full px-3 py-2 text-left text-xs font-jakarta text-ku-navy hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          {downloadingFolderId === f.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                          Unduh ZIP
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); startRename(f.id, f.name, "folder"); setOpenMenuId(null); }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-left text-xs font-jakarta text-ku-navy hover:bg-gray-50 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Ubah Nama
                        </button>
                        <div className="mx-3 my-1 border-t border-gray-100" />
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteFolder(f.id); setOpenMenuId(null); }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-left text-xs font-jakarta text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Hapus
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {files.map(f => {
            const isImage = f.mime_type?.startsWith("image/");
            return (
              <div key={f.id} 
                className={cn(
                  "relative group cursor-grab active:cursor-grabbing",
                  movingItemId === f.id ? "opacity-50 pointer-events-none" : ""
                )}
                draggable
                onDragStart={(e) => handleDragStart(e, f.id, "file")}
              >
                {isListView ? (
                  <div
                    onClick={() => { if (editingItemId !== f.id) window.open(`/api/vault/files/${f.id}/download?inline=true&cb=${new Date(f.updated_at).getTime()}`, "_blank"); }}
                    className="flex items-center sm:grid sm:grid-cols-[1fr_130px_100px_80px_110px] gap-3 px-4 py-3 transition-all cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {isImage ? (
                        <div className="w-6 h-6 rounded bg-gray-100 overflow-hidden flex-shrink-0 border border-black/10">
                          <img src={`/api/vault/files/${f.id}/download?inline=true&cb=${new Date(f.updated_at).getTime()}`} alt="thumbnail" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        getFileIcon(f.mime_type, "w-6 h-6 flex-shrink-0")
                      )}
                      {editingItemId === f.id && editingItemType === "file" ? (
                        <form onSubmit={executeRename} className="flex items-center gap-1.5 flex-1 min-w-0 pr-2" onClick={e => e.stopPropagation()}>
                          <input autoFocus value={editingItemName} onChange={e => setEditingItemName(e.target.value)} className="flex-1 min-w-0 font-jakarta font-medium text-sm text-text-soft px-2 py-0.5 border border-blue-400 rounded outline-none" />
                          <button type="submit" className="p-1 rounded text-green-600 hover:bg-green-50"><Check className="w-4 h-4" /></button>
                          <button type="button" onClick={cancelRename} className="p-1 rounded text-red-500 hover:bg-red-50"><X className="w-4 h-4" /></button>
                        </form>
                      ) : (
                        <div className="flex items-center min-w-0 gap-2">
                          <span className="font-jakarta font-medium text-sm text-text-soft group-hover:text-ku-navy truncate">{f.original_name}</span>
                          {movingItemId === f.id && <Loader2 className="w-3.5 h-3.5 text-ku-navy/50 animate-spin flex-shrink-0" />}
                        </div>
                      )}
                    </div>
                    <span className="font-jakarta text-[11px] text-text-muted hidden sm:block">{formatDate(f.created_at)}</span>
                    <span className="font-jakarta text-[11px] text-text-muted hidden sm:block truncate">{getFileTypeStr(f.mime_type)}</span>
                    <span className="font-jakarta text-[11px] text-text-muted text-right hidden sm:block">{formatBytes(f.file_size)}</span>
                    
                    <div className="flex items-center justify-end gap-1 ml-auto sm:ml-0">
                      <a href={`/api/vault/files/${f.id}/download`} download onClick={e => e.stopPropagation()} className="p-1.5 rounded-md text-text-muted hover:text-ku-navy hover:bg-ku-navy/8 transition-all" title="Unduh File"><Download className="w-4 h-4" /></a>
                      <button onClick={(e) => { e.stopPropagation(); startRename(f.id, f.original_name || "", "file"); }} className="p-1.5 rounded-md text-text-muted hover:text-ku-navy hover:bg-gray-100 transition-all" title="Ubah Nama">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteFile(f.id); }} className="p-1.5 rounded-md text-text-muted hover:text-red-500 hover:bg-red-50 transition-all" title="Hapus"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => { if (editingItemId !== f.id) window.open(`/api/vault/files/${f.id}/download?inline=true&cb=${new Date(f.updated_at).getTime()}`, "_blank"); }}
                    className={cn(
                      "w-full bg-white rounded-2xl p-3 shadow-sm border border-black/5 hover:shadow-card hover:border-ku-navy/20 transition-all flex flex-col items-center justify-center text-center gap-1.5 overflow-hidden relative cursor-pointer",
                      cardH
                    )}
                  >
                    {isImage ? (
                      <div className={cn("rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-black/5 group-hover:scale-110 transition-transform duration-300", viewMode === "large" ? "w-14 h-14" : "w-10 h-10")}>
                        <img src={`/api/vault/files/${f.id}/download?inline=true&cb=${new Date(f.updated_at).getTime()}`} alt={f.original_name || "image"} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="group-hover:scale-110 transition-transform duration-300">
                        {getFileIcon(f.mime_type, viewMode === "large" ? "w-12 h-12" : "w-8 h-8")}
                      </div>
                    )}
                    
                    {editingItemId === f.id && editingItemType === "file" ? (
                      <form onSubmit={executeRename} className="flex flex-col items-center gap-1 w-full px-1" onClick={e => e.stopPropagation()}>
                        <input autoFocus value={editingItemName} onChange={e => setEditingItemName(e.target.value)} className="w-full font-jakarta font-medium text-[10px] md:text-xs text-center text-text-soft px-1 py-0.5 border border-blue-400 rounded outline-none" />
                        <div className="flex items-center gap-1">
                          <button type="submit" className="p-1 rounded text-green-600 hover:bg-green-50"><Check className="w-3 h-3" /></button>
                          <button type="button" onClick={cancelRename} className="p-1 rounded text-red-500 hover:bg-red-50"><X className="w-3 h-3" /></button>
                        </div>
                      </form>
                    ) : (
                      <span className="font-jakarta font-medium text-[10px] md:text-xs text-text-soft line-clamp-2 md:line-clamp-3 break-all w-full px-1" title={f.original_name || ""}>
                        {movingItemId === f.id && <Loader2 className="w-3 h-3 text-ku-navy/50 animate-spin inline-block mr-1 align-middle" />}
                        <span className="align-middle">{f.original_name}</span>
                      </span>
                    )}

                    {viewMode === "large" && <span className="font-jakarta text-[9px] text-text-muted mt-auto pt-1">{formatBytes(f.file_size)}</span>}

                    {/* ── Tombol menu 3 titik — selalu terlihat (mobile-friendly) ─ */}
                    <div className="absolute top-1.5 right-1.5" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={(e) => toggleMenu(e, f.id)}
                        className={cn(
                          "p-1 rounded-lg transition-colors",
                          openMenuId === f.id ? "bg-ku-navy/10 text-ku-navy" : "bg-black/5 text-gray-400 hover:bg-ku-navy/8 hover:text-ku-navy"
                        )}
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {/* Dropdown */}
                      {openMenuId === f.id && (
                        <div className="absolute top-full right-0 mt-1 z-50 bg-white rounded-xl shadow-lg border border-black/8 py-1 min-w-[130px]">
                          <a
                            href={`/api/vault/files/${f.id}/download`}
                            download
                            onClick={e => { e.stopPropagation(); setOpenMenuId(null); }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-left text-xs font-jakarta text-ku-navy hover:bg-gray-50 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" /> Unduh File
                          </a>
                          <button
                            onClick={(e) => { e.stopPropagation(); startRename(f.id, f.original_name || "", "file"); setOpenMenuId(null); }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-left text-xs font-jakarta text-ku-navy hover:bg-gray-50 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" /> Ubah Nama
                          </button>
                          <div className="mx-3 my-1 border-t border-gray-100" />
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteFile(f.id); setOpenMenuId(null); }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-left text-xs font-jakarta text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Suspense Wrapper (Next.js 16 requirement untuk useSearchParams) ──
export default function VaultPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-ku-navy animate-spin" />
      </div>
    }>
      <VaultPageContent />
    </Suspense>
  );
}
