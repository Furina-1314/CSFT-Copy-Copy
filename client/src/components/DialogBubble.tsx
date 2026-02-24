import { useGame, type DialogMessage } from "@/contexts/GameContext";
import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MessageCircle } from "lucide-react";

export default function DialogBubble() {
  const { state, getDialogForType } = useGame();
  const [currentDialog, setCurrentDialog] = useState<DialogMessage | null>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const hasShownGreetingRef = useRef(false);

  // 休息结束时的提示
  useEffect(() => {
    if (state.timerMode === "break" && !state.isTimerRunning && state.sessionsCompleted > 0) {
      const dialog = getDialogForType("rest");
      showDialog(dialog);
    }
  }, [state.timerMode, state.sessionsCompleted, getDialogForType]);

  // 每日问候语 - 只在组件首次挂载时触发一次
  useEffect(() => {
    if (hasShownGreetingRef.current) return;
    
    const lastGreeting = localStorage.getItem("focus-companion-last-greeting");
    const today = new Date().toDateString();
    
    if (lastGreeting !== today) {
      localStorage.setItem("focus-companion-last-greeting", today);
      hasShownGreetingRef.current = true;
      const timer = setTimeout(() => {
        const dialog = getDialogForType("greeting");
        showDialog(dialog);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [getDialogForType]);

  const showDialog = useCallback((dialog: DialogMessage) => {
    setCurrentDialog(dialog);
    setDisplayedText("");
    setIsTyping(true);
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!currentDialog || !isTyping) return;
    const text = currentDialog.text;
    let index = 0;
    let hideTimeout: ReturnType<typeof setTimeout> | null = null;

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
        hideTimeout = setTimeout(() => setIsVisible(false), 6000);
      }
    }, 50);

    return () => {
      clearInterval(interval);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [currentDialog, isTyping]);

  return (
    <AnimatePresence>
      {isVisible && currentDialog && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 max-w-xs"
        >
          <div className="glass-strong rounded-2xl px-4 py-3 relative">
<button
              onClick={() => setIsVisible(false)}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white/60 
                         flex items-center justify-center hover:bg-white/80 transition-all"
            >
              <X size={10} />
            </button>
<div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <MessageCircle size={12} className="text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium leading-relaxed">
                  {displayedText}
                  {isTyping && (
                    <span className="inline-block w-0.5 h-3 bg-foreground/60 ml-0.5 animate-pulse" />
                  )}
                </p>
              </div>
            </div>
<div
              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 
                          rotate-45 glass-strong border-t-0 border-l-0"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
