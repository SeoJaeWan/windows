---
name: review-wiki-setup
description: Create or verify the `~/.codex/reviewWiki` link to the Obsidian review wiki vault, bootstrap the required `raw/` and `wiki/` structure, and maintain a workspace planning sync under `./.codex/review-wiki/sync/current`. Use when the review wiki link is missing, broken, moved, the vault needs first-time setup, or the workspace planning sync needs to be created or refreshed for planning agents.
---

# Review Wiki Setup

Use this skill to connect Codex to the Obsidian vault, create the minimum review wiki structure, and maintain the workspace planning sync consumed by planning agents. Read [references/platform-commands.md](references/platform-commands.md), [references/bootstrap-layout.md](references/bootstrap-layout.md), and [references/staging-contract.md](references/staging-contract.md) before editing the filesystem.

## Workflow

1. Resolve the actual vault path.
   - Use the real Obsidian vault path for this machine.
   - Treat the actual vault path as environment-specific input.
   - The Codex-facing path is always `~/.codex/reviewWiki`.

2. Create or verify the `~/.codex/reviewWiki` link.
   - Use the platform-appropriate link command from the reference file.
   - If a broken link or wrong target already exists, fix that first.
   - Do not continue bootstrapping against the wrong root.

3. Bootstrap the vault structure.
   - Create `raw/`, `wiki/`, `wiki/core/`, `wiki/patterns/`, and `wiki/_meta/` if they do not exist.
   - Seed `wiki/registry.json` if missing.
   - Seed the core planning documents if missing.
   - Preserve existing user content; do not overwrite populated files without explicit approval.

4. Refresh the workspace planning sync when requested.
   - Run the platform-appropriate sync command from `references/platform-commands.md` from the workspace root.
   - On Windows, use `stage-review-wiki.ps1`.
   - On macOS / Linux, use `stage-review-wiki.sh`.
   - Copy the contents of the external `wiki/` root into `./.codex/review-wiki/sync/current/`.
   - After syncing, treat `./.codex/review-wiki/sync/current/` itself as the planning root that contains `registry.json`, `core/`, `patterns/`, and `_meta/`.
   - Write `synced.json` with the source root, destination root, and sync timestamp.
   - Treat the workspace sync as read-only execution input; the source of truth remains `~/.codex/reviewWiki`.

5. Verify the bootstrap and sync.
   - Confirm the link resolves to the expected vault.
   - Confirm the required folders, registry, and core documents exist.
   - Confirm `architect`, `plan-review`, and `orchestrator` can target the same workspace sync path.
   - If a workspace sync was refreshed, confirm `./.codex/review-wiki/sync/current/registry.json` exists and matches the sync contract.

## Guardrails

- Do not point `~/.codex/reviewWiki` at the wrong vault.
- Do not overwrite existing wiki documents just to match a new template.
- Do not scatter environment-specific absolute paths throughout other skills; the link is the stable interface.
- Do not treat the workspace sync as the source of truth or edit the sync instead of the external wiki.
- Do not write the workspace sync outside the active workspace.
- Do not use workspace sync as a substitute for repairing a broken or missing link.
- Do not skip verification after link creation or sync refresh.

## Reference

- Read [references/platform-commands.md](references/platform-commands.md) for Windows, macOS, and Linux link and sync commands.
- Read [references/bootstrap-layout.md](references/bootstrap-layout.md) for the initial directory and document set.
- Read [references/staging-contract.md](references/staging-contract.md) for the workspace sync path contract and sync rules.
