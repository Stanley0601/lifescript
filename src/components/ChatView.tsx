"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Character, ChatMsg } from "@/types";
import { initChatState, handleUserMessage, type ChatState } from "@/lib/chat-engine";
import { saveChatHistory, loadChatHistory } from "@/lib/memory";
import { MsgBubble, TypingBubble } from "./ChatBubbles";
import { QQ_BLUE } from "@/lib/constants";

export default function ChatView({ char, onEnd, onBack }: {
  char: Character; onEnd: (endingId: string) => void; onBack: () => void;
}) {
  const [state, setState] = useState<ChatState>(() => initChatState(char.id));
  const [displayed, setDisplayed] = useState<ChatMsg[]>([]);
  const [queue, setQueue] = useState<ChatMsg[]>([]);
  const [typing, setTyping] = useState(false);
  const [userTurn, setUserTurn] = useState(false);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);

  const scrollBottom = useCallback(() => {
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 80);
  }, []);

  // Restore chat history from localStorage
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      const saved = loadChatHistory(char.id);
      if (saved && saved.messages.length > 0) {
        // Restore previous conversation
        setDisplayed(saved.messages);
        setUserTurn(true);
        setSuggestions(state.suggestedReplies);
        setTimeout(() => {
          scrollRef.current?.scrollTo({ top: scrollRef.current?.scrollHeight || 0 });
          inputRef.current?.focus();
        }, 200);
      } else {
        // Fresh start
        setQueue(state.pendingQueue);
        setSuggestions(state.suggestedReplies);
      }
    }
  }, [state, char.id]);

  // Save chat history whenever displayed messages change
  useEffect(() => {
    if (displayed.length > 0) {
      saveChatHistory(char.id, {
        characterId: char.id,
        messages: displayed,
        stageIndex: state.currentStageIndex,
        turnCount: state.turnsInCurrentStage,
      });
    }
  }, [displayed, char.id, state.currentStageIndex, state.turnsInCurrentStage]);

  useEffect(() => {
    if (queue.length === 0) {
      if (!userTurn && !state.isFinished && displayed.length > 0) {
        setTimeout(() => { setUserTurn(true); setTimeout(() => inputRef.current?.focus(), 100); }, 400);
      }
      if (state.isFinished && state.endingId && displayed.length > 0) {
        setTimeout(() => onEnd(state.endingId!), 2500);
      }
      return;
    }
    const next = queue[0];
    const delay = next.delay || 500;
    const typ = next.typing || 0;
    const timer = setTimeout(() => {
      if (typ > 0 && next.from === "char") {
        setTyping(true); scrollBottom();
        setTimeout(() => {
          setTyping(false);
          setDisplayed(p => [...p, next]);
          setQueue(q => q.slice(1));
          scrollBottom();
        }, typ);
      } else {
        setDisplayed(p => [...p, next]);
        setQueue(q => q.slice(1));
        scrollBottom();
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [queue, userTurn, state.isFinished, state.endingId, displayed.length, onEnd, scrollBottom]);

  const handleSend = useCallback((text?: string) => {
    const msgText = text || input.trim();
    if (!msgText || !userTurn) return;
    setUserTurn(false); setInput("");
    const newState = handleUserMessage(state, msgText);
    setState(newState);
    setQueue([
      { id: `u-${Date.now()}`, from: "user", type: "text", text: msgText, delay: 0, typing: 0 },
      ...newState.pendingQueue,
    ]);
    setSuggestions(newState.suggestedReplies);
  }, [input, userTurn, state]);

  return (
    <motion.div className="h-screen flex flex-col" style={{ background: "#f5f5f5" }}
      initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
      transition={{ type: "tween", duration: 0.25 }}>
      {/* QQ Header */}
      <div className="flex-shrink-0 z-20 flex items-center px-4 py-3"
        style={{ background: "#ffffff", borderBottom: "0.5px solid #ebebeb" }}>
        <button onClick={onBack} className="mr-3 flex-shrink-0">
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="M9 1L1 9L9 17" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="flex-1 text-center">
          <div className="text-[17px] font-semibold text-[#111]">{char.name}</div>
          {typing && <div className="text-[12px] text-[#999] mt-0.5">对方正在输入...</div>}
        </div>
        <div className="w-6 h-6 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="4" cy="10" r="1.5" fill="#666"/>
            <circle cx="10" cy="10" r="1.5" fill="#666"/>
            <circle cx="16" cy="10" r="1.5" fill="#666"/>
          </svg>
        </div>
      </div>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5" style={{ background: "#f5f5f5" }}>
        <div className="max-w-lg mx-auto space-y-4">
          {displayed.map(msg => <MsgBubble key={msg.id} msg={msg} charImg={char.avatarImg} charName={char.name} />)}
          {typing && <TypingBubble charImg={char.avatarImg} charName={char.name} />}
        </div>
      </div>

      {/* Suggestions */}
      <AnimatePresence>
        {userTurn && suggestions.length > 0 && (
          <motion.div className="flex-shrink-0 px-4 py-3 flex gap-2.5 overflow-x-auto"
            style={{ background: "#ffffff", borderTop: "0.5px solid #ebebeb" }}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => handleSend(s)}
                className="flex-shrink-0 px-4 py-2.5 rounded-full text-[14px] bg-white text-[#333] border border-[#e0e0e0] active:bg-[#e5e5e5]">
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input bar */}
      <div className="flex-shrink-0 z-20 px-4 py-3 safe-area-bottom" style={{ background: "#ffffff", borderTop: "0.5px solid #ebebeb" }}>
        {userTurn ? (
          <motion.div className="flex gap-2.5 items-end max-w-lg mx-auto"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex-1">
              <input ref={inputRef} type="text" value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                className="w-full px-4 py-2.5 rounded-full text-[16px] border outline-none focus:border-[#ccc]"
                style={{ lineHeight: "1.5", background: "#f2f3f5", borderColor: "#f2f3f5" }}
                placeholder="说点什么..."
                autoFocus />
            </div>
            <button onClick={() => handleSend()}
              className="px-5 py-2.5 rounded-full text-[15px] font-medium text-white flex-shrink-0"
              style={{ background: input.trim() ? "#0099FF" : "#c0c0c0" }}
              disabled={!input.trim()}>
              发送
            </button>
          </motion.div>
        ) : (
          <div className="flex gap-2.5 items-end max-w-lg mx-auto">
            <div className="flex-1 px-4 py-2.5 rounded-full text-[16px] text-[#bbb]" style={{ lineHeight: "1.5", background: "#f2f3f5" }}>
              &nbsp;
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
