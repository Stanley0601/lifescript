// 全局类型定义

export interface Character {
  id: string;
  name: string;
  avatar: string;       // fallback emoji
  avatarImg: string;    // real image path
  avatarBg: string;
  tagline: string;
  identity: string;
  briefIntro: string;
  personality: string;
  speakingStyle: string;
  // v5新增
  age: number;
  school: string;
  major: string;
  signature: string;         // 个性签名（随剧情变化）
  onlineStatus: string;      // "在线" | "在图书馆" | "在逛街" | "睡觉了" 等
  backgroundImg: string;     // 资料页背景图
  qqId: string;              // 模拟QQ号
}

export interface StoryStage {
  id: string;
  description: string;
  emotion: string;
  advanceTrigger: string;
  nextStageId: string | null;
  endingId?: string;
  openingMessages: ChatMsg[];
  suggestedReplies: string[];
  turnsInStage: number;
}

export interface ChatMsg {
  id: string;
  from: "char" | "user" | "narrator" | "system";
  type: "text" | "narration" | "timeskip" | "system";
  text: string;
  delay?: number;
  typing?: number;
}

export interface ChatApiRequest {
  characterId: string;
  stageId: string;
  history: { role: "assistant" | "user"; content: string }[];
  userMessage: string;
}

export interface ChatApiResponse {
  replies: { text: string; delay: number }[];
  emotion: string;
  shouldAdvanceStage: boolean;
  nextStageId: string | null;
  suggestedReplies: string[];
}

export interface Ending {
  id: string;
  title: string;
  emoji: string;
  description: string;
  stats: Record<string, number>;
  insight: string;
}

export interface EndingComparison {
  endingId: string;
  title: string;
  description: string;
  alternateText: string;
}

// ======= v5 新增类型 =======

/** 朋友圈/QQ空间动态 */
export interface MomentPost {
  id: string;
  characterId: string;
  stageId: string;           // 关联的剧情阶段
  text: string;
  imageDesc?: string;        // 配图描述（AI角色"拍的照片"）
  imageEmoji?: string;       // 配图用emoji代替（demo阶段）
  time: string;              // 显示时间 "3小时前" / "昨天 22:15"
  likes: number;
  likedByUser: boolean;
  comments: MomentComment[];
}

export interface MomentComment {
  id: string;
  from: "user" | string;     // "user" 或角色id
  name: string;
  text: string;
}

/** 角色状态 */
export interface CharacterStatus {
  characterId: string;
  onlineStatus: string;      // "在线" | "在图书馆" | 等
  lastMessage: string;       // 消息列表最后一条消息预览
  lastMessageTime: string;   // "刚刚" | "10:32" | "昨天"
  unreadCount: number;
  stageProgress: number;     // 0-4 剧情进度
  hasFinished: boolean;
  endingId?: string;
}

/** 人生时间线节点 */
export interface TimelineEvent {
  id: string;
  characterId: string;
  time: string;              // "大三下学期" | "毕业一年后"
  title: string;
  description: string;
  emoji: string;
  isKeyMoment: boolean;      // 关键转折点高亮
  unlocked: boolean;
}

/** 角色的主动消息（进入时未读的消息） */
export interface ProactiveMessage {
  characterId: string;
  stageId: string;
  messages: ChatMsg[];
  triggerCondition: "first_visit" | "return_visit" | "idle";
}

/** Tab 类型 */
export type TabType = "messages" | "moments" | "profile";

/** App 全局状态 */
export interface AppState {
  currentTab: TabType;
  characterStatuses: Map<string, CharacterStatus>;
  momentPosts: MomentPost[];
  activeCharId: string | null;
  viewingProfile: string | null;
  viewingTimeline: string | null;
}
