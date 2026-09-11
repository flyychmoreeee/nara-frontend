import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NARA — Papan Tugas Kuliah",
  description:
    "Catat tugas kuliah, atur tenggat waktu, dan dapatkan reminder harian otomatis lewat WhatsApp. Tidak ada lagi tugas yang terlewat!",
  metadataBase: new URL("https://nara-frontend.vercel.app"),
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
  openGraph: {
    title: "NARA — Papan Tugas Kuliah",
    description:
      "Catat tugas kuliah, atur tenggat waktu, dan dapatkan reminder harian otomatis lewat WhatsApp.",
    url: "https://nara-frontend.vercel.app",
    siteName: "NARA",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "NARA — Papan Tugas Kuliah",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NARA — Papan Tugas Kuliah",
    description:
      "Catat tugas kuliah, atur tenggat waktu, dan dapatkan reminder harian otomatis lewat WhatsApp.",
    images: ["/og-image.webp"],
  },
};

import { Toaster } from "@/components/ui/toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={cn("h-full", "antialiased", plusJakartaSans.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col bg-[#eef1f6] text-slate-900 selection:bg-amber-200 selection:text-slate-900 font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
