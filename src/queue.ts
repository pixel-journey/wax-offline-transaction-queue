/**
 * A FIFO of action names. At most 5 waiting.
 * Nothing is broadcast.
 */

const ACTION = /^[a-z1-5]{1,13}$/;

export function enqueue(queue: readonly string[], name: string): { ok: false; reason: string } | { ok: true; queue: string[] } {
  if (queue.length >= 5) return { ok: false, reason: "the queue already has 5 actions" };
  if (!ACTION.test(name)) return { ok: false, reason: `${name} is not an action name` };
  return { ok: true, queue: [...queue, name] };
}

export function dequeue(queue: readonly string[]): { ok: false; reason: string } | { ok: true; name: string; queue: string[] } {
  if (queue.length === 0) return { ok: false, reason: "the queue is empty" };
  const [name, ...rest] = queue;
  return { ok: true, name, queue: rest };
}
