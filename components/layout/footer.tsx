import { Container } from "./container";
import { BeadIcon } from "./bead-icon";

const footerLinks = {
  产品: ["功能介绍", "在线生成", "示例展示", "导出图纸"],
  资源: ["拼豆入门指南", "配色对照表", "常见问题", "博客"],
  关于: ["关于我们", "微博", "GitHub", "联系我们"],
};

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-[#F8F8FA]">
      <Container>
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-3">
                <BeadIcon className="size-6" />
                <span className="font-semibold text-[15px] tracking-tight text-[#1A1A1A]">
                  BeadCraft
                </span>
              </div>
              <p className="text-sm text-[#6B6B6B] leading-relaxed max-w-[200px]">
                将任意图片转化为拼豆图纸，AI 智能配色，一键导出高清网格。
              </p>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-sm font-medium text-[#1A1A1A] mb-3">{title}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-6 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#9B9B9B]">
              &copy; {new Date().getFullYear()} BeadCraft. 保留所有权利。
            </p>
            <p className="text-xs text-[#9B9B9B]">
              基于 Next.js 构建 &middot; Canvas API &middot; 46 色拼豆色库
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
