import type { QueueState } from "./types";

export interface UndoStack {
  past: QueueState[];
  max: number;
}

export function emptyUndo(max = 20): UndoStack {
  return { past: [], max };
}

/** Push a snapshot before applying a mutation. */
export function pushUndo(stack: UndoStack, state: QueueState): UndoStack {
  const past = [...stack.past, structuredClone(state)];
  if (past.length > stack.max) past.shift();
  return { ...stack, past };
}

export function popUndo(
  stack: UndoStack
): { ok: false; reason: string } | { ok: true; stack: UndoStack; state: QueueState } {
  if (stack.past.length === 0)
    return { ok: false, reason: "nothing to undo" };
  const past = stack.past.slice();
  const state = past.pop()!;
  return { ok: true, stack: { ...stack, past }, state };
}

export function undoDepth(stack: UndoStack): number {
  return stack.past.length;
}
