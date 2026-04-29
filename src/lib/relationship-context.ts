import type { FamiliarityStage, RelationshipState } from "@/types";

export function getRelationshipStageLabel(stage?: FamiliarityStage): string {
  if (!stage) return "陌生";
  return stage;
}

export function getRelationshipColor(stage?: FamiliarityStage): string {
  if (stage === "暧昧") return "#ec4899";
  if (stage === "熟络") return "#8b5cf6";
  return "#12b7f5";
}

export function getRelationshipDescription(state?: RelationshipState | null): string {
  if (!state) return "你们刚刚认识，语气会比较礼貌和克制。";
  if (state.stage === "暧昧") {
    return "你们已经不只是普通倾诉对象了，很多关心会开始带上明显的个人指向。";
  }
  if (state.stage === "熟络") {
    return "你们已经逐渐放下客套，会自然分享日常，也会开始互相惦记。";
  }
  return "你们还在试探彼此的边界，回应会更谨慎，但好感已经在慢慢积累。";
}

export function getRelationshipMilestone(state?: RelationshipState | null): string {
  if (!state) return "从一句回应开始。";
  if (state.stage === "暧昧") {
    return "你们已经走到‘会下意识惦记对方今天过得怎么样’的阶段。";
  }
  if (state.stage === "熟络") {
    return "你们已经走到‘看到某件小事会想分享给对方’的阶段。";
  }
  return "你们还在‘先成为一个可以放心说话的人’的阶段。";
}

export function getEndingRelationshipLine(name: string, state?: RelationshipState | null): string {
  if (!state) return `这一次，你陪${name}走到了答案前。`;
  if (state.stage === "暧昧") {
    return `这一次，你和${name}之间留下来的，不只是一个结局，还有一种已经开始偏向彼此的关系。`;
  }
  if (state.stage === "熟络") {
    return `这一次，你不只是影响了${name}的选择，也成了${name}愿意继续聊下去的人。`;
  }
  return `这一次，你陪${name}把一些原本说不出口的话，说了出来。`;
}

export function getRelationshipMomentReason(state?: RelationshipState | null): string {
  if (!state) return "现在更适合停下来看看TA今天的情绪。";
  if (state.stage === "暧昧") return "关系升温后，你更可能在这些细节上停留更久。";
  if (state.stage === "熟络") return "熟起来之后，TA的日常会更像在主动对你展开。";
  return "刚认识时，最容易被这些能看见真实情绪的瞬间打动。";
}

export function buildRelationshipPreview(state?: RelationshipState | null): string {
  if (!state) return "关系还在起点。";
  if (state.stage === "暧昧") return "会互相提醒天气、晚睡和情绪起伏。";
  if (state.stage === "熟络") return "聊天会越来越像朋友之间的自然来回。";
  return "还带点生疏，但已经开始愿意说真话。";
}
