"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Award, Star, X } from "lucide-react";

type Achievement = {
  id: string;
  name: string;
  issuer: string | null;
  category: string | null;
  year: number | null;
  photo_url: string | null;
};

const CATEGORY_CONFIG: Record<string, { label: string; Icon: any; color: string }> = {
  certificate: { label: "Sertifikat",   Icon: Award,   color: "bg-blue-100 text-blue-700" },
  award:       { label: "Penghargaan",  Icon: Trophy,  color: "bg-ku-yellow/20 text-amber-700" },
  competition: { label: "Kompetisi",    Icon: Star,    color: "bg-green-100 text-green-700" },
};

export default function PencapaianClient({
  achievements,
}: {
  achievements: Achievement[];
}) {
  const [selectedItem, setSelectedItem] = useState<Achievement | null>(null);

  return (
    <>
      <section className="min-h-screen pt-28 pb-16 px-6 md:px-14">
        <div className="max-w-6xl mx-auto w-full">
          {/* Header */}
          <div className="mb-10">
            <p className="font-jakarta font-semibold text-ku-yellow text-xs md:text-sm uppercase tracking-widest mb-2 md:mb-3">
              Pencapaian
            </p>
            <h1 className="font-montserrat font-extrabold text-3xl md:text-4xl text-ku-navy mb-3 md:mb-4">
              Yang Berhasil Diraih
            </h1>
            <p className="font-jakarta text-text-soft text-sm md:text-base max-w-xl">
              Sertifikat, penghargaan, dan pencapaian yang menjadi bagian dari perjalanan belajar.
            </p>
          </div>

          {/* Grid */}
          {achievements.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-montserrat font-extrabold text-3xl text-ku-navy/20 mb-3">Segera hadir</p>
              <p className="font-jakarta text-text-muted">Pencapaian sedang dikumpulkan. Nantikan ya!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
              {achievements.map((item) => {
                const cat = CATEGORY_CONFIG[item.category ?? "certificate"] ?? CATEGORY_CONFIG.certificate;
                const Icon = cat.Icon;
                const badgeTextColor = cat.color.split(" ")[1];
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="text-left glass-card flex flex-col shadow-card hover:shadow-card-hover transition-all duration-300 group overflow-hidden border border-black/5 cursor-pointer w-full"
                  >
                    {/* Image Thumbnail Area */}
                    <div className="relative w-full aspect-[4/3] bg-ku-bg border-b border-black/5 overflow-hidden flex items-center justify-center">
                      {item.photo_url ? (
                        <img src={`/api/image?url=${encodeURIComponent(item.photo_url)}`} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${cat.color.split(" ")[0]} group-hover:scale-110 transition-transform duration-500`}>
                          <Icon className={`w-8 h-8 ${badgeTextColor}`} />
                        </div>
                      )}
                      
                      {/* Category Badge Overlay */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className={`font-jakarta text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-md bg-white/90 border border-white/50 shadow-sm ${badgeTextColor}`}>
                          {cat.label}
                        </span>
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="p-5 flex flex-col flex-1 w-full">
                      <h3 className="font-montserrat font-extrabold text-base text-ku-navy leading-snug mb-1.5 line-clamp-2">
                        {item.name}
                      </h3>
                      
                      <div className="flex-1 mt-auto">
                        {item.issuer && <p className="font-jakarta text-sm text-text-soft line-clamp-1">{item.issuer}</p>}
                        {item.year && <p className="font-jakarta text-xs text-text-muted mt-1 font-medium">{item.year}</p>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Modal Popup Gambar Full (Lightbox) */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-xl cursor-pointer"
              onClick={() => setSelectedItem(null)}
            />
            
            {/* Close Button Fixed Top Right */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)} 
              className="absolute top-4 right-4 md:top-8 md:right-8 z-[10000] bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-all shadow-lg"
            >
              <X className="w-6 h-6" />
            </motion.button>
            
            {/* Image Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative z-10 flex items-center justify-center max-w-6xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
               {selectedItem.photo_url ? (
                 <img 
                   src={`/api/image?url=${encodeURIComponent(selectedItem.photo_url)}`} 
                   alt={selectedItem.name} 
                   className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
                 />
               ) : (
                 <div className="bg-white rounded-3xl p-12 text-center shadow-2xl">
                   <div className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center bg-gray-100 text-gray-400 mb-5">
                     <Award className="w-12 h-12" />
                   </div>
                   <h3 className="font-montserrat font-extrabold text-xl text-ku-navy mb-2">{selectedItem.name}</h3>
                   <p className="font-jakarta text-sm text-text-muted">Tidak ada foto visual untuk pencapaian ini.</p>
                 </div>
               )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
