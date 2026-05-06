import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.LLM_API_KEY;
const BASE_URL = process.env.LLM_BASE_URL || "https://api.deepseek.com/v1";
const MODEL = process.env.LLM_MODEL || "deepseek-chat";

export async function POST(request: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json({ error: "No API key" }, { status: 500 });
  }

  try {
    const { characterName, transcript, previousContext } = await request.json();

    const prompt = `你是一个对话记忆助手。请根据以下对话记录生成一份简洁的记忆摘要。
${previousContext || ""}

最近的对话记录：
${transcript}

请用JSON格式回复，包含：
- summary：一段话概括这次聊天的核心内容（50字以内）
- keyTopics：聊了哪些话题（数组，3-5个关键词）
- userAttitude：用户对${characterName}的态度倾向（"鼓励"/"中立"/"质疑"/"关心"中选一个）

只回复JSON，不要其他内容。`;

    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 200,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // 尝试解析JSON
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json(parsed);
      }
    } catch {
      // JSON解析失败，用原文作为摘要
    }

    return NextResponse.json({
      summary: content.slice(0, 80),
      keyTopics: [],
      userAttitude: "中立",
    });
  } catch (error) {
    console.error("Summary API error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
