# BetterDesk v2 — How to launch the quality rebuild

The old 9 AM runner is already finished. Do NOT restart it; it will either reject the old deadline or stop when it sees `.betterdesk-overnight/FINISHED.txt`.

1. Download and unzip this new ZIP to Downloads.
2. In Terminal, `cd ~/Developer/betterdesk-redesign` and verify `pwd`, `git status -sb`, `.vercel/project.json` (do not post secrets).
3. `unzip -o "$HOME/Downloads/betterdesk_sayable_quality_kit.zip" -d .`
4. Confirm Sayable reference exists: `test -f "$HOME/Developer/projects/anything-research/sayable-site/package.json" && echo "Sayable source available" || echo "Claude will locate the reference or use Vercel"`.
5. Start the rebuild: `caffeinate -dimsu python3 run_betterdesk_quality.py --repo "$HOME/Developer/betterdesk-redesign" --prompt BETTERDESK_SAYABLE_LEVEL_MASTER_PROMPT.md --hours 3 --max-cycles 4 --max-turns 70`.
6. Monitor in a NEW terminal: `tail -n 50 ~/Developer/betterdesk-redesign/docs/quality-v2/PROGRESS.md` (after it is created), and `ls -lh ~/Developer/betterdesk-redesign/.betterdesk-sayable/`.
7. Open preview in Vercel dashboard, signed into `neel-s-projects9`. Do not use the old public URL to assess latest work.
8. Inspect screenshot contact sheets in `docs/quality-v2/screenshots/` on your Mac. Tell Claude exact visual flaws; repeat a focused quality pass if necessary. Never publish `betterdesk.ai` without verifying the original host and DNS ownership.

If you want an interactive, hands-on iteration instead of the runner, open `claude` in the repo and paste the contents of `BETTERDESK_SAYABLE_LEVEL_MASTER_PROMPT.md`. The runner uses the same prompt but automates a few bounded cycles.
