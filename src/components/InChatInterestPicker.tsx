"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { InterestTag } from "@/types";
import { INTEREST_OPTIONS } from "@/lib/interest-context";
import { QQ_BLUE } from "@/lib/constants";

/**
 * 内嵌在聊天气泡中的兴趣选择卡片
 * 角色问完"你平时喜欢什么"后出现
 */
export default function InChatInterestPicker({ onConfirm }: {
  onConfirm: (tags: InterestTag[]) => void;
}) {
  const [selected, setSelected] = useState<InterestTag[]>([]);

  const toggleTag = (tag: InterestTag) => {
    setSelected(prev => {
      if (prev.includes(tag)) return prev.filter(t => t !== tag);
      if (prev.length >= 5) return prev;
      return [...prev, tag];
    });
  };

  const canConfirm = selected.length >= 2;

  return (
    <motion.div className="mx-2 my-2"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#f0f0f0]">
        <p className="text-[14px] text-[#666] mb-3">选几个你感兴趣的（2-5个）：</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {INTEREST_OPTIONS.map(tag => {
            const active = selected.includes(tag);
            return (
              <button key={tag} onClick={() => toggleTag(tag)}
                className="px-3 py-1.5 rounded-full text-[14px] transition-all"
                style={{
                  background: active ? QQ_BLUE : "#f5f5f5",
                  color: active ? "#fff" : "#555",
                  border: active ? `1px solid ${QQ_BLUE}` : "1px solid #eee",
                }}>
                {tag}
              </button>
            );
          })}
        </div>
        {canConfirm && (
          <motion.button
            onClick={() => onConfirm(selected)}
            className="w-full py-2.5 rounded-xl text-[14px] font-medium text-white"
            style={{ background: QQ_BLUE }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            就这些
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
