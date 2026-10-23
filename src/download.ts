/** Soft-fail browser download. No-op when document is unavailable. */

export function downloadTextFile(
  filename: string,
  content: string,
  mime = "text/plain;charset=utf-8"
): { ok: true } | { ok: false; reason: string } {
  if (typeof document === "undefined")
    return { ok: false, reason: "document unavailable" };
  try {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      reason: e instanceof Error ? e.message : "download failed",
    };
  }
}

export function queueExportBasename(prefix = "offline-queue"): string {
  const d = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  return `${prefix}-${d}`;
}
