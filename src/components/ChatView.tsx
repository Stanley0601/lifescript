"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Character, ChatMsg, ProactiveInboxEntry, RelationshipState, UserProfile } from "@/types";
import { getChatInterestSummary, initChatState, handleUserMessage, type ChatState } from "@/lib/chat-engine";
import { saveChatHistory, loadChatHistory } from "@/lib/memory";
import { getWeatherCareLine } from "@/lib/weather-context";
import { MsgBubble, TypingBubble } from "./ChatBubbles";
import { QQ_BLUE } from "@/lib/constants";

type InitialChatSession = {
  state: ChatState;
  displayed: ChatMsg[];
  queue: ChatMsg[];
  userTurn: boolean;
  suggestions: string[];
};

function createInitialChatSession(
  charId: string,
  userProfile: UserProfile | null,
  relationship: RelationshipState | null,
  proactiveEntry?: ProactiveInboxEntry | null,
): InitialChatSession {
  const saved = loadChatHistory(charId);

  if (saved && saved.messages.length > 0) {
    const baseState = initChatState(charId, userProfile, relationship);
    const restoredStageIndex = Math.min(saved.stageIndex, baseState.stages.length - 1);
    const restoredSuggestions = saved.suggestedReplies?.length
      ? saved.suggestedReplies
      : baseState.stages[restoredStageIndex]?.suggestedReplies || [];

    return {
      state: {
        ...baseState,
        currentStageIndex: restoredStageIndex,
        turnsInCurrentStage: saved.turnCount,
        displayedMessages: saved.messages,
        pendingQueue: [],
        isTyping: false,
        isUserTurn: !(saved.isFinished ?? false),
        userIntents: (saved.userIntents as ChatState["userIntents"]) || [],
        isFinished: saved.isFinished ?? false,
        endingId: saved.endingId ?? null,
        suggestedReplies: restoredSuggestions,
        usedInterestTopicIds: saved.usedInterestTopicIds || [],
      },
      displayed: saved.messages,
      queue: [],
      userTurn: !(saved.isFinished ?? false),
      suggestions: restoredSuggestions,
    };
  }

  const freshState = initChatState(charId, userProfile, relationship);
  const queue = proactiveEntry?.messages?.length
    ? [...proactiveEntry.messages, ...freshState.pendingQueue]
    : freshState.pendingQueue;
  const usedInterestTopicIds = proactiveEntry?.topicId
    ? [...freshState.usedInterestTopicIds, proactiveEntry.topicId]
    : freshState.usedInterestTopicIds;
  const state = {
    ...freshState,
    pendingQueue: queue,
    usedInterestTopicIds,
  };

  return {
    state,
    displayed: [],
    queue,
    userTurn: false,
    suggestions: state.suggestedReplies,
  };
}

