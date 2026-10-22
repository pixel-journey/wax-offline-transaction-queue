"use client";

import { useMemo, useState } from "react";
import {
  conflictHints,
  emptyQueue,
  enqueueItem,
  exportQueueMarkdown,
  markNext,
  peekNext,
  serializeQueue,
  setItemStatus,
} from "./queue";
import type { QueueState } from "./types";

const PRESETS = [
  { account: "eosio.token", name: "transfer" },
  { account: "eosio", name: "voteproducer" },
  { account: "eosio", name: "delegatebw" },
  { account: "atomicassets", name: "transfer" },
] as const;

export function Demo() {
  const [state, setState] = useState<QueueState>(() => emptyQueue());
  const [account, setAccount] = useState("eosio.token");
  const [name, setName] = useState("transfer");
  const [message, setMessage] = useState<string | null>(null);

  const next = useMemo(() => peekNext(state), [state]);
  const hints = useMemo(() => conflictHints(state), [state]);

  const push = () => {
    const r = enqueueItem(state, { account: account.trim(), name: name.trim() });
    if (!r.ok) {
      setMessage(r.reason);
      return;
    }
    setState(r.state);
    setMessage(`Queued ${r.item.account}::${r.item.name}`);
  };

  const copyMd = async () => {
    try {
      await navigator.clipboard.writeText(exportQueueMarkdown(state));
      setMessage("Markdown snapshot copied");
    } catch {
      setMessage("Clipboard unavailable");
    }
  };

  return (
    <main className="wrap space-y-6 max-w-xl mx-auto p-6 text-white">
      <p className="kicker text-xs uppercase tracking-widest text-emerald-400/80">
        Educational reference
      </p>
      <h1 className="text-2xl font-bold text-emerald-400">Offline transaction queue</h1>
      <p className="lede text-sm opacity-60">
        FIFO drafts with a hard active cap. Status transitions are local only —
        nothing is signed or broadcast.
      </p>

      <section className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={`${p.account}-${p.name}`}
              type="button"
              className="px-2 py-1 rounded-lg text-xs bg-white/10"
              onClick={() => {
                setAccount(p.account);
                setName(p.name);
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
        <label className="block text-xs opacity-70">
          Account
          <input
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 font-mono text-sm"
          />
        </label>
        <label className="block text-xs opacity-70">
          Action
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 font-mono text-sm"
          />
        </label>
        <button
          type="button"
          onClick={push}
          className="px-3 py-2 rounded-lg text-sm bg-emerald-700"
        >
          Enqueue draft
        </button>
      </section>

      <section className="rounded-2xl border border-white/10 bg-black/30 p-4 space-y-2">
        <p className="text-sm">
          Next active:{" "}
          <span className="font-mono text-emerald-400">
            {next ? `${next.account}::${next.name}` : "(none)"}
          </span>
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="px-2 py-1 rounded-lg text-xs bg-white/10"
            onClick={() => {
              const r = markNext(state, "ready");
              if (r.ok) setState(r.state);
              else setMessage(r.reason);
            }}
          >
            Mark next ready
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded-lg text-xs bg-amber-800/80"
            onClick={() => {
              const r = markNext(state, "failed");
              if (r.ok) setState(r.state);
              else setMessage(r.reason);
            }}
          >
            Mark next failed
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded-lg text-xs bg-white/10"
            onClick={() => {
              const r = markNext(state, "cancelled");
              if (r.ok) setState(r.state);
              else setMessage(r.reason);
            }}
          >
            Cancel next
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded-lg text-xs bg-sky-700"
            onClick={copyMd}
          >
            Copy markdown
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded-lg text-xs bg-white/10"
            onClick={() => setState(emptyQueue())}
          >
            Clear
          </button>
        </div>
      </section>

      <ul className="space-y-2 text-sm">
        {state.items.map((item) => (
          <li
            key={item.id}
            className="rounded-xl border border-white/10 px-3 py-2 flex justify-between gap-2"
          >
            <span>
              <span className="font-mono text-xs opacity-50">{item.id}</span>
              <span className="block font-mono text-emerald-300/90">
                {item.account}::{item.name}
              </span>
            </span>
            <span className="flex flex-col items-end gap-1">
              <span className="text-xs opacity-70">{item.status}</span>
              {(item.status === "pending" || item.status === "ready") && (
                <button
                  type="button"
                  className="text-[10px] underline opacity-60"
                  onClick={() => {
                    const r = setItemStatus(state, item.id, "cancelled");
                    if (r.ok) setState(r.state);
                  }}
                >
                  cancel
                </button>
              )}
            </span>
          </li>
        ))}
        {state.items.length === 0 && (
          <li className="text-xs opacity-50">Queue empty — enqueue a draft.</li>
        )}
      </ul>

      <ul className="text-xs space-y-1 opacity-80">
        {hints.map((h) => (
          <li
            key={h.message}
            className={h.level === "warn" ? "text-amber-300" : ""}
          >
            {h.message}
          </li>
        ))}
      </ul>

      {message && (
        <p className="text-xs text-emerald-200/80" role="status">
          {message}
        </p>
      )}

      <details className="text-[10px] opacity-40">
        <summary>JSON snapshot</summary>
        <pre className="overflow-x-auto mt-2">{serializeQueue(state)}</pre>
      </details>
    </main>
  );
}
