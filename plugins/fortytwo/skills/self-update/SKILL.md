---
name: self-update
description: Refresh fortytwo and its plugins, then verify health. On-demand, propose-then-apply. Wraps the native catalog refresh (`/plugin marketplace update`) and the npm engine/scaffold updater (`fortytwo update`), surfaces the `fortytwo doctor` report, and points to `fortytwo rollback` if anything breaks. Not scheduled, never silent.
---

# Self-update

Keep fortytwo current without surprising the owner. The engine-side commands
(`fortytwo update`, `fortytwo doctor`, `fortytwo rollback`) live in the `fortytwo`
npm package (the installer CLI); this skill orchestrates them alongside the native
Claude Code catalog refresh. It changes versions and scaffolding only — it never
touches the owner's persona or context.

Updates touch two independent layers that version separately and can drift:

- **Plugin catalog** (Claude Code native): `/plugin marketplace update` re-fetches the
  `fortytwo` marketplace and any installed plugins (`gate`, `memory`, `fortytwo`).
- **Engine + scaffold** (npm): `fortytwo update` bumps the CLI/engine and re-runs
  idempotent scaffold migrations against the owner's workspace.

## When to run

On-demand only. The owner invokes this skill explicitly (e.g. "update fortytwo",
"check for updates", "are we current?"). A wake-up/orient step *may* mention that a
newer version exists, but it must stop there and wait for a yes.

**Do not** schedule this, add it to a cron/hook, or run any step before the owner has
approved. There is no "auto-update" mode. Silence is not consent.

## Flow

Run the steps in order. Stop and report at the first failure; do not push past a
broken step.

1. **Propose.** Detect what's available and lay it out before doing anything:
   - Catalog: which marketplace/plugins have updates pending.
   - Engine: current vs. target `fortytwo` version (e.g. from `fortytwo --version`
     against the published version).
   - Summarize what each step will change, then **wait for explicit approval.**
     If the owner declines, stop cleanly — nothing has changed yet.

2. **Refresh the catalog.** Run:

   ```
   /plugin marketplace update
   ```

   Report which marketplace and plugins moved (and to what), or "already current".

3. **Update the engine + scaffold.** Run:

   ```
   fortytwo update
   ```

   Report the resulting engine version and any scaffold migrations that were applied.
   Migrations are idempotent; re-running is safe.

4. **Verify health.** Run:

   ```
   fortytwo doctor
   ```

   Surface the **full report verbatim** — do not summarize away detail. The report
   covers, at minimum: memory MCP reachable, gate hook wired, persona/context files
   intact, and engine/catalog versions aligned. Read the overall status:
   - **Green / healthy** → done. Give the one-line summary (step 6).
   - **Red / regressed** → go to step 5.

5. **On a red doctor or any step error — roll back.** Tell the owner plainly what
   failed, then instruct them to restore the previous known-good state:

   ```
   fortytwo rollback
   ```

   Do not attempt ad-hoc repairs of persona/context or hand-edit scaffold files to
   "fix" the regression — `rollback` is the supported recovery path. After rollback,
   suggest re-running `fortytwo doctor` to confirm the restore is green.

6. **Report once, at the end.** A single closing summary:
   - what changed in the catalog,
   - what changed in the engine/scaffold,
   - the doctor result (green/red),
   - and, if anything broke, the `fortytwo rollback` escape hatch.

## Boundaries

- **Never edit the owner's persona or context** as part of an update. This skill moves
  versions, plugins, and scaffolding only. Profile data is owned by the `onboarding` /
  `fortytwo init` writer, not by self-update.
- **Propose-then-apply, never silent.** Every run is owner-initiated and owner-approved.
- **The two layers are independent.** If the catalog updates but `fortytwo update` fails
  (or vice-versa), say so explicitly — they version separately and can drift, and a
  partial update is a real state worth naming.
- **Don't invent versions or health status.** Report what the commands actually print.
  If a command isn't available (e.g. `fortytwo` not on PATH), say so rather than guessing.
