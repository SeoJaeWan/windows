---
name: plan-review
description: Read-only critical review skill for executable `./plans/**/plan.md` artifacts and their linked phase detail files created by `architect`. Use when Codex needs an independent cold review before execution, checking template compliance, user-request traceability, blocking ambiguity, topology quality, owner routing, scenario-level technical input/output contracts, later `plan-materialize` derivation readiness, and registry-selected review wiki guidance without rewriting the plan.
---

<Skill_Guide>
<Purpose>
Provide a cold, skeptical review of an executable plan and report blocker, major, and minor findings before implementation begins.
</Purpose>

<Instructions>
# plan-review

Review the finished plan artifact against the user's request and any upstream request-lock handoff. Stay read-only.

## Inputs to inspect

1. Latest user request and latest conversation context
2. Target executable plan file: `./plans/**/plan.md`
3. Linked phase detail files referenced from that `plan.md`
4. Optional orchestration state file when invoked by `orchestrator`:
   - `./.codex/artifacts/plan/{task-slug}/state.json`
5. `../review-wiki-setup/references/staging-contract.md`
6. `../review-wiki-setup/references/platform-commands.md`
7. Resolved planning `review_wiki_root` containing `registry.json`, `core/`, and `patterns/`. Prefer `./.codex/cache/review-wiki/current`; fall back to `~/.codex/reviewWiki/wiki` only when the cache is unavailable.
8. Every core doc listed in the registry `core` array, in listed order
9. Pattern candidates selected from the registry `patterns` list using the `review` selection mode plus matching `Apply When`
10. `../architect/references/plan-template-sequential.md`
11. `../architect/references/phase-template-detail.md`
12. `../architect/references/agents-lite.md`
13. `./references/review-policy.md`
14. Repo-local execution contracts only when needed to verify routing, validation, or repo-fit claims in the plan
15. Directly referenced local prerequisite plan files only when the reviewed phase detail names them in the local prerequisite field

## Workflow

### Step 0. Read required references

Before judging the plan:

- determine execution mode first:
  - if an explicit orchestration `state.json` path is provided and `state.json.preflight.mode = "orchestrated"` with `state.json.preflight.complete = true`, enter orchestrated mode
  - otherwise enter direct mode
- in orchestrated mode:
  - read the provided `state.json`
  - require `state.json.preflight.review_wiki_root` to be present
  - treat `state.json.preflight.review_wiki_root` as authoritative
  - require `state.json.plan_path`, `state.json.plan_revision`, and `state.json.linked_phase_paths`
  - treat `state.json.plan_path`, `state.json.plan_revision`, and `state.json.linked_phase_paths` as authoritative orchestration metadata
  - do not run review wiki staging
  - if `state.json.preflight` is missing, incomplete, or contradictory, block instead of guessing
- in direct mode:
  - read `../review-wiki-setup/references/staging-contract.md`
  - read `../review-wiki-setup/references/platform-commands.md`
  - resolve `review_wiki_root` in this order:
    1. `./.codex/cache/review-wiki/current`
    2. `~/.codex/reviewWiki/wiki`
  - if the cache is missing and the external wiki root is readable, run the platform-appropriate staging command from `platform-commands.md` from the workspace root, then use the refreshed cache
  - if the external wiki root is missing or broken and the cache is absent, stop and report the missing dependency explicitly
  - if the external wiki root is permission-blocked but the cache exists, continue with the cache and mention the fallback in the review assumptions
- read `{review_wiki_root}/registry.json`
- read every path listed in the registry `core` array, in order, resolving relative paths from `review_wiki_root`
- read `architect/references/plan-template-sequential.md`
- read `architect/references/phase-template-detail.md`
- read `plan-review/references/review-policy.md`

### Step 1. Load one executable plan

- Review one executable `plan.md` at a time
- In orchestrated mode:
  - derive `task-slug` from the provided `state.json`
  - use `state.json.plan_path` as the reviewed plan path
  - use `state.json.plan_revision` as the authoritative revision id
  - use `state.json.linked_phase_paths` as the authoritative linked phase detail list
- In direct mode:
  - derive `task-slug` from the owning plan directory
  - load every phase detail file linked from the current `plan.md`
  - set `plan_revision = direct-mode`
- Load every phase detail file linked from that `plan.md`
- Derive the user-request items that the plan claims to address from the latest user request and conversation context
- Derive review tags from the reviewed `plan.md`, linked phase detail files, and any explicit scope words in the request metadata when present
- Select candidate pattern files from the registry `patterns` list using the registry `selection.review` mode and `adjacency_rules`
- Read only the selected pattern files whose `Apply When` clauses actually match the reviewed plan or its phase detail files
- In orchestrated mode, do not rerun linked phase discovery or recompute `plan_revision`
- Treat the plan summary, linked phase detail files, required references, and the user request items as the source of truth
- If this reviewer instance is being reused inside the same orchestration run, treat prior findings as untrusted history and re-evaluate the current plan files against the orchestrator-provided `plan_revision`
- Do not let the plan hide user-request loss behind planner shorthand
- Do not infer missing policy from the original user request when the plan itself is ambiguous
- If a reviewed phase detail names a local prerequisite plan in the local prerequisite field, load only that directly referenced plan and inspect only the minimum upstream phase needed to verify the prerequisite contract
- Do not recurse into a larger plan graph or turn the review into a full multi-plan orchestration pass

