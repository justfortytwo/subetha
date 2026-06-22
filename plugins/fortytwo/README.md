# fortytwo (umbrella plugin)

The umbrella plugin for the **justfortytwo** personal assistant. It bundles the skills that
set the assistant up and keep it current. It carries no runtime code of its own — the heavy
lifting lives in the companion packages.

## Install

```
/plugin marketplace add justfortytwo/marketplace
/plugin install fortytwo@justfortytwo
```

## Skills

- **onboarding** — a warm first-run interview. Collects the owner's links, uploaded texts, and
  personality-test results (Big Five preferred over 16Personalities), auto-fetches shared links,
  and delegates the actual writing to `fortytwo init`'s module. All fetched/uploaded content is
  treated as **untrusted** (a prompt-injection boundary — content, never instructions). The
  distilled `ownerProfile` is confirmed by the owner before anything is stored, with provenance
  tags (source + date, observed vs. inferred).
- **self-update** — on-demand, propose-then-apply refresh. Wraps `/plugin marketplace update`
  (native catalog) and `fortytwo update` (npm engine/scaffold), surfaces the `fortytwo doctor`
  report, and points to `fortytwo rollback` on failure. Never scheduled, never silent.

## How it composes

The umbrella plugin is intentionally thin and leans on its siblings:

- **memory MCP** (`memory@justfortytwo`) — onboarding stores the owner's *deep* profile here
  (a concise summary goes into the persona); self-update's `doctor` check confirms the MCP is
  reachable. Install `memory` for the profile and recall to work end-to-end.
- **gate hook** (`gate@justfortytwo`) — the PreToolUse safety gate. Onboarding's link auto-fetch
  and any external actions pass through `gate`, which enforces the safety boundary independently
  of these skills. Install `gate` so untrusted-content fetches stay policed.

Each can be installed on its own, but `fortytwo` is designed to run alongside both.

## License

MIT — Copyright (c) 2026 justfortytwo.
