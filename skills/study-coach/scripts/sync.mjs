#!/usr/bin/env node
// Saves the study workspace to git and pushes it, so the online dashboard stays current.
// Usage: node sync.mjs [workspaceDir] [--message "text"] [--yes] [--dry-run]
//   Reads STUDY.md: sync (auto | ask | off, default off), remote (default origin),
//   pages_url (printed after a push), sync_include (extra paths, comma-separated).
//   sync: auto → commit and push. ask / off → do nothing unless --yes (the learner said yes).
// Stages only workspace paths. Refuses private.md and .env files. No dependencies.

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const args = process.argv.slice(2);
let dirArg = ".";
let message;
let yes = false;
let dryRun = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--message" || args[i] === "-m") message = args[++i];
  else if (args[i] === "--yes" || args[i] === "-y") yes = true;
  else if (args[i] === "--dry-run") dryRun = true;
  else dirArg = args[i];
}

const say = (m) => console.log(`sync: ${m}`);
const fail = (m) => { console.error(`sync: ${m}`); process.exit(1); };

function findRoot(start) {
  for (const c of [start, path.join(start, "study")]) if (fs.existsSync(path.join(c, "STUDY.md"))) return path.resolve(c);
  let d = path.resolve(start);
  while (d !== path.dirname(d)) {
    if (fs.existsSync(path.join(d, "STUDY.md"))) return d;
    d = path.dirname(d);
  }
  return null;
}

function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  const data = {};
  if (!m) return data;
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (kv) data[kv[1]] = kv[2].replace(/\s+#.*$/, "").trim();
  }
  return data;
}

const root = findRoot(dirArg);
if (!root) fail(`no STUDY.md found in ${path.resolve(dirArg)} (or ./study, or any parent).`);
const cfg = frontmatter(fs.readFileSync(path.join(root, "STUDY.md"), "utf8"));
const mode = (cfg.sync || "off").toLowerCase();
const remote = cfg.remote || "origin";

if (mode !== "auto" && !yes) {
  say(mode === "ask" ? "sync is 'ask'. Ask the learner, then run again with --yes." : "sync is off. Nothing saved online. Run /study-coach online to set it up.");
  process.exit(0);
}

const git = (a, opts = {}) => execFileSync("git", a, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], ...opts }).trim();
const tryGit = (a) => { try { return git(a); } catch { return null; } };

if (tryGit(["--version"]) === null) fail("git is not installed. Run /study-coach online for the steps.");
if (tryGit(["rev-parse", "--is-inside-work-tree"]) !== "true") fail("this folder is not a git repository. Run /study-coach online to set it up.");

// Workspace paths only. The learner's code in projects/ is left alone unless sync_include names it.
const PATHS = ["STUDY.md", "DASHBOARD.md", "index.html", "curriculum", "days", "courses", "books", "articles",
  "concepts", "ideas", "posts", "reviews"];
if (cfg.progress_js) PATHS.push(cfg.progress_js);
for (const p of (cfg.sync_include || "").split(",").map((s) => s.trim()).filter(Boolean)) PATHS.push(p);
const present = [...new Set(PATHS)].filter((p) => fs.existsSync(path.join(root, p)));

const BLOCKED = (f) => /(^|\/)private\.md$/i.test(f) || /(^|\/)\.env(\.|$)/.test(f);

// Find what would change, without touching the index yet.
const changed = git(["status", "--porcelain", "--untracked-files=all", "--", ...present])
  .split("\n").filter(Boolean).map((l) => l.slice(3).replace(/^.* -> /, ""));
const blocked = changed.filter(BLOCKED);
if (blocked.length) fail(`refusing to save private files: ${blocked.join(", ")}. Add them to .gitignore first.`);

const date = new Date().toISOString().slice(0, 10);
const msg = message || `study-coach: update ${date}`;
const branch = tryGit(["rev-parse", "--abbrev-ref", "HEAD"]) || "main";
const hasRemote = tryGit(["remote", "get-url", remote]) !== null;

if (dryRun) {
  say(`would commit ${changed.length} file(s) as "${msg}"${hasRemote ? ` and push to ${remote}/${branch}` : " (no remote, local only)"}.`);
  for (const f of changed) console.log(`  ${f}`);
  process.exit(0);
}

let commit = null;
if (changed.length) {
  git(["add", "-A", "--", ...present]);
  try {
    // Commit only the workspace paths, so other staged work stays staged.
    git(["commit", "--quiet", "-m", msg, "--", ...present]);
  } catch (e) {
    const err = String(e.stderr || e.message);
    if (/user\.(name|email)|Please tell me who you are/i.test(err))
      fail('git does not know your name. Run: git config --global user.name "Your Name" and git config --global user.email "you@example.com"');
    fail(`commit failed: ${err.trim().split("\n").pop()}`);
  }
  commit = git(["rev-parse", "--short", "HEAD"]);
}

if (!hasRemote) {
  say(commit ? `saved locally (commit ${commit}, ${changed.length} file(s)). No remote yet: run /study-coach online to put it on GitHub.` : "nothing to save.");
  process.exit(0);
}

const upstream = tryGit(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"]);
const ahead = upstream ? Number(tryGit(["rev-list", "--count", "@{u}..HEAD"]) || 0) : 1;
if (!commit && upstream && ahead === 0) { say("nothing to save. Online copy is up to date."); process.exit(0); }

try {
  if (upstream) git(["pull", "--rebase", "--autostash", "--quiet", remote, branch]);
  git(["push", "--quiet", ...(upstream ? [] : ["-u"]), remote, branch]);
} catch (e) {
  const err = String(e.stderr || e.message).trim();
  if (/CONFLICT|could not apply|rebase/i.test(err)) fail("the online copy has changes that conflict with yours. Ask the coach to fix the conflict. Nothing was lost.");
  if (/Authentication|403|could not read Username|Permission denied/i.test(err)) fail("GitHub did not accept your login. Run: gh auth login (then: gh auth setup-git), and try again.");
  if (/Could not resolve host|unable to access/i.test(err)) fail(`no network. Your work is saved locally${commit ? ` (commit ${commit})` : ""}. Run this again when you are online.`);
  fail(`push failed: ${err.split("\n").pop()}`);
}

const parts = [commit ? `saved ${changed.length} file(s) (commit ${commit})` : "saved", `pushed to ${remote}/${branch}`];
say(parts.join(", ") + ".");
if (cfg.pages_url) say(`online dashboard: ${cfg.pages_url} (updates in about 1 minute).`);
