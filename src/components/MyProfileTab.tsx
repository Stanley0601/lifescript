"use client";

import Image from "next/image";
import type { UserProfile } from "@/types";
import { USER_AVATAR, QQ_BG } from "@/lib/constants";
import { getWeatherCareLine } from "@/lib/weather-context";

export default function MyProfileTab({ userProfile, onResetAll }: {
  userProfile?: UserProfile | null;
  onResetAll: () => void;
}) {
  const weatherLine = getWeatherCareLine(userProfile?.city);

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: QQ_BG }}>
      <div className="px-4 py-3 sticky top-0 z-10" style={{ background: "#fafafa", borderBottom: "0.5px solid #e5e5e5" }}>
        <span className="text-[18px] font-semibold text-[#111]">我的</span>
      </div>

      <div className="bg-white px-4 py-4 mt-2 flex items-center gap-4">
        <div className="w-[60px] h-[60px] rounded-xl overflow-hidden">
          <Image src={USER_AVATAR} alt="我" width={60} height={60} className="object-cover" />
        </div>
        <div>
          <p className="text-[17px] font-semibold text-[#111]">旁观者</p>
          <p className="text-[13px] text-[#999]">每一句话都可能改变别人的人生</p>
        </div>
      </div>

      <div className="bg-white mt-2 px-4">
        <div className="py-3.5 border-b border-[#f0f0f0]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[15px] text-[#333]">📍 当前城市</span>
            <span className="text-[14px] text-[#666]">{userProfile?.city || "深圳"}</span>
          </div>
          <p className="text-[12px] text-[#9aa4b2] leading-relaxed">{weatherLine}</p>
        </div>
        <div className="py-3.5 flex items-center justify-between border-b border-[#f0f0f0]">
          <span className="text-[15px] text-[#333]">🏷️ 我的兴趣画像</span>
          <span className="text-[12px] text-[#999]">{userProfile?.interestTags?.join(" / ") || "未设置"}</span>
        </div>
        <div className="py-3.5 flex items-center justify-between border-b border-[#f0f0f0]">
          <span className="text-[15px] text-[#333]">{"\u{1F3AC}"} 关于人生剧本</span>
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M1 1L7 7L1 13" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </div>
        <div className="py-3.5 flex items-center justify-between border-b border-[#f0f0f0]">
          <span className="text-[15px] text-[#333]">{"\u2764\uFE0F"} 腾讯PCG AI产品创意大赛</span>
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M1 1L7 7L1 13" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </div>
      </div>

      <div className="bg-white mt-2 px-4 py-4">
        <button
          onClick={onResetAll}
          className="w-full py-3 rounded-xl text-[14px] font-medium text-[#ff4d4f] bg-[#fff5f5] active:opacity-90"
        >
          重置本地剧情进度与互动记录
        </button>
        <p className="mt-2 text-[12px] text-[#aaa] leading-relaxed">
          会清空本机上的聊天记录、结局进度、点赞评论和当前剧本选择。
        </p>
      </div>

      <div className="mt-4 text-center text-[12px] text-[#ccc] pb-8">
        <p>「人生剧本」LifeScript v5</p>
        <p>QQ社交 · AI生命体验伙伴</p>
      </div>
    </div>
  );
}