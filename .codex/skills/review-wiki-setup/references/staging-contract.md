# Review Wiki Sync Contract

Use this contract whenever planning agents need a workspace-local copy of the review wiki.

## Paths

- External source root: `~/.codex/reviewWiki/wiki`
- Workspace sync root: `./.codex/review-wiki/sync/current`
- Sync manifest: `./.codex/review-wiki/sync/current/synced.json`

Use the platform-appropriate sync command from `references/platform-commands.md`:

- Windows: `powershell -NoProfile -ExecutionPolicy Bypass -File ./.codex/skills/review-wiki-setup/scripts/stage-review-wiki.ps1`
- macOS / Linux: `sh ./.codex/skills/review-wiki-setup/scripts/stage-review-wiki.sh`

The sync copies the contents of the external `wiki/` root only. After refresh, the planning root is `./.codex/review-wiki/sync/current` itself, so planning agents should find:

- `./.codex/review-wiki/sync/current/registry.json`
- `./.codex/review-wiki/sync/current/core/**`
- `./.codex/review-wiki/sync/current/patterns/**`
- `./.codex/review-wiki/sync/current/_meta/**`

`raw/` is not copied into the planning sync. The sync is read-only execution input, not the source of truth.

## Root resolution order

Resolve the planning `review_wiki_root` in this order:

1. `./.codex/review-wiki/sync/current`

If the workspace sync is missing, stop and route to `review-wiki-setup` instead of falling back to direct external-path reads in planning skills.

## Freshness policy

- `review-wiki-setup` or an external sync process refreshes `./.codex/review-wiki/sync/current` as needed.
- `orchestrator`, `architect`, and `plan-review` consume `./.codex/review-wiki/sync/current` directly and do not perform per-run refresh inside the planning workflow.
- Planning skills may read `synced.json` for diagnostics, but freshness checks are informational unless the user explicitly requests a stricter policy.
- If the workspace sync is missing, stop and escalate instead of guessing.

## Responsibility split

- `review-wiki-setup` repairs or bootstraps the external `~/.codex/reviewWiki` link and can refresh the workspace planning sync.
- External sync jobs may refresh `./.codex/review-wiki/sync/current` without involving the planning hot path.
- Planning skills consume the resolved `review_wiki_root` and must not bypass it with hardcoded external-path reads once the root is resolved.
