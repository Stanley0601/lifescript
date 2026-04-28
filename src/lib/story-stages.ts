import type { StoryStage, ChatMsg, Ending, EndingComparison } from "@/types";

// ========== 消息辅助 ==========
let _id = 0;
function cm(from: ChatMsg["from"], text: string, type: ChatMsg["type"] = "text", delay = 700, typing = 600): ChatMsg {
  return { id: `s${++_id}`, from, type, text, delay, typing: from === "char" ? typing : 0 };
}
function nar(text: string): ChatMsg {
  return cm("narrator", text, "narration", 1000, 0);
}
function sysMsg(text: string): ChatMsg {
  return cm("system", text, "system", 600, 0);
}
function timeSkip(text: string): ChatMsg {
  return cm("system", text, "timeskip", 1500, 0);
}

// =================================================================
// 林小宇的剧情阶段
// =================================================================
export function getXiaoyuStages(): StoryStage[] {
  _id = 0;
  return [
    {
      id: "xy-intro",
      description: "刚加好友，准备倾诉",
      emotion: "焦虑、忐忑",
      advanceTrigger: "用户做出了任何实质性回应（安慰/追问/评论）",
      nextStageId: "xy-dilemma",
      openingMessages: [
        sysMsg("林小宇 请求添加你为好友"),
        sysMsg("验证消息：听说你人很好 能聊聊吗"),
        sysMsg("—— 已添加好友 ——"),
        cm("char", "嗨！终于通过了", "text", 1500, 800),
        cm("char", "不好意思突然加你😅"),
        cm("char", "我叫林小宇 CS大四的"),
        cm("char", "今天有点崩溃 想找个人说说话"),
        cm("char", "你知道那种感觉吗"),
        cm("char", "所有人都在往前走 就你卡在原地"),
        cm("char", "室友们秋招都搞定了"),
        cm("char", "就我还在纠结😭"),
      ],
      suggestedReplies: ["怎么了 慢慢说", "听着呢 你说", "纠结什么呀"],
      turnsInStage: 2,
    },
    {
      id: "xy-dilemma",
      description: "说出核心困境：保研vs创业公司",
      emotion: "纠结、兴奋又害怕",
      advanceTrigger: "用户表达了对她选择的看法（支持工作/支持保研/中立分析）",
      nextStageId: "xy-deep",
      openingMessages: [
        cm("char", "事情是这样的"),
        cm("char", "我拿到保研名额了 导师方向是NLP"),
        cm("char", "但是！"),
        cm("char", "我偷偷去面了一家AI创业公司"),
        cm("char", "做Agent的 20来个人 CEO超有想法"),
        cm("char", "面试聊了俩小时我都忘了时间"),
        cm("char", "他们给了我产品负责人的offer"),
        cm("char", "所以现在就是"),
        cm("char", "保研 vs 创业公司"),
        cm("char", "啊啊啊怎么办🤯"),
      ],
      suggestedReplies: ["你心里更偏向哪个？", "创业公司听起来挺酷的", "保研也没什么不好啊"],
      turnsInStage: 2,
    },
    {
      id: "xy-deep",
      description: "深入聊内心——家庭压力、自我怀疑、真实渴望",
      emotion: "脆弱、真诚",
      advanceTrigger: "聊了2-3轮后自然推进到决定阶段",
      nextStageId: "xy-decision",
      openingMessages: [
        cm("char", "说实话 面完那天从公司出来"),
        cm("char", "我在地铁上笑了一路"),
        cm("char", "好久好久没有那种感觉了"),
        cm("char", "但是我爸妈已经跟所有亲戚说我要读研了"),
        cm("char", "我妈肯定会哭的"),
        cm("char", "而且创业公司 万一倒了呢"),
      ],
      suggestedReplies: ["你自己内心真正想要什么？", "家人的期望和你的人生 哪个更重要？", "有没有两全的办法？"],
      turnsInStage: 3,
    },
    {
      id: "xy-decision",
      description: "做出决定——根据整体对话倾向",
      emotion: "下定决心",
      advanceTrigger: "自动推进到结局",
      nextStageId: null,
      openingMessages: [
        timeSkip("—— 三天后 ——"),
        cm("char", "！！"),
        cm("char", "我做了决定"),
      ],
      suggestedReplies: ["什么决定！", "说说看", "是什么？"],
      turnsInStage: 1,
      // 结局由chat-engine根据对话历史的整体倾向决定
    },
  ];
}

