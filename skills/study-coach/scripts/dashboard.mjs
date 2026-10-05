#!/usr/bin/env node
// Regenerates DASHBOARD.md for a study workspace and prints it.
// Usage: node dashboard.mjs [workspaceDir] [--today YYYY-MM-DD] [--no-write] [--brief]
//   --brief: print a 1–4 line summary and don't write; exits silently if no workspace (for hooks).
// No dependencies: frontmatter and checkboxes are parsed by hand.

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

// ---------- args ----------
const args = process.argv.slice(2);
let dirArg = ".";
let todayArg;
let write = true;
let brief = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--today") todayArg = args[++i];
  else if (args[i] === "--no-write") write = false;
  else if (args[i] === "--brief") { brief = true; write = false; }
  else dirArg = args[i];
}

function findRoot(start) {
  const candidates = [start, path.join(start, "study")];
  for (const c of candidates) if (fs.existsSync(path.join(c, "STUDY.md"))) return path.resolve(c);
  let d = path.resolve(start);
  while (d !== path.dirname(d)) {
    if (fs.existsSync(path.join(d, "STUDY.md"))) return d;
    d = path.dirname(d);
  }
  return null;
}

const root = findRoot(dirArg);
if (!root) {
  if (brief) process.exit(0);
  console.error(`No STUDY.md found in ${path.resolve(dirArg)} (or ./study, or any parent).`);
  process.exit(1);
}

// ---------- parsing ----------
function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  const data = {};
  if (!m) return { data, body: text };
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].replace(/\s+#.*$/, "").trim();
    if (/^-?\d+(\.\d+)?$/.test(v)) v = Number(v);
    data[kv[1]] = v;
  }
  return { data, body: text.slice(m[0].length) };
}

const BOX = /^\s*[-*] \[( |x|X|-)\] (.*)$/;
const OPTIONAL = /\(stretch\)|\(if behind\)|\bstretch:/i;

// Checkboxes, optionally restricted to some `## ` sections.
function parseBoxes(body, sections) {
  const items = [];
  let section = null;
  for (const line of body.split("\n")) {
    const h = line.match(/^##\s+(.*)$/);
    if (h) { section = h[1].trim(); continue; }
    if (sections && !sections.includes(section)) continue;
    const m = line.match(BOX);
    if (!m) continue;
    const text = m[2].trim();
    const label = (text.match(/^\*\*(.+?):\*\*/) || [])[1] || (section === "Done when" ? "Done when" : "");
    items.push({
      text,
      label,
      section,
      state: m[1] === " " ? "todo" : m[1] === "-" ? "dropped" : "done",
      optional: OPTIONAL.test(text),
    });
  }
  return items;
}

function logField(body, name) {
  const m = body.match(new RegExp(`^- \\*\\*${name}:?\\*\\*:?[ \\t]*(.*)$`, "m"));
  return m ? m[1].trim() : "";
}

function read(file) { return fs.readFileSync(file, "utf8"); }
const last = (a) => a[a.length - 1];
function mdFiles(dir) {
  const d = path.join(root, dir);
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md").sort().map((f) => path.join(d, f));
}

// ---------- dates ----------
const { data: cfg } = parseFrontmatter(read(path.join(root, "STUDY.md")));
const tz = cfg.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
const today = todayArg || new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(new Date());
const toUTC = (s) => { const [y, m, d] = String(s).split("-").map(Number); return Date.UTC(y, m - 1, d); };
const daysBetween = (a, b) => Math.round((toUTC(b) - toUTC(a)) / 86400000);
const weekday = (s) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date(toUTC(s)).getUTCDay()];

// ---------- days ----------
const days = mdFiles("days").map((file) => {
  const { data, body } = parseFrontmatter(read(file));
  const items = parseBoxes(body, ["Plan", "Done when"]);
  const required = items.filter((i) => !i.optional);
  const resolved = required.filter((i) => i.state !== "todo");
  const date = String(data.date || "");
  let status;
  if (required.length && resolved.length === required.length) status = "done";
  else if (date > today) status = "upcoming";
  else if (date === today) status = "today";
  else status = items.some((i) => i.state === "done") ? "partial" : "missed";
  return {
    file: path.relative(root, file),
    day: Number(data.day ?? NaN),
    date,
    week: data.week ?? "",
    title: data.title || "",
    type: data.type || "core",
    hours: Number(data.hours) || 0,
    items,
    required,
    resolved,
    status,
    logged: Boolean(logField(body, "Done")),
    log: { done: logField(body, "Done"), blocked: logField(body, "Blocked"), next: logField(body, "Tomorrow's first task") },
  };
}).filter((d) => d.date).sort((a, b) => a.date.localeCompare(b.date));

