# Changelog

## 0.7.0 — 2026-10-27
- Extend a day: on the progress page, open a day and use the ⋮ menu to extend it by 1, 2, 3 or more days. Later days move by the same number of days at once. The change stays in the browser until you copy it to the coach, like ticks. "Undo" removes an extension that is not saved yet.
- New `extend` mode: the coach adds `extended: N` to the day file, moves the dates of later days, updates `end` and logs a row of kind `extend` in `curriculum/changes.md`.
- New "Extensions" tile on the progress page: extensions taken and extra days. Extended days show a `+Nd` badge and a `+N` mark on the calendar.
- `dashboard.mjs`: an extended day counts as "today" from `date` to `date + extended`, so it is not missed. DASHBOARD.md shows an Extensions line. `progress.js` has `extensions` and per-day `until` and `extended`.

## 0.6.0 — 2026-10-26
- New report card page, `templates/report-page.html` (copied to `report.html`). It shows a concept scorecard in five groups (Fix first, Fragile, Building, Reliable, Untested) and one card per plan week. Each week card shows items, days done, days logged, hours, posts, commits and the text of `reviews/week-N.md`.
- New `scripts/report.mjs`: writes `report-data.js` next to `progress.js` and prints the report card in the terminal. Today's date follows the `timezone` key. No dependencies.
- `dashboard.mjs` runs the report step after it writes `progress.js` when `report_page: true` is set. It also writes per-week posts and commits to `progress.js` (`weekStats`).
- `sync.mjs` saves `report.html` and `report-data.js` when `report_page` is true.
- New `report` mode. `init` and `online` add the page. `review` ends with a dashboard run, so the week text shows on the page.
- The progress page has a "Report card →" link next to the pace pill.
- Upgrade steps for older workspaces: `UPGRADING.md`.

## 0.5.0 — 2026-10-05
- New `online` mode (`references/online.md`): a step-by-step setup for learners who do not know git. It checks git and `gh`, guides the GitHub sign-up and `gh auth login`, creates the repo, adds the progress page and turns on GitHub Pages. The learner makes the account and signs in; the coach never types passwords.
- New `scripts/sync.mjs`: commits only workspace paths, refuses `private.md` and `.env` files, pulls with rebase, pushes, and prints the page link. Plain-English errors for login, network and conflicts.
- Automatic save: after `log`, `check`, `review`, `adapt`, `share`, `capture` and `init`, the coach runs `sync.mjs`. New STUDY.md keys: `sync` (auto / ask / off), `remote`, `pages_url`, `sync_include`.
- `templates/progress-page.html`: the static progress page that reads `progress.js`.
- `init` offers the online page. The dashboard shows the page link.
- `log`: a Post item that the learner does not share is marked `[-]`, not ticked.
- New docs page: [Go online](https://naval200.github.io/study-coach/online.html), written for people who do not know GitHub.

## 0.4.1 — 2026-10-05
- Both skills write responses and workspace text in ASD-STE100 Simplified Technical English (target: 80% or more of sentences).
- `tools/ste-check.mjs`: a heuristic STE check (sentence length, passive voice, contractions, -ing forms, paragraph length). Not the official STE dictionary. The docs site passes at 99%+.
- New docs page: a walkthrough with expandable steps.

## 0.4.0 — 2026-10-05
- `study-planner` rewritten around a first-principles method: target → required capabilities → audit → gaps → minimum curriculum → resources → exercises → schedule → checkpoints. Optimizes time-to-capability, not coverage.
- Capability audit with five classes (strong, rusty, partial, new, irrelevant) and progressive compression; ranked gaps; dependency graph with parallel tracks; source stacks; 60–80% active work; production-realism check; just-in-time depth; capability checkpoints; a pruning pass; a "Why this plan" section.
- Experienced Learner Mode with a worked example (`references/experienced.md`).
- New `curriculum/gaps.md` replaces `foundations.md`; `plan.md` now has modules (capability, why, prerequisites, material, practice, done, effort).
- Depth, learning-style and quality-check ideas adapted from [learn-anything-roadmap](https://github.com/mohitagw15856/pm-claude-skills/blob/main/skills/learn-anything-roadmap/SKILL.md) (MIT).

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
