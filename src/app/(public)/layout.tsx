import MeshBackground from "@/components/layout/MeshBackground";
import PublicNavbar from "@/components/layout/PublicNavbar";
import CursorSpotlight from "@/components/layout/CursorSpotlight";
import PublicFooter from "@/components/layout/PublicFooter";
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
        <div className="flex flex-col min-h-screen">
          <main className="relative flex-grow">{children}</main>
          <PublicFooter />
        </div>
      </GlobalPreloader>
    </div>
  );
}