const past = days.filter((d) => d.date < today);
const future = days.filter((d) => d.date > today);
const todayDay = days.find((d) => d.date === today);
const isPost = (i) => /^post/i.test(i.label);

// Pace: items owed from past days vs items already done on future days.
const owed = past.flatMap((d) => d.required.filter((i) => i.state === "todo").map((i) => ({ ...i, day: d })));
const aheadItems = future.flatMap((d) => d.items.filter((i) => i.state === "done"));
const totalRequired = days.reduce((n, d) => n + d.required.length, 0);
const totalResolved = days.reduce((n, d) => n + d.resolved.length, 0);

let missedRun = 0;
for (let i = past.length - 1; i >= 0 && past[i].status === "missed"; i--) missedRun++;
const scopeCutAfter = Number(cfg.scope_cut_after_missed) || 2;

let streak = 0;
for (let i = past.length - 1; i >= 0 && (past[i].logged || past[i].status === "done"); i--) streak++;
if (todayDay && (todayDay.logged || todayDay.status === "done")) streak++;

// ---------- other folders ----------
function progressOf(file) {
  const { data, body } = parseFrontmatter(read(file));
  if (data.total) return { title: data.title || path.basename(file, ".md"), done: Number(data.progress) || 0, total: Number(data.total), unit: data.unit || "" };
  const boxes = parseBoxes(body);
  if (!boxes.length) return null;
  return { title: data.title || path.basename(file, ".md"), done: boxes.filter((b) => b.state === "done").length, total: boxes.length, unit: data.type === "book" ? "chapters" : "parts" };
}
const tracks = [...mdFiles("courses"), ...mdFiles("books")].map((f) => ({ rel: path.relative(root, f), p: progressOf(f) })).filter((t) => t.p);

const LEVELS = { aware: 1, explain: 2, apply: 3, teach: 4 };
const lvl = (v) => (typeof v === "number" ? v : LEVELS[String(v).toLowerCase()] || 0);
const concepts = mdFiles("concepts").filter((f) => !path.basename(f).startsWith("_")).map((f) => {
  const { data } = parseFrontmatter(read(f));
  return {
    title: data.title || path.basename(f, ".md"),
    level: lvl(data.level),
    target: lvl(data.target || cfg.default_depth || "explain"),
    checked: data.last_checked || "",
    outcome: data.last_check || "",
    next: String(data.next_review || ""),
  };
});
const due = concepts.filter((c) => /^\d{4}-\d{2}-\d{2}$/.test(c.next) && c.next <= today).sort((a, b) => a.next.localeCompare(b.next));
const misconceptions = concepts.filter((c) => c.outcome === "misconception");

// Markdown table → array of row objects keyed by lower-cased header.
function readTable(rel) {
  const f = path.join(root, rel);
  if (!fs.existsSync(f)) return [];
  const rows = read(f).split("\n").filter((l) => /^\|/.test(l.trim()));
  if (rows.length < 2) return [];
  const cells = (l) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
  const head = cells(rows[0]).map((h) => h.toLowerCase());
  return rows.slice(2).map(cells).filter((r) => r.some(Boolean)).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] || ""])));
}
const misses = readTable("concepts/_misses.md");
const watchlist = misses.filter((m) => Number(m.count) >= 2);
const changes = readTable("curriculum/changes.md");
const proposals = readTable("curriculum/proposals.md").filter((p) => !/applied|rejected|parked/i.test(p.status || ""));
const published = readTable("posts/published.md");

let exit = null;
if (cfg.exit_test && fs.existsSync(path.join(root, cfg.exit_test))) {
  const boxes = parseBoxes(read(path.join(root, cfg.exit_test)));
  exit = { done: boxes.filter((b) => b.state === "done").length, total: boxes.length, pass: Number(cfg.exit_test_pass) || boxes.length };
}

