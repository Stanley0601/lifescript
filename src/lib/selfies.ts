/**
 * 角色自拍/照片系统
 * 每个角色有多张不同场景的照片，用户要求时随机发一张
 */

export interface CharSelfie {
  url: string;
  scene: string; // 场景描述（内部用）
}

const SELFIE_POOL: Record<string, CharSelfie[]> = {
  xiaoyu: [
    { url: "/avatars/xiaoyu.png", scene: "宿舍自拍" },
    { url: "/selfies/xiaoyu-library.png", scene: "图书馆" },
  ],
  haoran: [
    { url: "/avatars/haoran.png", scene: "咖啡厅" },
    { url: "/selfies/haoran-night.png", scene: "深夜工作" },
  ],
  momo: [
    { url: "/avatars/momo.png", scene: "画室" },
    { url: "/selfies/momo-cafe.png", scene: "咖啡厅" },
  ],
};

/** 随机获取一张角色自拍 */
export function getRandomSelfie(characterId: string): string {
  const pool = SELFIE_POOL[characterId];
  if (!pool || pool.length === 0) return `/avatars/${characterId}.png`;
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx].url;
}
