import { usePomodoro } from "@/hooks/usePomodoro";
import { useGame } from "@/contexts/GameContext";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function TimerPanel() {
  const { formattedTime, isRunning, mode, progress, start, pause, reset } = usePomodoro();
  const { state, dispatch } = useGame();
  const [showSettings, setShowSettings] = useState(false);

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-2xl p-6 flex flex-col items-center gap-4"
    >
<div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            mode === "focus" ? "bg-green-500" : "bg-amber-400"
          }`}
        />
        <span
          className="text-sm font-medium"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {mode === "focus" ? "专注时间" : "休息时间"}
        </span>
      </div>
<div className="relative w-52 h-52 flex items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 200 200">
<circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="oklch(0.90 0.015 200 / 30%)"
            strokeWidth="6"
          />
<circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={mode === "focus" ? "oklch(0.55 0.15 160)" : "oklch(0.70 0.12 80)"}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
<div className="text-center z-10">
          <div
            className="text-4xl font-bold tracking-wider"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {formattedTime}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {mode === "focus"
              ? `第 ${state.sessionsCompleted + 1} 个番茄`
              : "放松一下"}
          </div>
        </div>
      </div>
<div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="w-10 h-10 rounded-full glass flex items-center justify-center
                     hover:bg-white/30 transition-all duration-200 active:scale-95
                     touch-manipulation"
          title="重置"
          aria-label="重置计时器"
        >
          <RotateCcw size={16} />
        </button>

        <button
          onClick={isRunning ? pause : start}
          className={`w-14 h-14 rounded-full flex items-center justify-center
                      transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95
                      touch-manipulation
                      ${isRunning
                        ? "bg-amber-400/80 hover:bg-amber-400 text-amber-900"
                        : "bg-primary/80 hover:bg-primary text-primary-foreground"
                      }`}
          aria-label={isRunning ? "暂停" : "开始"}
        >
          {isRunning ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`w-10 h-10 rounded-full glass flex items-center justify-center
                     hover:bg-white/30 transition-all duration-200 active:scale-95
                     touch-manipulation ${showSettings ? "bg-white/30" : ""}`}
          title="设置"
          aria-label="设置"
        >
          <Settings size={16} />
        </button>
      </div>
<AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full overflow-hidden"
          >
            <div className="pt-3 border-t border-border/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">专注时长</span>
                <div className="flex items-center gap-2">
                  {[15, 25, 30, 45, 60].map((m) => (
                    <button
                      key={m}
                      onClick={() => dispatch({ type: "SET_POMODORO_MINUTES", payload: m })}
                      className={`px-2 py-1 rounded-lg text-xs font-medium transition-all
                        ${state.pomodoroMinutes === m
                          ? "bg-primary/20 text-primary"
                          : "hover:bg-white/20 text-muted-foreground"
                        }`}
                    >
                      {m}分
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">休息时长</span>
                <div className="flex items-center gap-2">
                  {[3, 5, 10, 15].map((m) => (
                    <button
                      key={m}
                      onClick={() => dispatch({ type: "SET_BREAK_MINUTES", payload: m })}
                      className={`px-2 py-1 rounded-lg text-xs font-medium transition-all
                        ${state.breakMinutes === m
                          ? "bg-amber-400/20 text-amber-700"
                          : "hover:bg-white/20 text-muted-foreground"
                        }`}
                    >
                      {m}分
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
