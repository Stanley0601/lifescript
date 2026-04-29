import { NextRequest, NextResponse } from "next/server";
import type { ChatApiRequest, ChatApiResponse } from "@/types";
import { getCharacter } from "@/lib/characters";
import { buildSystemPrompt } from "@/lib/prompts";
import { getStagesForCharacter } from "@/lib/story-stages";

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

  const systemPrompt = buildSystemPrompt(
    character,
    stage,
    body.userProfile || null,
    body.realtimeTopics,
  );

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
  const content: string = data.choices?.[0]?.message?.content || "嗯嗯";

  const shouldAdvance = content.includes("[NEXT]");
  const cleanContent = content.replace("[NEXT]", "").trim();
  const parts = cleanContent.split("|").map((s: string) => s.trim()).filter(Boolean);

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
