"use client";

import { useEffect, useMemo, useState } from "react";
import { RelatedBlueprints } from "./RelatedBlueprints";
import { probeChainHead } from "./connectivity";
import { importQueueJson } from "./importQueue";
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
import {
  exportDrainPlanMarkdown,
  markAllPendingReady,
  moveActive,
  purgeTerminal,
  simulateDrainStep,
} from "./queueOps";
import {
  clearQueueLocalStorage,
  loadQueueFromLocalStorage,
  saveQueueToLocalStorage,
} from "./storage";
import { DEFAULT_TTL_MS, expireStale, listExpired } from "./ttl";
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
  const [actor, setActor] = useState("alice.wam");
  const [importText, setImportText] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [probing, setProbing] = useState(false);

  useEffect(() => {
    const loaded = loadQueueFromLocalStorage();
    if (loaded.ok && loaded.value) {
      setState(loaded.value);
      setMessage(`Restored ${loaded.value.items.length} item(s) from localStorage`);
    }
    setHydrated(true);
  }, []);

  const next = useMemo(() => peekNext(state), [state]);
  const hints = useMemo(() => conflictHints(state), [state]);
  const expiredCount = useMemo(
    () => listExpired(state, DEFAULT_TTL_MS).length,
    [state]
  );

  const applyState = (nextState: QueueState, note: string) => {
    setState(nextState);
    const saved = saveQueueToLocalStorage(nextState);
    setMessage(
      saved.ok ? note : `${note} · storage: ${saved.reason ?? "failed"}`
    );
  };

  const push = () => {
    const r = enqueueItem(state, { account: account.trim(), name: name.trim() });
    if (!r.ok) {
      setMessage(r.reason);
      return;
    }
    applyState(r.state, `Queued ${r.item.account}::${r.item.name}`);
  };

  const copy = async (text: string, ok: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setMessage(ok);
    } catch {
      setMessage("Clipboard unavailable");
    }
  };

  return (
    <main className="wrap space-y-6 max-w-xl mx-auto p-6 text-white">
      <p className="kicker text-xs uppercase tracking-widest text-emerald-400/80">
        Educational reference · Passes 11–13
      </p>
      <h1 className="text-2xl font-bold text-emerald-400">Offline transaction queue</h1>
      <p className="lede text-sm opacity-60">
        Draft FIFO + TTL + import. Drain online with WharfKit only when you mean it.
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
          Contract account
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
        <label className="block text-xs opacity-70">
          Actor (drain plan)
          <input
            value={actor}
            onChange={(e) => setActor(e.target.value)}
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
          Next:{" "}
          <span className="font-mono text-emerald-400">
            {next ? `${next.account}::${next.name}` : "(none)"}
          </span>
          {expiredCount > 0 && (
            <span className="text-amber-300 text-xs ml-2">
              · {expiredCount} past 24h TTL
            </span>
          )}
          {!hydrated && (
            <span className="text-xs opacity-40 ml-2">hydrating…</span>
          )}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="px-2 py-1 rounded-lg text-xs bg-white/10"
            onClick={() => {
              const r = markNext(state, "ready");
              if (r.ok) applyState(r.state, "Marked next ready");
              else setMessage(r.reason);
            }}
          >
            Mark next ready
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded-lg text-xs bg-white/10"
            onClick={() => {
              const r = markAllPendingReady(state);
              applyState(r.state, `Marked ${r.count} pending → ready`);
            }}
          >
            All pending → ready
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded-lg text-xs bg-emerald-900"
            onClick={() => {
              const r = simulateDrainStep(state);
              if (r.ok)
                applyState(
                  r.state,
                  `Simulated drain of ${r.item.account}::${r.item.name}`
                );
              else setMessage(r.reason);
            }}
          >
            Simulate drain step
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded-lg text-xs bg-amber-900"
            onClick={() => {
              const r = expireStale(state);
              applyState(r.state, `Expired ${r.expired} stale draft(s)`);
            }}
          >
            Expire &gt;24h
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded-lg text-xs bg-white/10"
            onClick={() => {
              const r = purgeTerminal(state);
              applyState(r.state, `Purged ${r.removed} terminal`);
            }}
          >
            Purge terminal
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded-lg text-xs bg-sky-800 disabled:opacity-50"
            disabled={probing}
            onClick={async () => {
              setProbing(true);
              const r = await probeChainHead();
              setProbing(false);
              setMessage(
                r.ok
                  ? `Online probe ok · ${r.latencyMs}ms · still no auto-broadcast`
                  : `Offline/soft-fail: ${r.reason}`
              );
            }}
          >
            {probing ? "Probing…" : "Probe get_info"}
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded-lg text-xs bg-sky-700"
            onClick={() => copy(exportQueueMarkdown(state), "Queue MD copied")}
          >
            Copy queue MD
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded-lg text-xs bg-sky-900"
            onClick={() =>
              copy(
                exportDrainPlanMarkdown(state, actor.trim() || "alice.wam"),
                "Drain plan copied"
              )
            }
          >
            Copy drain plan
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded-lg text-xs bg-white/10"
            onClick={() => {
              clearQueueLocalStorage();
              applyState(emptyQueue(), "Cleared");
            }}
          >
            Clear all
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-2">
        <p className="text-xs opacity-60">Import JSON snapshot</p>
        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          rows={3}
          className="w-full font-mono text-[10px] bg-black/60 border border-white/10 rounded-lg p-2"
          placeholder='{"items":[],"maxPending":5}'
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="px-2 py-1 rounded-lg text-xs bg-violet-800"
            onClick={() => {
              const r = importQueueJson(importText, state, "replace");
              if (r.ok) applyState(r.state, "Imported (replace)");
              else setMessage(r.reason);
            }}
          >
            Import replace
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded-lg text-xs bg-violet-900"
            onClick={() => {
              const r = importQueueJson(importText, state, "append-active");
              if (r.ok) applyState(r.state, "Imported (append-active)");
              else setMessage(r.reason);
            }}
          >
            Import append-active
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
                <span className="flex gap-2 text-[10px]">
                  <button
                    type="button"
                    className="underline opacity-60"
                    onClick={() => {
                      const r = moveActive(state, item.id, "up");
                      if (r.ok) applyState(r.state, "Moved up");
                      else setMessage(r.reason);
                    }}
                  >
                    up
                  </button>
                  <button
                    type="button"
                    className="underline opacity-60"
                    onClick={() => {
                      const r = moveActive(state, item.id, "down");
                      if (r.ok) applyState(r.state, "Moved down");
                      else setMessage(r.reason);
                    }}
                  >
                    down
                  </button>
                  <button
                    type="button"
                    className="underline opacity-60"
                    onClick={() => {
                      const r = setItemStatus(state, item.id, "cancelled");
                      if (r.ok) applyState(r.state, `Cancelled ${item.id}`);
                    }}
                  >
                    cancel
                  </button>
                </span>
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

      <RelatedBlueprints />
    </main>
  );
}
