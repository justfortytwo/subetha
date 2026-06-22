# justfortytwo marketplace

The Claude Code plugin marketplace for **justfortytwo** — an open-source decomposition
of the "Ford" personal assistant into independent, composable pieces.

This repo is a single git repo containing `.claude-plugin/marketplace.json`, which catalogs
the org's plugins, plus the umbrella **fortytwo** plugin (bundled here under `plugins/`).

## Install

Add the marketplace once:

```
/plugin marketplace add justfortytwo/subetha
```

Then install whichever plugins you want:

```
/plugin install vogon@justfortytwo
/plugin install guide@justfortytwo
/plugin install fortytwo@justfortytwo
```

Keep everything current with:

```
/plugin marketplace update
```

## Plugins

| Plugin | Source | What it is |
|--------|--------|------------|
| **vogon** | `justfortytwo/vogon` (GitHub) | Standalone PreToolUse safety gate for Claude Code. Inspects tool calls before they run and blocks/asks per policy. |
| **guide** | `justfortytwo/guide` (GitHub) | Semantic-memory MCP server (SQLite + Ollama embeddings). Stores and recalls the owner's journal, docs, and deep profile. |
| **fortytwo** | `./plugins/fortytwo` (this repo) | Umbrella plugin bundling the onboarding + self-update skills. Composes with `guide` and `vogon`. |

## How they fit together

- **vogon** runs as a PreToolUse hook — the safety boundary for every tool call.
- **guide** runs as an MCP server — durable recall for the assistant.
- **fortytwo** ships the skills (onboarding, self-update) that drive setup and upkeep,
  writing the owner's deep profile into **guide** and relying on **vogon** for safety.

Each plugin installs independently; `fortytwo` is most useful with `guide` and `vogon` present.

## License

MIT — Copyright (c) 2026 justfortytwo.
