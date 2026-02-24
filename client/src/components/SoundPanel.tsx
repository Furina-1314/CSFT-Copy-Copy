import { useGame, SOUND_SCENES, INDIVIDUAL_SOUNDS } from "@/contexts/GameContext";
import { useAudioEngine } from "@/hooks/useAudioEngine";
import { Volume2, VolumeX, Sliders, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useRef } from "react";

type Mode = "scenes" | "mixer";

export default function SoundPanel() {
  const { state, dispatch } = useGame();
  const [mode, setMode] = useState<Mode>("scenes");
  const previousMixRef = useRef<Record<string, number>>({});
  const previousSceneRef = useRef<string | null>(null);

  useAudioEngine(state.customMix, state.masterVolume);

  const hasActiveSound = Object.values(state.customMix).some((v) => v > 0);
  
  const handleMuteToggle = () => {
    if (hasActiveSound) {
      // 保存当前状态并静音
      previousMixRef.current = { ...state.customMix };
      previousSceneRef.current = state.activeScene;
      dispatch({ type: "SET_SCENE", payload: null });
    } else {
      // 恢复之前的状态
      if (previousSceneRef.current && previousSceneRef.current !== "custom") {
        dispatch({ type: "SET_SCENE", payload: previousSceneRef.current });
      } else if (Object.keys(previousMixRef.current).length > 0) {
        dispatch({ type: "SET_CUSTOM_MIX", payload: previousMixRef.current });
        dispatch({ type: "SET_SCENE", payload: "custom" });
      }
    }
  };

  const handleSceneSelect = (sceneId: string) => {
    if (state.activeScene === sceneId) {
      dispatch({ type: "SET_SCENE", payload: null });
    } else {
      dispatch({ type: "SET_SCENE", payload: sceneId });
    }
  };

  const handleMixerToggle = (soundId: string) => {
    const newMix = { ...state.customMix };
    if (newMix[soundId] && newMix[soundId] > 0) {
      delete newMix[soundId];
    } else {
      newMix[soundId] = 0.5;
    }
    dispatch({ type: "SET_CUSTOM_MIX", payload: newMix });
    dispatch({ type: "SET_SCENE", payload: "custom" });
  };

  const handleMixerVolume = (soundId: string, volume: number) => {
    const newMix = { ...state.customMix };
    if (volume <= 0.01) {
      delete newMix[soundId];
    } else {
      newMix[soundId] = volume;
    }
    dispatch({ type: "SET_CUSTOM_MIX", payload: newMix });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-strong rounded-2xl p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h3
          className="text-sm font-semibold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          环境音效
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={handleMuteToggle}
            className={`p-1.5 rounded-lg transition-all ${
              !hasActiveSound ? "text-muted-foreground" : "text-foreground hover:bg-white/20"
            }`}
            title={hasActiveSound ? "静音" : "恢复音效"}
          >
            {hasActiveSound ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
        </div>
      </div>
<div className="flex gap-1 mb-3 bg-white/10 rounded-lg p-0.5">
        <button
          onClick={() => setMode("scenes")}
          className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-[10px] font-medium transition-all
            ${mode === "scenes" ? "bg-white/30 text-foreground shadow-sm" : "text-muted-foreground"}`}
        >
          <Sparkles size={10} />
          场景
        </button>
        <button
          onClick={() => setMode("mixer")}
          className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-[10px] font-medium transition-all
            ${mode === "mixer" ? "bg-white/30 text-foreground shadow-sm" : "text-muted-foreground"}`}
        >
          <Sliders size={10} />
          混音
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === "scenes" ? (
          <motion.div
            key="scenes"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-1.5"
          >
            {SOUND_SCENES.map((scene) => (
              <button
                key={scene.id}
                onClick={() => handleSceneSelect(scene.id)}
                className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl transition-all duration-200 text-left
                  ${state.activeScene === scene.id
                    ? "bg-primary/12 ring-1 ring-primary/25"
                    : "hover:bg-white/15"
                  }`}
              >
                <span className="text-lg shrink-0">{scene.icon}</span>
                <div className="min-w-0">
                  <div className="text-[11px] font-medium truncate">{scene.name}</div>
                  <div className="text-[9px] text-muted-foreground truncate">{scene.description}</div>
                </div>
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="mixer"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-1"
          >
            {INDIVIDUAL_SOUNDS.map((sound) => {
              const isActive = (state.customMix[sound.id] || 0) > 0;
              return (
                <div key={sound.id} className="flex items-center gap-2">
                  <button
                    onClick={() => handleMixerToggle(sound.id)}
                    className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all
                      ${isActive ? "bg-primary/15 ring-1 ring-primary/25" : "hover:bg-white/15"}`}
                  >
                    {sound.icon}
                  </button>
                  <span className="text-[10px] w-10 shrink-0 truncate">{sound.name}</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={state.customMix[sound.id] || 0}
                    onChange={(e) => handleMixerVolume(sound.id, parseFloat(e.target.value))}
                    className="flex-1 h-4 rounded-full appearance-none bg-border/40
                               [&::-webkit-slider-thumb]:appearance-none
                               [&::-webkit-slider-thumb]:w-4
                               [&::-webkit-slider-thumb]:h-4
                               [&::-webkit-slider-thumb]:rounded-full
                               [&::-webkit-slider-thumb]:bg-primary
                               [&::-webkit-slider-thumb]:shadow-sm
                               [&::-webkit-slider-thumb]:cursor-pointer
                               touch-manipulation"
                    aria-label={`${sound.name}音量`}
                  />
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
<div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/20">
        <VolumeX size={12} className="text-muted-foreground shrink-0" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={state.masterVolume}
          onChange={(e) =>
            dispatch({ type: "SET_MASTER_VOLUME", payload: parseFloat(e.target.value) })
          }
          className="flex-1 h-4 rounded-full appearance-none bg-border/40
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-4
                     [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-primary
                     [&::-webkit-slider-thumb]:shadow-md
                     [&::-webkit-slider-thumb]:cursor-pointer
                     touch-manipulation"
          aria-label="主音量"
        />
        <Volume2 size={12} className="text-muted-foreground shrink-0" />
      </div>
    </motion.div>
  );
}
