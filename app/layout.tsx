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
  title: "NARA — Papan Tugas",
  description: "Papan submission tugas kuliah Nara",
};

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
      </body>
    </html>
  );
}
