"use client";

import Link from "next/link";
import { Container } from "./container";
import { BeadIcon } from "./bead-icon";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <Container>
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <BeadIcon className="size-7" />
            <span className="font-semibold text-[15px] tracking-tight text-[#1A1A1A]">
              BeadCraft
            </span>
          </Link>
          <nav className="hidden sm:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
            >
              功能介绍
            </a>
            <a
              href="#generator"
              className="text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
            >
              在线生成
            </a>
            <a
              href="#showcase"
              className="text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
            >
              示例展示
            </a>
            <a
              href="#about"
              className="text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
            >
              关于
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="#generator"
              className="inline-flex items-center h-8 px-3.5 text-sm font-medium rounded-lg bg-[#1A1A1A] text-white hover:bg-[#333] transition-colors"
            >
              开始创作
            </a>
          </div>
        </div>
      </Container>
    </header>
  );
}
