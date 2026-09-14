import { prisma } from "@/lib/prisma";
import KaryaClient from "./KaryaClient";

export const dynamic = 'force-dynamic';

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
        <div className="mb-12 text-center md:text-left">
          <h1 className="font-montserrat font-extrabold text-4xl md:text-5xl text-ku-navy mb-4 tracking-tight">
            Karya &amp; <span className="text-ku-yellow">Proyek</span>
          </h1>
          <p className="font-jakarta text-text-soft text-base md:text-lg max-w-2xl mx-auto md:mx-0">
            Kumpulan proyek yang pernah dan sedang dikerjakan — dari tugas kuliah, proyek organisasi, hingga eksplorasi pribadi.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-montserrat font-extrabold text-3xl text-ku-navy/20 mb-3">Segera hadir</p>
            <p className="font-jakarta text-text-muted">Proyek-proyek sedang disiapkan. Nantikan ya!</p>
          </div>
        ) : (
          <KaryaClient projects={projects} />
        )}
      </div>
    </section>
  );
}
