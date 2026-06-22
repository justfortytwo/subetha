---
name: self-update
description: Refresh fortytwo and its plugins, then verify health. On-demand, propose-then-apply. Wraps the native catalog refresh (`/plugin marketplace update`) and the npm engine/scaffold updater (`fortytwo update`), surfaces the `fortytwo doctor` report, and points to `fortytwo rollback` if anything breaks. Not scheduled, never silent.
---

# Self-update

> STUB — describes intended behavior; the engine-side commands live in the `fortytwo` npm package.

Keep fortytwo current without surprising the owner. Updates touch two independent layers:

- **Plugin catalog** (Claude Code native): `/plugin marketplace update` re-fetches the
  `fortytwo` marketplace and any installed plugins (`vogon`, `guide`, `fortytwo`).
- **Engine + scaffold** (npm): `fortytwo update` bumps the CLI/engine and re-runs idempotent
  scaffold migrations against the owner's workspace.

## Trigger

On-demand only. Propose, then apply. **Do not** schedule this or run it silently —
the owner explicitly opts in each time. A wake-up/orient may *suggest* updating when a
new version is detected, but must wait for a yes.

## Flow

1. **Propose.** State what's available (catalog vs. engine), the current vs. target
   versions, and what will change. Wait for explicit approval.
2. **Refresh the catalog.** Run `/plugin marketplace update`. Report which plugins moved.
3. **Update the engine/scaffold.** Run `fortytwo update`. Report engine version + any
   scaffold migrations applied.
4. **Verify.** Run `fortytwo doctor` and surface the full report verbatim
   (guide MCP reachable, vogon hook wired, persona/context intact, versions aligned).
5. **On failure.** If `doctor` reports a regression or any step errors, instruct the owner to
   run `fortytwo rollback` to restore the previous known-good state, then report what failed.

## Boundaries

- Never edit the owner's persona/context as part of an update — only engine + scaffold + plugins.
- One report at the end: what changed, the doctor result, and the rollback escape hatch.
- If the catalog updates but the engine update fails (or vice-versa), say so plainly —
  the two layers version independently and can drift.
