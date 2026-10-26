#!/usr/bin/env node
// Builds report-data.js for report.html (concept scorecard + weekly report card) and prints a text summary.
// Usage: node report.mjs [workspaceDir] [--today YYYY-MM-DD] [--no-write]
// Reads progress.js (written by dashboard.mjs), concepts/*.md, concepts/_misses.md and reviews/week-N.md.
// dashboard.mjs imports buildReport() and runs it after it writes progress.js when STUDY.md has `report_page: true`.
// No dependencies.

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const data = {};
  if (!m) return { data, body: text };
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (kv) data[kv[1]] = kv[2].replace(/\s+#.*$/, "").trim();
  }
  return { data, body: text.slice(m[0].length) };
}

export const isOn = (v) => /^(true|yes|on)$/i.test(String(v ?? "").trim());

// report-data.js goes next to progress.js, because report.html loads both with relative paths.
export function reportPath(root, cfg) {
  return path.join(root, path.dirname(cfg.progress_js || "progress.js"), "report-data.js");
}

export const todayIn = (tz) => new Intl.DateTimeFormat("en-CA", { timeZone: tz || undefined }).format(new Date());

const LEVELS = ["aware", "explain", "apply", "teach"];
const rank = (v) => LEVELS.indexOf(String(v || "").toLowerCase()) + 1; // 0 = unknown

// Concept grouping rules (SKILL.md section 4). Keep in sync with the page legend.
export function groupOf(c) {
  if (!c.last) return "untested";
  if (c.last === "misconception" || c.last === "gap") return "fix";
  if (c.last === "fragile") return "fragile";
  if (c.last === "solid") return rank(c.level) >= rank(c.target) ? "reliable" : "building";
  return "untested";
}

function readTable(text) {
  const rows = text.split(/\r?\n/).filter((l) => /^\|/.test(l.trim()));
  if (rows.length < 2) return [];
  const cells = (l) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
  const head = cells(rows[0]).map((h) => h.toLowerCase());
  return rows.slice(2).map(cells).filter((r) => r.some(Boolean)).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] || ""])));
}

