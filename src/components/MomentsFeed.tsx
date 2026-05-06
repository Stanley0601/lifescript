"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
      <div className="relative overflow-hidden" style={{ height: 160, background: "linear-gradient(135deg, #12b7f5, #0099e5, #007bbd)" }}>
        <div className="absolute inset-0 flex items-end pb-4 px-4">
          <div className="flex items-center gap-3">
            <div className="w-[48px] h-[48px] rounded-lg overflow-hidden border-2 border-white/40">
              <img src={USER_AVATAR} alt="我" width={48} height={48} className="object-cover w-full h-full" />
            </div>
            <div>
              <p className="text-white font-semibold text-[17px]">我的空间</p>
            </div>
          </div>
        </div>
      </div>

      {/* 动态列表 */}
      <div>
        {posts.length === 0 ? (
          <div className="py-20 text-center text-[#999] text-[15px]">
            还没有动态<br/>
            <span className="text-[14px] text-[#bbb]">开始和TA们聊天，动态就会出现</span>
          </div>
        ) : (
          posts.map(post => {
            const char = getCharacter(post.characterId);
            if (!char) return null;
            return (
              <div key={post.id} className="bg-white px-4 py-4 mb-[6px]">
                {/* 头部 */}
                <div className="flex items-start gap-3">
                  <Avatar src={char.avatarImg} alt={char.name} size={42} />
                  <div className="flex-1 min-w-0">
                    <span className="text-[15px] font-medium" style={{ color: QQ_BLUE }}>{char.name}</span>
                    <p className="text-[15px] text-[#333] mt-1.5 leading-relaxed whitespace-pre-wrap">{post.text}</p>
                    {post.imageUrl ? (
                      <div className="mt-2 w-[200px] h-[150px] rounded-lg overflow-hidden">
                        <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    ) : post.imageEmoji ? (
                      <div className="mt-2 w-[140px] h-[100px] rounded-lg flex items-center justify-center text-[40px]"
                        style={{ background: "#f5f5f5" }}>
                        {post.imageEmoji}
                      </div>
                    ) : null}
                  </div>
                </div>
                {/* 时间+操作 */}
                <div className="flex items-center justify-between mt-3 ml-[54px]">
                  <span className="text-[13px] text-[#bbb]">{post.time}</span>
                  <div className="flex items-center gap-5">
                    <button onClick={() => onToggleLike(post.id)}
                      className="flex items-center gap-1 text-[14px]"
                      style={{ color: post.likedByUser ? "#f43f5e" : "#999" }}>
                      {post.likedByUser ? "❤️" : "🤍"} {post.likes + (post.likedByUser ? 1 : 0)}
                    </button>
                    <button onClick={() => setCommentingId(commentingId === post.id ? null : post.id)}
                      className="text-[14px] text-[#999]">
                      💬 {post.comments.length}
                    </button>
                  </div>
                </div>
                {/* 评论区 */}
                {post.comments.length > 0 && (
                  <div className="ml-[54px] mt-2 px-3 py-2 rounded" style={{ background: "#f5f5f5" }}>
                    {post.comments.map(c => (
                      <div key={c.id} className="text-[14px] leading-relaxed">
                        <span className="font-medium" style={{ color: QQ_BLUE }}>{c.name}</span>
                        <span className="text-[#333]">：{c.text}</span>
                      </div>
                    ))}
                  </div>
                )}
                {/* 评论输入 */}
                <AnimatePresence>
                  {commentingId === post.id && (
                    <motion.div className="ml-[54px] mt-2 flex gap-2"
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                      <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter" && commentText.trim()) {
                            onAddComment(post.id, commentText.trim());
                            setCommentText(""); setCommentingId(null);
                          }
                        }}
                        className="flex-1 px-3 py-2 rounded text-[14px] bg-white border border-[#e0e0e0] outline-none"
                        placeholder="说点什么..." autoFocus />
                      <button onClick={() => {
                        if (commentText.trim()) {
                          onAddComment(post.id, commentText.trim());
                          setCommentText(""); setCommentingId(null);
                        }
                      }}
                        className="px-3 py-2 rounded text-[14px] text-white"
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
