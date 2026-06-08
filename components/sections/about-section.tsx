"use client";

import { Container } from "@/components/layout/container";
import { Heart, Mail } from "lucide-react";
import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-[#06060B]">
      <Container size="narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Heart icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.4, ease: "backOut" }}
            className="inline-flex items-center justify-center size-16 rounded-2xl bg-gradient-to-br from-[#FF6B6B] to-[#EF3E6F] mb-6 shadow-[0_8px_30px_-8px_rgba(255,107,107,0.35)]"
          >
            <Heart className="size-8 text-white" fill="currentColor" />
          </motion.div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4">
            为女朋友而做的拼豆工具
          </h2>

          <p className="text-[15px] text-white/50 leading-relaxed max-w-lg mx-auto mb-3">
            女朋友喜欢拼豆，每次找图纸都要在各种 App
            和小程序之间来回切换，要么色号对不上，要么导出不够清晰。
          </p>
          <p className="text-[15px] text-white/50 leading-relaxed max-w-lg mx-auto mb-3">
            于是干脆自己写了一个 — 上传照片，自动匹配 5 个品牌 221
            种真实色号，生成带坐标和编号的正规图纸。
          </p>
          <p className="text-[15px] text-white/50 leading-relaxed max-w-lg mx-auto">
            希望能让她的拼豆创作更轻松一点 ❤️
          </p>
        </motion.div>

        {/* Bottom bar: open source + contact */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-12 pt-8 border-t border-white/[0.06]"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-white/45">
            <span>
              完全免费 · 开源（MIT）· 数据不上传服务器
            </span>
            <a
              href="https://github.com/PXY000/beadcraft"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#5E6AD2] hover:text-[#4F5AC0] transition-colors font-medium"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </a>
            <a
              href="mailto:2939177020@qq.com"
              className="inline-flex items-center gap-1.5 text-[#5E6AD2] hover:text-[#4F5AC0] transition-colors font-medium"
            >
              <Mail className="size-4" />
              2939177020@qq.com
            </a>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
