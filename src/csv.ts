import type { QueueItem, QueueState } from "./types";

function esc(cell: string): string {
  if (/[",\n\r]/.test(cell)) return `"${cell.replace(/"/g, '""')}"`;
  return cell;
}

export function itemToCsvRow(item: QueueItem): string {
  const data = item.data ? JSON.stringify(item.data) : "";
  return [
    item.id,
    item.account,
    item.name,
    item.status,
    item.createdAt,
    item.note ?? "",
    data,
  ]
    .map((c) => esc(String(c)))
    .join(",");
}

export function exportQueueCsv(state: QueueState): string {
  const header = "id,account,name,status,createdAt,note,data";
  const rows = state.items.map(itemToCsvRow);
  return [header, ...rows].join("\n") + "\n";
}