export default function ChatView({ char, userProfile, relationship, proactiveEntry, onEnd, onBack }: {
  char: Character;
  userProfile: UserProfile | null;
  relationship: RelationshipState | null;
  proactiveEntry?: ProactiveInboxEntry | null;
  onEnd: (endingId: string, relationship: RelationshipState) => void;
  onBack: (relationship: RelationshipState) => void;
}) {
  const initialSession = useMemo(
    () => createInitialChatSession(char.id, userProfile, relationship, proactiveEntry),
    [char.id, userProfile, relationship, proactiveEntry],
  );

  const [state, setState] = useState<ChatState>(initialSession.state);
  const [displayed, setDisplayed] = useState<ChatMsg[]>(initialSession.displayed);
  const [queue, setQueue] = useState<ChatMsg[]>(initialSession.queue);
  const [typing, setTyping] = useState(false);
  const [userTurn, setUserTurn] = useState(initialSession.userTurn);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>(initialSession.suggestions);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const interestSummary = getChatInterestSummary(userProfile);
  const weatherCare = getWeatherCareLine(userProfile?.city);

  const scrollBottom = useCallback(() => {
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 80);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current?.scrollHeight || 0 });
      if (userTurn) inputRef.current?.focus();
    }, 200);

    return () => clearTimeout(timer);
  }, [userTurn]);

  useEffect(() => {
    if (displayed.length > 0) {
      saveChatHistory(char.id, {
        characterId: char.id,
        messages: displayed,
        stageIndex: state.currentStageIndex,
        turnCount: state.turnsInCurrentStage,
        userIntents: state.userIntents,
        suggestedReplies: state.suggestedReplies,
        isFinished: state.isFinished,
        endingId: state.endingId,
        usedInterestTopicIds: state.usedInterestTopicIds,
      });
    }
  }, [displayed, char.id, state.currentStageIndex, state.turnsInCurrentStage, state.userIntents, state.suggestedReplies, state.isFinished, state.endingId, state.usedInterestTopicIds]);

  useEffect(() => {
    if (queue.length === 0) {
      if (!userTurn && !state.isFinished && displayed.length > 0) {
        setTimeout(() => {
          setUserTurn(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }, 400);
      }
      const endingId = state.endingId;
      if (state.isFinished && endingId && displayed.length > 0) {
        setTimeout(() => onEnd(endingId, state.relationship), 2500);
      }
      return;
    }

    const next = queue[0];
    const delay = next.delay || 500;
    const typ = next.typing || 0;
    const timer = setTimeout(() => {
      if (typ > 0 && next.from === "char") {
        setTyping(true);
        scrollBottom();
        setTimeout(() => {
          setTyping(false);
          setDisplayed((prev) => [...prev, next]);
          setQueue((prev) => prev.slice(1));
          scrollBottom();
        }, typ);
      } else {
        setDisplayed((prev) => [...prev, next]);
        setQueue((prev) => prev.slice(1));
        scrollBottom();
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [queue, userTurn, state.isFinished, state.endingId, state.relationship, displayed.length, onEnd, scrollBottom]);

  const handleSend = useCallback((text?: string) => {
    const msgText = text || input.trim();
    if (!msgText || !userTurn) return;

    setUserTurn(false);
    setInput("");

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
      <div className="flex-shrink-0 z-20 flex items-center px-4 py-3"
        style={{ background: "#ffffff", borderBottom: "0.5px solid #ebebeb" }}>
        <button onClick={() => onBack(state.relationship)} className="mr-3 flex-shrink-0">
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="M9 1L1 9L9 17" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="flex-1 text-center min-w-0">
          <div className="text-[17px] font-semibold text-[#111]">{char.name}</div>
          {typing ? (
            <div className="text-[12px] text-[#999] mt-0.5">对方正在输入...</div>
          ) : state.relationship ? (
            <div className="text-[11px] text-[#999] mt-0.5 truncate px-8">
              {state.relationship.stage} · 熟悉度 {state.relationship.familiarity}% · 心动值 {state.relationship.chemistry}%
            </div>
          ) : interestSummary ? (
            <div className="text-[11px] text-[#999] mt-0.5 truncate px-8">{interestSummary}</div>
          ) : null}
        </div>
        <div className="w-6 h-6 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="4" cy="10" r="1.5" fill="#666"/>
            <circle cx="10" cy="10" r="1.5" fill="#666"/>
            <circle cx="16" cy="10" r="1.5" fill="#666"/>
          </svg>
        </div>
      </div>

      {interestSummary && displayed.length === 0 && (
        <div className="px-4 pt-3">
          <div className="max-w-lg mx-auto rounded-2xl px-4 py-3 text-[12px] leading-6"
            style={{ background: `${QQ_BLUE}10`, color: "#5f6b7a" }}>
            已根据你的兴趣标签做了轻量注入：角色可能会在合适的时候，像真的刷到今天的话题一样自然提起。
          </div>
        </div>
      )}

      {displayed.length === 0 && (
        <div className="px-4 pt-3">
          <div className="max-w-lg mx-auto rounded-2xl px-4 py-3 text-[12px] leading-6 bg-white text-[#6b7280] border border-[#edf1f5]">
            <div className="font-medium text-[#4b5563] mb-1">关系状态：{state.relationship.stage}</div>
            <div>现在的语气会随着熟悉度慢慢变化，前期更克制，后面会越来越自然，甚至带一点暧昧。</div>
            <div className="mt-1 text-[#8b98a8]">{weatherCare}</div>
          </div>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5" style={{ background: "#f5f5f5" }}>
        <div className="max-w-lg mx-auto space-y-4">
          {displayed.map(msg => <MsgBubble key={msg.id} msg={msg} charImg={char.avatarImg} charName={char.name} />)}
          {typing && <TypingBubble charImg={char.avatarImg} charName={char.name} />}
        </div>
      </div>

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