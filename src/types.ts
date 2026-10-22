/**
 * Offline queue shapes. Nothing here is signed or broadcast.
 */

export type QueueStatus = "pending" | "ready" | "failed" | "cancelled";

export interface QueueItem {
  id: string;
  /** Contract account (Antelope name) */
  account: string;
  /** Action name */
  name: string;
  /** Opaque educational payload — not validated against ABI */
  data?: Record<string, unknown>;
  status: QueueStatus;
  createdAt: string;
  note?: string;
}

export interface QueueState {
  items: QueueItem[];
  /** Hard cap on pending+ready items */
  maxPending: number;
}

export type QueueError =
  | { ok: false; reason: string }
  | { ok: true };
