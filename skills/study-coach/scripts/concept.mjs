#!/usr/bin/env node
// Records a concept check and schedules the next review.
// Usage: node concept.mjs <concept-file> <outcome> [--level aware|explain|apply|teach] [--today YYYY-MM-DD]
//   outcome: solid | fragile | misconception | gap
//     solid         correct + confident   → move up the review ladder
//     fragile       correct + unsure      → repeat the same interval
//     misconception wrong + confident     → back to step 0 (top priority)
//     gap           wrong + unsure / not attempted → back to step 0
// Review ladder (days): 1, 3, 7, 16, 35. Past the last step the concept is "consolidated".
// Creates the file with minimal frontmatter if it doesn't exist.

import fs from "node:fs";
import path from "node:path";

const LADDER = [1, 3, 7, 16, 35];
const OUTCOMES = ["solid", "fragile", "misconception", "gap"];
const LEVELS = ["aware", "explain", "apply", "teach"];

const args = process.argv.slice(2);
const file = args[0];
const outcome = args[1];
let level;
let today = new Intl.DateTimeFormat("en-CA").format(new Date()); // local date
for (let i = 2; i < args.length; i++) {
  if (args[i] === "--level") level = args[++i];
  else if (args[i] === "--today") today = args[++i];
}
if (!file || !OUTCOMES.includes(outcome) || (level && !LEVELS.includes(level))) {
  console.error("Usage: node concept.mjs <concept-file> <solid|fragile|misconception|gap> [--level aware|explain|apply|teach] [--today YYYY-MM-DD]");
  process.exit(1);
}

let text = fs.existsSync(file)
  ? fs.readFileSync(file, "utf8")
  : `---\ntitle: ${path.basename(file, ".md").replace(/-/g, " ")}\ntarget: explain\nlevel: aware\n---\n\n# ${path.basename(file, ".md")}\n`;
if (!/^---\n[\s\S]*?\n---\n/.test(text)) text = `---\n---\n${text}`;

const fm = text.match(/^---\n([\s\S]*?)\n---\n/)[1];
const get = (k) => (fm.match(new RegExp(`^${k}:\\s*(.*)$`, "m")) || [])[1]?.replace(/\s+#.*$/, "").trim();
const step = Number(get("review_step")) || 0;

let nextStep;
if (outcome === "solid") nextStep = step + 1;
else if (outcome === "fragile") nextStep = step;
else nextStep = 0;
const interval = LADDER[Math.min(nextStep, LADDER.length - 1)];
const consolidated = nextStep >= LADDER.length;
const d = new Date(`${today}T00:00:00Z`);
d.setUTCDate(d.getUTCDate() + interval);
const nextReview = consolidated ? "consolidated" : d.toISOString().slice(0, 10);

const updates = { last_check: outcome, last_checked: today, review_step: nextStep, next_review: nextReview };
if (level) updates.level = level;
let newFm = fm;
for (const [k, v] of Object.entries(updates)) {
  const re = new RegExp(`^${k}:.*$`, "m");
  newFm = re.test(newFm) ? newFm.replace(re, `${k}: ${v}`) : `${newFm}${newFm ? "\n" : ""}${k}: ${v}`;
}
text = text.replace(/^---\n[\s\S]*?\n---\n/, `---\n${newFm}\n---\n`);
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, text);
console.log(`${path.basename(file)}: ${outcome}${level ? `, level ${level}` : ""} → step ${nextStep}, next review ${nextReview}`);
