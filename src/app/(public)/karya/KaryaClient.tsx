"use client";

import { useState } from "react";
import { ExternalLink, Github, X } from "lucide-react";
import { TechIconRow } from "@/components/TechBadge";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

type Project = {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  tech_stack: string[];
  project_url: string | null;
  github_url: string | null;
  start_date: string | null;
  end_date: string | null;
};

export default function KaryaClient({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Filter properti hanya yang butuh createPortal dan client side state
  const [mounted, setMounted] = useState(false);
  import("react").then((React) => {
    React.useEffect(() => setMounted(true), []);
  });

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="glass-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300 group flex flex-col cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="w-full aspect-[16/10] bg-gradient-to-br from-ku-navy/8 to-ku-navy/3 flex items-center justify-center overflow-hidden">
              {project.thumbnail_url ? (
                <img
                  src={`/api/image?url=${encodeURIComponent(project.thumbnail_url)}`}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <span className="font-montserrat font-extrabold text-5xl text-ku-navy/15">
                  {project.title.charAt(0)}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-6 pt-5 flex flex-col flex-1 gap-4">
              {/* Title & Date */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h3 className="font-montserrat font-extrabold text-xl text-ku-navy leading-tight group-hover:text-ku-navy-light transition-colors">
                    {project.title}
                  </h3>
                  <span className="font-jakarta text-[11px] text-text-muted flex-shrink-0 mt-1 whitespace-nowrap">
                    {project.start_date}
                    {project.end_date
                      ? project.start_date === project.end_date ? "" : ` — ${project.end_date}`
                      : project.start_date
                        ? " — sekarang"
                        : ""}
                  </span>
                </div>
                {project.description && (
                  <p className="font-jakarta text-text-soft text-sm leading-relaxed mt-2 line-clamp-3">
                    {project.description}
                  </p>
                )}
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Tech Stack Icons */}
              {project.tech_stack.length > 0 && (
                <TechIconRow techStack={project.tech_stack} size="lg" />
              )}

              {/* Links */}
              {(project.project_url || project.github_url) && (
                <div className="flex items-center gap-4 pt-2 border-t border-ku-navy/8" onClick={e => e.stopPropagation()}>
                  {project.project_url && (
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-jakarta font-bold text-sm text-ku-navy hover:text-ku-navy-light transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" /> Live Demo
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-jakarta font-bold text-sm text-text-soft hover:text-ku-navy transition-colors"
                    >
                      <Github className="w-4 h-4" /> GitHub
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detail Project */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {selectedProject && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 bg-ku-navy/40 backdrop-blur-sm" onClick={() => setSelectedProject(null)}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
                >
                  {/* Thumbnail di Modal */}
                  <div className="relative w-full h-48 md:h-64 bg-gradient-to-br from-ku-navy/8 to-ku-navy/3 flex-shrink-0">
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    {selectedProject.thumbnail_url ? (
                      <img
                        src={`/api/image?url=${encodeURIComponent(selectedProject.thumbnail_url)}`}
                        alt={selectedProject.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-montserrat font-extrabold text-7xl text-ku-navy/15">
                          {selectedProject.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-6 md:p-8 overflow-y-auto">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                      <div>
                        <h2 className="font-montserrat font-extrabold text-2xl md:text-3xl text-ku-navy mb-2">
                          {selectedProject.title}
                        </h2>
                        <span className="font-jakarta text-sm font-semibold text-ku-yellow bg-ku-yellow/10 px-3 py-1 rounded-full">
                          {selectedProject.start_date}
                          {selectedProject.end_date
                            ? selectedProject.start_date === selectedProject.end_date
                              ? ""
                              : ` — ${selectedProject.end_date}`
                            : selectedProject.start_date
                              ? " — sekarang"
                              : ""}
                        </span>
                      </div>
                      
                      {/* Action Links */}
                      {(selectedProject.project_url || selectedProject.github_url) && (
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {selectedProject.project_url && (
                            <a
                              href={selectedProject.project_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-ku-navy text-white rounded-xl font-jakarta font-bold text-sm hover:bg-ku-navy-light transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" /> Live Demo
                            </a>
                          )}
                          {selectedProject.github_url && (
                            <a
                              href={selectedProject.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-text-soft rounded-xl font-jakarta font-bold text-sm hover:bg-gray-200 hover:text-ku-navy transition-colors"
                            >
                              <Github className="w-4 h-4" /> GitHub
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Tech Stack */}
                    {selectedProject.tech_stack.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-montserrat font-bold text-sm text-text-soft mb-3">Teknologi yang digunakan</h4>
                        <TechIconRow techStack={selectedProject.tech_stack} size="lg" />
                      </div>
                    )}

                    {/* Description */}
                    {selectedProject.description && (
                      <div>
                        <h4 className="font-montserrat font-bold text-sm text-text-soft mb-2">Deskripsi Proyek</h4>
                        <div className="font-jakarta text-text-muted text-sm leading-relaxed whitespace-pre-wrap">
                          {selectedProject.description}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
