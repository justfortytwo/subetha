import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function json(rel: string): any {
  return JSON.parse(readFileSync(join(root, rel), 'utf8'));
}

/** Minimal YAML-frontmatter reader: returns the `key: value` pairs in the leading --- block. */
function frontmatter(rel: string): Record<string, string> {
  const text = readFileSync(join(root, rel), 'utf8');
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out: Record<string, string> = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) out[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return out;
}

describe('marketplace.json', () => {
  const mk = json('.claude-plugin/marketplace.json');

  it('declares the fortytwo marketplace with a credited owner', () => {
    expect(mk.name).toBe('fortytwo');
    expect(mk.owner?.name).toBeTruthy();
  });

  it('lists gate, memory, and the fortytwo umbrella with valid sources', () => {
    const byName: Record<string, any> = Object.fromEntries(mk.plugins.map((p: any) => [p.name, p]));
    expect(Object.keys(byName).sort()).toEqual(['fortytwo', 'gate', 'memory']);
    expect(byName.gate.source).toMatchObject({ source: 'github', repo: 'justfortytwo/gate' });
    expect(byName.memory.source).toMatchObject({ source: 'github', repo: 'justfortytwo/memory' });
    expect(byName.fortytwo.source).toBe('./plugins/fortytwo'); // bundled in this repo
    for (const p of mk.plugins) expect(p.description?.length).toBeGreaterThan(10);
  });
});

describe('umbrella fortytwo plugin', () => {
  it('plugin.json parses and is named "fortytwo"', () => {
    expect(json('plugins/fortytwo/.claude-plugin/plugin.json').name).toBe('fortytwo');
  });

  it.each(['self-update', 'onboarding'])('skill "%s" has name + description frontmatter', (skill) => {
    const fm = frontmatter(`plugins/fortytwo/skills/${skill}/SKILL.md`);
    expect(fm.name).toBe(skill);
    expect((fm.description ?? '').length).toBeGreaterThan(20);
  });
});
