"use client";

import { Container } from "@/components/layout/container";
import { ArrowDown, Sparkles, Grid3X3, Palette, Download } from "lucide-react";
import { motion } from "framer-motion";
import DecryptedText from "@/components/react-bits/decrypted-text";
import BeadParticles from "@/components/react-bits/bead-particles";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 sm:pt-36 sm:pb-28 bg-[#06060B]">
      {/* Bead particle background */}
      <BeadParticles particleCount={100} />

      {/* Subtle radial gradient vignette */}
      <div className="absolute inset-0 -z-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse, rgba(94,106,210,0.04) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,107,107,0.03) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse, rgba(48,204,204,0.03) 0%, transparent 70%)",
          }}
        />
      </div>

      <Container size="narrow">
        <div className="text-center relative z-10">
          {/* Badge */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] text-white/60 text-xs font-medium mb-8 ring-1 ring-white/[0.08] backdrop-blur-sm"
          >
            <Sparkles className="size-3 text-[#5E6AD2]" />
            免费开源 · 无需注册
          </motion.div>

          {/* Main headline — DecryptedText */}
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mb-4"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
              <DecryptedText
                text="BeadCraft"
                speed={60}
                maxIterations={8}
                animateOn="view"
                parentClassName="text-white"
                className="text-white"
                encryptedClassName="text-white/25"
              />
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-xl sm:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#5E6AD2] via-[#9373EE] to-[#FF6B6B]"
          >
            上传任意图片，秒变拼豆图纸
          </motion.p>

          {/* Subtitle */}
          <motion.p
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-5 text-sm sm:text-base text-white/40 max-w-lg mx-auto leading-relaxed"
          >
            上传照片，自动匹配真实拼豆颜色，生成带坐标编号的正规图纸。
            全部在浏览器本地完成，无需上传服务器，完全免费。
          </motion.p>

          {/* CTA */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <a
              href="#generator"
              className="group relative inline-flex items-center gap-2 h-12 px-7 rounded-xl bg-white text-[#0a0a0a] text-sm font-semibold hover:bg-white/90 transition-all shadow-[0_0_40px_-8px_rgba(94,106,210,0.4)] hover:shadow-[0_0_50px_-4px_rgba(94,106,210,0.6)]"
            >
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#5E6AD2] via-[#9373EE] to-[#FF6B6B] opacity-0 group-hover:opacity-[0.06] transition-opacity" />
              开始创作
              <ArrowDown className="size-4" />
            </a>
            <a
              href="#showcase"
              className="inline-flex items-center gap-2 h-12 px-7 rounded-xl text-sm font-medium text-white/50 hover:text-white/80 transition-all hover:bg-white/[0.04]"
            >
              查看示例
            </a>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            custom={5}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-14 flex flex-wrap items-center justify-center gap-2"
          >
            {[
              { icon: Grid3X3, label: "11 种网格 + 自定义" },
              { icon: Palette, label: "221 色 5 品牌" },
              { icon: Download, label: "PNG 高清导出" },
              { icon: Sparkles, label: "CIEDE2000 算法" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] ring-1 ring-white/[0.06] text-xs font-medium text-white/50 backdrop-blur-sm"
              >
                <Icon className="size-3 opacity-60" />
                {label}
              </div>
            ))}
          </motion.div>

          {/* Bead pattern — colorful bead dots */}
          <motion.div
            custom={6}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-16 flex justify-center"
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
    0.95, 0.45, 0.70, 1.0, 0.35, 0.80, 0.55, 0.90, 0.60, 0.40, 0.85, 0.75,
    0.50, 0.92, 0.65, 0.85, 0.88, 0.42, 0.72, 0.78, 0.38, 0.68, 0.58, 0.82,
    0.62, 0.45, 0.76, 0.94, 0.48, 0.70, 0.52, 0.86, 0.56, 0.44, 0.74, 0.90,
    0.32, 0.78, 0.50, 0.96, 0.54, 0.40, 0.80, 0.92, 0.36, 0.66, 0.46, 0.88,
    0.58, 0.42, 0.70, 0.84, 0.30, 0.76, 0.48, 0.94, 0.64, 0.38, 0.72, 0.82,
    0.44, 0.90, 0.52, 0.86,
  ];

  const colors = [
    "#5E6AD2", "#9373EE", "#FF6B6B", "#FFB300",
    "#2EA244", "#4371C7", "#EF3E6F", "#F98421",
    "#784198", "#30CCCC", "#C71585", "#77C74A",
    "#FEE434", "#D4AF37", "#FFFFFF", "#5E6AD2",
  ];

  return (
    <div className="grid grid-cols-8 gap-2">
      {Array.from({ length: 64 }).map((_, i) => (
        <motion.div
          key={i}
          className="size-5 sm:size-6 rounded-full"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: opacities[i],
            scale: 1,
          }}
          transition={{
            delay: 0.8 + i * 0.025,
            duration: 0.35,
            ease: "easeOut",
          }}
          style={{
            backgroundColor: colors[i % colors.length],
            boxShadow: `0 0 8px -2px ${colors[i % colors.length]}66`,
          }}
        />
      ))}
    </div>
  );
}
