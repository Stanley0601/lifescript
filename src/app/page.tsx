"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CharacterStatus, MomentPost, TabType } from "@/types";
import { characters, getCharacter } from "@/lib/characters";
import { getStagesForCharacter } from "@/lib/story-stages";
import { momentPosts } from "@/lib/moments-data";
import { getTimeline } from "@/lib/timeline-data";
import { getRandomDailyLife, getRandomStatus, getDailyLifeForStages } from "@/lib/daily-life";
import {
  saveAllProgress, loadAllProgress,
  saveSelectedStory, loadSelectedStory,
} from "@/lib/memory";
import {
  Landing,
  StorySelect,
  BottomTabBar,
  MessageListPage,
  ChatView,
  MomentsFeed,
  ProfilePage,
  TimelineView,
  EndingView,
  MyProfileTab,
} from "@/components";

// ============================================
// 🏡 Main App
// ============================================
export default function Home() {
  // App phase: landing → select → app → chat → ending
  type Phase = "landing" | "select" | "app" | "chat" | "ending" | "profile" | "timeline";
  const [phase, setPhase] = useState<Phase>("landing");
  const [tab, setTab] = useState<TabType>("messages");
  const [activeCharId, setActiveCharId] = useState<string | null>(null);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [viewProfileId, setViewProfileId] = useState<string | null>(null);
  const [viewTimelineId, setViewTimelineId] = useState<string | null>(null);
  const [endingId, setEndingId] = useState("");
  const [chatKey, setChatKey] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  const defaultProgress: Record<string, { stageProgress: number; hasFinished: boolean; endingId?: string }> = {
    xiaoyu: { stageProgress: 0, hasFinished: false },
    haoran: { stageProgress: 0, hasFinished: false },
    momo: { stageProgress: 0, hasFinished: false },
  };

  // Character progress tracking
  const [charProgress, setCharProgress] = useState<Record<string, {
    stageProgress: number; hasFinished: boolean; endingId?: string;
  }>>(defaultProgress);

  // Restore from localStorage on mount
  useEffect(() => {
    const savedProgress = loadAllProgress();
    if (savedProgress) {
      setCharProgress({ ...defaultProgress, ...savedProgress });
    }
    const savedStory = loadSelectedStory();
    if (savedStory) {
      setSelectedStoryId(savedStory);
      setActiveCharId(savedStory);
      setPhase("app");
    }
    setHydrated(true);
  }, []);

  // Persist progress whenever it changes
  useEffect(() => {
    if (hydrated) {
      saveAllProgress(charProgress);
    }
  }, [charProgress, hydrated]);

  // Persist selected story
  useEffect(() => {
    if (hydrated && selectedStoryId) {
      saveSelectedStory(selectedStoryId);
    }
  }, [selectedStoryId, hydrated]);

  // Live online status (changes over time for "alive" feeling)
  const [liveStatuses, setLiveStatuses] = useState<Record<string, string>>({});

  // Rotate online status every 15-30 seconds for selected character
  useEffect(() => {
    if (!selectedStoryId || phase === "landing" || phase === "select") return;
    const prog = charProgress[selectedStoryId];
    const stages = getStagesForCharacter(selectedStoryId);
    const currentStageId = stages[Math.min(prog?.stageProgress || 0, stages.length - 1)]?.id;
    if (!currentStageId) return;

    const update = () => {
      setLiveStatuses(prev => ({
        ...prev,
        [selectedStoryId]: getRandomStatus(selectedStoryId, currentStageId),
      }));
    };
    update(); // immediate first
    const interval = setInterval(update, 15000 + Math.random() * 15000);
    return () => clearInterval(interval);
  }, [selectedStoryId, phase, charProgress]);

  // Moments state (with local like/comment + daily life content)
  const [localMoments, setLocalMoments] = useState<MomentPost[]>(momentPosts);

  // Inject daily life posts as moments when progress changes
  useEffect(() => {
    if (!selectedStoryId) return;
    const prog = charProgress[selectedStoryId];
    if (!prog) return;
    const stages = getStagesForCharacter(selectedStoryId);
    const unlockedStageIds = stages.slice(0, prog.stageProgress + 1).map(s => s.id);
    const dailyPosts = getDailyLifeForStages(selectedStoryId, unlockedStageIds);

    // Convert daily life items to MomentPost format (only ones not already added)
    const existingIds = new Set(localMoments.map(m => m.id));
    const newPosts: MomentPost[] = dailyPosts
      .filter(d => !existingIds.has(`dl-${d.id}`))
      .map(d => ({
        id: `dl-${d.id}`,
        characterId: d.characterId,
        stageId: d.stageId,
        text: d.photoDesc ? `${d.text}\n${d.photoDesc}` : d.text,
        imageEmoji: d.type === "food" ? "🍽️" : d.type === "selfie" ? "🤳" : d.type === "photo" ? "📸" : d.type === "music" ? "🎵" : undefined,
        time: d.time === "深夜" ? "昨天 23:47" : d.time === "凌晨" ? "今天 02:13" : d.time === "上午" ? "今天 10:23" : d.time === "中午" ? "今天 12:08" : d.time === "下午" ? "今天 15:42" : d.time === "傍晚" ? "今天 18:15" : d.time === "晚上" ? "今天 21:30" : "刚刚",
        likes: Math.floor(Math.random() * 20) + 3,
        likedByUser: false,
        comments: [],
      }));

    if (newPosts.length > 0) {
      setLocalMoments(prev => [...prev, ...newPosts]);
    }
  }, [selectedStoryId, charProgress]);

  // Build character statuses for the selected story
  const charStatuses: CharacterStatus[] = useMemo(() => {
    // Only show selected character (+ possibly "系统助手")
    const charsToShow = selectedStoryId
      ? characters.filter(c => c.id === selectedStoryId)
      : characters;

    return charsToShow.map(c => {
      const prog = charProgress[c.id] || { stageProgress: 0, hasFinished: false };
      const msgs: Record<string, { last: string; time: string; unread: number }> = {
        xiaoyu: { last: "嗨！终于加上了，我是小宇~", time: "刚刚", unread: 3 },
        haoran: { last: "不好意思这么晚打扰 在吗", time: "00:32", unread: 2 },
        momo: { last: "你好...可以聊聊吗", time: "昨天", unread: 1 },
      };
      const info = msgs[c.id] || { last: "", time: "", unread: 0 };
      const liveStatus = liveStatuses[c.id] || c.onlineStatus;
      return {
        characterId: c.id,
        onlineStatus: liveStatus,
        lastMessage: prog.hasFinished ? `[故事已结束]` : info.last,
        lastMessageTime: info.time,
        unreadCount: prog.stageProgress > 0 ? 0 : info.unread,
        stageProgress: prog.stageProgress,
        hasFinished: prog.hasFinished,
        endingId: prog.endingId,
      };
    });
  }, [charProgress, selectedStoryId, liveStatuses]);

  const unreadTotal = charStatuses.reduce((sum, s) => sum + s.unreadCount, 0);

  // Get visible moments based on progress (only for selected character)
  const visibleMoments = useMemo(() => {
    const targetChars = selectedStoryId ? [selectedStoryId] : Object.keys(charProgress);
    const visible: MomentPost[] = [];
    targetChars.forEach((charId) => {
      const prog = charProgress[charId];
      if (!prog) return;
      const stages = getStagesForCharacter(charId);
      const visibleStageIds = stages.slice(0, prog.stageProgress + 1).map(s => s.id);
      const charMoments = localMoments.filter(
        m => m.characterId === charId && visibleStageIds.includes(m.stageId)
      );
      visible.push(...charMoments);
    });
    return visible.reverse();
  }, [charProgress, localMoments, selectedStoryId]);

  const handleToggleLike = useCallback((postId: string) => {
    setLocalMoments(prev => prev.map(m =>
      m.id === postId ? { ...m, likedByUser: !m.likedByUser } : m
    ));
  }, []);

  const handleAddComment = useCallback((postId: string, text: string) => {
    setLocalMoments(prev => prev.map(m =>
      m.id === postId ? {
        ...m,
        comments: [...m.comments, { id: `uc-${Date.now()}`, from: "user", name: "我", text }]
      } : m
    ));
  }, []);

  const handleChatEnd = useCallback((charId: string, eid: string) => {
    setCharProgress(prev => ({
      ...prev,
      [charId]: { stageProgress: 4, hasFinished: true, endingId: eid },
    }));
    setEndingId(eid);
    setPhase("ending");
  }, []);

  const handleSelectStory = useCallback((charId: string) => {
    setSelectedStoryId(charId);
    setActiveCharId(charId);
    setPhase("app");
  }, []);

  const activeChar = activeCharId ? getCharacter(activeCharId) : null;
  const profileChar = viewProfileId ? getCharacter(viewProfileId) : null;
  const timelineChar = viewTimelineId ? getCharacter(viewTimelineId) : null;

  return (
    <main className="h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {/* Landing */}
        {phase === "landing" && (
          <Landing key="landing" onStart={() => setPhase("select")} />
        )}

        {/* Story Selection */}
        {phase === "select" && (
          <StorySelect key="select" onSelect={handleSelectStory} />
        )}

        {/* Main App (Tab View) - now scoped to selected story */}
        {phase === "app" && (
          <motion.div key="app" className="h-screen flex flex-col"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {tab === "messages" && (
              <MessageListPage
                statuses={charStatuses}
                onSelectChat={(cid) => {
                  setActiveCharId(cid);
                  setChatKey(k => k + 1);
                  setCharProgress(prev => ({
                    ...prev,
                    [cid]: { ...prev[cid], stageProgress: Math.max(prev[cid]?.stageProgress || 0, 1) },
                  }));
                  setPhase("chat");
                }}
                onSelectProfile={(cid) => {
                  setViewProfileId(cid);
                  setPhase("profile");
                }}
              />
            )}
            {tab === "moments" && (
              <MomentsFeed
                posts={visibleMoments}
                onToggleLike={handleToggleLike}
                onAddComment={handleAddComment}
              />
            )}
            {tab === "profile" && <MyProfileTab />}
            <BottomTabBar current={tab} onChange={setTab} unreadTotal={unreadTotal} />
          </motion.div>
        )}

        {/* Chat */}
        {phase === "chat" && activeChar && (
          <ChatView
            key={`chat-${activeChar.id}-${chatKey}`}
            char={activeChar}
            onEnd={(eid) => handleChatEnd(activeChar.id, eid)}
            onBack={() => setPhase("app")}
          />
        )}

        {/* Ending */}
        {phase === "ending" && activeChar && (
          <EndingView
            key="ending"
            char={activeChar}
            endingId={endingId}
            onRestart={() => { setChatKey(k => k + 1); setPhase("chat"); }}
            onHome={() => { setPhase("app"); setTab("messages"); }}
          />
        )}

        {/* Profile */}
        {phase === "profile" && profileChar && (
          <ProfilePage
            key={`profile-${profileChar.id}`}
            char={profileChar}
            status={charStatuses.find(s => s.characterId === profileChar.id)!}
            onBack={() => { setViewProfileId(null); setPhase("app"); }}
            onViewTimeline={() => {
              const st = charStatuses.find(s => s.characterId === profileChar.id);
              if (st?.hasFinished && st.endingId) {
                setViewTimelineId(profileChar.id);
                setEndingId(st.endingId);
                setPhase("timeline");
              }
            }}
          />
        )}

        {/* Timeline */}
        {phase === "timeline" && timelineChar && (
          <TimelineView
            key={`timeline-${timelineChar.id}`}
            char={timelineChar}
            events={getTimeline(timelineChar.id, endingId)}
            onBack={() => { setViewTimelineId(null); setPhase("profile"); setViewProfileId(timelineChar.id); }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
