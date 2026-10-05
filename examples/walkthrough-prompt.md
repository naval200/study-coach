# Prompt: generate a study-coach walkthrough

Paste everything below the line into ChatGPT. The output is a Markdown walkthrough you can turn into `docs/walkthrough.html` or a README section.

---

You are writing a **how-to-use guide told as one realistic conversation**. It shows a learner using two Claude skills, **study-planner** and **study-coach**, from "I have no plan" to "I took my exit test". The reader should finish it knowing exactly what to type, what Claude does, and which files change.

## The learner (use this persona)

- **Maya**, frontend engineer, 6 years. Strong: React, TypeScript, REST APIs as a consumer, Git, CI, debugging in the browser. Some Node.js scripts. SQL from a course 4 years ago (rusty). Never owned a backend service, queue or production database.
- **Goal:** in 4 weeks, be able to own backend tickets at her startup: build, test and deploy a small Node/TypeScript API service with Postgres, background jobs and basic monitoring.
- **Time:** about 8 hours a week. Weekday sessions of 60–75 minutes, 2 hours on Saturday. She dropped her last two plans in week 2: "a new course always looked better".
- She works in **Claude Code** in a folder called `backend-study/`.

## What the skills really do (stay inside this — do not invent features)

**Install (Claude Code):**
```
/plugin marketplace add naval200/study-coach
/plugin install study-coach@study-coach
```
This installs both skills. Everything is plain markdown files in the study folder; Claude does not remember between sessions — the files hold the state.

**study-planner** (`/study-planner <goal>`) plans like a technical architect, not a course catalog:
- Works backward: target → required capabilities → what she already has → gaps → minimum curriculum → resources → exercises → schedule → checkpoints.
- Asks one or two questions at a time. Asks *why* once and gets a date. Asks about past work, depth wanted, learning style, hours, session length, and what usually breaks her plans.
- Classifies each capability: **A strong** (skip) · **B rusty** (recap + 3–5 exercises) · **C partial** (teach the missing parts) · **D new** (full module) · **E not needed** (skip, say why). If unsure, it gives a 10–15 minute diagnostic instead of trusting the self-report.
- Turns on **Experienced Learner Mode** for experienced people: test before teaching, refreshers not courses, fewer but realistic exercises, shorter plan. "Do not relearn the field. Close the gap."
- Ranks 3–10 gaps; builds a dependency order with parallel tracks; picks resources *after* the gaps, as a source stack (primary, reference, practice, real-world example); 60–80% active work; production-like projects ("would this be useful in a high-growth startup?"); capability checkpoints (explain / implement / debug / design / trade-offs), never "% of course".
- Makes it stick: plans to the hours she really kept, one light day a week, a **minimum day** (20-minute version that still counts), rules (never shift the calendar; a missed Build moves to the light day; time boxes are hard; new courses go to `ideas/parking-lot.md`; 2 missed days in a row → scope cut, not extra hours), and a **pre-mortem** turned into if-then rules.
- Shows an outline first: Destination, Current position, Capability gaps, Curriculum (each module: capability, why, prerequisites, material, practice, done when, effort), Schedule, Validation (exit test with a pass mark), **Why this plan**. Asks "Can you do week 1 as written?" and shrinks it until yes.
- Only after approval writes: `curriculum/brief.md`, `curriculum/gaps.md`, `curriculum/exit-test.md`, `curriculum/plan.md`. Day headings look like `### Day 1 · Mon 5 Oct — Title` with `- **Learn:**`, `- **Build:**`, `- **Done when:**` bullets.