// =================================================================
// 陈浩然的剧情阶段
// =================================================================
export function getHaoranStages(): StoryStage[] {
  _id = 100;
  return [
    {
      id: "hr-intro",
      description: "深夜加好友，睡不着",
      emotion: "焦躁、亢奋",
      advanceTrigger: "用户做出任何回应",
      nextStageId: "hr-dilemma",
      openingMessages: [
        sysMsg("陈浩然 请求添加你为好友"),
        sysMsg("验证消息：朋友推荐 说你看问题很准"),
        sysMsg("—— 已添加好友 ——"),
        cm("char", "不好意思这么晚", "text", 1500, 800),
        cm("char", "睡不着 脑子一直在转"),
        cm("char", "我叫陈浩然 金融研二"),
        cm("char", "跟朋友做了个量化项目"),
        cm("char", "上个月开始赚钱了 真金白银那种"),
        cm("char", "然后问题就来了"),
      ],
      suggestedReplies: ["什么问题？", "赚钱了不是好事吗", "说说看"],
      turnsInStage: 2,
    },
    {
      id: "hr-dilemma",
      description: "核心困境：全职做项目vs完成学业",
      emotion: "纠结、急迫",
      advanceTrigger: "用户表达了看法",
      nextStageId: "hr-deep",
      openingMessages: [
        cm("char", "合伙人说 窗口期就这一两年"),
        cm("char", "要全职做 规模才能上去"),
        cm("char", "但我开题报告下个月得交"),
        cm("char", "导师已经问了我三次进度"),
        cm("char", "女朋友觉得我疯了"),
        cm("char", "说我一个学金融的 不好好毕业去搞什么量化"),
        cm("char", "但上个月净赚了8万啊"),
        cm("char", "读完研出来月薪可能都没这个数"),
      ],
      suggestedReplies: ["8万确实挺猛的", "但市场不是一直涨的", "女朋友的担心也有道理"],
      turnsInStage: 2,
    },
    {
      id: "hr-deep",
      description: "深入：风险、家庭、关系",
      emotion: "真实、略显脆弱",
      advanceTrigger: "聊到2-3轮后推进",
      nextStageId: "hr-decision",
      openingMessages: [
        cm("char", "我爸是公务员 我妈是老师"),
        cm("char", "在他们的世界里"),
        cm("char", "退学 = 人生完蛋"),
        cm("char", "我理解 但我也知道"),
        cm("char", "如果现在不做 以后会后悔"),
        cm("char", "你说 一辈子能遇到几次这种机会"),
      ],
      suggestedReplies: ["有没有不退学也能做的方案？", "机会以后还会有", "你自己觉得能承受最坏的结果吗？"],
      turnsInStage: 3,
    },
    {
      id: "hr-decision",
      description: "做出决定",
      emotion: "下定决心",
      advanceTrigger: "自动推进",
      nextStageId: null,
      openingMessages: [
        timeSkip("—— 一周后 ——"),
        cm("char", "兄弟"),
        cm("char", "想了一周 做了决定"),
      ],
      suggestedReplies: ["说！", "什么决定", "怎么选的？"],
      turnsInStage: 1,
    },
  ];
}

