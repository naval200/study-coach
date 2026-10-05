# online: put the dashboard on the web and save automatically

Use this mode when the learner wants an online progress page, or when `sync.mjs` reports "no remote" or "not a git repository". Many learners do not know git or GitHub. Explain each step in one or two plain sentences. Do one step at a time. Confirm that each step works before you start the next one.

## Words to explain (only when the learner asks, or seems unsure)

- **git:** a program that saves versions of a folder. Each save is a "commit".
- **GitHub:** a website that keeps a copy of a git folder online. The online copy is a "repository" (repo).
- **Push:** send the new commits to GitHub.
- **GitHub Pages:** free web hosting from GitHub. It shows `index.html` from the repo at `https://<username>.github.io/<repo>/`.

## Safety rules

- The learner creates the GitHub account. Do not create accounts, type passwords or enter one-time codes.
- The learner signs in with `gh auth login`. This uses a browser, so you never see a password.
- A free account shows Pages only for a **public** repo. Anyone can then read every committed file. Say this before you create the repo, and get a clear yes.
- Before the first push, make sure `.gitignore` lists `private.md` and `.env*`. Show the file list from `sync.mjs --dry-run --yes` and get a yes.
- Never push the learner's code from `projects/` unless they ask. It goes in `sync_include` only on request.

## Steps

1. **Ask what they want.** Choose one:
   - **Online page and automatic save** (recommended): GitHub repo, Pages, `sync: auto`.
   - **Automatic backup only:** a private repo, no page, `sync: auto`.
   - **Ask each time:** as above, with `sync: ask`.
   - **Local only:** `sync: off`. Stop here.
2. **Check the tools.** Run `git --version` and `gh --version`.
   - No git on macOS: `xcode-select --install`. On Windows: `winget install Git.Git`. On Linux: the package manager.
   - No gh on macOS: `brew install gh`. On Windows: `winget install GitHub.cli`. Other options: https://cli.github.com.
   - The learner runs install commands that need a password. You do not.
   - If `git config user.name` is empty, ask for the name and email to show on commits. Then set them with `git config --global`.
3. **GitHub account.** Ask "Do you have a GitHub account?" If not, tell them:
   - Open https://github.com/signup and follow the screens. Choose a username that you are happy to show in the page address.
   - Verify the email address. The free plan is enough.
   - Tell me the username when you finish.
4. **Sign in.** Tell the learner to type `! gh auth login` in Claude Code, or to run `gh auth login` in a terminal. Tell them which choices to pick: GitHub.com, HTTPS, "Login with a web browser". Then run `gh auth setup-git` and `gh auth status` to confirm the sign-in.
5. **Make the folder a repo.** If `git rev-parse --is-inside-work-tree` fails, run `git init -b main`. If `origin` points to a repo that the learner does not own (for example, they cloned a template), rename it with `git remote rename origin upstream` before step 7. Add or extend `.gitignore` with `private.md`, `.env*`, `.DS_Store` and `.claude/skills/`.
6. **Progress page.** If `index.html` does not exist, copy `templates/progress-page.html` to `index.html`. Set `progress_js: progress.js` in `STUDY.md`. Run the dashboard so that `progress.js` exists.
7. **Create the repo.** Suggest a name (for example `study` or the curriculum slug). Get a yes for public or private. Then run:
   `gh repo create <name> --public --source . --remote origin` (or `--private`).
8. **Save the settings** in the `STUDY.md` front matter:
   ```yaml
   sync: auto
   remote: origin
   pages_url: https://<username>.github.io/<name>/
   ```
   For a backup-only repo, leave `pages_url` empty.
9. **First push.** Run `sync.mjs --dry-run --yes` and show the file list. After a yes, run `sync.mjs --yes -m "Start my study log"`.
10. **Turn on Pages** (only for the online page):
    `gh api -X POST repos/<username>/<name>/pages -f "source[branch]=main" -f "source[path]=/"`
    If GitHub says that Pages already exists, continue. The first build takes 1–10 minutes. Check with
    `gh api repos/<username>/<name>/pages --jq .status` until it shows `built`. Then give the learner the link.
11. **Tell the learner what happens now.** Use one short paragraph:
    - After each `log`, `check`, `review`, `adapt`, `share` or `capture`, the coach saves and pushes. The page updates in about 1 minute.
    - Ticks on the web page stay in that browser. Use "Copy for coach" and paste the text into `/study-coach log`.
    - To stop the automatic save, set `sync: off` in `STUDY.md`.

## When something goes wrong

| Message from sync.mjs | What to do |
|---|---|
| GitHub did not accept your login | The learner runs `gh auth login` again, then `gh auth setup-git`. |
| git does not know your name | Set `user.name` and `user.email` with `git config --global`. |
| no network | Nothing is lost. The work is in a local commit. Run sync again later. |
| the online copy has changes that conflict | Run `git status`. Resolve the conflict in the markdown file, keeping both sides of the log. Then run `git rebase --continue` and sync again. |
| refusing to save private files | Add the file to `.gitignore`. Do not force it. |
| Page shows 404 | Wait 10 minutes after the first push. Then check that Pages uses branch `main`, folder `/`. |
