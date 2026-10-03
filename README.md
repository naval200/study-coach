# study-coach

A Claude Code skill that coaches you through a self-directed curriculum. Give it any study plan; it builds a plain-markdown workspace, tells you what to do today, tracks whether you're ahead or behind, and quizzes you until you actually know the material.

```
/study-coach                  what do I do today?
/study-coach status           how am I progressing?
/study-coach log              tick off what I did, write the day's log
/study-coach check <concept>  quiz me to the depth I need (aware → explain → apply → teach)
/study-coach capture idea|article|book …
/study-coach review           weekly scorecard
/study-coach init plan.md     turn a curriculum into a workspace
```

## Install

**As a plugin (recommended):**

```
/plugin marketplace add navalsaini/study-coach
/plugin install study-coach@study-coach
```

**As a plain skill:** copy or symlink `skills/study-coach/` into `~/.claude/skills/` (all projects) or `<project>/.claude/skills/` (one project).

Requires Node.js 18+ for the dashboard script (no npm dependencies).

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

## Roadmap

See [ROADMAP.md](ROADMAP.md). Issues and PRs welcome.

## License

MIT
