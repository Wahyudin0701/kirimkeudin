"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  LayoutDashboard, Briefcase, MapPin, Trophy,
  FolderOpen, Folder, Inbox, LogOut, ChevronDown, ChevronRight,
  Home, Shield, X, User, Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import MeshBackground from "@/components/layout/MeshBackground";

const tabs = [
  { id: "dashboard", label: "Dashboard",  icon: LayoutDashboard, href: "/dashboard", subItems: [] },
  { id: "portfolio", label: "Portofolio", icon: Briefcase,       href: "/dashboard/portofolio",
    subItems: [
      { label: "Home",          href: "/dashboard/portofolio",   icon: Home,     desc: "" },
      { label: "Karya & Proyek", href: "/dashboard/karya",      icon: Briefcase, desc: "Kelola proyek yang pernah kamu buat" },
      { label: "Perjalanan",     href: "/dashboard/perjalanan", icon: MapPin,    desc: "Pendidikan & pengalaman" },
      { label: "Pencapaian",     href: "/dashboard/pencapaian", icon: Trophy,    desc: "Sertifikat & penghargaan" },
    ]
  },
  { id: "vault",     label: "Vault",      icon: FolderOpen,      href: "/dashboard/vault", subItems: [] },
  { id: "inbox",     label: "Inbox",      icon: Inbox,           href: "/dashboard/inbox", subItems: [], badge: true },
];

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [allVaultFolders, setAllVaultFolders] = useState<any[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [isVaultLoading, setIsVaultLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (searchParams.get("success") === "profile_updated") {
      setSuccessToast(true);
      const timer = setTimeout(() => {
        setSuccessToast(false);
        // Clean up URL without triggering navigation
        window.history.replaceState(null, "", "/dashboard");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // Buka folder otomatis jika sedang diakses (berdasarkan query)
  useEffect(() => {
    const folderId = searchParams.get("folderId");
    if (folderId && allVaultFolders.length > 0) {
      const openParents = (id: string) => {
        const folder = allVaultFolders.find(f => f.id === id);
        if (folder && folder.parent_id) {
          setExpandedFolders(prev => new Set(prev).add(folder.parent_id));
          openParents(folder.parent_id);
        }
      };
      openParents(folderId);
    }
  }, [searchParams, allVaultFolders]);

  useEffect(() => {
    if (pathname === "/dashboard") { setActiveTab("dashboard"); setPanelOpen(false); }
    else if (pathname.startsWith("/dashboard/portofolio") || pathname.startsWith("/dashboard/karya") || pathname.startsWith("/dashboard/perjalanan") || pathname.startsWith("/dashboard/pencapaian")) {
      setActiveTab("portfolio"); setPanelOpen(true);
    }
    else if (pathname.startsWith("/dashboard/vault")) { setActiveTab("vault"); }
    else if (pathname.startsWith("/dashboard/inbox")) { setActiveTab("inbox"); setPanelOpen(false); }
    else if (pathname.startsWith("/dashboard/profil")) { setActiveTab(null); setPanelOpen(false); }
  }, [pathname]);

  useEffect(() => {
    fetch("/api/inbox?status=unread")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setUnread(d.length))
      .catch(() => {});
      
    // Fetch SEMUA folder vault untuk membangun pohon (tree) sidebar
    const fetchVaultFolders = () => {
      setIsVaultLoading(true);
      fetch("/api/vault")
        .then((r) => r.json())
        .then((d) => { if (d.allFolders) setAllVaultFolders(d.allFolders); })
        .catch(() => {})
        .finally(() => setIsVaultLoading(false));
    };
    // Hanya fetch jika kita sedang berada di halaman vault atau pertama kali load, 
    // agar tidak membebani server setiap kali pathname berganti ke inbox dll.
    if (pathname.startsWith("/dashboard/vault")) {
      fetchVaultFolders();
    } else {
      setIsVaultLoading(false);
    }

    window.addEventListener("vault-folders-updated", fetchVaultFolders);
    return () => window.removeEventListener("vault-folders-updated", fetchVaultFolders);
  }, [pathname]);

  // Fungsi rekursif untuk membangun pohon folder secara datar dengan indentasi (level)
  const buildFolderTree = (folders: any[], parentId: string | null = null, level = 0): any[] => {
    let result: any[] = [];
    const children = folders.filter(f => f.parent_id === parentId);
    for (const child of children) {
      const hasChildren = folders.some(f => f.parent_id === child.id);
      const isExpanded = expandedFolders.has(child.id);
      
      result.push({
        id: child.id,
        label: child.name,
        href: `/dashboard/vault?folderId=${child.id}`,
        icon: isExpanded ? FolderOpen : Folder,
        level: level + 1,
        hasChildren,
        isExpanded
      });
      
      if (isExpanded) {
        result = result.concat(buildFolderTree(folders, child.id, level + 1));
      }
    }
    return result;
  };

  const toggleFolderExpand = (e: React.MouseEvent, folderId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  };

  const dynamicTabs = tabs.map(tab => {
    if (tab.id === "vault") {
      return {
        ...tab,
        subItems: [
          { id: null, label: "Home", href: "/dashboard/vault", icon: Home, level: 0 },
          ...buildFolderTree(allVaultFolders),
          ...(isVaultLoading ? [{ id: "loading", label: "Memuat folder...", href: "#", icon: Loader2, level: 1, isLoading: true }] : [])
        ]
      };
    }
    return tab;
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    document.cookie = "sb-access-token=; path=/; max-age=0";
    document.cookie = "sb-refresh-token=; path=/; max-age=0";
    router.push("/login");
  };

  const handleTabClick = (tab: any) => {
    const hasSubItems = tab.subItems && tab.subItems.length > 0;
    if (hasSubItems) {
      if (activeTab === tab.id) {
        // Sudah di tab ini → hanya toggle panel, TANPA navigasi
        setPanelOpen((p) => !p);
      } else {
        // Berpindah dari tab lain → buka panel DAN navigasi
        setActiveTab(tab.id);
        setPanelOpen(true);
        if (tab.href) router.push(tab.href);
      }
    } else {
      setActiveTab(tab.id); setPanelOpen(false);
      if (tab.href) router.push(tab.href);
    }
  };

  const activeTabConfig = dynamicTabs.find((t) => t.id === activeTab);
  const showPanel = panelOpen && activeTabConfig && activeTabConfig.subItems.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6FA]">
      {/* ══ Top Header Bar ════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14"
        style={{ background: "linear-gradient(90deg, #0D2D6B 0%, #112f72 100%)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center h-full px-4 md:px-5 gap-3 md:gap-4">
          <Link href="/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-ku-yellow flex items-center justify-center overflow-hidden">
              <img src="/Logo_Kirimkeudin.png?v=2" alt="Logo" width={32} height={32} className="object-cover w-full h-full"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; (e.currentTarget.parentElement as HTMLElement).innerHTML = '<span style="font-family:Montserrat;font-weight:800;font-size:14px;color:#0D2D6B">K</span>'; }} />
            </div>
            <span className="font-montserrat font-extrabold text-white text-sm">Kirim Ke Udin</span>
          </Link>
          <div className="w-px h-6 bg-white/20 mx-1 hidden md:block" />
          <span className="font-jakarta text-white/50 text-xs hidden md:block">Dashboard Pribadi</span>
          
          <div className="flex-1" />

          <Link href="/" target="_blank"
            className="flex items-center gap-1.5 font-jakarta text-xs text-white/60 hover:text-white transition-colors p-1.5 md:px-3 md:py-1.5 rounded-lg hover:bg-white/10 mr-1 md:mr-2">
            <Home className="w-4 h-4 md:w-3.5 md:h-3.5" />
            <span className="hidden md:block">Website Publik</span>
          </Link>

          {/* User Profile Dropdown Area */}
          <div className="relative border-l border-white/15 pl-2 md:pl-3 h-full flex items-center">
            <button 
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2.5 hover:bg-white/5 p-1.5 md:p-2 rounded-xl transition-all cursor-pointer"
            >
              <div className="text-right hidden sm:block">
                <p className="font-jakarta font-bold text-xs text-white">{settings?.name || "Wahyudin"}</p>
                <p className="font-jakarta text-[10px] text-white/40">Administrator</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-ku-yellow flex items-center justify-center flex-shrink-0 overflow-hidden border border-white/20">
                {settings?.avatar_url ? (
                  <img src={`/api/image?url=${encodeURIComponent(settings.avatar_url)}`} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-montserrat font-extrabold text-xs text-ku-navy">{(settings?.name || "W").charAt(0).toUpperCase()}</span>
                )}
              </div>
              <ChevronDown className={cn("w-3 h-3 text-white/50 transition-transform", profileMenuOpen ? "rotate-180" : "")} />
            </button>

            {/* Dropdown Menu */}
            {profileMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
                <div className="absolute right-2 md:right-0 top-[90%] w-48 bg-white rounded-xl shadow-card border border-black/5 z-50 overflow-hidden py-1.5 animate-in slide-in-from-top-2 fade-in duration-200">
                  <div className="px-4 py-2 border-b border-black/5 sm:hidden">
                    <p className="font-jakarta font-bold text-xs text-ku-navy">{settings?.name || "Wahyudin"}</p>
                    <p className="font-jakarta text-[10px] text-text-muted">Administrator</p>
                  </div>
                  <Link href="/dashboard/profil" onClick={() => setProfileMenuOpen(false)} 
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-ku-bg transition-colors font-jakarta font-semibold text-sm text-text-soft hover:text-ku-navy">
                    <User className="w-4 h-4 text-ku-navy/60" /> Profil Saya
                  </Link>
                  <div className="h-px bg-black/5 my-1" />
                  <button onClick={handleLogout} 
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 transition-colors font-jakarta font-semibold text-sm text-red-500 text-left">
                    <LogOut className="w-4 h-4 text-red-400" /> Logout
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </header>

      {/* ══ Tab Navigation Bar ════════════════════════ */}
      <div className="fixed top-14 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center px-2 md:px-5 h-11 gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
          {dynamicTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => handleTabClick(tab)}
                className={cn(
                  "relative flex items-center gap-2 px-3 md:px-4 py-2 rounded-t-lg font-jakarta font-semibold text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0",
                  isActive ? "bg-ku-yellow text-ku-navy shadow-sm" : "text-text-soft hover:text-ku-navy hover:bg-gray-50"
                )}>
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {tab.badge && unread > 0 && (
                  <span className="ml-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unread}</span>
                )}
                {tab.subItems.length > 0 && (
                  <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", isActive && panelOpen ? "rotate-180" : "")} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ══ Content Area ══════════════════════════════ */}
      <div className="flex flex-1 pt-[100px] relative min-h-screen w-full">
        
        {/* Mobile Backdrop */}
        {showPanel && (
          <div className="fixed inset-0 bg-black/20 z-20 md:hidden mt-[100px] backdrop-blur-sm"
               onClick={() => setPanelOpen(false)} />
        )}

        {/* Left Sub-panel */}
        <aside className={cn(
          "fixed left-0 top-[100px] bottom-0 z-30 w-64 bg-white border-r border-gray-200 shadow-xl md:shadow-sm flex flex-col overflow-hidden transition-transform duration-300",
          showPanel ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="font-montserrat font-extrabold text-sm text-ku-navy">{activeTabConfig?.label}</span>
            </div>
            <button onClick={() => setPanelOpen(false)} className="text-text-muted hover:text-ku-navy md:hidden p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
          <nav className="flex-1 py-2 overflow-y-auto">
            {activeTabConfig?.subItems.map((item: any) => {
              // Untuk tab vault, cek berdasarkan query parameter `folderId`
              const currentFolderId = searchParams.get("folderId");
              let isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              if (activeTab === "vault") {
                isActive = currentFolderId ? item.id === currentFolderId : item.id === null;
              }

              const Icon = item.icon;
              return (
                <div key={item.href || item.id} className="relative group">
                  <Link href={item.href!} onClick={(e) => { if (item.isLoading) { e.preventDefault(); return; }; if (window.innerWidth < 768) setPanelOpen(false); }}
                    style={{ marginLeft: item.level ? `${item.level * 1.2 + 0.5}rem` : '0.5rem' }}
                    className={cn("flex items-start gap-3 mr-2 pr-2 pl-3 py-3 rounded-xl transition-all duration-200",
                      isActive ? "bg-ku-navy/8 text-ku-navy" : "text-text-soft hover:bg-gray-50 hover:text-ku-navy",
                      item.isLoading ? "opacity-70 pointer-events-none" : "")}>
                    {item.level > 0 && (
                      <div className="absolute left-[-1.2rem] top-0 bottom-0 w-px bg-gray-200" />
                    )}
                    {item.level > 0 && (
                      <div className="absolute left-[-1.2rem] top-1/2 w-4 h-px bg-gray-200" />
                    )}
                    <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0 z-10 bg-white", isActive ? "text-ku-navy" : "text-text-muted group-hover:text-ku-navy", item.isLoading ? "animate-spin text-ku-navy" : "")} />
                    <div className="flex-1 min-w-0">
                      <p className={cn("font-jakarta font-semibold text-sm truncate", isActive ? "underline" : "")}>{item.label}</p>
                      {item.desc && (
                        <p className="font-jakarta text-[11px] text-text-muted mt-0.5 leading-snug truncate">{item.desc}</p>
                      )}
                    </div>
                  </Link>
                  {/* Tombol Expand/Collapse */}
                  {item.hasChildren && (
                    <button 
                      onClick={(e) => toggleFolderExpand(e, item.id)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-200 transition-colors z-20 text-text-muted hover:text-ku-navy"
                    >
                      <ChevronRight className={cn("w-4 h-4 transition-transform duration-200", item.isExpanded ? "rotate-90" : "")} />
                    </button>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={cn(
          "flex-1 transition-all duration-300 relative w-full overflow-x-hidden",
          showPanel ? "md:ml-64" : "ml-0"
        )}>
          <MeshBackground />
          <div className="relative z-10 min-h-[calc(100vh-100px)] w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-[100] bg-white border border-green-200 text-green-700 px-5 py-3 rounded-xl shadow-lg font-jakarta text-sm font-semibold flex items-center gap-2 transition-all duration-500",
          successToast ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
        )}
      >
        <span className="w-2 h-2 rounded-full bg-green-500" /> Profil berhasil diperbarui!
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-ku-bg text-ku-navy">
        Loading dashboard...
      </div>
    }>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
