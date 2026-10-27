# Upgrading a workspace

## 0.7.0: extend a day

To get the ⋮ menu and the Extensions tile, copy `skills/study-coach/templates/progress-page.html` to `index.html` again. If you changed your copy, ask the coach to merge the change. Then run `/study-coach status`, so that `progress.js` has the new fields. No other change is necessary. Day files without `extended` work as before.

## 0.6.0: report card page

New workspaces from `init` or `online` get `report.html`. An older workspace needs three changes. The coach can do them for you: run `/study-coach report` and say yes.

1. Copy `skills/study-coach/templates/report-page.html` to `report.html` in the workspace root.
2. In the `STUDY.md` frontmatter, set these two keys:
   ```yaml
   progress_js: progress.js
   report_page: true
   ```
3. In `index.html`, add the link next to the pace pill:
   ```html
   <span class="pill" id="pace"></span>
   <a class="btnlink" href="report.html">Report card →</a>
   ```
   Add this CSS to the `<style>` block. The pills then wrap on a phone, so the link stays on the first screen.
   ```css
   a.btnlink { font-size: 13px; text-decoration: none; color: var(--accent); background: var(--accent-soft); border: 1px solid var(--accent); border-radius: 8px; padding: 5px 12px; white-space: nowrap; }
   a.btnlink:hover { filter: brightness(.97); }
   .hright { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
   ```
   Then change `<div style="display:flex;gap:8px;align-items:center">` around the pill to `<div class="hright">`.
   You can also copy `templates/progress-page.html` to `index.html` again, if you did not change your copy.
4. Run `/study-coach status`. The dashboard writes `report-data.js`.

Notes:
- If you have `report.html` or `report-data.js` in `sync_include`, you can remove them. `sync.mjs` adds them when `report_page` is true.
- If you have your own `scripts/report.mjs`, you can delete it. The dashboard now runs the skill's copy.
- Nothing changes in your day files, logs or concept files.
