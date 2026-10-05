# study-coach

A Claude Code skill that coaches you through a self-directed curriculum. Give it any study plan; it builds a plain-markdown workspace, tells you what to do today, tracks whether you're ahead or behind, quizzes you until you actually know the material, lets the plan change without falling apart, and turns your progress into posts.

**Guide:** [naval200.github.io/study-coach](https://naval200.github.io/study-coach/) — short pages that explain each part of the skill (source in [`docs/`](docs/)).

```
/study-coach                  what do I do today?
/study-coach status           how am I progressing?
/study-coach log              tick off what I did, write the day's log
/study-coach check <concept>  quiz me to the depth I need (aware → explain → apply → teach), schedule reviews
/study-coach adapt <change>   "I found this paper/job post" — triage it, swap it in, or re-plan, with a changelog
/study-coach share            turn today's work into a blog + LinkedIn / X / Instagram carousel / YouTube text
/study-coach capture idea|article|book …
/study-coach review           weekly scorecard
/study-coach init plan.md     turn a curriculum into a workspace
```

## No plan yet? Start with study-planner

```
/study-planner move into AI infrastructure in 12 weeks
```

A second skill in this plugin. It plans like a technical architect, not a course catalog: it works backward from your goal and plans only the gap.

**target → capabilities needed → what you already have → gaps → minimum curriculum → resources → exercises → schedule → checkpoints**

- **Capabilities, not topics:** "learn Rust" becomes "write and debug production Rust services".
- **Audit first:** each capability is classed strong, rusty, partial, new or irrelevant. Strong is skipped, rusty gets a refresher, only real gaps get full modules.
- **Smallest plan that closes the gap:** a dependency graph with parallel tracks, a pruning pass, and a list of what was skipped and why.
- **Resources after the gap:** a source stack per topic (primary, reference, practice, real-world, validation) instead of one giant course.
- **Mostly doing:** 60–80% active work, production-like projects, checkpoints such as "can design and debug X", not "72% of the course".
- **Experienced Learner Mode:** for professionals. Diagnose, refresh, close the delta; do not relearn the field.
- **Built to stick:** sized to your real hours, a 20-minute minimum day, a scope-cut rule and a pre-mortem.
- **Why this plan:** every plan ends with what was assumed, prioritized and skipped, so you can change it.

It writes `curriculum/brief.md`, `gaps.md`, `exit-test.md` and `plan.md`. Then `/study-coach init curriculum/plan.md` runs it. Guide: [study-planner docs](https://naval200.github.io/study-coach/planner.html).

## Install

**As a plugin (recommended):**

```
/plugin marketplace add naval200/study-coach
/plugin install study-coach@study-coach
```

This installs straight from this GitHub repo; it does not need the official plugin directory.

**As a plain skill:** copy or symlink `skills/study-coach/` into `~/.claude/skills/` (all projects) or `<project>/.claude/skills/` (one project).

Requires Node.js 18+ for the scripts (no npm dependencies). The plugin install also adds a SessionStart hook that prints a one-line summary inside study workspaces (silent elsewhere).

## The workspace

Everything is markdown you own and can commit:

```
STUDY.md        config + goal, learner profile, rules
DASHBOARD.md    generated — day N of M, pace, streak, catch-up queue, weekly scorecard
curriculum/     plan.md, exit-test.md
days/           dayNN.md — checklist, "Done when", log, notes
courses/ books/ articles/ concepts/ ideas/ projects/ posts/ reviews/
```

Checkbox states: `[ ]` todo · `[x]` done · `[-]` dropped. Items marked `(stretch)` or `(if behind)` never count as owed. See `skills/study-coach/SKILL.md` for the full format.

Try it on the sample:

```bash
node skills/study-coach/scripts/dashboard.mjs examples/sample-workspace --today 2026-01-06 --no-write
```

## See it in use

[Walkthrough](https://naval200.github.io/study-coach/walkthrough.html): one learner, four weeks, from no plan to a passed exit test. Each step shows the command; open it to read the conversation.

## How it works

- **Pace:** items owed from past days vs items done ahead; a missed-run alert triggers your plan's scope-cut rule.
- **Checks:** answers are graded by correctness × confidence — *solid*, *fragile*, *misconception* (confident and wrong, fixed first) or *gap*. Depth only rises on independent evidence.
- **Spaced review:** `scripts/concept.mjs` schedules each concept on a 1 / 3 / 7 / 16 / 35-day ladder; due reviews become a warm-up in the `today` view.
- **Plan changes:** cheap to propose, applied on a schedule (tweaks any day, swaps weekly, re-plans and goal changes at checkpoints). Every addition names what comes out; every change is logged.
- **Sharing:** write once from your real logs and numbers, then adapt the post for each platform. No video required.

## Roadmap

See [ROADMAP.md](ROADMAP.md). Issues and PRs welcome.

## Credits

Several mechanisms were adapted from other MIT-licensed learning skills — thank you:
[supertutor](https://github.com/sayeemabdullah/supertutor) (confidence × correctness grading, review ladder, re-plan triggers),
[learn-skill](https://github.com/derwells/learn-skill) (evidence-backed levels, fresh angles),
[claude-learning-coach](https://github.com/coffeerunhobby/claude-learning-coach) (miss log and watchlist),
[tutor-skills](https://github.com/bevibing/tutor-skills) (zero-hint quiz rules),
[claude-tutor](https://github.com/kirilxd/claude-tutor) (SessionStart summary),
[agent-tutor-skill](https://github.com/bhala-srinivash/agent-tutor-skill) (review-first warm-ups).

## License

MIT
