"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function GlobalPreloader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showPreloader, setShowPreloader] = useState(true);
  const [progress, setProgress] = useState(0);

  // Trigger ulang preloader setiap kali pindah halaman
  useEffect(() => {
    setShowPreloader(true);
    setProgress(0);

    // Animasi fake progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) return prev + Math.floor(Math.random() * 15) + 10;
        if (prev < 100) return prev + 2;
        return 100;
      });
    }, 100);

    // Timeline:
    // 0.0s - 0.7s: Zoom In (di CSS motion)
    // 0.0s - 1.5s: Progress bar berjalan
    // 1.5s - 2.0s: Light Sweep (delay 1.5s di motion)
    // 2.2s: Zoom Out & Hilang
    const timer = setTimeout(() => setShowPreloader(false), 2200); 

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [pathname]);

  return (
    <>
      <AnimatePresence>
        {showPreloader && (
          <motion.div
            key="preloader"
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
            initial={{ opacity: 0, scale: 12, filter: "blur(10px) brightness(1.5)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px) brightness(1)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, scale: 12, filter: "blur(10px) brightness(1.5)", transition: { duration: 0.7, ease: [0.8, 0, 0.2, 1] } }}
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
                
                {/* Animasi Garis Cahaya (Light Sweep) - Mulai setelah progress selesai (1.5s) */}
                <motion.div
                  className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-white to-transparent skew-x-[30deg] z-10"
                  initial={{ left: "-100%" }}
                  animate={{ left: "200%" }}
                  transition={{ duration: 0.5, delay: 1.5, ease: "easeInOut" }}
                />
              </div>

              {/* Progress Bar (muncul setelah zoom-in selesai) */}
              <motion.div 
                className="flex flex-col items-center mt-2 opacity-0"
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <motion.div 
                    className="h-full bg-ku-navy rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>
                <span className="font-jakarta font-bold text-xs text-text-muted">
                  Memuat... {Math.min(progress, 100)}%
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
