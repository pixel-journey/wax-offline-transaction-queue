"use client";

import { dequeue, enqueue } from "./queue";

export function Demo() {
  const waiting = enqueue(["transfer"], "stake");
  const next = waiting.ok ? dequeue(waiting.queue) : null;
  return (
    <main className="wrap">
      <p className="kicker">Educational reference</p>
      <h1>transfer, then stake</h1>
      <p className="lede">The first name out is transfer. A sixth name is refused. Nothing is broadcast.</p>
      {next && next.ok ? <p>Next: {next.name}. Left: {next.queue.join(", ") || "none"}.</p> : <p>The sample failed.</p>}
    </main>
  );
}
