// 对话记忆持久化模块
// 使用 localStorage 保存对话历史、角色进度、用户选择

import type { ChatMsg, MomentPost } from "@/types";

const STORAGE_KEY_PREFIX = "lifescript_";

// ============================================
// 通用读写
// ============================================

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch {
    // quota exceeded, silently ignore
  }
}

function removeItem(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY_PREFIX + key);
}

// ============================================
// 对话历史
// ============================================

export interface ChatHistory {
  characterId: string;
  messages: ChatMsg[];
  stageIndex: number;       // 当前处于第几个stage
  turnCount: number;        // 对话轮次
  lastUpdated: number;      // timestamp
}

export function saveChatHistory(characterId: string, data: Omit<ChatHistory, "lastUpdated">): void {
  setItem(`chat_${characterId}`, { ...data, lastUpdated: Date.now() });
}

export function loadChatHistory(characterId: string): ChatHistory | null {
  return getItem<ChatHistory | null>(`chat_${characterId}`, null);
}

export function clearChatHistory(characterId: string): void {
  removeItem(`chat_${characterId}`);
}

// ============================================
// 角色进度
// ============================================

export interface CharacterProgress {
  stageProgress: number;
  hasFinished: boolean;
  endingId?: string;
}

export function saveAllProgress(progress: Record<string, CharacterProgress>): void {
  setItem("progress", progress);
}

export function loadAllProgress(): Record<string, CharacterProgress> | null {
  return getItem<Record<string, CharacterProgress> | null>("progress", null);
}

// ============================================
// 选中的剧本
// ============================================

export function saveSelectedStory(characterId: string): void {
  setItem("selected_story", characterId);
}

export function loadSelectedStory(): string | null {
  return getItem<string | null>("selected_story", null);
}

// ============================================
// 朋友圈状态（点赞、评论）
// ============================================

export interface MomentState {
  likedPosts: string[];           // post IDs the user liked
  comments: Record<string, { id: string; text: string }[]>;  // postId -> user comments
}

export function saveMomentState(state: MomentState): void {
  setItem("moments", state);
}

export function loadMomentState(): MomentState | null {
  return getItem<MomentState | null>("moments", null);
}

// ============================================
// 清除所有数据（重置游戏）
// ============================================

export function clearAllData(): void {
  if (typeof window === "undefined") return;
  const keys = Object.keys(localStorage).filter(k => k.startsWith(STORAGE_KEY_PREFIX));
  keys.forEach(k => localStorage.removeItem(k));
}