**study-coach** (`/study-coach <command>`) runs the plan:
- `init curriculum/plan.md` — reads the brief, writes `STUDY.md` (settings and rules), one `days/dayNN.md` per day, and `DASHBOARD.md`, then shows today.
- `today` (or no command) — today's tasks laid out by time block, owed items and where the rules send them, then the single first action.
- `log` — asks what she did and the hours; ticks only what she confirms (`[x]` done, `[-]` dropped with a reason); fills **Done / Blocked / Tomorrow's first task**; if a "Done when" item is about understanding, it runs a quick check before ticking ("I get it" is not evidence); re-runs the dashboard and gives pace in one line.
- `status` — at most 8 lines: day N/M, pace with numbers, this week's deliverable, streak, exit test, reviews due; then one recommendation. Behind is stated plainly, without guilt, and the rule is applied.
- `check <concept>` — agrees on a depth (aware / explain / apply / teach), asks one question at a time with no hints, asks "sure or unsure?" before revealing, grades each answer **solid**, **fragile**, **misconception** (confident and wrong — fixed first) or **gap**, and schedules the next review on a 1 / 3 / 7 / 16 / 35-day ladder.
- `adapt <change>` — for "I found a better course/paper": tests it against the goal and this week's deliverable, then routes it: small tweak now, a proposal for the weekly review, or the parking lot. Every addition names what comes out. Logged in `curriculum/changes.md`.
- `review` — weekly scorecard in `reviews/week-N.md`: numbers, did the deliverable ship, what worked, one change for next week, due reviews.
- `share` — optional: drafts a blog and short posts from real logs. Never posts for her.
- **Dashboard lines look like:** `Day 9 of 28 · Pace: 🟢 On track` or `🔴 Behind — 3 item(s) owed across 1 day(s)`, `Streak: 4 day(s)`, `Exit test: 3/7 (pass ≥ 5)`.
- **Exit test:** there is no separate command. On the last day she asks the coach to run it. The coach goes through `curriculum/exit-test.md` one check at a time: for "built" checks it asks for evidence (a URL, a repo, a test run); for "explain" checks it runs a `check` with no hints. It ticks only checks with evidence, reports k of n against the pass mark, and says what happens next (pass → next goal or a new `/study-planner` pass; below the mark → the next block closes the gaps first).

## Write the conversation in these scenes

1. **Setup (short).** Install, make the folder, start Claude Code there.
2. **Planning.** `/study-planner own backend tickets in 4 weeks`. Show the real back-and-forth: the audit questions, one short diagnostic (e.g. a SQL JOIN question she gets half right → SQL is **B rusty**, not new), Experienced Learner Mode turning on, the class table, ranked gaps, what is skipped and why (e.g. no "intro to programming", no "what is HTTP", no Kubernetes), the pre-mortem using her "new course" weakness, the outline with 3–4 modules, and "Can you do week 1 as written?" — she says Tuesday is too full; Claude shrinks it. Then the files are written. Show a short excerpt of `gaps.md` and of one module plus Day 1 in `plan.md`, and 3 lines of *Why this plan*.
3. **Start.** `/study-coach init curriculum/plan.md`, then the first `today` output.
4. **A normal day.** `/study-coach log` at the end of Day 2: she did the Build but only half the Learn; one Done-when says "explain how a connection pool works" — Claude asks two quick questions before ticking. Show the day file's Plan and Log sections after.
5. **A bad week.** She misses Day 8 and Day 9 (work deadline). `/study-coach status` shows Behind with numbers. Claude applies the two-missed-days rule: a concrete scope cut that protects the week's deliverable. No guilt. It reminds her of the minimum day.
6. **The shiny new course.** She finds a 40-hour "Node.js microservices masterclass". `/study-coach adapt` routes it: parking lot, with one 20-minute chapter added only if it replaces something. Show the line written to `curriculum/changes.md` or the parking lot.
7. **A concept check.** `/study-coach check idempotency`. Show 3–4 questions. One answer is a **misconception** (she is sure retries are always safe for POST requests) — Claude fixes it first. Show the grade and the next review date.
8. **Weekly review.** Short `/study-coach review` excerpt from week 2.
9. **Exit test (Day 28).** She asks Claude to run the exit test. 6–7 checks; she passes 5 of 7 with evidence (a repo URL, a deployed endpoint, a passing test run, two explain checks). One "design" check is fragile and one "debug" check has no evidence. Claude reports `5/7 (pass ≥ 5)` — passed — and lists the two gaps as the start of her next plan.
10. **What to remember.** 6–8 bullet points: the commands she used most and the habits that made the plan stick.

## Format and style

- Markdown. Each scene: a heading, one or two sentences on what is happening, then the conversation as `**You:**` and `**Claude:**` turns, then a short `> Tip:` line.
- Show files and command output in code blocks. Keep each excerpt short (under 15 lines).
- Claude's replies are short and concrete, like a real coach: real numbers, one question at a time, no hype, no guilt language ("you're behind!", "don't break your streak").
- Simple English: short sentences, active voice, present tense, common words. Explain each term the first time (e.g. "idempotent — safe to run twice").
- Use real, existing resources and name the exact part (e.g. "node-postgres docs: Pooling", "PostgreSQL docs: tutorial, ch. 2"). If unsure a resource exists, choose a safer one.
- Use plausible dates: start Monday 5 October 2026.
- Length: about 3,000–4,000 words. Make it feel like a real session, not a feature list.
- Do not invent commands, files, settings, notifications, reminders, a web app or anything not listed above.
