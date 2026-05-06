"use client";

import { motion } from "framer-motion";
import type { ChatMsg } from "@/types";
import Avatar from "./Avatar";
import { USER_AVATAR } from "@/lib/constants";
import { parseStickerTag, getStickerByEmotion } from "@/lib/stickers";

export function MsgBubble({ msg, charImg, charName }: { msg: ChatMsg; charImg: string; charName: string }) {
  if (msg.type === "timeskip") {
    return (
      <motion.div className="flex justify-center py-6" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <span className="px-5 py-1.5 rounded-full text-[13px] text-[#999]" style={{ background: "rgba(0,0,0,0.06)" }}>{msg.text}</span>
      </motion.div>
    );
  }
  if (msg.type === "system") {
    return (
      <motion.div className="flex justify-center py-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <span className="px-4 py-1 rounded-full text-[14px] text-[#999]" style={{ background: "rgba(0,0,0,0.05)" }}>{msg.text}</span>
      </motion.div>
    );
  }
  if (msg.type === "narration") {
    return (
      <motion.div className="py-5 px-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <p className="text-center text-[14px] text-[#aaa] italic leading-relaxed">{msg.text}</p>
      </motion.div>
    );
  }

  const isUser = msg.from === "user";

  // 解析表情包标记
  const { cleanText, stickerEmotion } = parseStickerTag(msg.text);
  const sticker = stickerEmotion ? getStickerByEmotion(stickerEmotion) : null;

  return (
    <>
      {/* 文字消息（如果有文字内容） */}
      {cleanText && (
        <motion.div className={`flex items-start gap-5 ${isUser ? "flex-row-reverse" : ""}`}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <Avatar src={isUser ? USER_AVATAR : charImg} alt={isUser ? "你" : charName} size={40} />
          <div className={`relative max-w-[68%] px-3.5 py-2.5 ${isUser ? "qq-bubble-right" : "qq-bubble-left"}`}>
            <p className="text-[15px] leading-[1.6] text-[#111] whitespace-pre-wrap break-words">{cleanText}</p>
          </div>
        </motion.div>
      )}
      {/* 表情包（独立一条） */}
      {sticker && (
        <motion.div className={`flex items-start gap-5 ${isUser ? "flex-row-reverse" : ""}`}
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }}>
          {!cleanText && <Avatar src={isUser ? USER_AVATAR : charImg} alt={isUser ? "你" : charName} size={40} />}
          {cleanText && <div className="w-[40px] flex-shrink-0" />}
          <div className="w-[120px] h-[120px] rounded-lg overflow-hidden">
            <img src={sticker.url} alt={sticker.alt} className="w-full h-full object-cover" />
          </div>
        </motion.div>
      )}
    </>
  );
}

export function TypingBubble({ charImg, charName }: { charImg: string; charName: string }) {
  return (
    <motion.div className="flex items-start gap-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Avatar src={charImg} alt={charName} size={40} />
      <div className="qq-bubble-left px-4 py-3.5">
        <div className="flex gap-2 items-center">
          {[0, 1, 2].map(i => (
            <motion.span key={i} className="w-[7px] h-[7px] rounded-full bg-[#999] inline-block"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
