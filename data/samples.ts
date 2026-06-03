import type { Sample } from "@/lib/types";

export const samples: Sample[] = [
  {
    id: "cat",
    title: "猫咪头像",
    description: "可爱橘猫脸部特写，暖色调拼豆还原毛色层次，适合入门级小尺寸作品。",
    pixelSize: 48,
    beadCount: 912,
    tags: ["cat", "animal"],
    image: "/samples/猫咪.png",
  },
  {
    id: "anime",
    title: "动漫角色",
    description: "经典动漫人物像素化，高对比度色彩边界清晰，中等难度适合进阶玩家。",
    pixelSize: 48,
    beadCount: 1104,
    tags: ["anime", "character"],
    image: "/samples/动漫.png",
  },
  {
    id: "sports-car",
    title: "跑车侧面",
    description: "流线型跑车轮廓，金属质感配色，大尺寸高清图纸适合大幅拼豆作品。",
    pixelSize: 64,
    beadCount: 1856,
    tags: ["car", "vehicle"],
    image: "/samples/跑车.png",
  },
];
