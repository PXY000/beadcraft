"use client";

import { Container } from "@/components/layout/container";
import { Grid3X3, Palette, Download, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Grid3X3,
    title: "智能像素化",
    description:
      "将任意图片转换为清晰像素画，支持11种预设尺寸加自定义，最近邻插值保持锐利边缘。",
  },
  {
    icon: Palette,
    title: "精准配色匹配",
    description:
      "工业级 CIEDE2000 色差算法，78 种真实 MARD 拼豆颜色，支持多品牌色号，比 RGB 距离准确 2 倍以上。",
  },
  {
    icon: Sparkles,
    title: "智能图像优化",
    description:
      "可选的中值滤波降噪与 Unsharp Mask 边缘增强，让照片类素材也能获得干净利落的拼豆效果。",
  },
  {
    icon: Download,
    title: "高清图纸导出",
    description:
      "一键下载高分辨率 PNG 图纸，可选附带配色图例和统计信息，打印出来就能直接开始拼豆。",
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-[#0A0A0F] border-t border-white/[0.10]">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            拼豆创作，从未如此简单
          </h2>
          <p className="mt-3 text-sm text-white/40 max-w-md mx-auto">
            从照片到图纸只需几秒，不需要任何设计基础
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {features.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={item}
              className="group relative p-6 rounded-2xl bg-white/[0.05] backdrop-blur-xl ring-1 ring-white/[0.12] hover:ring-white/[0.20] hover:bg-white/[0.08] transition-all"
            >
              <div className="size-10 rounded-xl bg-[#5E6AD2]/12 flex items-center justify-center mb-4 group-hover:bg-[#5E6AD2]/20 transition-colors">
                <Icon className="size-5 text-[#5E6AD2]" />
              </div>
              <h3 className="text-sm font-semibold text-white/85 mb-1">
                {title}
              </h3>
              <p className="text-xs text-white/40 leading-relaxed">
                {description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
