import type { ChatMsg, ProactiveInboxEntry, UserProfile } from "@/types";
import { pickTopicForChat } from "./interest-context";

function makeMsg(idPrefix: string, index: number, text: string): ChatMsg {
  return {
    id: `${idPrefix}-${index}`,
    from: "char",
    type: "text",
    text,
    delay: 350 + index * 260,
    typing: 420 + index * 220,
  };
}

function formatTimeLabel(date = new Date()): string {
  return date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function getBaseMessageSet(characterId: string): string[] {
  if (characterId === "xiaoyu") {
    return [
      "我刚刚路过操场 突然有点想找个人说话",
      "你会不会觉得 有时候人表面看着很正常 其实脑子里已经打了八百个结",
    ];
  }

  if (characterId === "haoran") {
    return [
      "这么晚给你发消息好像有点冒昧",
      "但我刚从实验室出来 脑子还在转 现在根本睡不着",
    ];
  }

  return [
    "我刚把电脑合上 结果还是忍不住点开了聊天框",
    "有些想法卡在心里太久了 就会很想随便找个人说一说",
  ];
}

function buildInterestLine(characterId: string, userProfile: UserProfile | null): { text: string; topicId: string; topicTag: UserProfile["interestTags"][number] } | null {
  const tags = userProfile?.interestTags || [];
  if (tags.length === 0) return null;

  const topic = pickTopicForChat(tags, []);
  if (!topic) return null;

  if (characterId === "xiaoyu") {
    return {
      text: `对了 我刚刚还刷到一个话题：${topic.mention}`,
      topicId: topic.id,
      topicTag: topic.tag,
    };
  }

  if (characterId === "haoran") {
    return {
      text: `顺便一提 我刚刷到个东西，${topic.mention}`,
      topicId: topic.id,
      topicTag: topic.tag,
    };
  }

  return {
    text: `刚刚还看到一个东西…${topic.mention}`,
    topicId: topic.id,
    topicTag: topic.tag,
  };
}

export function buildInitialProactiveEntry(characterId: string, userProfile: UserProfile | null): ProactiveInboxEntry {
  const base = getBaseMessageSet(characterId);
  const interestPayload = buildInterestLine(characterId, userProfile);
  const texts = interestPayload ? [base[0], interestPayload.text, base[1]] : base;
  const createdAt = Date.now();
  const idPrefix = `pm-${characterId}-${createdAt}`;

  return {
    id: idPrefix,
    characterId,
    stageId: "first_visit",
    triggerCondition: "first_visit",
    preview: texts[0],
    lastMessageTime: formatTimeLabel(new Date(createdAt)),
    unread: true,
    createdAt,
    messages: texts.map((text, index) => makeMsg(idPrefix, index, text)),
    topicId: interestPayload?.topicId,
    topicTag: interestPayload?.topicTag,
  };
}
