# Finding the foundations

Goal: find the few things everything else stands on, teach those first, and cut what no exit-test check needs.

## 1. Work backward from each check

For each exit-test check, ask: **"To do this, what must I already be able to do?"** Write 2–4 answers. For each answer, ask the same question again. Stop when you reach something the learner already knows (from the starting point) or a single resource covers in a day or two.

Example (check: "Explain from memory why decode speed is limited by memory bandwidth and estimate tokens/sec for a 7B model"):

```
estimate decode tokens/sec
├─ know how a transformer generates one token        ← attention, KV cache
│   └─ attention by hand                              ← matrix multiply, softmax  (known)
├─ know model size in bytes at a given precision      ← quantization basics
└─ know the machine's memory bandwidth                ← (look up, 10 min)
```

## 2. Count what depends on what

Merge the trees. A skill that sits under **three or more** checks is a **foundation**. A skill under one check is a **leaf**: learn it the week that check is built.

## 3. Order

- Foundations first, in dependency order (nothing before what it needs).
- Learn each foundation by **building** the smallest thing that uses it. Reading alone does not count.
- After the foundations, order weeks so each one ends in a deliverable that a check needs.

## 4. Cut

List what the learner wanted to study that no check needs. Put it in "Skip for now" with a reason. If the learner insists, it goes to the parking lot or the optional slot, never into a block.

## 5. Show the learner

Use `templates/foundations.md`. Keep it to one screen. The learner should see: these 4–7 things unlock everything; this is the order; this is what we skip.

## Signs a foundation is missing later

Repeated misses on the same concept in study-coach checks, or Build tasks that take 2× their time box. Then the fix is to go one level down, not to push harder.
