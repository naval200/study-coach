#!/usr/bin/env node
// Heuristic ASD-STE100 check for HTML/Markdown prose. Not the official STE dictionary.
// Checks per sentence: length (<=20 words procedural, <=25 descriptive), passive voice,
// contractions, -ing forms, and paragraphs over 6 sentences. Usage: node tools/ste-check.mjs <files...> [--verbose]
import { readFileSync } from "node:fs";

const files = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const verbose = process.argv.includes("--verbose");
const ING_OK = new Set(["thing", "something", "anything", "nothing", "everything", "string", "bring", "during", "morning", "evening", "spring", "king", "ring", "ceiling", "sing", "wing", "bring", "meaning", "building", "warning", "setting", "settings", "training", "pricing", "logging", "nothing", "learning", "planning", "missing", "pending", "routing", "pooling", "existing", "debugging", "testing", "monitoring", "streaming", "sharing", "tracking", "spacing", "timing", "parking"]);
// Words STE treats as technical names / common nouns in this project are allowed above.
const PASSIVE = /\b(is|are|was|were|be|been|being|gets|got)\s+(\w+ly\s+)?\w+(ed|en)\b/i;
const CONTRACTION = /\b\w+(n't|'re|'ll|'ve|'d|'m)\b|\b(it|that|there|what|here)'s\b/i;
const IMPERATIVE = /^(add|ask|build|check|choose|copy|do|find|give|keep|make|open|put|read|run|show|start|stop|tell|type|use|write|install|make|download|turn|answer|learn|test|log|cut|end|fix|go|look|say|set|see)\b/i;

function textOf(src, file) {
  if (file.endsWith(".html")) {
    src = src.replace(/<(script|style|pre|code|nav|title|head)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<(br|\/p|\/li|\/h\d|\/td|\/th|\/tr|\/summary|\/div)>/gi, "\n\n")
      .replace(/<[^>]+>/g, " ").replace(/&[a-z]+;|&#\d+;/g, " ");
  } else {
    src = src.replace(/```[\s\S]*?```/g, " ").replace(/`[^`]*`/g, " X ").replace(/^---[\s\S]*?---/, " ");
  }
  return src;
}

let total = 0, pass = 0;
const issues = {};
for (const file of files) {
  const paras = textOf(readFileSync(file, "utf8"), file).split(/\n\s*\n/).map((p) => p.replace(/\s+/g, " ").trim()).filter(Boolean);
  for (const p of paras) {
    const sentences = p.split(/(?<=[.!?:])\s+(?=[A-Z"“(])/).filter((s) => s.split(/\s+/).length >= 3);
    if (sentences.length > 6) (issues["paragraph > 6 sentences"] ??= []).push(`${file}: ${p.slice(0, 60)}…`);
    for (const s of sentences) {
      const words = s.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w));
      const limit = IMPERATIVE.test(s) ? 20 : 25;
      const probs = [];
      if (words.length > limit) probs.push(`long (${words.length})`);
      if (PASSIVE.test(s) && !/\b(is|are)\s+(red|need|used to)\b/i.test(s)) probs.push("passive?");
      if (CONTRACTION.test(s)) probs.push("contraction");
      const ing = words.map((w) => w.toLowerCase().replace(/[^a-z-]/g, "")).filter((w) => w.endsWith("ing") && w.length > 4 && !ING_OK.has(w));
      if (ing.length) probs.push(`-ing: ${ing.join(",")}`);
      total++;
      if (!probs.length) pass++;
      else for (const pr of probs) (issues[pr.split(/[ :(]/)[0]] ??= []).push(`${file}: [${probs.join("; ")}] ${s}`);
    }
  }
}
const pct = total ? Math.round((pass / total) * 100) : 100;
console.log(`STE heuristic: ${pass}/${total} sentences pass (${pct}%)`);
for (const [k, v] of Object.entries(issues)) {
  console.log(`  ${k}: ${v.length}`);
  if (verbose) for (const line of v) console.log(`    ${line}`);
}
process.exitCode = pct >= 80 ? 0 : 1;
