import { HISTORY_ORIGIN, historyActions } from "./api";
import { dequeue, enqueue } from "./queue";
import type { ChainAction, HttpRequest } from "./api";

export type UseCase = {
  title: string;
  detail: string;
  request: HttpRequest;
  transaction: { note: string; actions: ChainAction[] } | null;
};

const waiting = enqueue(["transfer"], "stake");
if (!waiting.ok) throw new Error(waiting.reason);
const next = dequeue(waiting.queue);
if (!next.ok) throw new Error(next.reason);

export const USE_CASES: UseCase[] = [
  {
    title: "Transfer history is not this queue",
    detail: `The first name out is ${next.name}. Hyperion is not walked. Nothing is broadcast.`,
    request: historyActions(HISTORY_ORIGIN, "alice", "eosio.token:transfer", 20),
    transaction: null,
  },
  {
    title: "A sixth name is refused",
    detail: "No action is built from the queue.",
    request: historyActions(HISTORY_ORIGIN, "bob", "eosio.token:transfer", 20),
    transaction: null,
  },
];

export function assertUseCases(): void {
  if (!next.ok || next.name !== "transfer" || enqueue(["a", "b", "c", "d", "e"], "transfer").ok) throw new Error("queue");
}
