import { useGame, PLANT_STAGES } from "@/contexts/GameContext";
import { motion } from "motion/react";
import { Heart, Sprout, Timer, Flame } from "lucide-react";

export default function PlantInfo() {
  const { state, currentPlantStage, nextPlantStage, progressToNext } = useGame();
  const currentIndex = PLANT_STAGES.indexOf(currentPlantStage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="glass-strong rounded-2xl p-5"
    >
<div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Sprout size={20} className="text-primary" />
        </div>
        <div>
          <h3
            className="text-sm font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {currentPlantStage.name}
          </h3>
          <p className="text-[10px] text-muted-foreground">
            阶段 {currentIndex + 1}/{PLANT_STAGES.length}
          </p>
        </div>
      </div>
<p className="text-xs text-muted-foreground mb-4 leading-relaxed">
        {currentPlantStage.description}
      </p>
{nextPlantStage && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-[10px] mb-1.5">
            <span className="text-muted-foreground">
              下一阶段: {nextPlantStage.name}
            </span>
            <span className="font-medium text-primary">
              {state.affection}/{nextPlantStage.minAffection}
            </span>
          </div>
          <div className="h-2 rounded-full bg-border/30 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressToNext, 100)}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      )}
<div className="grid grid-cols-3 gap-2">
        <div className="text-center p-2 rounded-xl bg-white/10">
          <Heart size={14} className="mx-auto mb-1 text-pink-400" />
          <div className="text-sm font-bold" style={{ fontFamily: "var(--font-mono)" }}>
            {state.affection}
          </div>
          <div className="text-[9px] text-muted-foreground">好感度</div>
        </div>
        <div className="text-center p-2 rounded-xl bg-white/10">
          <Timer size={14} className="mx-auto mb-1 text-blue-400" />
          <div className="text-sm font-bold" style={{ fontFamily: "var(--font-mono)" }}>
            {state.totalFocusMinutes}
          </div>
          <div className="text-[9px] text-muted-foreground">专注分钟</div>
        </div>
        <div className="text-center p-2 rounded-xl bg-white/10">
          <Flame size={14} className="mx-auto mb-1 text-orange-400" />
          <div className="text-sm font-bold" style={{ fontFamily: "var(--font-mono)" }}>
            {state.currentStreak}
          </div>
          <div className="text-[9px] text-muted-foreground">连续天数</div>
        </div>
      </div>
<div className="mt-4 pt-3 border-t border-border/20">
        <div className="flex items-center justify-between">
          {PLANT_STAGES.map((stage, i) => (
            <div key={stage.name} className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold
                  ${i <= currentIndex
                    ? "bg-primary/20 text-primary"
                    : "bg-border/20 text-muted-foreground"
                  }`}
              >
                {i + 1}
              </div>
              {i < PLANT_STAGES.length - 1 && (
                <div
                  className={`w-3 h-0.5 ${
                    i < currentIndex ? "bg-primary/30" : "bg-border/20"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
