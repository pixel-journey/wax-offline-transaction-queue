/**
 * Educational helpers for a future WharfKit drain step.
 * Does NOT import @wharfkit/* — keeps this package light and offline-testable.
 * Host apps should call session.transact after login/restore.
 */

import type { QueueItem } from "./types";

export interface TransactActionSketch {
  account: string;
  name: string;
  authorization: Array<{ actor: string; permission: string }>;
  data: Record<string, unknown>;
}

/**
 * Map one offline draft to a Session.transact-style action object.
 * Permission defaults to "active" — override when your session used another.
 */
export function draftToActions(
  item: QueueItem,
  actor: string,
  permission = "active"
): TransactActionSketch[] {
  return [
    {
      account: item.account,
      name: item.name,
      authorization: [{ actor, permission }],
      data: item.data ?? {},
    },
  ];
}

export function draftsToActions(
  items: QueueItem[],
  actor: string,
  permission = "active"
): TransactActionSketch[] {
  return items.flatMap((item) => draftToActions(item, actor, permission));
}
