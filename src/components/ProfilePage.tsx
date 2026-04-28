"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Character, CharacterStatus } from "@/types";
import { QQ_BLUE, QQ_BG } from "@/lib/constants";

export default function ProfilePage({ char, status, onBack, onViewTimeline }: {
  char: Character; status: CharacterStatus; onBack: () => void; onViewTimeline?: () => void;
}) {
  return (
    <motion.div className="h-screen flex flex-col" style={{ background: QQ_BG }}
      initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
      transition={{ type: "tween", duration: 0.25 }}>
      {/* 背景+头像 */}
      <div className="relative" style={{ height: 220 }}>
        <div className="absolute inset-0" style={{
          background: `linear-gradient(135deg, ${char.avatarBg}, ${QQ_BLUE}40)`,
        }} />
        <button onClick={onBack} className="absolute top-12 left-4 z-10 w-8 h-8 rounded-full bg-black/20 flex items-center justify-center">
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7L7 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 flex items-end gap-4">
          <div className="w-[72px] h-[72px] rounded-xl overflow-hidden border-3 border-white shadow-lg">
            <Image src={char.avatarImg} alt={char.name} width={72} height={72} className="object-cover" />
          </div>
          <div className="flex-1 pb-1">
            <h2 className="text-xl font-bold text-white drop-shadow">{char.name}</h2>
            <p className="text-[13px] text-white/80 drop-shadow">{char.signature}</p>
          </div>
        </div>
      </div>

      {/* 资料卡 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <div className="bg-white rounded-xl p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#999]">QQ号</span>
              <span className="text-[14px] text-[#333]">{char.qqId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#999]">年龄</span>
              <span className="text-[14px] text-[#333]">{char.age}岁</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#999]">学校</span>
              <span className="text-[14px] text-[#333]">{char.school}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#999]">专业</span>
              <span className="text-[14px] text-[#333]">{char.major}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#999]">状态</span>
              <span className="text-[14px]" style={{ color: status.hasFinished ? "#999" : "#10b981" }}>
                {status.hasFinished ? "故事已结束" : status.onlineStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4">
          <p className="text-[13px] text-[#999] mb-2">个人简介</p>
          <p className="text-[14px] text-[#333] leading-relaxed">{char.briefIntro}</p>
        </div>

        {status.hasFinished && status.endingId && onViewTimeline && (
          <motion.button onClick={onViewTimeline}
            className="w-full py-3.5 rounded-xl text-white font-medium text-[15px]"
            style={{ background: `linear-gradient(135deg, ${QQ_BLUE}, #0099e5)` }}
            whileTap={{ scale: 0.97 }}>
            🕐 查看TA的人生故事
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
