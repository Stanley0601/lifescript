"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Character } from "@/types";
import { getEndingsForCharacter } from "@/lib/story-stages";
import { QQ_BLUE, QQ_BG } from "@/lib/constants";

export default function EndingView({ char, endingId, onRestart, onHome }: {
  char: Character; endingId: string; onRestart: () => void; onHome: () => void;
}) {
  const { endings, comparisons } = getEndingsForCharacter(char.id);
  const ending = endings.get(endingId);
  if (!ending) return null;
  const dims = Object.entries(ending.stats);
  const colors = ["#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6"];
  const otherEndings = comparisons.filter(c => c.endingId !== endingId);

  return (
    <motion.div className="min-h-screen px-5 py-10" style={{ background: QQ_BG }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="max-w-md mx-auto">
        <motion.div className="text-center mb-6" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="inline-block mb-3 overflow-hidden" style={{ borderRadius: 16, width: 72, height: 72 }}>
            <Image src={char.avatarImg} alt={char.name} width={72} height={72} className="object-cover" />
          </div>
          <p className="text-xs text-[#888] mb-1">{char.name}的结局</p>
          <h1 className="text-2xl font-bold text-[#111]">{ending.emoji} {ending.title}</h1>
        </motion.div>

        <motion.div className="bg-white rounded-xl p-5 mb-3 shadow-sm"
          initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <p className="text-[15px] leading-relaxed text-[#333]">{ending.description}</p>
        </motion.div>

        <motion.div className="bg-white rounded-xl p-5 mb-3 shadow-sm"
          initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <p className="text-xs text-[#888] mb-3">{char.name}的人生指标</p>
          <div className="space-y-3">
            {dims.map(([label, value], i) => (
              <div key={label} className="flex items-center gap-2.5">
                <span className="text-[12px] text-[#888] w-10 text-right">{label}</span>
                <div className="flex-1 h-[6px] bg-[#f0f0f0] rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full"
                    style={{ background: colors[i % colors.length] }}
                    initial={{ width: 0 }} animate={{ width: `${value}%` }}
                    transition={{ delay: 0.6 + i * 0.08, duration: 0.6 }} />
                </div>
                <span className="text-[12px] font-medium text-[#333] w-6 text-right">{String(value)}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="bg-white rounded-xl p-5 mb-3 shadow-sm border-l-[3px]"
          style={{ borderColor: QQ_BLUE }}
          initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
          <p className="text-xs mb-1 font-medium" style={{ color: QQ_BLUE }}>&#x1F4A1; 你的影响</p>
          <p className="text-[14px] text-[#333] leading-relaxed">{ending.insight}</p>
        </motion.div>

        {otherEndings.length > 0 && (
          <motion.div className="bg-white rounded-xl p-5 mb-4 shadow-sm"
            initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
            <p className="text-xs text-[#888] mb-3">&#x1F500; 其他可能的结局</p>
            <div className="space-y-2.5">
              {otherEndings.map((alt) => (
                <div key={alt.endingId} className="p-3 bg-[#f9f9f9] rounded-lg">
                  <p className="text-[14px] font-medium text-[#333] mb-0.5">{alt.title}</p>
                  <p className="text-[12px] text-[#888]">{alt.alternateText}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div className="space-y-2.5 mt-6"
          initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }}>
          <button onClick={onRestart}
            className="w-full py-3 rounded-lg text-white font-medium text-[15px]"
            style={{ background: QQ_BLUE }}>
            重新对话，改变结局
          </button>
          <button onClick={onHome}
            className="w-full py-3 rounded-lg font-medium text-[15px] text-[#333] bg-white shadow-sm">
            返回消息列表
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
