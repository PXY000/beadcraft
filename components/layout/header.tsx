"use client";

import Link from "next/link";
import { Container } from "./container";
import { BeadIcon } from "./bead-icon";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#06060B]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#06060B]/60">
      <Container>
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <BeadIcon className="size-7" />
            <span className="font-semibold text-[15px] tracking-tight text-white">
              BeadCraft
            </span>
          </Link>
          <nav className="hidden sm:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              功能介绍
            </a>
            <a
              href="#generator"
              className="text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              在线生成
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="#generator"
              className="inline-flex items-center h-8 px-3.5 text-sm font-medium rounded-lg bg-white text-[#0a0a0a] hover:bg-white/90 transition-colors"
            >
              开始创作
            </a>
          </div>
        </div>
      </Container>
    </header>
  );
}
