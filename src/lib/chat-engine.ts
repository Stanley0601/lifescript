import type { Character, StoryStage, ChatMsg, ChatApiResponse } from "@/types";
import { getStagesForCharacter, getEndingsForCharacter } from "./story-stages";
import { getMockResponse, classifyIntent, determineEnding } from "./mock-responses";

export interface ChatState {
  characterId: string;
  stages: StoryStage[];
  currentStageIndex: number;
  turnsInCurrentStage: number;
  displayedMessages: ChatMsg[];
  pendingQueue: ChatMsg[];
  isTyping: boolean;
  isUserTurn: boolean;
  userIntents: string[]; // 记录用户的意图历史，用于决定结局
  isFinished: boolean;
  endingId: string | null;
  suggestedReplies: string[];
}

let msgId = 0;
function makeMsg(from: ChatMsg["from"], text: string, type: ChatMsg["type"] = "text"): ChatMsg {
  return {
    id: `cm-${++msgId}`,
    from,
    type,
    text,
    delay: from === "char" ? 600 + Math.random() * 500 : 200,
    typing: from === "char" ? 400 + Math.random() * 800 : 0,
  };
}

/**
 * 初始化聊天状态
 */
export function initChatState(characterId: string): ChatState {
  const stages = getStagesForCharacter(characterId);
  const firstStage = stages[0];

  return {
    characterId,
    stages,
    currentStageIndex: 0,
    turnsInCurrentStage: 0,
    displayedMessages: [],
    pendingQueue: [...firstStage.openingMessages],
    isTyping: false,
    isUserTurn: false,
    userIntents: [],
    isFinished: false,
    endingId: null,
    suggestedReplies: firstStage.suggestedReplies,
  };
}

/**
 * 处理用户发送的消息
 * 返回更新后的state + 需要展示的新消息队列
 */
export function handleUserMessage(state: ChatState, userText: string): ChatState {
  const userMsg = makeMsg("user", userText);
  const intent = classifyIntent(userText);
  const currentStage = state.stages[state.currentStageIndex];

  // 获取mock回复（后续替换为API调用）
  const response = getMockResponse(
    state.characterId,
    currentStage.id,
    userText,
    state.currentStageIndex,
    state.stages.length,
  );

  // 构建回复消息
  const replyMsgs: ChatMsg[] = response.replies.map((r) =>
    makeMsg("char", r.text)
  );

  const newTurns = state.turnsInCurrentStage + 1;
  const newIntents = [...state.userIntents, intent];

  // 判断是否推进阶段
  const shouldAdvance = response.shouldAdvanceStage || newTurns >= currentStage.turnsInStage;
  const nextIndex = state.currentStageIndex + 1;
  const hasNextStage = nextIndex < state.stages.length;

  if (shouldAdvance && hasNextStage) {
    // 推进到下一阶段
    const nextStage = state.stages[nextIndex];
    return {
      ...state,
      currentStageIndex: nextIndex,
      turnsInCurrentStage: 0,
      displayedMessages: [...state.displayedMessages, userMsg],
      pendingQueue: [...replyMsgs, ...nextStage.openingMessages],
      isUserTurn: false,
      userIntents: newIntents,
      suggestedReplies: nextStage.suggestedReplies,
    };
  }

  if (shouldAdvance && !hasNextStage) {
    // 到达最终阶段→决定结局
    const endingId = determineEnding(state.characterId, newIntents as any[]);
    const { endings } = getEndingsForCharacter(state.characterId);
    const ending = endings.get(endingId);

    // 构建结局的结尾消息
    const epilogueMessages = ending
      ? [makeMsg("narrator", `这次聊天，改变了${getCharName(state.characterId)}的选择。`, "narration")]
      : [];

    return {
      ...state,
      turnsInCurrentStage: newTurns,
      displayedMessages: [...state.displayedMessages, userMsg],
      pendingQueue: [...replyMsgs, ...epilogueMessages],
      isUserTurn: false,
      userIntents: newIntents,
      isFinished: true,
      endingId,
    };
  }

  // 不推进，继续当前阶段
  return {
    ...state,
    turnsInCurrentStage: newTurns,
    displayedMessages: [...state.displayedMessages, userMsg],
    pendingQueue: replyMsgs,
    isUserTurn: false,
    userIntents: newIntents,
  };
}

function getCharName(id: string): string {
  const map: Record<string, string> = { xiaoyu: "林小宇", haoran: "陈浩然", momo: "苏默默" };
  return map[id] || "";
}
