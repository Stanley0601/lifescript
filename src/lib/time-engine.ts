/**
 * 时间加速引擎
 * 
 * 故事内时间 : 现实时间 = 10 : 1
 * 即故事里过3天 = 现实过0.3天（约7.2小时）
 * 
 * 用法：
 * - 记录"故事里的时间点"（如：3天后角色主动发消息）
 * - 转换为"现实世界的等待时长"
 * - 调度器在对应时间触发事件
 */

/** 时间加速倍率：故事时间/现实时间 */
export const TIME_SCALE = 10;

/** 将故事内的时间间隔转换为现实等待毫秒数 */
export function storyToRealMs(storyMs: number): number {
  return storyMs / TIME_SCALE;
}

/** 故事内"X天后" → 现实等待毫秒 */
export function storyDaysToRealMs(days: number): number {
  const storyMs = days * 24 * 60 * 60 * 1000;
  return storyMs / TIME_SCALE;
}

/** 故事内"X小时后" → 现实等待毫秒 */
export function storyHoursToRealMs(hours: number): number {
  const storyMs = hours * 60 * 60 * 1000;
  return storyMs / TIME_SCALE;
}

/** 格式化现实等待时间为人类可读 */
export function formatRealWait(realMs: number): string {
  const minutes = Math.round(realMs / (60 * 1000));
  if (minutes < 60) return `${minutes}分钟`;
  const hours = Math.round(minutes / 60 * 10) / 10;
  if (hours < 24) return `${hours}小时`;
  const days = Math.round(hours / 24 * 10) / 10;
  return `${days}天`;
}

/**
 * 定时消息调度
 * 存储待发送的主动消息及其触发时间
 */
export interface ScheduledMessage {
  id: string;
  characterId: string;
  storyDelay: string;       // "3天后" / "半天后" 等描述
  realTriggerAt: number;    // 现实世界的触发时间戳 (Date.now() + realMs)
  messages: { text: string; from: "char" }[];
  triggered: boolean;
}

/** 检查哪些消息已到触发时间 */
export function getTriggeredMessages(scheduled: ScheduledMessage[]): ScheduledMessage[] {
  const now = Date.now();
  return scheduled.filter(s => !s.triggered && now >= s.realTriggerAt);
}

/** 创建一个定时消息 */
export function createScheduledMessage(
  characterId: string,
  storyDelayDays: number,
  storyDelayLabel: string,
  messages: { text: string }[],
): ScheduledMessage {
  const realMs = storyDaysToRealMs(storyDelayDays);
  return {
    id: `sched-${characterId}-${Date.now()}`,
    characterId,
    storyDelay: storyDelayLabel,
    realTriggerAt: Date.now() + realMs,
    messages: messages.map(m => ({ text: m.text, from: "char" as const })),
    triggered: false,
  };
}

/**
 * 预设的剧情节点定时消息
 * 角色在某些关键时刻会主动联系你
 */
export function getStoryScheduledMessages(characterId: string, stageId: string): ScheduledMessage[] {
  const schedules: Record<string, Record<string, { days: number; label: string; msgs: string[] }[]>> = {
    xiaoyu: {
      "xy-intro": [
        { days: 0.5, label: "半天后", msgs: ["对了 我忘了问", "你平时喜欢什么呀 想多了解你一点"] },
      ],
      "xy-dilemma": [
        { days: 1, label: "一天后", msgs: ["在吗！", "今天又去了那个公司", "有点新进展想跟你说"] },
      ],
      "xy-deep": [
        { days: 2, label: "两天后", msgs: ["睡不着", "想了很多你之前说的话", "你说得对…"] },
      ],
    },
    haoran: {
      "hr-intro": [
        { days: 0.3, label: "几小时后", msgs: ["对了 你平时做什么的", "加了你也不太了解你哈哈"] },
      ],
      "hr-dilemma": [
        { days: 1.5, label: "一天半后", msgs: ["兄弟", "今天市场暴跌了", "我人麻了"] },
      ],
      "hr-deep": [
        { days: 3, label: "三天后", msgs: ["跟女朋友摊牌了", "她说让我自己想清楚", "我想清楚了"] },
      ],
    },
    momo: {
      "mm-intro": [
        { days: 0.8, label: "大半天后", msgs: ["嗯…你还在吗", "不好意思又来打扰", "你平时也会有不确定的时候吗"] },
      ],
      "mm-dilemma": [
        { days: 2, label: "两天后", msgs: ["给你看个东西", "我做的那个小app 有500个人想试用了", "有点不敢相信"] },
      ],
      "mm-deep": [
        { days: 3, label: "三天后", msgs: ["想通了一些事", "想跟你说"] },
      ],
    },
  };

  const charSchedules = schedules[characterId]?.[stageId];
  if (!charSchedules) return [];

  return charSchedules.map(s => createScheduledMessage(
    characterId, s.days, s.label, s.msgs.map(text => ({ text }))
  ));
}
