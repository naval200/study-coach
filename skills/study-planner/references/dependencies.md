# Dependency graph and sequencing

Organize gaps as a graph, not a list. The goal is the shortest path to the capabilities, with as much in parallel as possible.

## 1. Build the graph backward

For each required capability, ask: **"To do this, what must I already be able to do?"** Write 2–4 answers, then ask again for each. Stop at capabilities the learner already has (class A) or that one resource covers in a day or two.

For each node record:

- prerequisites
- what it unlocks
- foundational or optional
- class (A–E from the audit)
- whether it can run in parallel with other nodes

Example:

```
programming fundamentals (A)
└─ concurrency (C)
   ├─ async systems (D)
   │  └─ queues / event-driven architecture (D)
   │     └─ distributed systems (D)
   │        └─ distributed agents (D)   ← target
   └─ Rust (D) — runs in parallel from week 1; needs only concurrency basics
```

## 2. Leverage

A node under three or more target capabilities is a **foundation**: learn it early and by building. A node under one capability is a **leaf**: learn it just in time, in the week it is needed.

## 3. Sequence

- Respect prerequisites, nothing more. Do not serialize what does not depend on each other.
- Run a second track in parallel with a fixed small daily slot when it only needs early foundations (e.g. a language alongside architecture work).
- Order weeks so each ends in a deliverable that a checkpoint needs.
- Prefer just-in-time depth: a node's theory can come after a first build that shows why it matters.

## 4. Show the learner

Use `templates/gaps.md`. Keep it to one screen: the graph, the ranked gaps, what runs in parallel, and what is skipped.

## Signs the graph is wrong later

Repeated misses on the same concept in study-coach checks, or Build tasks that take twice their time box. The fix is usually a missing prerequisite one level down, not more hours.
