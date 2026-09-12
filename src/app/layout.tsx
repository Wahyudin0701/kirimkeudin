import type { Metadata } from "next";
import { Montserrat, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-montserrat",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kirim Ke Udin — Personal Digital Hub",
  description:
    "Ruang digital pribadi Wahyudin. Lihat karya, perjalanan, pencapaian, dan kirimkan sesuatu langsung ke Udin.",
  openGraph: {
    title: "Kirim Ke Udin",
    description: "Ruang digital pribadi Wahyudin.",
    url: "https://kirimkeudin.my.id",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${montserrat.variable} ${jakarta.variable}`}>
      <body className="font-jakarta antialiased">{children}</body>
    </html>
  );
}
