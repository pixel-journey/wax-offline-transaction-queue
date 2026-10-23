/**
 * Soft-fail online probe — educational only.
 * Success does not mean wallets or ABI are ready.
 */

export type ConnectivityResult =
  | { ok: true; latencyMs: number; source: string }
  | { ok: false; reason: string };

export async function probeChainHead(
  rpcBase = "https://wax.greymass.com"
): Promise<ConnectivityResult> {
  const url = `${rpcBase.replace(/\/$/, "")}/v1/chain/get_info`;
  const t0 = Date.now();
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: "{}",
    });
    if (!res.ok) return { ok: false, reason: `HTTP ${res.status}` };
    await res.json();
    return { ok: true, latencyMs: Date.now() - t0, source: url };
  } catch (e) {
    return {
      ok: false,
      reason: e instanceof Error ? e.message : "probe failed",
    };
  }
}
