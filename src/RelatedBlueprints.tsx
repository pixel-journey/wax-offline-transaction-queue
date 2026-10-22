"use client";

import { useId } from "react";

const LINKS = [
  {
    name: "wax-hardware-wallet-integration-patterns",
    href: "https://github.com/pixel-journey/wax-hardware-wallet-integration-patterns",
    why: "When drafts leave the offline queue, sign with a readiness-checked hardware path.",
  },
  {
    name: "wax-social-recovery-and-key-backup-tools",
    href: "https://github.com/pixel-journey/wax-social-recovery-and-key-backup-tools",
    why: "Owner/active separation before any reconnect-and-broadcast flow.",
  },
  {
    name: "wax-unified-wallet-health-dashboard",
    href: "https://github.com/pixel-journey/wax-unified-wallet-health-dashboard",
    why: "Check account wellness flags before draining a long offline backlog.",
  },
  {
    name: "ECOSYSTEM-RESILIENCE.md (PX §11)",
    href: "https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog/blob/main/ECOSYSTEM-RESILIENCE.md",
    why: "Do not depend on a single RPC or wallet host when flushing the queue.",
  },
] as const;

export function RelatedBlueprints({ className = "" }: { className?: string }) {
  const headingId = useId();

  return (
    <section
      className={`rounded-2xl border border-white/10 bg-black/30 p-6 ${className}`}
      aria-labelledby={headingId}
    >
      <h3 id={headingId} className="font-semibold text-lg mb-1">
        Related blueprints
      </h3>
      <p className="text-sm text-white/60 mb-4">
        This queue only stores drafts. Signing and broadcast belong in wallet
        session code — not here.
      </p>
      <ul className="space-y-3">
        {LINKS.map((l) => (
          <li key={l.href} className="text-sm">
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-emerald-400 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded"
            >
              {l.name}
            </a>
            <p className="text-white/55 text-xs mt-0.5 leading-relaxed">{l.why}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