// =================================================================
// 苏默默的剧情阶段
// =================================================================
export function getMomoStages(): StoryStage[] {
  _id = 200;
  return [
    {
      id: "mm-intro",
      description: "安静地加好友，犹豫了很久",
      emotion: "紧张、不确定",
      advanceTrigger: "用户做出回应",
      nextStageId: "mm-dilemma",
      openingMessages: [
        sysMsg("苏默默 请求添加你为好友"),
        sysMsg("验证消息：你好 看了你的文章 想请教点事"),
        sysMsg("—— 已添加好友 ——"),
        cm("char", "你好", "text", 1500, 500),
        cm("char", "谢谢你通过", "text", 1000, 400),
        cm("char", "想了很久要不要找人聊这个"),
        cm("char", "我学视觉传达 大三"),
        cm("char", "最近有个很困扰我的事"),
        cm("char", "我好像…不那么喜欢设计了"),
      ],
      suggestedReplies: ["怎么突然这么想？", "也许只是一个阶段", "说说看呗"],
      turnsInStage: 2,
    },
    {
      id: "mm-dilemma",
      description: "核心困境：发现了对编程/产品的热爱",
      emotion: "困惑、小兴奋",
      advanceTrigger: "用户表达了看法",
      nextStageId: "mm-deep",
      openingMessages: [
        cm("char", "上学期开始自学编程"),
        cm("char", "做了一个小产品"),
        cm("char", "一个记录情绪的app"),
        cm("char", "虽然很粗糙"),
        cm("char", "但做的时候特别开心"),
        cm("char", "比做任何设计作业都开心"),
        cm("char", "这正常吗……"),
        cm("char", "学了三年突然说不喜欢了 是不是太任性了"),
      ],
      suggestedReplies: ["做的时候开心说明方向对了", "三年的积累不会浪费的", "你觉得自己真正喜欢的是什么？"],
      turnsInStage: 2,
    },
    {
      id: "mm-deep",
      description: "深入：不是非此即彼",
      emotion: "慢慢打开",
      advanceTrigger: "聊2-3轮后推进",
      nextStageId: "mm-decision",
      openingMessages: [
        cm("char", "写代码的时候那种感觉"),
        cm("char", "从无到有创造出一个东西"),
        cm("char", "设计也有创造 但不一样"),
        cm("char", "编程是……写下一行代码 世界就多了一种可能"),
        cm("char", "但转专业来不及了"),
        cm("char", "考研换方向是三跨 基础几乎是零"),
        cm("char", "有时候觉得自己什么都不是"),
      ],
      suggestedReplies: ["设计+代码结合起来不是更强？", "你不需要成为纯程序员", "零基础不代表学不会"],
      turnsInStage: 3,
    },
    {
      id: "mm-decision",
      description: "做出决定",
      emotion: "释然",
      advanceTrigger: "自动推进",
      nextStageId: null,
      openingMessages: [
        timeSkip("—— 一个月后 ——"),
        cm("char", "嗨"),
        cm("char", "跟你说一个事"),
      ],
      suggestedReplies: ["什么事！", "说说看", "好消息吗？"],
      turnsInStage: 1,
    },
  ];
}

