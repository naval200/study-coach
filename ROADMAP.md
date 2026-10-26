# study-coach roadmap

## Done
- v0.1: workspace convention, dashboard, modes today / log / status / check / capture / review / init.
- v0.2: confidence × correctness grading, zero-hint checks, evidence-backed depth, spaced review ladder (`concept.mjs`), miss log + watchlist, `adapt` (intake, cadence, cost, changelog), `share` (blog → LinkedIn / X / carousel / YouTube), SessionStart hook.
- v0.5: `online` mode (GitHub repo + Pages setup for beginners), `sync.mjs` automatic save and publish, progress page template.
- v0.6: report card page (`report.html`): concept scorecard (Fix first, Fragile, Building, Reliable, Untested) and weekly report cards from `reviews/week-N.md`. New `report` mode and `scripts/report.mjs`; the dashboard runs it. Upgrade steps: `UPGRADING.md`.

## Next
- [ ] **Goal tree:** goal → milestones → weeks. Each day item links to the milestone it serves, and status reports goal progress, not just task progress.
- [ ] **Calibration:** the learner predicts a score before a check; the dashboard shows predicted vs actual bias after 5 or more checks and adjusts readiness verdicts.
- [ ] **FSRS upgrade:** replace the fixed ladder with stability/difficulty scheduling, ordering due reviews by retrievability.
- [ ] **Concept auto-extraction:** pre-create concept files (with targets) from each day's "Done when".
- [ ] **Coverage vs plan:** each track's share of effort vs its planned share; flag gaps of 5 or more points.
- [ ] **Freshness:** flag fast-moving AI topics whose notes are more than 6 weeks old for a quick refresh sweep.
- [ ] **Rolling memory:** fold old logs into a standing summary in the weekly review; keep the last 7 days in detail.
- [ ] **Smarter pace:** weight items by estimated hours; forecast the finish date from the last 7 days' velocity.
- [ ] **Carousel renderer:** turn `variants.md` slides into PNGs (HTML → image) so no design tool is needed.
- [ ] **Evidence links:** tie Build items to commits, PRs or URLs.
- [ ] **Report card history:** keep one snapshot of the concept groups per week, so the page can show movement (for example Fragile → Reliable).
- [ ] **Evals:** `claude plugin eval` cases for today / status / check / adapt behaviours.
