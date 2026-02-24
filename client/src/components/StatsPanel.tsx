import { useGame } from "@/contexts/GameContext";
import { motion } from "motion/react";
import { BarChart3, Clock, Zap, Trophy, Calendar } from "lucide-react";
import { useMemo } from "react";

export default function StatsPanel() {
  const { state } = useGame();

  const weekData = useMemo(() => {
    const days: { label: string; minutes: number; sessions: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const daySessions = state.sessions.filter(
        (s) => new Date(s.startTime).toDateString() === dateStr
      );
      days.push({
        label: date.toLocaleDateString("zh-CN", { weekday: "short" }),
        minutes: daySessions.reduce((sum, s) => sum + s.duration, 0),
        sessions: daySessions.length,
      });
    }
    return days;
  }, [state.sessions]);

  const maxMinutes = Math.max(...weekData.map((d) => d.minutes), 1);
  const todayMinutes = weekData[weekData.length - 1]?.minutes || 0;
  const todaySessions = weekData[weekData.length - 1]?.sessions || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-strong rounded-2xl p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={16} className="text-primary" />
        <h3
          className="text-sm font-semibold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          专注统计
        </h3>
      </div>
<div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <Clock size={14} className="mx-auto mb-1 text-blue-400" />
          <div className="text-lg font-bold" style={{ fontFamily: "var(--font-mono)" }}>
            {todayMinutes}
          </div>
          <div className="text-[9px] text-muted-foreground">今日专注(分钟)</div>
        </div>
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <Zap size={14} className="mx-auto mb-1 text-amber-400" />
          <div className="text-lg font-bold" style={{ fontFamily: "var(--font-mono)" }}>
            {todaySessions}
          </div>
          <div className="text-[9px] text-muted-foreground">今日番茄数</div>
        </div>
      </div>
<div className="mb-4">
        <div className="flex items-center gap-1 mb-2">
          <Calendar size={12} className="text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">本周趋势</span>
        </div>
        <div className="flex items-end gap-1 h-16">
          {weekData.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full relative" style={{ height: "48px" }}>
                <motion.div
                  className="absolute bottom-0 w-full rounded-t-sm bg-primary/30"
                  initial={{ height: 0 }}
                  animate={{
                    height: `${(day.minutes / maxMinutes) * 100}%`,
                  }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                />
              </div>
              <span className="text-[8px] text-muted-foreground">{day.label}</span>
            </div>
          ))}
        </div>
      </div>
<div className="pt-3 border-t border-border/20 grid grid-cols-2 gap-y-2 gap-x-4">
        <div className="flex items-center gap-2">
          <Trophy size={10} className="text-amber-400" />
          <span className="text-[10px] text-muted-foreground">总番茄数</span>
          <span className="text-[10px] font-bold ml-auto">{state.sessionsCompleted}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={10} className="text-blue-400" />
          <span className="text-[10px] text-muted-foreground">总时长</span>
          <span className="text-[10px] font-bold ml-auto">
            {Math.floor(state.totalFocusMinutes / 60)}h{state.totalFocusMinutes % 60}m
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Zap size={10} className="text-orange-400" />
          <span className="text-[10px] text-muted-foreground">最长连续</span>
          <span className="text-[10px] font-bold ml-auto">{state.longestStreak}天</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={10} className="text-green-400" />
          <span className="text-[10px] text-muted-foreground">当前连续</span>
          <span className="text-[10px] font-bold ml-auto">{state.currentStreak}天</span>
        </div>
      </div>
    </motion.div>
  );
}
