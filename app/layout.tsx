import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { withBase } from "./base";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 部署地址（GitHub Pages）。本地构建默认使用此值，也可用环境变量覆盖。
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://tornadoPark.github.io/my_library";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "The Quiet Split — Interactive Study",
  description: "一间由阅读区与工作区组成的可交互私人书房。",
  icons: { icon: withBase("/favicon.svg"), shortcut: withBase("/favicon.svg") },
  openGraph: {
    title: "The Quiet Split",
    description: "进入一间由阅读区与工作区组成的可交互私人书房。",
    type: "website",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "The Quiet Split interactive study" }],
  },
  twitter: { card: "summary_large_image", title: "The Quiet Split", description: "Interactive private study", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
