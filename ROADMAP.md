# study-coach roadmap

v0.1 (now): workspace convention, dashboard script, modes today / log / status / check / capture / review / init.

## Next
- [ ] **Goal-based plans** — start from a goal ("get hired as an LLM engineer", "pass exam X") and back-plan milestones; each day item links to the goal it serves, and status reports goal progress, not just task progress.
- [ ] **Depth negotiation at init** — ask per topic how deep the learner needs it; store `target` on concepts ahead of time so `check` knows the bar.
- [ ] **Spaced repetition** — re-check concepts at 1/3/7/21 days; surface "due for review" in `today`.
- [ ] **Concept auto-extraction** — pull concepts from each day's "Done when" and pre-create concept files.
- [ ] **Smarter pace** — weight items by estimated hours; forecast finish date at current velocity; trend over the last 7 days.
- [ ] **Encouragement engine** — streak milestones, "best week so far", specific wins pulled from logs.
- [ ] **Falling-behind playbook** — propose a concrete re-plan (which items to drop/merge) when owed work exceeds a threshold, then apply it with confirmation.
- [ ] **Checkpoint expansion** — at roadmap checkpoints (e.g. Day 30/60/90), expand the next block into day files.
- [ ] **Evidence links** — tie Build items to commits/PRs/URLs so "done" is verifiable.
- [ ] **Hooks** — SessionStart hook that prints the `today` view; reminder if no log by evening.
- [ ] **HTML dashboard** — optional rendered view with charts.
