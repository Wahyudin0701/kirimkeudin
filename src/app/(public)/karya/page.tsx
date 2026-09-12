import { ExternalLink, Github } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { TechIconRow } from "@/components/TechBadge";

// Fetch langsung di server (Server Component)
async function getProjects() {
  try {
    return await prisma.project.findMany({
      orderBy: [{ sort_order: "asc" }, { created_at: "desc" }],
    });
  } catch {
    return [];
  }
}

export default async function KaryaPage() {
  const projects = await getProjects();

  return (
    <section className="min-h-screen pt-28 pb-16 px-6 md:px-14">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-10">
          <p className="font-jakarta font-semibold text-ku-yellow text-xs md:text-sm uppercase tracking-widest mb-2 md:mb-3">Karya &amp; Proyek</p>
          <h1 className="font-montserrat font-extrabold text-3xl md:text-4xl text-ku-navy mb-3 md:mb-4">Yang Sudah Dibuat</h1>
          <p className="font-jakarta text-text-soft text-sm md:text-base max-w-xl">
            Kumpulan proyek yang pernah dan sedang dikerjakan — dari tugas kuliah, proyek organisasi, hingga eksplorasi pribadi.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-montserrat font-extrabold text-3xl text-ku-navy/20 mb-3">Segera hadir</p>
            <p className="font-jakarta text-text-muted">Proyek-proyek sedang disiapkan. Nantikan ya!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="glass-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group flex flex-col"
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
                          ? ` — ${project.end_date}`
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
                    <div className="flex items-center gap-4 pt-2 border-t border-ku-navy/8">
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
        )}
      </div>
    </section>
  );
}
