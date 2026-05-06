"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "@/types";
import { QQ_BLUE } from "@/lib/constants";

const AVATAR_OPTIONS = [
  "/avatars/user.png",
  "/avatars/user2.png",
  "/avatars/user3.png",
  "/avatars/user4.png",
  "/avatars/user5.png",
  "/avatars/user6.png",
];

export default function MyProfileTab({ userProfile, onResetAll, onUpdateNickname, onUpdateAvatar }: {
  userProfile?: UserProfile | null;
  onResetAll: () => void;
  onUpdateNickname?: (name: string) => void;
  onUpdateAvatar?: (url: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [nickname, setNickname] = useState(userProfile?.nickname || "");

  const displayName = userProfile?.nickname || "点击设置昵称";
  const currentAvatar = userProfile?.avatar || AVATAR_OPTIONS[0];

  const handleSaveNickname = () => {
    if (nickname.trim() && onUpdateNickname) {
      onUpdateNickname(nickname.trim());
    }
    setEditing(false);
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: "#f5f5f5" }}>
      {/* 顶部个人卡片 */}
      <div style={{ background: "white" }}>
        <div className="px-4 pt-14 pb-5">
          <div className="flex items-center gap-4">
            {/* 头像（可点击更换） */}
            <div className="relative cursor-pointer" onClick={() => setShowAvatarPicker(true)}>
              <div className="w-[64px] h-[64px] rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#f0f0f0]">
                <img src={currentAvatar} alt="我" className="object-cover w-full h-full" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm border border-[#eee]">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 7.5V9H2.5L7.5 4L6 2.5L1 7.5Z" fill="#999"/>
                  <path d="M8.5 1.5L8 1L7 2L8 3L8.5 2.5C8.8 2.2 8.8 1.8 8.5 1.5Z" fill="#999"/>
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSaveNickname()}
                    className="flex-1 text-[18px] font-semibold text-[#111] border-b-2 border-[#12b7f5] outline-none bg-transparent pb-0.5"
                    placeholder="输入昵称"
                    autoFocus
                    maxLength={12}
                  />
                  <button onClick={handleSaveNickname}
                    className="text-[14px] px-3 py-1 rounded-full text-white"
                    style={{ background: QQ_BLUE }}>
                    完成
                  </button>
                </div>
              ) : (
                <div onClick={() => setEditing(true)} className="cursor-pointer">
                  <p className="text-[18px] font-semibold text-[#111]">{displayName}</p>
                </div>
              )}
              <p className="text-[14px] text-[#999] mt-1">QQ号：2849371056</p>
            </div>
            {!editing && (
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className="flex-shrink-0">
                <path d="M1 1L7 7L1 13" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* 头像选择弹窗 */}
      <AnimatePresence>
        {showAvatarPicker && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowAvatarPicker(false)} />
            <motion.div className="relative bg-white rounded-2xl p-5 mx-6 w-full max-w-[320px]"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <p className="text-[16px] font-semibold text-[#111] mb-4">选择头像</p>
              <div className="grid grid-cols-3 gap-3">
                {AVATAR_OPTIONS.map(url => (
                  <button key={url} onClick={() => {
                    onUpdateAvatar?.(url);
                    setShowAvatarPicker(false);
                  }}
                    className={`w-full aspect-square rounded-full overflow-hidden ring-2 transition-all ${currentAvatar === url ? "ring-[#12b7f5]" : "ring-[#eee]"}`}>
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <button onClick={() => setShowAvatarPicker(false)}
                className="mt-4 w-full py-2.5 rounded-xl text-[14px] text-[#666] bg-[#f5f5f5]">
                取消
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 功能列表 */}
      <div className="bg-white mt-3">
        <MenuItem icon="⭐" label="我的收藏" />
        <MenuItem icon="📁" label="我的文件" />
        <MenuItem icon="👔" label="我的装扮" />
      </div>

      <div className="bg-white mt-3">
        <MenuItem icon="🏷️" label="兴趣标签" value={userProfile?.interestTags?.slice(0, 3).join("、") || "未设置"} />
        <MenuItem icon="📍" label="所在城市" value={userProfile?.city || "深圳"} />
      </div>

      <div className="bg-white mt-3">
        <MenuItem icon="⚙️" label="设置" />
      </div>

      {/* 重置 */}
      <div className="px-4 mt-6 mb-4">
        <button
          onClick={onResetAll}
          className="w-full py-3 rounded-xl text-[15px] text-[#999] bg-white active:bg-[#f5f5f5]"
        >
          重置所有数据
        </button>
      </div>

      <div className="text-center text-[13px] text-[#ddd] pb-8">
        <p>人生剧本 LifeScript · QQ社交</p>
      </div>
    </div>
  );
}

function MenuItem({ icon, label, value }: { icon: string; label: string; value?: string }) {
  return (
    <div className="flex items-center px-4 py-3.5" style={{ borderBottom: "0.5px solid #f5f5f5" }}>
      <span className="text-[18px] mr-3 w-6 text-center">{icon}</span>
      <span className="flex-1 text-[16px] text-[#333]">{label}</span>
      {value && <span className="text-[14px] text-[#999] mr-2">{value}</span>}
      <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
        <path d="M1 1L7 7L1 13" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
  );
}
