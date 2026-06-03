# 🎨 BeadCraft — AI 拼豆图纸生成器

上传任意图片，AI 自动转换成拼豆图纸。智能配色匹配、像素化处理、网格生成、颜色统计、高清导出。全部在浏览器本地完成，无需上传服务器。

## ✨ 功能特点

- **AI 智能像素化** — 支持 16×16、32×32、48×48、64×64 四种分辨率，最近邻缩放保持锐利
- **精准配色匹配** — 感知加权RGB距离算法，从46色官方拼豆色库中自动匹配最佳颜色
- **智能图像优化** — 中值滤波降噪 + Unsharp Mask 边缘增强，照片也能出好效果
- **实时预览** — 圆形/方形/圆角方形三种拼豆形状，网格线和编号可选显示
- **颜色统计** — 每种颜色的用量一目了然，方便提前准备拼豆材料
- **高清导出** — 一键下载高分辨率 PNG 图纸，可选附带色标图例和统计摘要

## 🚀 快速开始

```bash
npm install
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。

## 🛠️ 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS v4
- **组件库**: shadcn/ui v4
- **动画**: Framer Motion
- **图像处理**: HTML Canvas API（纯前端，无后端）
- **图标**: Lucide React

## 📁 项目结构

```
app/                  # Next.js App Router
components/
  layout/             # Header, Footer, Container
  sections/           # Hero, Features, Generator, Showcase, CTA
  generator/          # 图片上传、画布、参数控制、统计、导出
  ui/                 # shadcn/ui 基础组件
lib/
  types.ts            # TypeScript 类型定义
  bead-library.ts     # 46 色拼豆颜色库
  color-matcher.ts    # 加权 RGB 欧几里得距离配色算法
  canvas-pipeline.ts  # 完整图像处理管线
  canvas-operations/  # 加载、像素化、配色、渲染、优化、导出
  statistics.ts       # 颜色统计引擎
hooks/                # React Hooks（useReducer 状态管理 + 图片上传）
data/samples.ts       # 示例展示数据
```

## 🎯 工作流程

1. **上传** — 拖拽或点击上传 JPG/PNG/WEBP 图片
2. **裁剪** — 自动居中裁剪为正方形
3. **优化**（可选）— 中值滤波 + 反锐化掩模，提升照片类素材效果
4. **像素化** — 最近邻插值缩放到目标网格尺寸
5. **配色** — 每个像素匹配到最近的真实拼豆颜色
6. **渲染** — 在 Canvas 上绘制可配置的拼豆网格
7. **导出** — 高 DPI 离屏渲染，触发 PNG 下载

## 📦 构建与部署

```bash
npm run build    # 生产环境构建
npm start        # 启动生产服务器
```

可直接部署到 Vercel、Netlify 或任意静态托管平台。

## 🎨 拼豆颜色库

收录 46 种官方 Perler 拼豆配色，涵盖：中性色、红色系、橙色系、黄色系、绿色系、蓝色系、紫色系、粉色系、棕色系、特殊色（金属金/银）。

## 📄 许可证

MIT