### Step 2. Run a cold review

Judge the plan against:

- template compliance
- the active review wiki core contract
- the selected pattern guidance that actually matches the reviewed plan
- request traceability from the user's wording to the plan tables and phase detail work bundles
- parity between the `plan.md` phase summary and the linked technical detail file
- blocking ambiguity
- topology quality and plan-count justification
- `owner_agent` routing
- scenario-level `input -> output` contract completeness in the phase detail files
- canonical outputs, negative outputs, and recipients or interpretation boundaries when relevant
- touched public surface concreteness: props, callbacks, outputs, ownership, invalid/no-op rules, and exclusions when relevant
- observable outputs and no-op rules for interactive or stateful behavior when later test materialization would otherwise have to guess
- one-hop prerequisite contract parity when the reviewed plan references a local prerequisite plan
- verification realism and repo-fit
- whether the phase detail contracts are explicit enough for later `plan-materialize` derivation, affected-owner migration, and stable owner-test selection without guessing
- `visual-comparator` planning when the active core docs or selected pattern guidance require it

Prefer findings over compliments. Do not invent repo facts that the plan does not support.

### Step 3. Classify findings

- Use the severity model in `references/review-policy.md`
- Record only real issues that materially affect execution readiness, contract clarity, or later test derivation
- When a weakness comes from an explicit user tradeoff, note it accurately instead of silently normalizing it away
- If the plan introduces planner terminology that obscures the user's wording, review the loss of traceability rather than accepting the shorthand automatically
- If no findings remain, say so explicitly

### Step 4. Decide the outcome

- Mark the review `blocked` if any `blocker` finding exists
- Mark the review `ready-with-findings` if no blocker exists but `major` or `minor` findings remain
- Mark the review `ready` only when no findings remain
- Do not rewrite the plan in this skill

### Step 5. Write the review artifact

Write:

- `./.codex/artifacts/plan-review/{task-slug}/review.md`

Include:

- a YAML frontmatter block at the top with at least:
  - `plan_path`
  - `task_slug`
  - `plan_revision`
  - `outcome`
  - `next_action`
  - `finding_signature`
  - `requires_user_decision`
  - `issue_codes`
  - `affected_phase_paths`
- reviewed plan path
- outcome
- blocker, major, and minor findings
- assumptions or unknowns that constrained the review
- explicit execution-readiness note

Frontmatter rules:

- `outcome`: `ready` | `ready-with-findings` | `blocked`
- `requires_user_decision`: `true` only when the plan cannot proceed without a fresh user decision; otherwise `false`
- `issue_codes`: stable, sorted short codes for the current finding set; use `[]` when no findings remain
- `affected_phase_paths`: sorted linked phase detail paths implicated by the finding set; use `[]` when not applicable
- `next_action`:
  - `user_gate` when `outcome = ready`
  - `user_gate` when `requires_user_decision = true`
  - `architect` when findings remain and `requires_user_decision = false`
- `finding_signature`: a stable short fingerprint of the normalized finding set for this exact `plan_revision`; use `none` when no findings remain
- In direct mode, use `plan_revision = direct-mode` in the review artifact frontmatter

### Step 6. Respond in chat

- Present findings first, ordered by severity
- Use file references to the reviewed `plan.md`, any especially relevant phase detail file, and the written `review.md` artifact
- If the outcome is `blocked`, say execution should not proceed until `architect` revises the plan
- If the outcome is `ready-with-findings`, separate advisory issues from blockers clearly

## Guardrails

- Read-only: do not edit the plan, source code, or tests
- Do not silently fix or rewrite the plan inside the review
- Do not downgrade a blocker just to keep momentum
- Do not treat partial notes, briefs, or non-executable artifacts as execution-ready plans
- Do not bypass the resolved `review_wiki_root` with hardcoded external-path reads when a workspace cache exists
- In orchestrated mode, do not redo review wiki bootstrap that the orchestrator already completed
- In orchestrated mode, do not recompute orchestrator-owned plan metadata such as `plan_revision` or linked phase discovery
- Do not perform a second full review of upstream plans; inspect only the direct prerequisite parity needed to judge the reviewed plan's execution readiness
- Do not let missing canonical outputs, negative outputs, recipients, winner or loser rules, terminal-state policy, side-effect coupling, or invalid topology pass silently when later execution would have to guess
- Do not let a plan describe behavior only as vague UI feel when later materialization would need observable outputs, no-op rules, or a stable owner boundary to test it
- Do not let summary/detail drift or unresolved contract wording force guesswork about the actual phase boundary
- Do not approve a plan that makes a reviewer reconstruct touched public surfaces or exclusions from prose alone
- Do not let planner shorthand replace user-request traceability

</Instructions>
</Skill_Guide>
