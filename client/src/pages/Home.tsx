import { useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import TimerPanel from "@/components/TimerPanel";
import SoundPanel from "@/components/SoundPanel";
import PlantInfo from "@/components/PlantInfo";
import NotesPanel from "@/components/NotesPanel";
import HabitsPanel from "@/components/HabitsPanel";
import StatsPanel from "@/components/StatsPanel";
import DialogBubble from "@/components/DialogBubble";
import FloatingParticles from "@/components/FloatingParticles";
import {
  FileText,
  Target,
  BarChart3,
  Leaf,
  ChevronLeft,
  ChevronRight,
  Timer,
  Volume2,
  Sprout,
  X,
} from "lucide-react";

const PlantScene = lazy(() => import("@/components/PlantScene"));

const CLOUDS_BG = "/assets/clouds-bg.png";

const HERO_BG = "/assets/hero-bg.png";

type RightTab = "notes" | "habits" | "stats";
type MobilePanel = "timer" | "sounds" | "plant" | "notes" | "habits" | "stats" | null;

export default function Home() {
  const [rightTab, setRightTab] = useState<RightTab>("notes");
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>(null);

  const rightTabs: { id: RightTab; label: string; icon: typeof FileText }[] = [
    { id: "notes", label: "笔记", icon: FileText },
    { id: "habits", label: "习惯", icon: Target },
    { id: "stats", label: "统计", icon: BarChart3 },
  ];

  const mobileTabs = [
    { id: "timer" as MobilePanel, label: "计时", icon: Timer },
    { id: "sounds" as MobilePanel, label: "音效", icon: Volume2 },
    { id: "plant" as MobilePanel, label: "植物", icon: Sprout },
    { id: "notes" as MobilePanel, label: "笔记", icon: FileText },
    { id: "habits" as MobilePanel, label: "习惯", icon: Target },
    { id: "stats" as MobilePanel, label: "统计", icon: BarChart3 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden">
<div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #d4f1f9 0%, #b8e6f0 30%, #a8d8ea 60%, #c5e8d5 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `url(${CLOUDS_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            animation: "cloudDrift 80s linear infinite",
          }}
        />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `url(${HERO_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
            maskImage: "linear-gradient(to top, black 0%, transparent 50%)",
            WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 35%, rgba(255,248,225,0.35) 0%, transparent 65%)",
          }}
        />
      </div>

      <FloatingParticles />
<div className="relative z-20 h-full hidden lg:flex">
<AnimatePresence mode="wait">
          {!leftCollapsed ? (
            <motion.div
              key="left-open"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-[280px] shrink-0 p-4 flex flex-col gap-3 overflow-y-auto relative"
            >
<div className="flex items-center gap-2.5 px-1 py-1.5">
                <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center shadow-sm">
                  <Leaf size={16} className="text-primary" />
                </div>
                <div>
                  <span
                    className="text-sm font-bold block leading-tight"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    专注陪伴
                  </span>
                  <span className="text-[9px] text-muted-foreground">Focus Companion</span>
                </div>
              </div>

              <TimerPanel />
              <SoundPanel />

              <button
                onClick={() => setLeftCollapsed(true)}
                className="absolute top-1/2 -right-3 w-6 h-14 rounded-r-xl glass 
                           flex items-center justify-center hover:bg-white/50 transition-all z-30"
              >
                <ChevronLeft size={12} className="text-muted-foreground" />
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="left-closed"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={() => setLeftCollapsed(false)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-16 rounded-xl glass
                         flex items-center justify-center hover:bg-white/50 transition-all z-30
                         shadow-lg"
            >
              <ChevronRight size={14} className="text-muted-foreground" />
            </motion.button>
          )}
        </AnimatePresence>
<div className="flex-1 relative flex items-center justify-center">
          <div className="w-full h-full max-w-xl max-h-[550px] relative">
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Leaf size={36} className="mx-auto mb-3 text-primary/40 animate-pulse" />
                    <p className="text-xs text-muted-foreground/60" style={{ fontFamily: "var(--font-display)" }}>
                      正在加载温室...
                    </p>
                  </div>
                </div>
              }
            >
              <PlantScene />
            </Suspense>
            <DialogBubble />
          </div>
        </div>
<AnimatePresence mode="wait">
          {!rightCollapsed ? (
            <motion.div
              key="right-open"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-[280px] shrink-0 p-4 flex flex-col gap-3 overflow-y-auto relative"
            >
              <PlantInfo />
<div className="flex gap-0.5 glass rounded-xl p-1">
                {rightTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setRightTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg 
                               text-[11px] font-medium transition-all duration-200
                      ${rightTab === tab.id
                        ? "bg-white/40 text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/15"
                      }`}
                  >
                    <tab.icon size={13} />
                    {tab.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {rightTab === "notes" && <NotesPanel key="notes" />}
                {rightTab === "habits" && <HabitsPanel key="habits" />}
                {rightTab === "stats" && <StatsPanel key="stats" />}
              </AnimatePresence>

              <button
                onClick={() => setRightCollapsed(true)}
                className="absolute top-1/2 -left-3 w-6 h-14 rounded-l-xl glass 
                           flex items-center justify-center hover:bg-white/50 transition-all z-30"
              >
                <ChevronRight size={12} className="text-muted-foreground" />
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="right-closed"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={() => setRightCollapsed(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-16 rounded-xl glass
                         flex items-center justify-center hover:bg-white/50 transition-all z-30
                         shadow-lg"
            >
              <ChevronLeft size={14} className="text-muted-foreground" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
<div className="relative z-20 h-full flex flex-col lg:hidden">
<div className="flex items-center gap-2 px-4 pt-3 pb-2">
          <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
            <Leaf size={14} className="text-primary" />
          </div>
          <span
            className="text-sm font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            专注陪伴
          </span>
        </div>
<div className="flex-1 relative">
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <Leaf size={32} className="text-primary/40 animate-pulse" />
              </div>
            }
          >
            <PlantScene />
          </Suspense>
          <DialogBubble />
        </div>
<AnimatePresence>
          {mobilePanel && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-14 left-0 right-0 z-30 max-h-[60vh] overflow-y-auto
                         rounded-t-3xl glass-strong p-4 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-1 rounded-full bg-border/40 mx-auto" />
                <button
                  onClick={() => setMobilePanel(null)}
                  className="absolute right-3 top-3 p-1.5 rounded-full hover:bg-white/20 
                           transition-colors touch-manipulation"
                  aria-label="关闭面板"
                >
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>
              {mobilePanel === "timer" && <TimerPanel />}
              {mobilePanel === "sounds" && <SoundPanel />}
              {mobilePanel === "plant" && <PlantInfo />}
              {mobilePanel === "notes" && <NotesPanel />}
              {mobilePanel === "habits" && <HabitsPanel />}
              {mobilePanel === "stats" && <StatsPanel />}
            </motion.div>
          )}
        </AnimatePresence>
<div className="shrink-0 glass-strong border-t border-white/20 px-2 py-1.5 flex items-center justify-around">
          {mobileTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMobilePanel(mobilePanel === tab.id ? null : tab.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all
                active:scale-95 touch-manipulation min-w-[56px]
                ${mobilePanel === tab.id
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground active:bg-white/10"
                }`}
              aria-label={tab.label}
              aria-pressed={mobilePanel === tab.id}
            >
              <tab.icon size={18} />
              <span className="text-[9px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
<style>{`
        @keyframes cloudDrift {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </div>
  );
}
