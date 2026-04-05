import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "아현 재정 관리",
  description: "두나미스 교회 아현부 재정 관리 시스템",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${geist.className} bg-gray-50 min-h-screen`}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
