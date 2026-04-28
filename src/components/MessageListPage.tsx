"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { CharacterStatus } from "@/types";
import { getCharacter } from "@/lib/characters";
import Avatar from "./Avatar";
import { USER_AVATAR } from "@/lib/constants";

export default function MessageListPage({ statuses, onSelectChat, onSelectProfile }: {
  statuses: CharacterStatus[];
  onSelectChat: (charId: string) => void;
  onSelectProfile: (charId: string) => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto" style={{ background: "#ffffff" }}>

      {/* === 顶部：头像 + 昵称 + 状态 + 加号 === */}
      <div className="flex items-center justify-between px-[16px] pt-[14px] pb-[8px]">
        <div className="flex items-center gap-[10px]">
          <div className="w-[38px] h-[38px] rounded-full overflow-hidden flex-shrink-0">
            <Image src={USER_AVATAR} alt="我" width={38} height={38} className="object-cover" />
          </div>
          <div>
            <div className="text-[18px] font-semibold text-[#1a1a1a] leading-tight">旁观者</div>
            <div className="flex items-center gap-[4px] mt-[2px]">
              <span className="w-[7px] h-[7px] rounded-full inline-block" style={{ background: "#c8c8c8" }} />
              <span className="text-[12px] text-[#b0b0b0] leading-none">隐身</span>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="ml-[1px]">
                <path d="M2 3L4 5L6 3" stroke="#c0c0c0" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
        <button className="w-[28px] h-[28px] flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M11 5V17M5 11H17" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* === 搜索栏 === */}
      <div className="px-[16px] pt-[4px] pb-[10px]">
        <div className="flex items-center justify-center gap-[6px] h-[36px] rounded-full"
          style={{ background: "#f2f3f5" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="5" stroke="#c0c0c0" strokeWidth="1.3" />
            <path d="M10 10L13 13" stroke="#c0c0c0" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <span className="text-[14px] text-[#c0c0c0]">搜索</span>
        </div>
      </div>

      {/* === 消息列表 === */}
      <div>
        {statuses.map((s) => {
          const char = getCharacter(s.characterId);
          if (!char) return null;
          return (
            <div key={s.characterId}
              className="flex items-center px-[16px] active:bg-[#f5f5f5]"
              style={{ height: 72, borderBottom: "0.5px solid #f0f0f0" }}
              onClick={() => onSelectChat(s.characterId)}>

              {/* 头像 52px 正圆 */}
              <div className="flex-shrink-0 mr-[12px]"
                onClick={(e) => { e.stopPropagation(); onSelectProfile(s.characterId); }}>
                <Avatar src={char.avatarImg} alt={char.name} size={52} />
              </div>

              {/* 中间：名字 + 预览 */}
              <div className="flex-1 min-w-0 py-[2px]">
                <div className="flex items-baseline justify-between">
                  <span className="text-[17px] font-medium text-[#1a1a1a] truncate leading-none">{char.name}</span>
                  <span className="text-[12px] text-[#c8c8c8] flex-shrink-0 ml-[8px] leading-none">{s.lastMessageTime}</span>
                </div>
                <div className="mt-[6px]">
                  <span className="text-[14px] text-[#b0b0b0] truncate block leading-none">{s.lastMessage}</span>
                </div>
              </div>

              {/* 未读 */}
              {s.unreadCount > 0 && (
                <div className="flex-shrink-0 ml-[8px] min-w-[20px] h-[20px] px-[5px] rounded-full flex items-center justify-center"
                  style={{ background: "#FA5151" }}>
                  <span className="text-[11px] text-white font-bold leading-none">
                    {s.unreadCount > 99 ? "99+" : s.unreadCount}
                  </span>
                </div>
              )}
              {s.hasFinished && !s.unreadCount && (
                <span className="flex-shrink-0 ml-[8px] text-[11px] px-[6px] py-[2px] rounded bg-[#f2f3f5] text-[#b0b0b0]">已结束</span>
              )}
            </div>
          );
        })}

        {/* QQ提醒 行 */}
        <div className="flex items-center px-[16px]"
          style={{ height: 72, borderBottom: "0.5px solid #f0f0f0" }}>
          <div className="flex-shrink-0 mr-[12px] w-[52px] h-[52px] rounded-full flex items-center justify-center"
            style={{ background: "#EBF5FF" }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="10" stroke="#4BA3F5" strokeWidth="1.5"/>
              <path d="M14 9V15" stroke="#4BA3F5" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="14" cy="18" r="1" fill="#4BA3F5"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0 py-[2px]">
            <div className="flex items-baseline justify-between">
              <span className="text-[17px] font-medium text-[#1a1a1a] leading-none">QQ提醒</span>
              <span className="text-[12px] text-[#c8c8c8] leading-none">刚刚</span>
            </div>
            <div className="mt-[6px]">
              <span className="text-[14px] text-[#b0b0b0] truncate block leading-none">欢迎来到人生剧本</span>
            </div>
          </div>
        </div>

        {/* QQ安全中心 行 */}
        <div className="flex items-center px-[16px]"
          style={{ height: 72, borderBottom: "0.5px solid #f0f0f0" }}>
          <div className="flex-shrink-0 mr-[12px] w-[52px] h-[52px] rounded-full flex items-center justify-center"
            style={{ background: "#E8F8EF" }}>
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <path d="M13 3L4 7V12C4 17.5 7.8 22.7 13 24C18.2 22.7 22 17.5 22 12V7L13 3Z" stroke="#10B981" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M9 13L12 16L18 10" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0 py-[2px]">
            <div className="flex items-baseline justify-between">
              <span className="text-[17px] font-medium text-[#1a1a1a] leading-none">QQ安全中心</span>
              <span className="text-[12px] text-[#c8c8c8] leading-none">星期三</span>
            </div>
            <div className="mt-[6px]">
              <span className="text-[14px] text-[#b0b0b0] truncate block leading-none">账号登录通知</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