// One week review. Every section is optional: a missing file gives null, a missing section gives [].
function parseReview(text) {
  const { body } = parseFrontmatter(text);
  const sections = {};
  let cur = null;
  let deliverable = "";
  for (const raw of body.split(/\r?\n/)) {
    const line = raw.trimEnd();
    const h = line.match(/^#{2,3}\s+(.*)$/);
    if (h) { cur = h[1].trim().toLowerCase().replace(/[’`]/g, "'"); sections[cur] = []; continue; }
    const d = line.match(/^\*\*Deliverable:?\*\*:?\s*(.*)$/i);
    if (d) { deliverable = d[1].trim(); continue; }
    if (!cur || !line.trim() || /^\s*\|/.test(line) || /^<!--/.test(line.trim())) continue;
    const item = line.replace(/^\s*(?:[-*+]|\d+[.)])\s*(?:\[[ xX-]\]\s*)?/, "").trim();
    if (item) sections[cur].push(item);
  }
  const pick = (...keys) => {
    const hit = Object.entries(sections).find(([k]) => keys.some((key) => k.startsWith(key)));
    return hit ? hit[1] : [];
  };
  const r = {
    deliverable,
    worked: pick("what worked"),
    didnt: pick("what didn", "what did not"),
    catchup: pick("catch-up", "catch up"),
    ideas: pick("ideas"),
    change: pick("one change", "change for next"),
  };
  const empty = !r.deliverable && ["worked", "didnt", "catchup", "ideas", "change"].every((k) => !r[k].length);
  return empty ? null : r;
}

export function buildReport(root, { cfg, progress, today }) {
  const read = (p) => { try { return fs.readFileSync(path.join(root, p), "utf8"); } catch { return ""; } };
  const defaultTarget = cfg.default_depth || "explain";

  // ---- concept scorecard ----
  const misses = readTable(read("concepts/_misses.md")).map((m) => ({
    concept: m.concept || "", note: m.note || m.type || "", count: Number(m.count) || 1, last: m["last seen"] || "",
  }));
  const dir = path.join(root, "concepts");
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".md") && !f.startsWith("_") && f.toLowerCase() !== "readme.md").sort() : [];
  const concepts = files.map((f) => {
    const slug = f.replace(/\.md$/, "");
    const { data } = parseFrontmatter(read(`concepts/${f}`));
    const c = {
      slug,
      title: data.title || slug,
      level: String(data.level || "aware").toLowerCase(),
      target: String(data.target || defaultTarget).toLowerCase(),
      last: String(data.last_check || "").toLowerCase(),
      lastChecked: data.last_checked || "",
      next: /^\d{4}-\d{2}-\d{2}$/.test(data.next_review || "") ? data.next_review : "",
      misses: misses.filter((m) => m.concept === slug).map((m) => ({ note: m.note, count: m.count, last: m.last })),
    };
    c.group = groupOf(c);
    c.overdue = Boolean(c.next) && c.next < today;
    return c;
  });

  // ---- weekly report card ----
  const days = (progress.days || []).filter((d) => Number(d.week) >= 1 && d.date);
  const weekNums = [...new Set(days.map((d) => Number(d.week)))].sort((a, b) => a - b);
  const stats = progress.weekStats || {};
  const weeks = weekNums.map((n) => {
    const wd = days.filter((d) => Number(d.week) === n);
    const dates = wd.map((d) => d.date).sort();
    const nums = wd.map((d) => Number(d.day)).filter((x) => Number.isFinite(x));
    const req = wd.flatMap((d) => (d.items || []).filter((i) => !i.optional));
    const hours = wd.reduce((s, d) => s + (Number(d.hours) || 0), 0);
    const intro = (progress.weeks || {})[n] || {};
    const st = stats[n] || {};
    const reviewText = read(`reviews/week-${n}.md`);
    return {
      week: n,
      title: intro.title || "",
      goal: intro.goal || "",
      start: dates[0],
      end: dates[dates.length - 1],
      dayFrom: nums.length ? Math.min(...nums) : null,
      dayTo: nums.length ? Math.max(...nums) : null,
      state: today < dates[0] ? "upcoming" : today > dates[dates.length - 1] ? "past" : "current",
      days: wd.length,
      daysDone: wd.filter((d) => d.status === "done").length,
      daysLogged: wd.filter((d) => d.log && (d.log.done || d.log.blocked)).length,
      items: req.length,
      itemsDone: req.filter((i) => i.state === "done").length,
      hours: hours || null, // null = not tracked; the page shows "–"
      posts: today < dates[0] ? null : st.posts ?? null,
      commits: typeof st.commits === "number" ? st.commits : null,
      review: reviewText ? parseReview(reviewText) : null,
    };
  });

  return { generated: today, posts: progress.posts ?? null, concepts, weeks };
}

export function writeReport(root, cfg, data) {
  const file = reportPath(root, cfg);
  fs.writeFileSync(file, "window.STUDY_REPORT = " + JSON.stringify(data, null, 1) + ";\n");
  return file;
}

// ---------- CLI ----------
const GROUPS = [["fix", "Fix first"], ["fragile", "Fragile"], ["building", "Building"], ["reliable", "Reliable"], ["untested", "Untested"]];

function printReport(r) {
  const out = [];
  const C = r.concepts;
  out.push(`# Report card (${r.generated})`, "");
  out.push("Grades come from checks with no hints. A tick on a day does not count here.", "");
  out.push(`## Concept scorecard (${C.length} concept(s))`, "");
  if (!C.length) out.push("No concepts yet. Run `/study-coach check <concept>` to add the first one.");
  for (const [g, name] of GROUPS) {
    const rows = C.filter((c) => c.group === g);
    if (!rows.length) continue;
    out.push(`**${name} · ${rows.length}**`);
    for (const c of rows) {
      const next = c.next ? (c.overdue ? `review overdue (${c.next})` : `next review ${c.next}`) : "no review set";
      out.push(`- ${c.title}: ${c.level} → ${c.target}${c.last ? `, last: ${c.last}` : ""}, ${next}`);
      for (const m of c.misses) out.push(`  - miss${m.count > 1 ? ` ×${m.count}` : ""}: ${m.note}`);
    }
    out.push("");
  }
  out.push("", `## Weekly report card (${r.weeks.filter((w) => w.review).length} of ${r.weeks.length} week(s) reviewed)`, "");
  if (!r.weeks.length) out.push("No plan weeks yet.");
  const dash = (v) => (v == null ? "–" : v);
  for (const w of r.weeks) {
    const span = w.dayFrom != null ? `Days ${w.dayFrom}–${w.dayTo}, ` : "";
    out.push(`- **Week ${w.week}${w.title ? ` · ${w.title}` : ""}** (${span}${w.start} – ${w.end}, ${w.state}): items ${w.itemsDone}/${w.items}, days done ${w.daysDone}/${w.days}, logged ${w.daysLogged}/${w.days}, hours ${dash(w.hours)}, posts ${dash(w.posts)}, commits ${dash(w.commits)}`);
    if (w.review) {
      for (const [k, label] of [["worked", "worked"], ["didnt", "did not work"], ["change", "one change"]]) {
        if (w.review[k].length) out.push(`  - ${label}: ${w.review[k].join("; ")}`);
      }
    } else if (w.state === "past") out.push("  - no week review yet");
  }
  process.stdout.write(out.join("\n") + "\n");
}

function findRoot(start) {
  for (const c of [start, path.join(start, "study")]) if (fs.existsSync(path.join(c, "STUDY.md"))) return path.resolve(c);
  let d = path.resolve(start);
  while (d !== path.dirname(d)) {
    if (fs.existsSync(path.join(d, "STUDY.md"))) return d;
    d = path.dirname(d);
  }
  return null;
}

let isMain = false;
try { isMain = fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url)); } catch {}
if (isMain) {
  const args = process.argv.slice(2);
  let dirArg = ".", todayArg, write = true;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--today") todayArg = args[++i];
    else if (args[i] === "--no-write") write = false;
    else dirArg = args[i];
  }
  const root = findRoot(dirArg);
  if (!root) { console.error(`report: no STUDY.md found in ${path.resolve(dirArg)} (or ./study, or any parent).`); process.exit(1); }
  const { data: cfg } = parseFrontmatter(fs.readFileSync(path.join(root, "STUDY.md"), "utf8"));
  const pjs = path.join(root, cfg.progress_js || "progress.js");
  if (!fs.existsSync(pjs)) { console.error(`report: ${path.relative(root, pjs)} is missing. Set progress_js in STUDY.md and run dashboard.mjs first.`); process.exit(1); }
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(pjs, "utf8"), ctx);
  const progress = ctx.window.STUDY_PROGRESS || {};
  const today = todayArg || todayIn(cfg.timezone || progress.timezone);
  const data = buildReport(root, { cfg, progress, today });
  if (write) writeReport(root, cfg, data);
  printReport(data);
}