const countLines = (rel, re) => (fs.existsSync(path.join(root, rel)) ? read(path.join(root, rel)).split("\n").filter((l) => re.test(l)).length : 0);
const inboxCount = countLines("ideas/inbox.md", /^- (?!\[)\S/);
const parkingCount = Math.max(0, countLines("ideas/parking-lot.md", /^\|/) - 2);
const articleCount = mdFiles("articles").length;

function commitsBetween(from, to) {
  try {
    const out = execFileSync("git", ["-C", root, "log", "--oneline", `--since=${from} 00:00`, `--until=${to} 23:59`, "--", "."], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    return out.split("\n").filter(Boolean).length;
  } catch { return "–"; }
}

// ---------- render ----------
const bar = (done, total, width = 20) => {
  const f = total ? Math.round((done / total) * width) : 0;
  return "█".repeat(f) + "░".repeat(width - f);
};
const pct = (done, total) => (total ? Math.round((done / total) * 100) : 0);
const box = (s) => (s === "done" ? "[x]" : s === "dropped" ? "[-]" : "[ ]");
const ICON = { done: "✅", partial: "🟡", missed: "❌", today: "👉", upcoming: "·" };

const out = [];
out.push(`# Dashboard — ${cfg.curriculum || "Study plan"}`, "");
out.push(`> Generated ${today} by study-coach. Don't edit by hand — run \`/study-coach status\`.`, "");

// Headline
const start = cfg.start || days.find((d) => d.day >= 1)?.date;
const end = cfg.end || last(days)?.date;
const dayNum = start ? daysBetween(start, today) + 1 : null;
const totalDays = Number(cfg.days) || days.filter((d) => d.day >= 1).length;
out.push("## Where you are", "");
if (start && today < start) out.push(`- **Before Day 1.** Day 1 starts ${weekday(start)} ${start} (in ${daysBetween(today, start)} day(s)).`);
else if (end && today > end) out.push(`- **Curriculum finished** (ended ${end}).`);
else if (dayNum) out.push(`- **Day ${dayNum} of ${totalDays}** · ${weekday(today)} ${today}${todayDay ? ` · Week ${todayDay.week}: ${todayDay.title}` : ""}`);
out.push(`- **Overall:** ${bar(totalResolved, totalRequired)} ${pct(totalResolved, totalRequired)}% (${totalResolved}/${totalRequired} required items)`);

let pace;
if (owed.length && aheadItems.length) pace = `🟠 **Mixed** — ${owed.length} item(s) owed from past days, ${aheadItems.length} done ahead`;
else if (owed.length) pace = `🔴 **Behind** — ${owed.length} item(s) owed across ${new Set(owed.map((o) => o.day.day)).size} day(s)`;
else if (aheadItems.length) pace = `🟢 **Ahead** — ${aheadItems.length} future item(s) already done`;
else pace = past.length ? "🟢 **On track** — nothing owed" : "⚪ **Not started**";
out.push(`- **Pace:** ${pace}`);
out.push(`- **Streak:** ${streak} day(s) logged in a row`);
if (missedRun >= scopeCutAfter) out.push(`- ⚠️ **${missedRun} days missed in a row** — plan rule: cut scope, don't add hours.`);
if (exit) out.push(`- **Exit test:** ${exit.done}/${exit.total} (pass ≥ ${exit.pass})`);
if (cfg.pages_url) out.push(`- **Online:** ${cfg.pages_url}`);
out.push("");

// Reviews due
if (due.length || watchlist.length || misconceptions.length) {
  out.push("## Reviews due", "");
  for (const c of misconceptions) out.push(`- ❗ **${c.title}** — confident but wrong last time; fix first`);
  for (const c of due.filter((c) => c.outcome !== "misconception")) out.push(`- 🔁 ${c.title} — due ${c.next}${c.outcome ? ` (last: ${c.outcome})` : ""}`);
  for (const m of watchlist) out.push(`- 👀 Repeat miss: ${m.concept || m.id} — ${m.note || m.type} (×${m.count})`);
  out.push("");
}

// Today
const focus = todayDay || (start && today < start ? days.find((d) => d.date <= start && d.status !== "done" && d.day === 0) : null);
const lastLogged = [...past].reverse().find((d) => d.log.next);
out.push("## Today", "");
if (focus) {
  out.push(`**${focus.title}** — \`${focus.file}\``, "");
  if (lastLogged) out.push(`Start with (from Day ${lastLogged.day}'s log): _${lastLogged.log.next}_`, "");
  for (const i of focus.items) out.push(`- ${box(i.state)} ${i.text}${i.optional ? " _(optional)_" : ""}`);
} else {
  out.push(future.length ? `No entry for today. Next: Day ${future[0].day} (${future[0].date}) — ${future[0].title}` : "Nothing scheduled today.");
}
out.push("");

// Catch-up queue
if (owed.length) {
  out.push("## Catch-up queue (goes to Sunday)", "");
  for (const o of owed.slice(0, 15)) out.push(`- Day ${o.day.day} · ${o.text.length > 110 ? o.text.slice(0, 107) + "…" : o.text}`);
  if (owed.length > 15) out.push(`- …and ${owed.length - 15} more`);
  out.push("");
}

// Weeks
const weeks = [...new Set(days.map((d) => d.week))].filter((w) => w !== "" && w !== 0);
if (weeks.length) {
  out.push("## Weekly scorecard", "");
  out.push(`| Week | Days done | Logged | Items | Hours (target ${cfg.hours_target_per_week || "–"}) | Posts | Commits |`);
  out.push("|---|---|---|---|---|---|---|");
  for (const w of weeks) {
    const wd = days.filter((d) => d.week === w);
    const req = wd.reduce((n, d) => n + d.required.length, 0);
    const res = wd.reduce((n, d) => n + d.resolved.length, 0);
    const started = wd[0].date <= today;
    const reels = wd.reduce((n, d) => n + d.items.filter((i) => isPost(i) && i.state === "done").length, 0);
    out.push(`| ${w} | ${wd.filter((d) => d.status === "done").length}/${wd.length} | ${wd.filter((d) => d.logged).length} | ${res}/${req} | ${wd.reduce((n, d) => n + d.hours, 0)} | ${reels} | ${started ? commitsBetween(wd[0].date, last(wd).date) : "–"} |`);
  }
  out.push("");
}

// Calendar
out.push("## Calendar", "");
out.push("✅ done · 🟡 partial · ❌ missed · 👉 today · · upcoming", "");
for (const w of [...new Set(days.map((d) => d.week))]) {
  const wd = days.filter((d) => d.week === w);
  out.push(`- **${w === 0 || w === "" ? "Setup" : `Week ${w}`}:** ` + wd.map((d) => `${ICON[d.status]} ${d.day}`).join("  "));
}
out.push("");

// Tracks
if (tracks.length) {
  out.push("## Courses & books", "");
  for (const t of tracks) out.push(`- \`${bar(t.p.done, t.p.total, 12)}\` ${t.p.title} — ${t.p.done}/${t.p.total} ${t.p.unit}`);
  out.push("");
}

// Concepts
if (concepts.length) {
  const names = ["–", "aware", "explain", "apply", "teach"];
  out.push("## Concept mastery", "");
  out.push("| Concept | Level | Target | Last checked | Next review |", "|---|---|---|---|---|");
  for (const c of concepts) out.push(`| ${c.title} | ${names[c.level] || "–"}${c.level < c.target ? " ⚠️" : " ✅"} | ${names[c.target]} | ${c.checked}${c.outcome ? ` (${c.outcome})` : ""} | ${c.next} |`);
  out.push("");
}

// Recent log
const recent = [...days].filter((d) => d.date <= today && (d.log.done || d.log.blocked)).slice(-3).reverse();
if (recent.length) {
  out.push("## Recent log", "");
  for (const d of recent) {
    out.push(`- **Day ${d.day}** (${d.date}) — done: ${d.log.done || "–"}${d.log.blocked ? ` · blocked: ${d.log.blocked}` : ""}`);
  }
  out.push("");
}

// Sharing
if (published.length) {
  const byPlatform = {};
  for (const p of published) byPlatform[p.platform || "other"] = (byPlatform[p.platform || "other"] || 0) + 1;
  out.push("## Shared", "");
  out.push(`- ${published.length} post(s) published · ` + Object.entries(byPlatform).map(([k, v]) => `${k} ${v}`).join(" · "));
  const lastPost = last(published);
  out.push(`- Last: ${lastPost.date || ""} ${lastPost.title || ""}`.trimEnd());
  out.push("");
}

// Plan changes
if (changes.length || proposals.length) {
  const goalChanges = changes.filter((c) => /goal/i.test(c.kind || ""));
  out.push("## Plan changes", "");
  if (changes.length) out.push(`- ${changes.length} change(s) logged${goalChanges.length ? ` · ${goalChanges.length} goal change(s)` : ""} · last: ${last(changes).date} — ${last(changes).change}`);
  if (proposals.length) out.push(`- ${proposals.length} proposal(s) waiting for the next review`);
  out.push("");
}

out.push("## Collected", "");
out.push(`- Ideas in inbox: ${inboxCount} · Parking lot: ${parkingCount} · Articles/papers noted: ${articleCount} · Concepts checked: ${concepts.length} · Misses logged: ${misses.length}`);
out.push("");

if (brief) {
  const lines = [`study-coach: ${dayNum && dayNum >= 1 && dayNum <= totalDays ? `Day ${dayNum}/${totalDays}${todayDay ? ` — ${todayDay.title}` : ""}` : start && today < start ? `Day 1 starts ${start}` : "plan finished"} · ${pace.replace(/\*\*/g, "")}`];
  if (due.length || misconceptions.length) lines.push(`study-coach: ${due.length} concept review(s) due${misconceptions.length ? `, ${misconceptions.length} misconception(s) to fix` : ""}`);
  if (lastLogged && todayDay) lines.push(`study-coach: start with — ${lastLogged.log.next}`);
  lines.push("study-coach: run /study-coach for today's plan");
  process.stdout.write(lines.join("\n") + "\n");
  process.exit(0);
}

// Optional data file for a progress page: STUDY.md `progress_js: progress.js`.
// Written as `window.STUDY_PROGRESS = {...}` so a static page can load it from file:// or GitHub Pages.
function weekIntros() {
  const f = path.join(root, cfg.plan || "curriculum/plan.md");
  if (!fs.existsSync(f)) return {};
  const intros = {};
  const re = /^## Week (\d+) — (.+)\n\n([^\n]+)/gm;
  for (const m of read(f).matchAll(re)) intros[m[1]] = { title: m[2].replace(/\s*\(Days.*\)$/, ""), goal: m[3] };
  return intros;
}
if (write && cfg.progress_js) {
  const data = {
    generated: today, timezone: tz,
    curriculum: cfg.curriculum || "",
    start, end, dayNum, totalDays,
    pace: pace.replace(/\*\*/g, ""),
    paceKind: owed.length && aheadItems.length ? "mixed" : owed.length ? "behind" : aheadItems.length ? "ahead" : past.length ? "on-track" : "not-started",
    streak, missedRun,
    overall: { done: totalResolved, total: totalRequired },
    exit: exit && { ...exit, items: parseBoxes(read(path.join(root, cfg.exit_test))).map((b) => ({ text: b.text, state: b.state })) },
    posts: published.length,
    reviewsDue: due.map((c) => ({ title: c.title, next: c.next, outcome: c.outcome })),
    weeks: weekIntros(),
    tracks: tracks.map((t) => ({ file: t.rel, ...t.p })),
    days: days.map((d) => ({
      day: d.day, date: d.date, weekday: weekday(d.date), week: d.week, title: d.title, type: d.type, hours: d.hours,
      status: d.status, file: d.file, log: d.log,
      items: d.items.map((i) => ({ text: i.text, label: i.label, section: i.section, state: i.state, optional: i.optional })),
    })),
  };
  fs.writeFileSync(path.join(root, cfg.progress_js), `window.STUDY_PROGRESS = ${JSON.stringify(data, null, 1)};\n`);
}

const md = out.join("\n");
if (write) fs.writeFileSync(path.join(root, "DASHBOARD.md"), md);
process.stdout.write(md);
