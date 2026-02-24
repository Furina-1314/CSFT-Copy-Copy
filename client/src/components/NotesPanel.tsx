import { useGame, type MemoEntry } from "@/contexts/GameContext";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, Lightbulb, Check, ChevronDown, Tag, AlertCircle } from "lucide-react";

const PRIORITY_CONFIG = {
  low: { label: "低", color: "text-blue-400", bg: "bg-blue-400/15" },
  medium: { label: "中", color: "text-amber-500", bg: "bg-amber-400/15" },
  high: { label: "高", color: "text-red-400", bg: "bg-red-400/15" },
};

export default function NotesPanel() {
  const { state, dispatch } = useGame();
  const [newContent, setNewContent] = useState("");
  const [newTag, setNewTag] = useState(state.memoTags[0] || "学习");
  const [newPriority, setNewPriority] = useState<MemoEntry["priority"]>("medium");
  const [isAdding, setIsAdding] = useState(false);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [showDone, setShowDone] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");
  const [showNewTag, setShowNewTag] = useState(false);

  const handleAdd = () => {
    if (!newContent.trim()) return;
    dispatch({
      type: "ADD_MEMO",
      payload: { content: newContent.trim(), tag: newTag, priority: newPriority },
    });
    setNewContent("");
    setIsAdding(false);
  };

  const filteredMemos = state.memos.filter((m) => {
    if (!showDone && m.done) return false;
    if (filterTag && m.tag !== filterTag) return false;
    return true;
  });

  const pendingCount = state.memos.filter((m) => !m.done).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-strong rounded-2xl p-4 flex flex-col"
      style={{ maxHeight: "420px" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb size={15} className="text-amber-400" />
        <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
          灵感备忘
        </h3>
        <span className="text-[9px] text-muted-foreground ml-auto">
          {pendingCount} 条待处理
        </span>
      </div>
<div className="flex gap-1 mb-2 flex-wrap">
        <button
          onClick={() => setFilterTag(null)}
          className={`px-2 py-0.5 rounded-md text-[9px] font-medium transition-all
            ${!filterTag ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-white/15"}`}
        >
          全部
        </button>
        {state.memoTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setFilterTag(filterTag === tag ? null : tag)}
            className={`px-2 py-0.5 rounded-md text-[9px] font-medium transition-all
              ${filterTag === tag ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-white/15"}`}
          >
            {tag}
          </button>
        ))}
        <button
          onClick={() => setShowDone(!showDone)}
          className={`px-2 py-0.5 rounded-md text-[9px] font-medium transition-all
            ${showDone ? "bg-green-400/15 text-green-600" : "text-muted-foreground hover:bg-white/15"}`}
        >
          {showDone ? "隐藏已完成" : "显示已完成"}
        </button>
      </div>
<AnimatePresence>
        {isAdding ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-2 overflow-hidden"
          >
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAdd(); }
                if (e.key === "Escape") setIsAdding(false);
              }}
              placeholder="记录灵感、待查资料、学习笔记..."
              rows={2}
              autoFocus
              className="w-full bg-white/15 rounded-xl px-3 py-2 text-xs resize-none
                         placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1
                         focus:ring-primary/30 transition-all mb-1.5"
            />
            <div className="flex items-center gap-1.5">
<div className="relative">
                <select
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="appearance-none bg-white/15 rounded-lg px-2 py-1 text-[10px] pr-5
                             focus:outline-none focus:ring-1 focus:ring-primary/30"
                >
                  {state.memoTags.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown size={8} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
{showNewTag ? (
                <input
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newTagInput.trim()) {
                      dispatch({ type: "ADD_MEMO_TAG", payload: newTagInput.trim() });
                      setNewTag(newTagInput.trim());
                      setNewTagInput("");
                      setShowNewTag(false);
                    }
                    if (e.key === "Escape") setShowNewTag(false);
                  }}
                  placeholder="新标签"
                  autoFocus
                  className="w-16 bg-white/15 rounded-lg px-2 py-1 text-[10px]
                             focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              ) : (
                <button
                  onClick={() => setShowNewTag(true)}
                  className="p-1 rounded-lg hover:bg-white/15 text-muted-foreground"
                  title="添加标签"
                >
                  <Tag size={10} />
                </button>
              )}
<div className="flex gap-0.5 ml-auto">
                {(["low", "medium", "high"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setNewPriority(p)}
                    className={`px-1.5 py-0.5 rounded text-[8px] font-medium transition-all
                      ${newPriority === p ? PRIORITY_CONFIG[p].bg + " " + PRIORITY_CONFIG[p].color : "text-muted-foreground"}`}
                  >
                    {PRIORITY_CONFIG[p].label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleAdd}
                disabled={!newContent.trim()}
                className="px-2.5 py-1 rounded-lg bg-primary/15 text-primary text-[10px]
                           font-medium hover:bg-primary/25 transition-all disabled:opacity-30"
              >
                保存
              </button>
            </div>
          </motion.div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2 mb-2 rounded-xl
                       text-xs text-muted-foreground hover:bg-white/10 transition-all
                       border border-dashed border-border/30"
          >
            <Plus size={12} />
            记录灵感
          </button>
        )}
      </AnimatePresence>
<div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
        {filteredMemos.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground/50">
            <Lightbulb size={20} className="mx-auto mb-1.5 opacity-30" />
            <p className="text-[10px]">专注时随手记录灵感和想法</p>
          </div>
        ) : (
          filteredMemos.map((memo) => (
            <motion.div
              key={memo.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`group bg-white/10 rounded-xl p-2.5 relative ${memo.done ? "opacity-50" : ""}`}
            >
              <div className="flex items-start gap-2">
                <button
                  onClick={() => dispatch({ type: "UPDATE_MEMO", payload: { id: memo.id, done: !memo.done } })}
                  className="shrink-0 mt-0.5"
                >
                  {memo.done ? (
                    <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check size={8} className="text-primary" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-border/50" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-[11px] leading-relaxed ${memo.done ? "line-through" : ""}`}>
                    {memo.content}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/15 text-muted-foreground">
                      {memo.tag}
                    </span>
                    {memo.priority === "high" && (
                      <AlertCircle size={8} className="text-red-400" />
                    )}
                    <span className="text-[8px] text-muted-foreground/50 ml-auto">
                      {new Date(memo.updatedAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => dispatch({ type: "DELETE_MEMO", payload: memo.id })}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity
                             text-destructive/50 hover:text-destructive shrink-0
                             active:opacity-100 touch-manipulation p-1 rounded"
                  aria-label="删除备忘"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
