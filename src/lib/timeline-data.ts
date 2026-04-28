import type { TimelineEvent } from "@/types";

/**
 * 人生时间线数据
 * 结局后解锁，展示角色人生的关键节点
 */

export const timelineEvents: Record<string, Record<string, TimelineEvent[]>> = {
  // ====== 林小宇 ======
  xiaoyu: {
    "xy-e-job": [
      { id: "xy-t1", characterId: "xiaoyu", time: "大四上学期", title: "收到保研通知", description: "导师方向是NLP，爸妈已经跟亲戚说了", emoji: "\u{1F4E8}", isKeyMoment: false, unlocked: true },
      { id: "xy-t2", characterId: "xiaoyu", time: "大四上·10月", title: "偷偷面试AI公司", description: "面了两小时，从公司出来在地铁上笑了一路", emoji: "\u{1F3E2}", isKeyMoment: true, unlocked: true },
      { id: "xy-t3", characterId: "xiaoyu", time: "大四上·11月", title: "和陌生人聊了聊", description: "有个人让她敢于承认自己真正想要什么", emoji: "\u{1F4AC}", isKeyMoment: true, unlocked: true },
      { id: "xy-t4", characterId: "xiaoyu", time: "大四上·12月", title: "接了Offer", description: "妈妈哭了，但最后说了一句「妈只希望你开心」", emoji: "\u{1F680}", isKeyMoment: true, unlocked: true },
      { id: "xy-t5", characterId: "xiaoyu", time: "毕业一年后", title: "公司拿到A轮", description: "作为早期产品负责人，她找到了热爱的节奏", emoji: "\u{1F31F}", isKeyMoment: false, unlocked: true },
    ],
    "xy-e-pg": [
      { id: "xy-t1", characterId: "xiaoyu", time: "大四上学期", title: "收到保研通知", description: "导师方向是NLP", emoji: "\u{1F4E8}", isKeyMoment: false, unlocked: true },
      { id: "xy-t2", characterId: "xiaoyu", time: "大四上·10月", title: "偷偷面试AI公司", description: "面试很开心，但犹豫了", emoji: "\u{1F3E2}", isKeyMoment: true, unlocked: true },
      { id: "xy-t3", characterId: "xiaoyu", time: "大四上·11月", title: "和陌生人聊了聊", description: "有人帮她看到了稳妥选择背后的价值", emoji: "\u{1F4AC}", isKeyMoment: true, unlocked: true },
      { id: "xy-t4", characterId: "xiaoyu", time: "大四上·12月", title: "选择保研", description: "拒offer时CEO说「门永远为你开着」", emoji: "\u{1F4DA}", isKeyMoment: true, unlocked: true },
      { id: "xy-t5", characterId: "xiaoyu", time: "研一下学期", title: "Workshop Paper中了", description: "发现了一些之前不知道自己喜欢的东西", emoji: "\u{2728}", isKeyMoment: false, unlocked: true },
    ],
    "xy-e-both": [
      { id: "xy-t1", characterId: "xiaoyu", time: "大四上学期", title: "收到保研通知", description: "导师方向是NLP", emoji: "\u{1F4E8}", isKeyMoment: false, unlocked: true },
      { id: "xy-t2", characterId: "xiaoyu", time: "大四上·10月", title: "偷偷面试AI公司", description: "面了两小时，两边都想要", emoji: "\u{1F3E2}", isKeyMoment: true, unlocked: true },
      { id: "xy-t3", characterId: "xiaoyu", time: "大四上·11月", title: "和陌生人聊了聊", description: "有人帮她想到了第三种可能", emoji: "\u{1F4AC}", isKeyMoment: true, unlocked: true },
      { id: "xy-t4", characterId: "xiaoyu", time: "大四上·12月", title: "保研+实习两手抓", description: "和CEO商量：先保研，同时实习加入", emoji: "\u{2728}", isKeyMoment: true, unlocked: true },
      { id: "xy-t5", characterId: "xiaoyu", time: "研一", title: "产品上了App Store推荐", description: "论文方向也找到了，1+1>2", emoji: "\u{1F31F}", isKeyMoment: false, unlocked: true },
    ],
  },

  // ====== 陈浩然 ======
  haoran: {
    "hr-e-drop": [
      { id: "hr-t1", characterId: "haoran", time: "研二上", title: "量化项目开始盈利", description: "上个月净赚8万，合伙人说要All In", emoji: "\u{1F4C8}", isKeyMoment: false, unlocked: true },
      { id: "hr-t2", characterId: "haoran", time: "研二上·11月", title: "导师催论文", description: "开题报告下个月得交，女朋友也在催", emoji: "\u{1F4DD}", isKeyMoment: true, unlocked: true },
      { id: "hr-t3", characterId: "haoran", time: "研二上·12月", title: "凌晨两点和陌生人聊天", description: "有人说「去试试」", emoji: "\u{1F4AC}", isKeyMoment: true, unlocked: true },
      { id: "hr-t4", characterId: "haoran", time: "研二下", title: "办了休学", description: "中间有两个月亏得心态崩了，但扛过来了", emoji: "\u{1F3B2}", isKeyMoment: true, unlocked: true },
      { id: "hr-t5", characterId: "haoran", time: "半年后", title: "管理规模上3000万", description: "注册了公司，正式成为CEO", emoji: "\u{1F680}", isKeyMoment: false, unlocked: true },
    ],
    "hr-e-mid": [
      { id: "hr-t1", characterId: "haoran", time: "研二上", title: "量化项目开始盈利", description: "赚钱了但学业也不能丢", emoji: "\u{1F4C8}", isKeyMoment: false, unlocked: true },
      { id: "hr-t2", characterId: "haoran", time: "研二上·11月", title: "四面楚歌", description: "导师、合伙人、女朋友，三方拉扯", emoji: "\u{1F4DD}", isKeyMoment: true, unlocked: true },
      { id: "hr-t3", characterId: "haoran", time: "研二上·12月", title: "和陌生人深聊", description: "有人帮他看到了不用全赌一边的可能", emoji: "\u{1F4AC}", isKeyMoment: true, unlocked: true },
      { id: "hr-t4", characterId: "haoran", time: "研二下", title: "两条腿走路", description: "交了开题报告，晚上和周末做项目", emoji: "\u{2696}\uFE0F", isKeyMoment: true, unlocked: true },
      { id: "hr-t5", characterId: "haoran", time: "半年后", title: "规模稳步增长到500万", description: "累但平衡，两边都没丢", emoji: "\u{1F31F}", isKeyMoment: false, unlocked: true },
    ],
    "hr-e-stay": [
      { id: "hr-t1", characterId: "haoran", time: "研二上", title: "量化项目开始盈利", description: "但市场随时可能变", emoji: "\u{1F4C8}", isKeyMoment: false, unlocked: true },
      { id: "hr-t2", characterId: "haoran", time: "研二上·11月", title: "纠结退学", description: "冲动和理性拉扯", emoji: "\u{1F4DD}", isKeyMoment: true, unlocked: true },
      { id: "hr-t3", characterId: "haoran", time: "研二上·12月", title: "被陌生人泼了冷水", description: "有人帮他在冲动时冷静下来", emoji: "\u{1F4AC}", isKeyMoment: true, unlocked: true },
      { id: "hr-t4", characterId: "haoran", time: "研二下", title: "暂停项目，专注论文", description: "后来市场果然回撤了不少", emoji: "\u{1F6E1}\uFE0F", isKeyMoment: true, unlocked: true },
      { id: "hr-t5", characterId: "haoran", time: "毕业后", title: "把经历写成Case Study", description: "导师夸他有实践经验，有的赚有的学", emoji: "\u{1F4D6}", isKeyMoment: false, unlocked: true },
    ],
  },

  // ====== 苏默默 ======
  momo: {
    "mm-e-switch": [
      { id: "mm-t1", characterId: "momo", time: "大三上", title: "开始怀疑自己", description: "在画室对着空白画板发呆两小时", emoji: "\u{1F3A8}", isKeyMoment: false, unlocked: true },
      { id: "mm-t2", characterId: "momo", time: "大三上·10月", title: "自学编程做了一个App", description: "记录情绪的小产品，做的时候特别开心", emoji: "\u{1F308}", isKeyMoment: true, unlocked: true },
      { id: "mm-t3", characterId: "momo", time: "大三上·11月", title: "和陌生人说了心里话", description: "有人让她相信「喜欢就是最好的理由」", emoji: "\u{1F4AC}", isKeyMoment: true, unlocked: true },
      { id: "mm-t4", characterId: "momo", time: "大三下", title: "考研报了交互设计", description: "八个月，每天五点起来背英语", emoji: "\u{1F98B}", isKeyMoment: true, unlocked: true },
      { id: "mm-t5", characterId: "momo", time: "出分那天", title: "浙大·过线了", description: "三年的设计基础不是沉没成本，而是独特的起点", emoji: "\u{1F31F}", isKeyMoment: false, unlocked: true },
    ],
    "mm-e-indie": [
      { id: "mm-t1", characterId: "momo", time: "大三上", title: "开始怀疑自己", description: "学了三年但热情在消退", emoji: "\u{1F3A8}", isKeyMoment: false, unlocked: true },
      { id: "mm-t2", characterId: "momo", time: "大三上·10月", title: "做了情绪记录App", description: "设计+代码，发现了结合点", emoji: "\u{1F308}", isKeyMoment: true, unlocked: true },
      { id: "mm-t3", characterId: "momo", time: "大三上·11月", title: "和陌生人聊天", description: "有人帮她发现了自己最独特的定位", emoji: "\u{1F4AC}", isKeyMoment: true, unlocked: true },
      { id: "mm-t4", characterId: "momo", time: "大三下", title: "把App放到小红书", description: "500多人想试用", emoji: "\u{1F3A8}", isKeyMoment: true, unlocked: true },
      { id: "mm-t5", characterId: "momo", time: "大四", title: "被投资人看到了", description: "设计+代码，1+1>2", emoji: "\u{1F31F}", isKeyMoment: false, unlocked: true },
    ],
    "mm-e-stay": [
      { id: "mm-t1", characterId: "momo", time: "大三上", title: "开始怀疑自己", description: "但也许只是一个阶段", emoji: "\u{1F3A8}", isKeyMoment: false, unlocked: true },
      { id: "mm-t2", characterId: "momo", time: "大三上·10月", title: "自学了编程", description: "当作一项新技能", emoji: "\u{1F4BB}", isKeyMoment: true, unlocked: true },
      { id: "mm-t3", characterId: "momo", time: "大三上·11月", title: "和陌生人聊了聊", description: "有人帮她在不颠覆现有路径的前提下找到新可能", emoji: "\u{1F4AC}", isKeyMoment: true, unlocked: true },
      { id: "mm-t4", characterId: "momo", time: "大三下", title: "留在设计，代码当秘密武器", description: "毕设做了「情绪可视化」", emoji: "\u{270F}\uFE0F", isKeyMoment: true, unlocked: true },
      { id: "mm-t5", characterId: "momo", time: "毕业", title: "导师的评价", description: "有技术思维的设计师很稀缺", emoji: "\u{1F31F}", isKeyMoment: false, unlocked: true },
    ],
  },
};

/** 获取某角色某结局的时间线 */
export function getTimeline(characterId: string, endingId: string): TimelineEvent[] {
  return timelineEvents[characterId]?.[endingId] || [];
}
