import { NextRequest, NextResponse } from "next/server";
import type { ChatApiRequest, ChatApiResponse } from "@/types";

/**
 * POST /api/chat
 * 
 * LLM对话接口 —— 当前返回mock数据
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

    // 如果配置了API Key，调用真实LLM
    if (API_KEY) {
      return await callLLM(body);
    }

    // 否则返回提示
    return NextResponse.json({
      replies: [{ text: "（LLM API未配置，使用本地mock模式）", delay: 500 }],
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
  // TODO: 接入LLM后实现
  // 1. 从 body.characterId + body.stageId 构建 system prompt
  // 2. 从 body.history 构建消息历史
  // 3. 调用 LLM API
  // 4. 解析回复，判断是否需要推进阶段
  // 5. 返回 ChatApiResponse

  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: "TODO: build system prompt" },
        ...body.history,
        { role: "user", content: body.userMessage },
      ],
      temperature: 0.8,
      max_tokens: 300,
    }),
  });

  const data = await response.json();
  const content: string = data.choices?.[0]?.message?.content || "嗯嗯";

  // 解析回复（用 | 分隔多条消息）
  const shouldAdvance = content.includes("[NEXT]");
  const cleanContent = content.replace("[NEXT]", "").trim();
  const parts = cleanContent.split("|").map((s: string) => s.trim()).filter(Boolean);

  return NextResponse.json({
    replies: parts.map((text: string, i: number) => ({
      text,
      delay: 600 + i * 400,
    })),
    emotion: "neutral",
    shouldAdvanceStage: shouldAdvance,
    nextStageId: null,
    suggestedReplies: [],
  } satisfies ChatApiResponse);
}
