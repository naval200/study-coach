# check — concept checks and spaced review

Read this before running a `check` or a due review.

## Depth levels

**1 aware** knows what it is · **2 explain** explains it without notes · **3 apply** uses/builds/debugs it · **4 teach** handles edge cases and trade-offs.

`level` in a concept file is the highest level with **independent** evidence (the learner did it without your help). Guided success is recorded but doesn't raise the level. Reading, watching, "makes sense", "okay" and silence are not evidence. Time passing alone never lowers a level — only a failed check does.

## Target depth

Concept file `target` → else implied by the day's "Done when" ("explain without notes" = explain, "matches X within 1e-5" = apply) → else `default_depth` in STUDY.md. If still unclear, ask once: "How deep do you need this — aware, explain, apply or teach?"

## Running the check

1. Read the concept file: gaps, angles already used, any rows for it in `concepts/_misses.md`. Use a **fresh angle** each time.
2. Ask 3–5 questions **one per message**, escalating toward the target:
   - explain: "explain why…", "what would go wrong if…"
   - apply: a small numeric estimate, code to write or debug, a prediction to verify
   - teach: an edge case, a trade-off, "how would you explain this to X"
   - For a `confusion` miss, ask an A-vs-B discrimination question. For a `trap`, build a new scenario where the trap is tempting.
3. **Zero hints.** Don't put the answer, a list of candidate answers, or an example answer at the end of your message. If you give options, keep them neutral, use real-concept distractors, vary where the right one sits, and never mark one as recommended.
4. **Before revealing, ask "sure or unsure?"** Then grade:

   | | sure | unsure |
   |---|---|---|
   | correct | **solid** | **fragile** |
   | wrong | **misconception** | **gap** |

   Partial credit counts as wrong until the learner names the missing piece. A skipped question is a **gap**.
5. After each answer: one line on what was right, one on what was missing, then the correct idea.
6. Escalate after a clean pass; stop when the target is reached or two questions in a row miss.

## Recording

- The overall outcome is the **worst** outcome among questions at the target depth.
- Run `node <skill-dir>/scripts/concept.mjs concepts/<slug>.md <outcome> [--level <highest independent level>]`. It sets `last_check`, `last_checked`, `review_step` and `next_review` on the ladder 1 → 3 → 7 → 16 → 35 days (solid moves up, fragile repeats, misconception/gap resets). Don't hand-compute dates.
- In the concept file: keep 1–3 evidence rows that justify the level, add the angle you used (≤5 kept), update gaps.
- Misses: add or bump a row in `concepts/_misses.md` (template `templates/_misses.md`). Same mistake again → increase `count`, don't add a row.
- Below target → prescribe one fix that fits the plan's time boxes (re-derive X, rerun experiment Y, re-read section Z), not a new resource.

## Due reviews

The dashboard lists concepts with `next_review ≤ today` under **Reviews due**, misconceptions first. In `today`, offer them as a 5–10 minute warm-up before the first block: 1–2 questions each, same grading, no re-teaching first. Batch at most 5.

## Readiness against a milestone

When asked "am I ready for X?" (an exit test, interview, exam), sort the relevant concepts into three groups and say so plainly:
- **Reliable:** solid at or above target, checked recently
- **Fragile:** fragile, or solid only once
- **Untested:** never checked, or no independent evidence — this is its own category, not "probably fine"
