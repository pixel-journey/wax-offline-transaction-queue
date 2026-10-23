# WharfKit and the offline → online flow

**Trust label:** educational-reference

## Intent

1. **Offline / deferred:** queue action **drafts** in the client (this package).
2. **Online:** user confirms → **WharfKit** `session.transact` → update queue status.

Pure helpers never auto-broadcast. **Live drain is expected** in a real dApp.

## Recommended stack

- `@wharfkit/session` (+ wallet plugins you support)
- Not: greenfield eosjs / UAL-only / Anchor Link as the only path

## Drain

See `src/liveDrain.sketch.ts`:

- `draftToActions` maps a `QueueItem` → transact actions
- `drainNextWithSession(state, session, actor)` calls `session.transact` and marks success/fail

Host app installs WharfKit, logs in, then drains with user confirmation (especially for transfers).

## Related

- [POLICY.md](./POLICY.md)
- Permission / session-key blueprints in the Pixel Journey org
