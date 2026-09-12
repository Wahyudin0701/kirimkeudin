import MeshBackground from "@/components/layout/MeshBackground";
import PublicNavbar from "@/components/layout/PublicNavbar";
import CursorSpotlight from "@/components/layout/CursorSpotlight";
import GlobalPreloader from "@/components/layout/GlobalPreloader";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <MeshBackground />
      <CursorSpotlight />
      <PublicNavbar />
      <GlobalPreloader>
        <main className="relative">{children}</main>
      </GlobalPreloader>
    </div>
  );
}
