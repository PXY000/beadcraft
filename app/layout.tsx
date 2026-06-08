import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BeadCraft — 免费拼豆图纸生成器 | 图片转拼豆像素画",
  description:
    "上传任意图片，自动转换成拼豆图纸。智能配色匹配、像素化处理、网格生成、颜色统计、高清导出。免费开源，无需注册。",
  keywords: [
    "拼豆",
    "拼豆图纸",
    "拼豆生成器",
    "像素画",
    "perler bead",
    "拼豆图案",
    "免费拼豆",
    "开源拼豆",
    "图片转拼豆",
  ],
  openGraph: {
    title: "BeadCraft — 免费拼豆图纸生成器",
    description: "上传任意图片，AI 自动转换成拼豆图纸，支持46色精准匹配。",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BeadCraft — 免费拼豆图纸生成器",
    description: "上传任意图片，AI 自动转换成拼豆图纸，支持46色精准匹配。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-[#06060B] text-[#1A1A1A] font-sans grain-bg">
        <TooltipProvider delay={200}>{children}</TooltipProvider>
      </body>
    </html>
  );
}
