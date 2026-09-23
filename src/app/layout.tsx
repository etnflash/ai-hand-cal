import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Sans_KR, IBM_Plex_Mono } from "next/font/google";
import { PwaRegister } from "@/components/pwa/PwaRegister";
import { OfflineHint } from "@/components/pwa/OfflineHint";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = IBM_Plex_Sans_KR({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Hand Cal — AI를 손으로 계산하다",
  description:
    "행렬부터 Attention까지, 셀을 직접 채우며 검증되는 손계산 학습 앱",
  applicationName: "Hand Cal",
  appleWebApp: {
    capable: true,
    title: "Hand Cal",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
  manifest: `${base}/manifest.webmanifest`,
  icons: {
    icon: [{ url: `${base}/icon-192.png`, sizes: "192x192", type: "image/png" }],
    apple: [{ url: `${base}/apple-touch-icon.png`, sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b2a32",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <OfflineHint />
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
