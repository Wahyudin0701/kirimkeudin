"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function GlobalPreloader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showPreloader, setShowPreloader] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isReadyToExit, setIsReadyToExit] = useState(false);

  // 1. Tangkap klik pada link untuk memunculkan preloader SECARA INSTAN
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (target && target.href && !target.target && !target.hasAttribute("download")) {
        const url = new URL(target.href);
        // Jika link internal dan bukan ke halaman yang sama (hash)
        if (url.origin === window.location.origin && url.pathname !== window.location.pathname) {
          setShowPreloader(true);
          setProgress(0);
          setIsReadyToExit(false);
        }
      }
    };
    document.addEventListener("click", handleLinkClick);
    return () => document.removeEventListener("click", handleLinkClick);
  }, []);

  // 2. Animasi Progress Bar saat preloader muncul
  useEffect(() => {
    if (!showPreloader) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (isReadyToExit) return 100; // Langsung penuh kalau sudah ready
        if (prev < 90) return prev + Math.floor(Math.random() * 10) + 5;
        if (prev < 99) return prev + 1; // Stuck di 99% sampai halaman siap
        return 99;
      });
    }, 150);

    return () => clearInterval(progressInterval);
  }, [showPreloader, isReadyToExit]);

  // 3. Ketika URL benar-benar berubah (data dari database sudah selesai diambil)
  useEffect(() => {
    // Beri tanda bahwa halaman baru sudah siap
    setIsReadyToExit(true);
    setProgress(100);

    // Sequence penyelesaian:
    // Tunggu light sweep jalan sebentar (0.4s), lalu langsung tutup preloader-nya
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [pathname]); // Trigger setiap kali pathname ganti

  return (
    <>
      <AnimatePresence>
        {showPreloader && (
          <motion.div
            key="preloader"
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
            initial={{ opacity: 0, scale: 12, filter: "blur(10px) brightness(1.5)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px) brightness(1)", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, scale: 12, filter: "blur(10px) brightness(1.5)", transition: { duration: 0.4, ease: [0.8, 0, 0.2, 1] } }}
          >
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-3 relative overflow-hidden px-4 py-4">
                <div className="w-10 h-10 rounded-xl bg-ku-yellow flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img
                    src="/Logo_Kirimkeudin.png?v=2"
                    alt="Logo"
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <span className="font-montserrat font-extrabold text-3xl text-ku-navy">Kirim Ke Udin</span>
                
                {/* Animasi Garis Cahaya (Light Sweep) - Akan jalan otomatis saat progress 100% */}
                {progress === 100 && (
                  <motion.div
                    className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-white to-transparent skew-x-[30deg] z-10"
                    initial={{ left: "-100%" }}
                    animate={{ left: "200%" }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                  />
                )}
              </div>

              {/* Progress Text */}
              <motion.div 
                className="flex flex-col items-center opacity-0"
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <span className="font-jakarta font-medium text-xs text-text-muted">
                  Memuat... {progress}%
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!showPreloader && (
        <div key={pathname} className="w-full">
          {children}
        </div>
      )}
    </>
  );
}
