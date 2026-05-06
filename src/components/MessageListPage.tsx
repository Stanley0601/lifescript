"use client";

import { motion } from "framer-motion";
import type { CharacterStatus } from "@/types";
import { getCharacter } from "@/lib/characters";
import Avatar from "./Avatar";
import { QQ_BLUE, USER_AVATAR } from "@/lib/constants";

export default function MessageListPage({ statuses, onSelectChat, onSelectProfile }: {
  statuses: CharacterStatus[];
  onSelectChat: (charId: string) => void;
  onSelectProfile: (charId: string) => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto" style={{ background: "#ffffff" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-[14px] pb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
            <img src={USER_AVATAR} alt="我" width={36} height={36} className="object-cover w-full h-full" />
          </div>
          <span className="text-[18px] font-semibold text-[#1a1a1a]">消息</span>
        </div>
        <button className="w-7 h-7 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M11 5V17M5 11H17" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="px-4 pb-2">
        <div className="flex items-center justify-center gap-2 h-9 rounded-full"
          style={{ background: "#f2f3f5" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="5" stroke="#c0c0c0" strokeWidth="1.3" />
            <path d="M10 10L13 13" stroke="#c0c0c0" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <span className="text-[14px] text-[#c0c0c0]">搜索</span>
        </div>
      </div>

      {/* Message List - 简洁QQ风格 */}
      <div>
        {statuses.map((s) => {
          const char = getCharacter(s.characterId);
          if (!char) return null;
          return (
            <motion.div key={s.characterId}
              className="flex items-center px-4 active:bg-[#f5f5f5]"
              style={{ height: 72, borderBottom: "0.5px solid #f5f5f5" }}
              onClick={() => onSelectChat(s.characterId)}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}>

              {/* 头像 */}
              <div className="flex-shrink-0 mr-3 relative"
                onClick={(e) => { e.stopPropagation(); onSelectProfile(s.characterId); }}>
                <Avatar src={char.avatarImg} alt={char.name} size={50} />
                {/* 在线绿点 */}
                {!s.hasFinished && s.stageProgress > 0 && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                    style={{ background: "#10b981" }} />
                )}
              </div>

              {/* 名字 + 消息预览 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[16px] font-medium text-[#1a1a1a] truncate">{char.name}</span>
                  <span className="text-[13px] text-[#c0c0c0] flex-shrink-0 ml-2">{s.lastMessageTime}</span>
                </div>
                <div className="mt-1">
                  <span className="text-[14px] text-[#999] truncate block">{s.lastMessage}</span>
                </div>
              </div>

              {/* 未读红点 */}
              {s.unreadCount > 0 && (
                <div className="flex-shrink-0 ml-2 min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center"
                  style={{ background: "#FA5151" }}>
                  <span className="text-[13px] text-white font-bold">{s.unreadCount > 99 ? "99+" : s.unreadCount}</span>
                </div>
              )}
              {s.hasFinished && !s.unreadCount && (
                <span className="flex-shrink-0 ml-2 text-[13px] px-2 py-0.5 rounded bg-[#f2f3f5] text-[#b0b0b0]">已结束</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
