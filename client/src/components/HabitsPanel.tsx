import { useGame } from "@/contexts/GameContext";
import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Trash2, CheckCircle2, Circle, Target, Flame } from "lucide-react";

export default function HabitsPanel() {
  const { state, dispatch } = useGame();
  const [newHabit, setNewHabit] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (!newHabit.trim()) return;
    dispatch({ type: "ADD_HABIT", payload: { name: newHabit.trim() } });
    setNewHabit("");
    setIsAdding(false);
  };

  const completedCount = state.habits.filter((h) => h.completed).length;
  const totalCount = state.habits.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="glass-strong rounded-2xl p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <Target size={16} className="text-primary" />
        <h3
          className="text-sm font-semibold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          每日习惯
        </h3>
        {totalCount > 0 && (
          <span className="text-[10px] text-muted-foreground ml-auto">
            {completedCount}/{totalCount}
          </span>
        )}
      </div>
<div className="h-1.5 rounded-full bg-border/30 overflow-hidden mb-3">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary"
          animate={{ width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : "0%" }}
          transition={{ duration: 0.3 }}
        />
      </div>
<div className="space-y-1.5 mb-3">
        {state.habits.length === 0 && !isAdding ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 text-muted-foreground/50"
          >
            <Target size={28} className="mx-auto mb-2 opacity-30" />
            <p className="text-[10px] mb-3">添加每日习惯，培养好的生活节奏</p>
            <div className="flex gap-1.5 justify-center flex-wrap">
              {["阅读30分钟", "多喝水", "早睡"].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    dispatch({ type: "ADD_HABIT", payload: { name: suggestion } });
                  }}
                  className="px-2 py-1 rounded-lg bg-white/10 text-[9px] text-muted-foreground
                           hover:bg-white/20 hover:text-foreground transition-all"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          state.habits.map((habit) => (
            <motion.div
              key={habit.id}
              layout
              className="group flex items-center gap-2 p-2 rounded-xl hover:bg-white/10 transition-all"
            >
              <button
                onClick={() => dispatch({ type: "TOGGLE_HABIT", payload: habit.id })}
                className="shrink-0"
              >
                {habit.completed ? (
                  <CheckCircle2 size={18} className="text-primary" />
                ) : (
                  <Circle size={18} className="text-muted-foreground/40" />
                )}
              </button>

              <span
                className={`flex-1 text-xs ${
                  habit.completed
                    ? "line-through text-muted-foreground/50"
                    : ""
                }`}
              >
                {habit.name}
              </span>

              {habit.streak > 1 && (
                <span className="flex items-center gap-0.5 text-[9px] text-orange-400">
                  <Flame size={10} />
                  {habit.streak}
                </span>
              )}

              <button
                onClick={() => dispatch({ type: "DELETE_HABIT", payload: habit.id })}
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity
                           text-destructive/50 hover:text-destructive shrink-0
                           active:opacity-100 touch-manipulation p-1 rounded"
                aria-label="删除习惯"
              >
                <Trash2 size={12} />
              </button>
            </motion.div>
          ))
        )}
      </div>
{isAdding ? (
        <div className="flex gap-2">
          <input
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") setIsAdding(false);
            }}
            placeholder="习惯名称..."
            autoFocus
            className="flex-1 bg-white/15 rounded-xl px-3 py-1.5 text-xs
                       placeholder:text-muted-foreground/50 focus:outline-none 
                       focus:ring-1 focus:ring-primary/30"
          />
          <button
            onClick={handleAdd}
            disabled={!newHabit.trim()}
            className="px-3 py-1.5 rounded-xl bg-primary/15 text-primary text-xs 
                       font-medium hover:bg-primary/25 transition-all disabled:opacity-30"
          >
            添加
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl
                     text-xs text-muted-foreground hover:bg-white/10 transition-all
                     border border-dashed border-border/30"
        >
          <Plus size={12} />
          添加习惯
        </button>
      )}
    </motion.div>
  );
}
