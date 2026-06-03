"use client";

import { useState } from "react";
import { Container } from "./container";
import { BeadIcon } from "./bead-icon";
import { Mail, X } from "lucide-react";

export function Footer() {
  const [showEmail, setShowEmail] = useState(false);

  return (
    <footer className="border-t border-black/5 bg-[#F8F8FA]">
      <Container>
        <div className="py-10 sm:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <BeadIcon className="size-6" />
              <span className="font-semibold text-[15px] tracking-tight text-[#1A1A1A]">
                BeadCraft
              </span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-5">
              <a
                href="https://beadcraft.online"
                className="text-sm text-[#5E6AD2] hover:text-[#4F5AC0] transition-colors"
              >
                beadcraft.online
              </a>
              <a
                href="https://github.com/PXY000/beadcraft"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
              >
                GitHub
              </a>
              <button
                onClick={() => setShowEmail(true)}
                className="flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
              >
                <Mail className="size-4" />
                联系我
              </button>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-black/5">
            <p className="text-xs text-[#9B9B9B]">
              &copy; {new Date().getFullYear()} BeadCraft &mdash; 免费开源的拼豆图纸生成工具 · MIT License
            </p>
          </div>
        </div>
      </Container>

      {/* Email popup */}
      {showEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-lg ring-1 ring-black/5 p-6 mx-4 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#1A1A1A]">联系方式</h3>
              <button
                onClick={() => setShowEmail(false)}
                className="size-7 rounded-lg flex items-center justify-center text-[#9B9B9B] hover:bg-[#F0F0F4] hover:text-[#1A1A1A] transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F8F8FA]">
              <Mail className="size-5 text-[#5E6AD2]" />
              <a
                href="mailto:2939177020@qq.com"
                className="text-sm font-medium text-[#5E6AD2] hover:underline"
              >
                2939177020@qq.com
              </a>
            </div>
            <p className="text-xs text-[#9B9B9B] mt-3">
              品牌色号指正、功能建议、问题反馈，欢迎来信。
            </p>
          </div>
        </div>
      )}
    </footer>
  );
}
