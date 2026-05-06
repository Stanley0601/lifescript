import { NextRequest, NextResponse } from "next/server";
import type { ChatApiRequest, ChatApiResponse } from "@/types";
import { getCharacter } from "@/lib/characters";
import { buildSystemPrompt } from "@/lib/prompts";
import { getStagesForCharacter } from "@/lib/story-stages";
import { buildMoodPromptBlock } from "@/lib/mood-engine";

/**
 * POST /api/chat
 *
 * LLM对话接口 —— 当前支持真实模型 + fallback
 * 接入API后，这里会调用 DeepSeek/混元/OpenAI
 *
 * 环境变量（.env.local）：
 *   LLM_API_KEY=your-api-key
 *   LLM_BASE_URL=https://api.deepseek.com/v1  (或混元/OpenAI)
 *   LLM_MODEL=deepseek-chat  (或其他模型)
 */

const API_KEY = process.env.LLM_API_KEY;
const BASE_URL = process.env.LLM_BASE_URL || "https://api.deepseek.com/v1";
const MODEL = process.env.LLM_MODEL || "deepseek-chat";

export async function POST(request: NextRequest) {
  try {
    const body: ChatApiRequest = await request.json();

    if (API_KEY) {
      return await callLLM(body);
    }

    return NextResponse.json({
      replies: [{ text: "（LLM API未配置，当前仍使用本地剧情引擎）", delay: 500 }],
      emotion: "neutral",
      shouldAdvanceStage: false,
      nextStageId: null,
      suggestedReplies: [],
    } satisfies ChatApiResponse);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function callLLM(body: ChatApiRequest): Promise<NextResponse> {
  const character = getCharacter(body.characterId);
  const stage = getStagesForCharacter(body.characterId).find(item => item.id === body.stageId);

  if (!character || !stage) {
    return NextResponse.json({ error: "Invalid character or stage" }, { status: 400 });
  }

  let systemPrompt = buildSystemPrompt(
    character,
    stage,
    body.userProfile || null,
    body.realtimeTopics,
    body.chatSummary || null,
  );

  // 注入心情状态
  if (body.mood) {
    const moodBlock = buildMoodPromptBlock({
      current: body.mood.current as "excited" | "happy" | "calm" | "anxious" | "down",
      intensity: body.mood.intensity,
      history: [],
    });
    systemPrompt = systemPrompt + "\n\n" + moodBlock;
  }

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
        ...body.history,
        { role: "user", content: body.userMessage },
      ],
      temperature: 0.85,
      max_tokens: 300,
    }),
  });

  const data = await response.json();
  console.log("[LLM Response]", JSON.stringify(data).slice(0, 500));

  if (!response.ok) {
    console.error("[LLM Error]", data);
    return NextResponse.json({
      replies: [{ text: `API错误: ${data.error?.message || response.status}`, delay: 500 }],
      emotion: "neutral",
      shouldAdvanceStage: false,
      nextStageId: null,
      suggestedReplies: [],
    });
  }

  const content: string = data.choices?.[0]?.message?.content || "嗯嗯";

  const shouldAdvance = content.includes("[NEXT]");
  const cleanContent = content.replace("[NEXT]", "").trim();
  
  // 分割消息：优先用 | 分割，fallback 用换行
  let parts: string[];
  if (cleanContent.includes("|")) {
    parts = cleanContent.split("|").map((s: string) => s.trim()).filter(Boolean);
  } else if (cleanContent.includes("\n")) {
    parts = cleanContent.split("\n").map((s: string) => s.trim()).filter(Boolean);
  } else if (cleanContent.length > 20) {
    // 模型没遵循分割规则，强制按标点拆
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

  // 过滤掉图片描述（LLM有时会幻觉出[图片：xxx]这样的内容）
  parts = parts
    .map(p => p.replace(/\[图片[：:].*?\]/g, "").replace(/\[照片.*?\]/g, "").replace(/（发了.*?）/g, "").trim())
    .filter(p => p.length > 0);
  if (parts.length === 0) parts = ["嗯嗯"];

  return NextResponse.json({
    replies: parts.map((text: string, i: number) => ({
      text,
      delay: 600 + i * 400,
    })),
    emotion: stage.emotion,
    shouldAdvanceStage: shouldAdvance,
    nextStageId: stage.nextStageId,
    suggestedReplies: stage.suggestedReplies,
  } satisfies ChatApiResponse);
}
