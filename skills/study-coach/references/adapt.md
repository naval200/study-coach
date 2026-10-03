# adapt — changing the plan without losing it

Read this whenever the learner wants to add, swap, drop or reorder work, or change their goal — and when they bring in something new ("I found this paper / job post / course").

Principle: changes are **cheap to propose and applied on a schedule**. A plan that can't change goes stale; a plan that changes whenever something shiny appears never finishes.

## Change kinds and default cadence

| Kind | Example | Default: when it can be applied |
|---|---|---|
| **tweak** | swap a resource, reorder within a week, drop a stretch item | any day |
| **swap** | replace a day/topic with something new | weekly review |
| **replan** | new block, new deliverable, extend/shorten the plan | checkpoints |
| **goal** | change or re-weight the goal | checkpoints, after the proposal has waited `goal_cooldown_days` |

`STUDY.md` may override with frontmatter: `change_cadence_swap` (`anytime` / `weekly` / `checkpoint`), `change_cadence_replan`, `checkpoints` (e.g. `30, 60, 90`), `goal_cooldown_days` (default 7), `max_swaps_per_week` (default 2). The learner's rules in STUDY.md win over these defaults.

## Intake: something new and interesting

1. Ask (or infer) what it is and what it would give them.
2. Test it against the goal and this week's deliverable: **Serves the goal?** **Serves this week?**
3. Route it:
   - Serves this week and fits a tweak → apply now as a tweak.
   - Serves the goal but not this week → row in `curriculum/proposals.md` with what it would replace and when it gets decided.
   - Doesn't serve the goal → `ideas/parking-lot.md` with why parked and a revisit day. If it might mean the goal itself should change, add a `goal` proposal and start the cooldown.
4. Tell them where it went and when they'll see it again, in one line. Never let it interrupt the current block.

## Applying a change

1. **Cost:** anything added must say what comes out (similar hours). If nothing comes out, the change must explicitly extend the plan, and that's a `replan`.
2. **Forward only:** never edit past day files' checkboxes or logs. Changes apply from today or the next unstarted day, so pace stays honest.
3. Edit `curriculum/plan.md` and the affected `days/dayNN.md` files (keep the day-file format), then add a row to `curriculum/changes.md`: date, kind, change, reason, cost. Mark the proposal `applied`.
4. Re-run the dashboard and show the effect on pace and the deliverable.
5. Show the diff and confirm before writing any `replan` or `goal` change.

## Guardrails to say out loud

- More than `max_swaps_per_week` swaps in a week, or 2 or more goal changes in 30 days → point it out kindly with the numbers from `changes.md`. Ask whether the plan is wrong or the novelty is pulling. Both are legitimate; name which.
- Behind on the current deliverable → finishing it beats swapping in new material. Prefer a scope cut to a swap.
- Evidence-based replans are good replans: a job-post gap list, a failed exit-test item, a prerequisite gap found in a check, or two or more days far off their planned effort.

## Re-plan triggers (suggest an adapt even if not asked)

- Two or more days land far off planned effort (much harder or much easier).
- Weekly hours or the goal changed.
- A `check` reveals a missing prerequisite.
- The dashboard shows a missed run of `scope_cut_after_missed` or more.
- A checkpoint arrives: review proposals, the parking lot (items whose revisit day has come) and the goal.
