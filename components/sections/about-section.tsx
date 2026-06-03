"use client";

import { Container } from "@/components/layout/container";
import { Heart, Mail, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28">
      <Container size="narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl bg-gradient-to-br from-[#F8F8FA] to-[#F0F0F4] ring-1 ring-black/5 px-8 py-12 sm:px-14 sm:py-16"
        >
          {/* Decorative hearts */}
          <div className="absolute top-6 right-8 sm:right-12 opacity-20">
            <Heart className="size-16 text-[#FF6B6B]" fill="currentColor" />
          </div>
          <div className="absolute bottom-8 left-8 opacity-10">
            <Heart className="size-10 text-[#5E6AD2]" fill="currentColor" />
          </div>

          <div className="relative max-w-lg">
            <div className="flex items-center gap-3 mb-5">
              <div className="size-10 rounded-xl bg-[#FF6B6B]/10 flex items-center justify-center">
                <Heart className="size-5 text-[#FF6B6B]" fill="currentColor" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A]">
                关于 BeadCraft
              </h2>
            </div>

            <p className="text-[15px] text-[#555555] leading-relaxed mb-4">
              女朋友喜欢拼豆，每次找图纸都要在各种 App 和小程序之间来回切换，要么色号对不上，要么导出不够清晰。
            </p>
            <p className="text-[15px] text-[#555555] leading-relaxed mb-4">
              于是干脆自己写了一个 —— 上传照片，自动匹配真实厂家的拼豆色号，生成带坐标和编号的正规图纸。希望能让她的拼豆创作更轻松一点，也希望能帮到同样喜欢拼豆的你。
            </p>
            <p className="text-[15px] text-[#555555] leading-relaxed mb-4">
              BeadCraft 完全免费、代码开源（MIT），不收集任何数据，所有图片处理都在你的浏览器本地完成。欢迎 Star、提 PR、或者直接拿去部署自己的版本。
            </p>

            <div className="mt-8 pt-6 border-t border-black/5 space-y-3">
              <div className="flex items-center gap-2.5">
                <MessageCircle className="size-4 text-[#5E6AD2]" />
                <span className="text-sm text-[#555555]">
                  品牌色号如有错误，或有好建议，欢迎指正！
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="size-4 text-[#5E6AD2]" />
                <a
                  href="mailto:2939177020@qq.com"
                  className="text-sm font-medium text-[#5E6AD2] hover:text-[#4F5AC0] transition-colors"
                >
                  2939177020@qq.com
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