// =================================================================
// 结局定义
// =================================================================
export function getEndingsForCharacter(charId: string): { endings: Map<string, Ending>; comparisons: EndingComparison[] } {
  const endings = new Map<string, Ending>();
  let comparisons: EndingComparison[] = [];

  if (charId === "xiaoyu") {
    endings.set("xy-e-job", {
      id: "xy-e-job", title: "勇敢者的奖赏", emoji: "🚀",
      description: "她接了创业公司的offer。妈妈哭了，但最后说了一句「妈只希望你开心」。一年后，公司拿到了A轮。",
      stats: { "幸福": 82, "成长": 95, "稳定": 45, "勇气": 95, "连接": 78 },
      insight: "你没有替她做选择，但你让她敢于承认自己真正想要什么。有时候，一个陌生人的理解比十个亲人的建议更管用。",
    });
    endings.set("xy-e-pg", {
      id: "xy-e-pg", title: "细水长流", emoji: "📚",
      description: "她选了保研。拒offer时，CEO说「门永远为你开着」。一年后workshop paper中了，她发现了一些之前不知道喜欢的东西。",
      stats: { "幸福": 73, "成长": 78, "稳定": 90, "勇气": 55, "连接": 65 },
      insight: "你帮她看到了稳妥选择背后的价值。不是每段路都要轰轰烈烈。",
    });
    endings.set("xy-e-both", {
      id: "xy-e-both", title: "第三种可能", emoji: "✨",
      description: "她和CEO商量：先保研，同时以实习身份加入。导师也同意了。一年后，公司产品上了App Store推荐榜，论文也有了方向。",
      stats: { "幸福": 88, "成长": 92, "稳定": 75, "勇气": 85, "连接": 92 },
      insight: "你没有让她选A或B，而是帮她想到了C。最好的朋友不替你做决定，而是帮你看到更多可能性。",
    });
    comparisons = [
      { endingId: "xy-e-job", title: "勇敢者的奖赏", description: "她去了创业公司", alternateText: "如果你当时支持她追随内心，她会勇敢迈出那一步" },
      { endingId: "xy-e-pg", title: "细水长流", description: "她选了保研", alternateText: "如果你当时建议她求稳，她会安心走学术路" },
      { endingId: "xy-e-both", title: "第三种可能", description: "她找到了两全之策", alternateText: "如果你帮她跳出二选一的框架，她会创造新的路" },
    ];
  }

  if (charId === "haoran") {
    endings.set("hr-e-drop", {
      id: "hr-e-drop", title: "All In", emoji: "🎲",
      description: "他办了休学。中间有两个月亏得心态崩了，但扛过来了。半年后管理规模上了3000万，注册了公司。",
      stats: { "幸福": 78, "成长": 98, "稳定": 30, "勇气": 95, "连接": 72 },
      insight: "你在凌晨两点的一句「去试试」，让他有了跨出去的勇气。年轻时的试错成本，永远比你想的低。",
    });
    endings.set("hr-e-mid", {
      id: "hr-e-mid", title: "两条腿走路", emoji: "⚖️",
      description: "他交了开题报告，项目由学长白天盯，他晚上和周末全力做。累但平衡。半年后规模稳步增长到500万。",
      stats: { "幸福": 80, "成长": 85, "稳定": 72, "勇气": 75, "连接": 82 },
      insight: "你帮他看到了不用全赌一边的可能性。平衡本身就是一种被低估的能力。",
    });
    endings.set("hr-e-stay", {
      id: "hr-e-stay", title: "理性的力量", emoji: "🛡️",
      description: "他暂停了项目，先安心做论文。后来市场回撤了不少。他把经历写成了case study，导师还夸他有实践经验。",
      stats: { "幸福": 73, "成长": 70, "稳定": 95, "勇气": 50, "连接": 65 },
      insight: "你帮他在冲动的时候冷静下来。有时候不做选择也是一种选择——而且是正确的。",
    });
    comparisons = [
      { endingId: "hr-e-drop", title: "All In", description: "他休学创业了", alternateText: "如果你鼓励他冒险，他会选择休学全力一搏" },
      { endingId: "hr-e-mid", title: "两条腿走路", description: "他找到了平衡", alternateText: "如果你帮他想到折中方案，他会学业创业两手抓" },
      { endingId: "hr-e-stay", title: "理性的力量", description: "他先完成学业", alternateText: "如果你提醒他风险，他会选择先把学位拿到" },
    ];
  }

  if (charId === "momo") {
    endings.set("mm-e-switch", {
      id: "mm-e-switch", title: "破茧", emoji: "🦋",
      description: "她考研报了交互设计方向。八个月，每天五点起来背英语。出分那天——她过线了。浙大。",
      stats: { "幸福": 85, "成长": 95, "稳定": 50, "勇气": 95, "连接": 72 },
      insight: "你让她相信了「喜欢就是最好的理由」。三年的设计基础不是沉没成本，而是她与众不同的起点。",
    });
    endings.set("mm-e-indie", {
      id: "mm-e-indie", title: "独立创造者", emoji: "🎨",
      description: "她把情绪app放到了小红书上介绍，500多人想试用。后来被一个投资人看到了。设计+代码，1+1>2。",
      stats: { "幸福": 88, "成长": 90, "稳定": 58, "勇气": 82, "连接": 88 },
      insight: "你帮她发现了自己最独特的定位——不是设计师也不是程序员，而是两者结合的创造者。这比选A或B都强。",
    });
    endings.set("mm-e-stay", {
      id: "mm-e-stay", title: "隐藏技能", emoji: "✏️",
      description: "她留在了设计，但把编程当作秘密武器。毕设主题是「情绪可视化」，导师说：有技术思维的设计师很稀缺。",
      stats: { "幸福": 75, "成长": 75, "稳定": 88, "勇气": 55, "连接": 70 },
      insight: "你帮她在不颠覆现有路径的情况下找到了新的可能。一项隐藏技能，往往比一次彻底转型更持久。",
    });
    comparisons = [
      { endingId: "mm-e-switch", title: "破茧", description: "她跨考了交互设计", alternateText: "如果你鼓励她大胆转方向，她会三跨考研" },
      { endingId: "mm-e-indie", title: "独立创造者", description: "她做了独立产品", alternateText: "如果你帮她看到设计+代码的结合点，她会走独立创造的路" },
      { endingId: "mm-e-stay", title: "隐藏技能", description: "她留在设计，代码当副业", alternateText: "如果你建议她别急着转，编程会成为她的秘密武器" },
    ];
  }

  return { endings, comparisons };
}

// 获取角色的剧情阶段
export function getStagesForCharacter(charId: string): StoryStage[] {
  switch (charId) {
    case "xiaoyu": return getXiaoyuStages();
    case "haoran": return getHaoranStages();
    case "momo": return getMomoStages();
    default: return getXiaoyuStages();
  }
}
