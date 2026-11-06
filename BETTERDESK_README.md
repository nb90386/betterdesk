# BetterDesk 9 AM redesign kit

These files are for the **actual BetterDesk repository** and should not be placed in StarNet OS, Sayable, Voltron, or any other project.

## Option A: paste one prompt into Claude Code

1. Open the BetterDesk repository in Terminal.
2. Copy the entire content of `BETTERDESK_MASTER_PROMPT.md` and paste it into your interactive Claude Code session.
3. Keep the Mac awake using `caffeinate -dimsu` in another Terminal tab. A prompt by itself cannot force a CLI session to stay active until 9 AM. For resilience use Option B.

## Option B: supervised overnight cycles (recommended)

Move these files into the verified BetterDesk repository root:

- `BETTERDESK_MASTER_PROMPT.md`
- `BETTERDESK_DESIGN_CHECKLIST.txt`
- `run_betterdesk_overnight.py`

From that repository root, with `claude auth status` and `vercel whoami` working:

```bash
caffeinate -dimsu python3 run_betterdesk_overnight.py \
  --repo . \
  --prompt BETTERDESK_MASTER_PROMPT.md \
  --until '2026-11-06T09:00:00-08:00' \
  --max-cycles 10
```

Keep the Mac plugged in and the Terminal session open. The runner uses `--permission-mode auto`, not an unsafe permission bypass; if an action needs human approval or a tool isn't logged in, it can be blocked. No script can guarantee every dependency, model, account limit or deployment will work. The site is only deployed if Claude verifies the project and release gates.

Check progress in `docs/redesign/STATUS.md` and `.betterdesk-overnight/`. At the end open `docs/redesign/HANDOFF.md` for real tested URLs, results and blockers.

If started after the deadline, edit `--until` to the next intended deadline. The script intentionally refuses a deadline in the past.
