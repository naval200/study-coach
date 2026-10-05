# Experienced Learner Mode

Turn on when the learner has substantial professional experience near the target, or says they have "done most of this before". Treat that as a strong signal to switch to refresher mode, not to shrink a beginner curriculum.

Default heuristic: **do not make an experienced engineer relearn the field. Make them close the delta.**

## What changes

- **Assume transfer.** Start from what they have shipped. Ask what carries over before asking what is missing.
- **Diagnose before teaching.** For anything uncertain, a 10–15 minute question or task decides A, B or C. Do not schedule a module to find out.
- **Minimize fundamentals.** A topics get no time. B topics get a recap and a few exercises.
- **Focus on conceptual gaps and modern developments**, not basics they used at work for years.
- **Fewer, more realistic exercises.** Implementation and system-design challenges over drills.
- **Prioritize job and project relevance.** Tie each module to roles, interviews or systems they will work on.
- **Shorter total plan.** Shape: targeted refresh → strategic gaps → practical exercises → integration project.
- **No "finish this entire course" thinking.** Use chapters, docs pages and source code, not whole courses.
- **Lighter weekly load** is often better: they have a job, and retention matters more than speed.

## Worked example

**Learner:** senior software engineer, about 10 years. Strong in production web development, APIs, databases, cloud, TypeScript and Python, payments, startup engineering. Wants to move toward AI infrastructure and distributed systems. About 10 hours a week, 12 weeks.

**Generic plan (what not to do):** a full CS-style curriculum. Networking, HTTP and REST, SQL, operating systems, an algorithms course, a distributed-systems textbook cover to cover, a Rust book cover to cover, then an ML course. 9+ months.

**Audit result:**

| Capability | Class | Treatment |
|---|---|---|
| HTTP, REST, CRUD, SQL, auth, cloud deploy | A | Skip |
| Production debugging, basic architecture | A | Skip |
| Concurrency (threads, locks, async in JS/Python) | C | Targeted: implement and break a worker pool |
| Queues and event-driven architecture | C/D | Module, just in time |
| Delivery semantics, idempotency, retries | D (partly from payments: C) | Learned via the queue project's failures |
| Consistency, coordination, failure modes | D | Module, after the queue project shows why |
| Observability (tracing, metrics) | B | Refresher during the integration project |
| Rust | D | Parallel track, 1h/day, from week 1 |
| Agent architectures, LLM serving, AI infra | D | Modules in weeks 7–12 |
| Compilers, OS internals, ML theory | E | Skipped: not needed for the target role |

**Ranked gaps:** 1. queues + delivery semantics (high leverage, very common at work) · 2. distributed-systems failure modes · 3. concurrency and async in practice · 4. Rust (needed for target companies; parallel) · 5. agent architecture · 6. LLM serving and cost.

**Resulting plan shape (12 weeks, ~10 h/week):**

- Weeks 1–3: build a queue-backed job service (retries, dead-letter queue, idempotent handlers) for a notifications or payments-like workload; learn delivery semantics when duplicates appear. Rust in parallel.
- Weeks 4–6: make it fail (partitions, slow consumers, a poison message); learn consistency and coordination from what broke. Add tracing and metrics (refresher).
- Weeks 7–10: an agent runtime on top of the service: durable steps, tool calls, timeouts, cost limits. Serving and cost basics, just in time.
- Weeks 11–12: integration project write-up, a system-design mock, and a public repo.

**Validation:** can design a reliable queue-backed job system and explain its failure modes; can explain at-least-once vs exactly-once trade-offs with their own measurements; can implement and debug a small async Rust service; can design an agent runtime that survives restarts.

**Check against the target environment:** every project is something a high-growth consumer startup runs (notifications, payments-like jobs, background agents). The plan is about 120 hours, not 9 months, and it reuses the learner's payments experience as an analogy for idempotency.
