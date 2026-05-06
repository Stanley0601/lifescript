"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChatMsg } from "@/types";
import Avatar from "./Avatar";
import { USER_AVATAR } from "@/lib/constants";
import { parseStickerTag, getStickerByEmotion } from "@/lib/stickers";
import { getRandomSelfie } from "@/lib/selfies";

export function MsgBubble({ msg, charImg, charName, charId }: { msg: ChatMsg; charImg: string; charName: string; charId?: string }) {
  const [showPreview, setShowPreview] = useState(false);

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
  const { cleanText, stickerEmotion } = parseStickerTag(msg.text);
  const sticker = stickerEmotion ? getStickerByEmotion(stickerEmotion) : null;

  const hasSelfie = cleanText.includes("[SELFIE]");
  const displayText = cleanText.replace("[SELFIE]", "").trim();
  const selfieUrl = useMemo(() => hasSelfie && charId ? getRandomSelfie(charId) : "", [hasSelfie, charId]);

  const avatarSrc = isUser ? USER_AVATAR : charImg;

  return (
    <>
      <motion.div className={`flex items-start gap-6 ${isUser ? "flex-row-reverse" : ""}`}
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        {/* 头像 - 可点击放大 */}
        <div className="flex-shrink-0 cursor-pointer" onClick={() => setShowPreview(true)}>
          <Avatar src={avatarSrc} alt={isUser ? "你" : charName} size={44} />
        </div>
        {/* 消息内容区 */}
        <div className={`flex flex-col gap-2 max-w-[62%] ${isUser ? "items-end" : "items-start"}`}>
          {displayText && (
            <div className={`px-3.5 py-2.5 ${isUser ? "qq-bubble-right" : "qq-bubble-left"}`}>
              <p className="text-[15px] leading-[1.6] text-[#111] whitespace-pre-wrap break-words">{displayText}</p>
            </div>
          )}
          {sticker && (
            <div className="w-[110px] h-[110px] rounded-lg overflow-hidden">
              <img src={sticker.url} alt={sticker.alt} className="w-full h-full object-cover" />
            </div>
          )}
          {hasSelfie && selfieUrl && (
            <div className="w-[160px] h-[200px] rounded-xl overflow-hidden shadow-sm border border-[#eee]">
              <img src={selfieUrl} alt={`${charName}的照片`} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </motion.div>

      {/* 头像点击放大预览 */}
      <AnimatePresence>
        {showPreview && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowPreview(false)}>
            <div className="absolute inset-0 bg-black/60" />
            <motion.div className="relative w-[240px] h-[240px] rounded-2xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
              <img src={avatarSrc} alt={isUser ? "你" : charName} className="w-full h-full object-cover" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function TypingBubble({ charImg, charName }: { charImg: string; charName: string }) {
  return (
    <motion.div className="flex items-start gap-6"
      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex-shrink-0">
        <Avatar src={charImg} alt={charName} size={44} />
      </div>
      <div className="qq-bubble-left px-4 py-3">
        <div className="flex gap-1.5 items-center">
          <span className="w-2 h-2 rounded-full bg-[#aaa] animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 rounded-full bg-[#aaa] animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 rounded-full bg-[#aaa] animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </motion.div>
  );
}
