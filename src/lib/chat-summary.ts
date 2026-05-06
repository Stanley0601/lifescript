import type { ChatMsg } from "@/types";
import type { ChatSummary } from "./memory";

/**
 * 调用 LLM 生成对话摘要
 * 在用户退出聊天时调用
 */
export async function generateChatSummary(
  characterId: string,
  characterName: string,
  messages: ChatMsg[],
  existingSummary?: ChatSummary | null,
): Promise<ChatSummary | null> {
  // 只取文本消息
  const textMsgs = messages.filter(m => m.type === "text" && (m.from === "char" || m.from === "user"));
  if (textMsgs.length < 4) return existingSummary || null; // 对话太短不生成

  // 取最近20条构建上下文
  const recent = textMsgs.slice(-20);
  const transcript = recent.map(m => `${m.from === "user" ? "用户" : characterName}：${m.text}`).join("\n");

  const previousContext = existingSummary
    ? `\n\n上次的记忆摘要：${existingSummary.summary}\n上次聊过的话题：${existingSummary.keyTopics.join("、")}`
    : "";

  try {
    const res = await fetch("/api/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ characterId, characterName, transcript, previousContext }),
    });

    if (!res.ok) return existingSummary || null;
    const data = await res.json();
    return {
      characterId,
      summary: data.summary || "",
      keyTopics: data.keyTopics || [],
      userAttitude: data.userAttitude || "中立",
      lastUpdated: Date.now(),
    };
  } catch {
    return existingSummary || null;
  }
}
