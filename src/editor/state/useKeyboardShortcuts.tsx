import { useEffect } from "react";

interface ShortcutOptions {
  onUndo: () => void;
  onRedo: () => void;
  onDelete: () => void;
}

export function useKeyboardShortcuts({
  onUndo,
  onRedo,
  onDelete,
}: ShortcutOptions) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      // Ignore inputs & textareas
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      if (isCtrlOrCmd && e.key === "z") {
        e.preventDefault();
        onUndo();
      }

      if (isCtrlOrCmd && e.key === "y") {
        e.preventDefault();
        onRedo();
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        onDelete();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onUndo, onRedo, onDelete]);
}
