"use client";

import Image from "next/image";
import { USER_AVATAR, QQ_BG } from "@/lib/constants";

export default function MyProfileTab() {
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
        <div className="py-3.5 flex items-center justify-between border-b border-[#f0f0f0]">
          <span className="text-[15px] text-[#333]">{"\u{1F3AC}"} 关于人生剧本</span>
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M1 1L7 7L1 13" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </div>
        <div className="py-3.5 flex items-center justify-between border-b border-[#f0f0f0]">
          <span className="text-[15px] text-[#333]">{"\u2764\uFE0F"} 腾讯PCG AI产品创意大赛</span>
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M1 1L7 7L1 13" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </div>
      </div>

      <div className="mt-4 text-center text-[12px] text-[#ccc] pb-8">
        <p>「人生剧本」LifeScript v5</p>
        <p>QQ社交 · AI生命体验伙伴</p>
      </div>
    </div>
  );
}
