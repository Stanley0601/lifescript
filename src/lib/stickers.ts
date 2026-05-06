/**
 * 表情包系统
 * AI角色偶尔发送表情包，让聊天更有真人感
 */

export type StickerEmotion = "happy" | "speechless" | "sad" | "shy" | "surprised" | "tired";

export interface Sticker {
  id: string;
  url: string;
  emotion: StickerEmotion;
  alt: string;
}

export const STICKERS: Sticker[] = [
  { id: "happy", url: "/stickers/happy.png", emotion: "happy", alt: "开心猫猫" },
  { id: "speechless", url: "/stickers/speechless.png", emotion: "speechless", alt: "无语猫猫" },
  { id: "sad", url: "/stickers/sad.png", emotion: "sad", alt: "难过猫猫" },
  { id: "shy", url: "/stickers/shy.png", emotion: "shy", alt: "害羞猫猫" },
  { id: "surprised", url: "/stickers/surprised.png", emotion: "surprised", alt: "惊讶猫猫" },
  { id: "tired", url: "/stickers/tired.png", emotion: "tired", alt: "摆烂猫猫" },
];

/** 根据情绪匹配一个表情包 */
export function getStickerByEmotion(emotion: StickerEmotion): Sticker {
  const match = STICKERS.find(s => s.emotion === emotion);
  return match || STICKERS[0];
}

/** 从 [STICKER:emotion] 标记中提取情绪 */
export function parseStickerTag(text: string): { cleanText: string; stickerEmotion: StickerEmotion | null } {
  const match = text.match(/\[STICKER:(happy|speechless|sad|shy|surprised|tired)\]/);
  if (!match) return { cleanText: text, stickerEmotion: null };
  const cleanText = text.replace(match[0], "").trim();
  return { cleanText, stickerEmotion: match[1] as StickerEmotion };
}
