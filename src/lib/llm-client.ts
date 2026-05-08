/**
 * 客户端直连 LLM（用于静态部署，无需服务端 API Route）
 */

import { buildSystemPrompt } from "./prompts";
import { buildMoodPromptBlock, type MoodState } from "./mood-engine";
import { getCharacter } from "./characters";
import { getStagesForCharacter } from "./story-stages";
import type { ChatApiResponse, UserProfile, InterestTopic } from "@/types";
import type { ChatSummary } from "./memory";

const API_KEY = "sk-379bfe5879e242a493487bdc4dc33fdf";
const BASE_URL = "https://api.deepseek.com/v1";
const MODEL = "deepseek-chat";

export async function callLLMDirect(params: {
  characterId: string;
  stageId: string;
  history: { role: "user" | "assistant"; content: string }[];
  userMessage: string;
  userProfile?: UserProfile | null;
  chatSummary?: ChatSummary | null;
  mood?: MoodState | null;
}): Promise<ChatApiResponse | null> {
  const character = getCharacter(params.characterId);
  const stage = getStagesForCharacter(params.characterId).find(s => s.id === params.stageId);

  if (!character || !stage) return null;

  let systemPrompt = buildSystemPrompt(
    character,
    stage,
    params.userProfile || null,
    undefined,
    params.chatSummary || null,
  );

  if (params.mood) {
    systemPrompt += "\n\n" + buildMoodPromptBlock(params.mood);
  }

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          ...params.history,
          { role: "user", content: params.userMessage },
        ],
        temperature: 0.85,
        max_tokens: 300,
      }),
    });

    const data = await response.json();

    if (!response.ok) return null;

    const content: string = data.choices?.[0]?.message?.content || "嗯嗯";
    const shouldAdvance = content.includes("[NEXT]");
    const cleanContent = content.replace("[NEXT]", "").trim();

    // 分割消息
    let parts: string[];
    if (cleanContent.includes("|")) {
      parts = cleanContent.split("|").map((s: string) => s.trim()).filter(Boolean);
    } else if (cleanContent.includes("\n")) {
      parts = cleanContent.split("\n").map((s: string) => s.trim()).filter(Boolean);
    } else if (cleanContent.length > 20) {
      const segments = cleanContent.split(/(?<=[，。！？\s])/);
      parts = [];
      let buf = "";
      for (const seg of segments) {
        if ((buf + seg).length > 18 && buf.length > 0) {
          parts.push(buf.trim());
          buf = seg;
        } else {
          buf += seg;
        }
      }
      if (buf.trim()) parts.push(buf.trim());
      if (parts.length === 0) parts = [cleanContent];
    } else {
      parts = [cleanContent];
    }

    // 过滤图片描述
    parts = parts
      .map(p => p.replace(/\[图片[：:].*?\]/g, "").replace(/\[照片.*?\]/g, "").replace(/（发了.*?）/g, "").trim())
      .filter(p => p.length > 0);
    if (parts.length === 0) parts = ["嗯嗯"];

    return {
      replies: parts.map((text, i) => ({ text, delay: 600 + i * 400 })),
      emotion: stage.emotion,
      shouldAdvanceStage: shouldAdvance,
      nextStageId: stage.nextStageId,
      suggestedReplies: stage.suggestedReplies,
    };
  } catch {
    return null;
  }
}
