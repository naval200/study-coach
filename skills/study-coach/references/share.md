# share — turning progress into posts (no video required)

Read this when a day has a **Post** item, a write-up is due, or the learner asks to share progress.

Principle: **write once, adapt everywhere.** Every post gives a stranger something useful (a number, a gotcha, a how-to, a comparison), not a diary entry. The learner's own work is the proof.

## Sources (draft from these, don't invent)

Today's (or this week's) day files: Done-when results, Log, Notes; the related `articles/` Q&A; `concepts/` explanations; real numbers from `projects/` (results tables, benchmarks, loss curves). Ask for the numbers you don't have. Never make up results.

## Flow

1. **Find the useful angle.** Offer 2–3 one-line options, e.g. "the KV cache made decode 6× faster — here's why", "3 mistakes I made implementing attention", "BM25 vs dense on FiQA in one table". The learner picks one.
2. **Draft or update `posts/YYYY-MM-DD-slug/blog.md`** (template `templates/blog.md`). Short posts are fine for daily items; weekly write-ups are the long version. Keep the learner's voice; mark gaps as `TODO(you): …`.
3. **Make `variants.md`** (template `templates/variants.md`) for the platforms in STUDY.md `post_formats` (default: linkedin, x, instagram-carousel):
   - **LinkedIn:** 150–250 words. Hook line, 3–5 short paragraphs or bullets, one concrete number, a question or link at the end. Hashtags only at the end, if at all.
   - **X / Threads:** 5–8 posts, each ≤280 characters and able to stand alone. Post 1 is the hook plus the result.
   - **Instagram carousel:** 6–8 slides, ≤25 words each. Slide 1 is the hook, the middle slides are one idea each (a diagram description or code snippet is fine), the last slide is the takeaway. Plus a caption and 5–10 hashtags. The learner makes slides in Canva/Keynote; no filming.
   - **YouTube community post** (short text plus image), and an optional **60-second voice-over script** to read over the carousel slides if they ever want a Short.
   - **Newsletter/blog:** the full `blog.md`.
4. **Check before they post:** no secrets, API keys or private data; numbers match the source; links work; claims are hedged where the evidence is thin.
5. **After publishing**, add one row per platform to `posts/published.md` (template `templates/published.md`) and tick the day's **Post** item. The dashboard counts these.

## Cadence

Match the plan's Post items. If the learner is short on time, a daily post can be just the LinkedIn or X variant; bundle the week into the long blog plus a carousel on the review day. One good post beats three filler posts. Say so if they're about to post filler.
