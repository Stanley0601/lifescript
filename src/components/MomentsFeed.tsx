"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { MomentPost } from "@/types";
import { getCharacter } from "@/lib/characters";
import Avatar from "./Avatar";
import { USER_AVATAR, QQ_BLUE, QQ_BG } from "@/lib/constants";

export default function MomentsFeed({ posts, onToggleLike, onAddComment }: {
  posts: MomentPost[];
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
}) {
  const [commentingId, setCommentingId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: QQ_BG }}>
      {/* QQ空间 Header */}
      <div className="relative overflow-hidden" style={{ height: 180, background: "linear-gradient(135deg, #12b7f5, #0099e5, #007bbd)" }}>
        <div className="absolute inset-0 flex items-end pb-4 px-4">
          <div className="flex items-center gap-3">
            <div className="w-[50px] h-[50px] rounded-lg overflow-hidden border-2 border-white/40">
              <Image src={USER_AVATAR} alt="我" width={50} height={50} className="object-cover" />
            </div>
            <div>
              <p className="text-white font-semibold text-[16px]">我</p>
              <p className="text-white/70 text-[12px]">旁观者</p>
            </div>
          </div>
        </div>
      </div>

      {/* 动态列表 */}
      <div className="px-0">
        {posts.length === 0 ? (
          <div className="py-20 text-center text-[#bbb] text-[14px]">
            还没有动态<br/>
            <span className="text-[12px]">开始和TA们聊天，动态就会出现</span>
          </div>
        ) : (
          posts.map(post => {
            const char = getCharacter(post.characterId);
            if (!char) return null;
            return (
              <div key={post.id} className="bg-white px-4 py-4 mb-2">
                {/* 头部 */}
                <div className="flex items-start gap-3 mb-2">
                  <Avatar src={char.avatarImg} alt={char.name} size={40} />
                  <div className="flex-1 min-w-0">
                    <span className="text-[15px] font-medium" style={{ color: QQ_BLUE }}>{char.name}</span>
                    <p className="text-[14px] text-[#333] mt-1 leading-relaxed whitespace-pre-wrap">{post.text}</p>
                    {post.imageEmoji && (
                      <div className="mt-2 w-[160px] h-[120px] rounded-lg flex items-center justify-center text-[48px]"
                        style={{ background: "#f5f5f5" }}>
                        {post.imageEmoji}
                      </div>
                    )}
                  </div>
                </div>
                {/* 时间+操作 */}
                <div className="flex items-center justify-between ml-[52px]">
                  <span className="text-[12px] text-[#bbb]">{post.time}</span>
                  <div className="flex items-center gap-4">
                    <button onClick={() => onToggleLike(post.id)}
                      className="flex items-center gap-1 text-[12px]"
                      style={{ color: post.likedByUser ? "#f43f5e" : "#999" }}>
                      {post.likedByUser ? "❤️" : "🤍"} {post.likes + (post.likedByUser ? 1 : 0)}
                    </button>
                    <button onClick={() => setCommentingId(commentingId === post.id ? null : post.id)}
                      className="text-[12px] text-[#999]">
                      💬 {post.comments.length}
                    </button>
                  </div>
                </div>
                {/* 评论区 */}
                {post.comments.length > 0 && (
                  <div className="ml-[52px] mt-2 px-3 py-2 rounded" style={{ background: "#f5f5f5" }}>
                    {post.comments.map(c => (
                      <div key={c.id} className="text-[13px] leading-relaxed">
                        <span className="font-medium" style={{ color: QQ_BLUE }}>{c.name}</span>
                        <span className="text-[#333]">：{c.text}</span>
                      </div>
                    ))}
                  </div>
                )}
                {/* 评论输入 */}
                <AnimatePresence>
                  {commentingId === post.id && (
                    <motion.div className="ml-[52px] mt-2 flex gap-2"
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                      <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter" && commentText.trim()) {
                            onAddComment(post.id, commentText.trim());
                            setCommentText(""); setCommentingId(null);
                          }
                        }}
                        className="flex-1 px-2.5 py-1.5 rounded text-[13px] bg-white border border-[#e0e0e0] outline-none"
                        placeholder="说点什么..." autoFocus />
                      <button onClick={() => {
                        if (commentText.trim()) {
                          onAddComment(post.id, commentText.trim());
                          setCommentText(""); setCommentingId(null);
                        }
                      }}
                        className="px-3 py-1.5 rounded text-[13px] text-white"
                        style={{ background: QQ_BLUE }}>发送</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
