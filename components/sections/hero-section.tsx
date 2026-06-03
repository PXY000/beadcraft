"use client";

import { Container } from "@/components/layout/container";
import { ArrowDown, Sparkles, Grid3X3, Palette, Download } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-24">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#5E6AD2]/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-[#FF6B6B]/3 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-[#30CCCC]/3 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <Container size="narrow">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5E6AD2]/8 text-[#5E6AD2] text-xs font-medium mb-6 ring-1 ring-[#5E6AD2]/10"
          >
            <Sparkles className="size-3" />
            AI 驱动的拼豆图纸生成器
          </motion.div>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1A1A1A] leading-[1.08]"
          >
            上传任意图片
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5E6AD2] via-[#9373EE] to-[#FF6B6B]">
              秒变拼豆图纸
            </span>
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-5 text-base sm:text-lg text-[#6B6B6B] max-w-lg mx-auto leading-relaxed"
          >
            上传照片，选择网格尺寸，自动匹配真实拼豆颜色，生成带颜色统计的图纸，
            一键导出高清 PNG —— 全部在浏览器内完成。
          </motion.p>

          {/* CTA */}
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <a
              href="#generator"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-[#1A1A1A] text-white text-sm font-medium hover:bg-[#333] transition-colors shadow-sm"
            >
              开始创作
              <ArrowDown className="size-4" />
            </a>
            <a
              href="#showcase"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
            >
              查看示例
            </a>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-12 flex flex-wrap items-center justify-center gap-2"
          >
            {[
              { icon: Grid3X3, label: "11 种网格 + 自定义" },
              { icon: Palette, label: "221 色 5 品牌" },
              { icon: Download, label: "PNG 高清导出" },
              { icon: Sparkles, label: "CIEDE2000 算法" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8F8FA] ring-1 ring-black/5 text-xs font-medium text-[#6B6B6B]"
              >
                <Icon className="size-3" />
                {label}
              </div>
            ))}
          </motion.div>

          {/* Decorative bead pattern */}
          <motion.div
            custom={5}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-14 flex justify-center"
          >
            <BeadPattern />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function BeadPattern() {
  const opacities = [
    0.85, 0.35, 0.60, 0.90, 0.25, 0.70, 0.45, 0.95,
    0.55, 0.30, 0.75, 0.80, 0.40, 0.65, 0.50, 0.88,
    0.92, 0.38, 0.58, 0.82, 0.28, 0.68, 0.48, 0.86,
    0.62, 0.33, 0.72, 0.78, 0.42, 0.52, 0.96, 0.44,
    0.54, 0.36, 0.66, 0.84, 0.32, 0.74, 0.46, 0.90,
    0.56, 0.34, 0.76, 0.88, 0.24, 0.64, 0.95, 0.50,
    0.80, 0.39, 0.55, 0.70, 0.30, 0.85, 0.42, 0.92,
    0.58, 0.36, 0.68, 0.77, 0.45, 0.91, 0.53, 0.87,
  ];

  const colors = [
    "#5E6AD2", "#9373EE", "#FF6B6B", "#FFB300",
    "#2EA244", "#4371C7", "#EF3E6F", "#F98421",
    "#784198", "#30CCCC", "#C71585", "#77C74A",
    "#212121", "#9B9B9B", "#FEE434", "#D4AF37",
  ];

  return (
    <div className="grid grid-cols-8 gap-1.5 opacity-80">
      {Array.from({ length: 64 }).map((_, i) => (
        <motion.div
          key={i}
          className="size-6 sm:size-7 rounded-full shadow-sm"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: opacities[i], scale: 1 }}
          transition={{ delay: 0.6 + i * 0.02, duration: 0.3 }}
          style={{ backgroundColor: colors[i % colors.length] }}
        />
      ))}
    </div>
  );
}
