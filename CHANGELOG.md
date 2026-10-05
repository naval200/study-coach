# Changelog

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
