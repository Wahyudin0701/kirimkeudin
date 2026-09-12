"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function GlobalPreloader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showPreloader, setShowPreloader] = useState(true);

  // Trigger ulang preloader setiap kali pindah halaman
  useEffect(() => {
    setShowPreloader(true);
    // Timeout untuk memicu exit animation (setelah animasi masuk selesai 0.7s + hold 0.5s)
    const timer = setTimeout(() => setShowPreloader(false), 1200); 
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <AnimatePresence>
        {showPreloader && (
          <motion.div
            key="preloader"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
            initial={{ opacity: 0, scale: 12, filter: "blur(10px) brightness(1.5)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px) brightness(1)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, scale: 12, filter: "blur(10px) brightness(1.5)", transition: { duration: 0.7, ease: [0.8, 0, 0.2, 1] } }}
          >
            <div className="flex items-center gap-3 relative overflow-hidden px-2 py-2">
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
              
              {/* Animasi Garis Cahaya (Light Sweep) */}
              <motion.div
                className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-white to-transparent skew-x-[30deg] z-10"
                initial={{ left: "-100%" }}
                animate={{ left: "200%" }}
                transition={{ duration: 0.5, delay: 0.7, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* 
        Menambahkan key={pathname} ke children akan memaksa komponen halaman (seperti LandingClient) 
        untuk me-remount sehingga animasi masuk (fade-up) dari masing-masing halaman ter-trigger ulang.
      */}
      <div key={pathname} className="w-full">
        {children}
      </div>
    </>
  );
}
