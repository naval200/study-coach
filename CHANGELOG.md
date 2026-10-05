# Changelog

## 0.3.0 — 2026-10-05
- New `study-planner` skill: builds a plan from scratch. Starts from an end objective and an exit test, maps the foundations to build on (and what to skip), sizes the plan to real weekly hours with Relaxed / Steady / Faster pace, and adds a minimum day, rules and a pre-mortem so the plan survives bad weeks. Writes `curriculum/brief.md`, `exit-test.md`, `foundations.md` and `plan.md`.
- `init` reads `curriculum/brief.md` when present and only asks for what is missing.

## 0.2.0 — 2026-10-03
- `check`: confidence × correctness grading (solid / fragile / misconception / gap), zero-hint rules, evidence-backed depth levels, fresh angles each time.
- Spaced review: `scripts/concept.mjs` schedules reviews on a 1 / 3 / 7 / 16 / 35-day ladder; the dashboard shows reviews due and misconceptions first.
- Miss log (`concepts/_misses.md`) with confusion/trap types and a repeat-miss watchlist.
- New `adapt` mode: intake for new ideas, change kinds and cadence, a cost for every addition, forward-only edits, `curriculum/changes.md` + `proposals.md`.
- New `share` mode: blog → LinkedIn, X thread, Instagram carousel, YouTube community post; `posts/published.md` counted on the dashboard.
- SessionStart hook (plugin installs): one-glance summary, silent outside study workspaces.
- Procedures moved to `references/` to keep SKILL.md short.

## 0.1.0 — 2026-10-03
- First release: workspace convention, zero-dependency dashboard script, modes `today`, `log`, `status`, `check`, `capture`, `review`, `init`.
