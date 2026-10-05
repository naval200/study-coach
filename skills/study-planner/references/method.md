# Planning method in detail

Guidance for each step of the algorithm in `SKILL.md`. Read the section you need.

## 1. Destination, not subject

Get a concrete target before any topic. Examples: get a backend or distributed-systems job; become effective as an AI infrastructure engineer; build production agentic systems; prepare for senior or staff interviews; build a startup product at scale; refresh skills before returning to a field.

Plan types change the size of the plan:

| Type | Typical shape |
|---|---|
| Career change | A substantial curriculum. Foundations matter. |
| Refresh / repositioning | Short. Targeted refresh → strategic gaps → practical exercises → integration project. |
| A few strategic gaps | Very focused. Often 2–4 modules. |

## 2. Capabilities, not topics

Write each required capability as something observable.

| Weak | Strong |
|---|---|
| Learn Kafka | Understand partitions, consumer groups, ordering, retention, delivery semantics and failure modes well enough to design and debug an event-driven service |
| Learn Rust ownership | Implement and debug non-trivial Rust services while reasoning about ownership, borrowing, lifetimes, traits, concurrency and async |

Knowledge is not capability. "Watched the course" is not an outcome.

## 3. The audit

Ask, in plain words and a few at a time:

- What have you done professionally? What did you build?
- Which technologies have you used, and how deeply (toy / side project / production / owned it)?
- What did you learn before but have not used lately?
- What transfers from another language or field? (Direct transfer: same sub-skill, new context. Analogy: same mental model, different field — teach it by that analogy.)
- Depth wanted: dabble, competent or deep?
- Learning style: hands-on, structured course, reading, video?
- Time: hours per week, session length, weekdays vs weekends, horizon, how intense a week they can sustain.
- Constraints: current job, target roles and companies, interview expectations, public portfolio, budget, opportunity cost.

If the learner is unsure how strong they are in something, run a **diagnostic**: one or two quick questions or a 15-minute task. Classify from the result, not from the self-report.

## 4. Classify (A–E) and minimum sufficient curriculum

| Class | Meaning | Treatment |
|---|---|---|
| A — strong | Production experience | Do not teach. A quick reference only if a later module needs it. |
| B — rusty | Learned before, not used lately | Refresher: concept recap → 3–5 exercises → small application |
| C — partial | Knows the concept, weak implementation | Teach the missing implementation details; targeted exercises |
| D — new | Never learned | Full module: concepts → examples → exercises → project → review |
| E — irrelevant | Not needed for the goal | Skip. List it under "Skipped" with the reason. |

For every candidate topic, ask:

1. Is it required for the stated goal?
2. Is it already known?
3. Can a short refresher cover it?
4. Does it unlock another important capability?
5. Is there a practical reason to know it?
6. Is it worth the time compared with the other gaps?

If the answers do not justify it, remove it. A good plan feels like "everything I need", not "everything someone could learn".

## 5. Progressive compression

| Learner position | Path |
|---|---|
| New (D) | Concepts → examples → exercises → project → review |
| Rusty (B) | Concept recap → 3–5 targeted exercises → small implementation |
| Strong (A) | Quick reference → one challenging problem → move on |

Re-check the class after the first exercise. If the learner is faster than expected, compress further.

## 6. Ranking gaps

Score each gap on: importance to the goal, leverage (how many other capabilities it unlocks), prerequisite value, work or interview relevance, learning cost. Prefer high-leverage foundations over isolated technologies. Examples: queues unlock event-driven systems; concurrency unlocks async systems and Rust; distributed-systems basics unlock agent infrastructure; observability improves debugging nearly everywhere; system design connects technologies into architecture.

## 7. Resources after the gap, as a source stack

Pick the best source for each specific learning task. Do not default to one bootcamp, one certification, one popular video course, or one textbook for everything.

For important topics, layer:

| Layer | Example |
|---|---|
| Primary | A concise article, chapter or short course |
| Reference | Official docs or a book |
| Practice | Coding or design exercises |
| Real-world context | A production write-up, an architecture post, or source code of a real system |
| Validation | A project, an interview problem or a system-design question |

Weigh: prior knowledge, depth needed, quality, practicality, recency, time, relevance to the target role, learning style, and whether the learner needs concepts or implementation fluency. For experienced learners, prefer short refresher + targeted exercises + real implementation over a long beginner course. Prefer what the learner already owns.

## 8. Active work

For experienced learners, aim for about 20–40% input (reading, video, docs) and 60–80% active work. Adapt to the subject. Exercise types: implement from scratch; debug a broken implementation; explain a design; compare architectural choices; modify an existing system; benchmark; simulate failure; write tests; reason about edge cases; design for scale; build a small production-like service.

## 9. Production realism

Ask: *would these exercises still be useful inside a high-growth consumer startup?* When the goal is work, favor scenarios with high traffic, async workloads, unreliable dependencies, retries, rate limiting, caching, queues, background jobs, idempotency, payments, notifications, analytics, search, feeds, real-time systems, graceful degradation, monitoring and cost/performance trade-offs. Projects should resemble systems the learner could meet at work.

## 10. Just-in-time depth

Do not require mastering a domain before using it: learn enough → build something → hit a limitation → learn the concept that explains it → improve the system. Example: queue basics → build a queue-backed service → hit duplicate or lost messages → learn delivery semantics and idempotency → fix the service.

## 11. Checkpoints by capability

Each module ends with the smallest test that proves competence: can **explain** it, **implement** it, **debug** it, **design** with it, make **trade-offs** with it. Good: "can design a reliable queue-backed job system and explain its failure modes". Bad: "finished 72% of the course". These become the `Definition of done` lines and the exit test.

## 12. Pruning pass

After the first draft, do a second pass and report what changed:

- **Remove** anything known or low-value.
- **Compress** anything rusty but familiar.
- **Expand** only genuine gaps that matter.
- **Reorder** by dependency and leverage.
- **Replace** weak resources with better, more targeted ones.

The result must be clearly smaller than a generic curriculum for the same target. If it is not, prune again.

## 13. Real-world constraints

A plan is an investment of scarce time toward a future capability. Account for the learner's current job, target roles, interview expectations, technologies at target companies, the chance to show work publicly, portfolio opportunities, time and opportunity cost.

## 14. Final quality check

Before presenting, confirm:

- [ ] Anchored to a concrete destination, with a date
- [ ] Every module states a capability, not a topic
- [ ] The audit happened; A topics are not taught; B topics are refreshers
- [ ] 3–10 ranked gaps, with reasons
- [ ] Dependency order, with parallel tracks where possible
- [ ] A source stack per important module; no single giant course by default
- [ ] Mostly active work; production-like where the goal is work
- [ ] Capability checkpoints, not completion percentages
- [ ] Fits real hours, with a light day and a minimum day
- [ ] Pruning pass done; skipped topics listed with reasons
- [ ] *Why this plan* written
