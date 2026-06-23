# fortytwo marketplace

The Claude Code plugin marketplace for **fortytwo** — an open-source decomposition
of the fortytwo personal assistant into independent, composable pieces.

This repo is a single git repo containing `.claude-plugin/marketplace.json`, which catalogs
the org's plugins, plus the umbrella **fortytwo** plugin (bundled here under `plugins/`).

## Install

Add the marketplace once:

```
/plugin marketplace add justfortytwo/marketplace
```

Then install whichever plugins you want:

```
/plugin install gate@fortytwo
/plugin install memory@fortytwo
/plugin install fortytwo@fortytwo
```

Keep everything current with:

```
/plugin marketplace update
```

## Plugins

| Plugin | Source | What it is |
|--------|--------|------------|
| **gate** | `justfortytwo/gate` (GitHub) | Standalone PreToolUse safety gate for Claude Code. Inspects tool calls before they run and blocks/asks per policy. |
| **memory** | `justfortytwo/memory` (GitHub) | Semantic-memory MCP server (SQLite + Ollama embeddings). Stores and recalls the owner's journal, docs, and deep profile. |
| **fortytwo** | `./plugins/fortytwo` (this repo) | Umbrella plugin bundling the onboarding + self-update skills. Composes with `memory` and `gate`. |

## How they fit together

- **gate** runs as a PreToolUse hook — the safety boundary for every tool call.
- **memory** runs as an MCP server — durable recall for the assistant.
- **fortytwo** ships the skills (onboarding, self-update) that drive setup and upkeep,
  writing the owner's deep profile into **memory** and relying on **gate** for safety.

Each plugin installs independently; `fortytwo` is most useful with `memory` and `gate` present.

## License

MIT — Copyright (c) 2026 Enrico Deleo.

---

Created and maintained by [**Enrico Deleo**](https://enricodeleo.com).
