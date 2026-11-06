#!/usr/bin/env python3
"""Run/resume the BetterDesk Claude Code mission until a local timezone-aware deadline.

Requires an authenticated Claude Code CLI. Never uses bypassPermissions.
Use from the verified BetterDesk repository only.
"""
import argparse
import json
import os
from pathlib import Path
import signal
import subprocess
import sys
import time
from datetime import datetime, timezone


def now():
    return datetime.now(timezone.utc)


def say(s):
    print(f"[{datetime.now().astimezone().isoformat(timespec='seconds')}] {s}", flush=True)


def read_session_id(path):
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        return data.get("session_id") or data.get("sessionId")
    except (OSError, ValueError, AttributeError):
        return None


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--repo", default=".", help="verified BetterDesk repository root")
    p.add_argument("--prompt", default="BETTERDESK_MASTER_PROMPT.md")
    p.add_argument("--until", default="2026-11-06T09:00:00-08:00")
    p.add_argument("--max-cycles", type=int, default=10)
    p.add_argument("--max-turns", type=int, default=70)
    p.add_argument("--model", default="opus")
    a = p.parse_args()

    repo = Path(a.repo).expanduser().resolve()
    prompt_file = Path(a.prompt).expanduser()
    if not prompt_file.is_absolute():
        prompt_file = repo / prompt_file
    prompt_file = prompt_file.resolve()
    if not repo.is_dir():
        p.error(f"Repo missing: {repo}")
    if not prompt_file.is_file():
        p.error(f"Prompt missing: {prompt_file}")
    if not ((repo / ".git").exists() or (repo / "package.json").exists()):
        p.error("Run inside a verified BetterDesk code repository, not another project")
    deadline = datetime.fromisoformat(a.until)
    if deadline.tzinfo is None:
        p.error("--until must include timezone offset, e.g. -08:00")
    deadline = deadline.astimezone(timezone.utc)
    if now() >= deadline:
        p.error("The overnight deadline is already in the past")

    # Claude must be signed into the user's own existing account; do not ask for keys.
    auth = subprocess.run(["claude", "auth", "status"], cwd=repo,
                          capture_output=True, text=True, timeout=30, check=False)
    if auth.returncode != 0:
        p.error("Claude Code is not authenticated. Run 'claude auth login' interactively first.")

    logs = repo / ".betterdesk-overnight"
    logs.mkdir(mode=0o700, exist_ok=True)
    os.chmod(logs, 0o700)
    state_file = logs / "state.json"
    session_id = None
    if state_file.exists():
        try:
            state = json.loads(state_file.read_text(encoding="utf-8"))
            if state.get("repo") == str(repo) and state.get("prompt") == str(prompt_file):
                session_id = state.get("session_id")
        except (ValueError, OSError):
            pass

    initial_prompt = prompt_file.read_text(encoding="utf-8")
    say(f"BetterDesk repo: {repo}")
    say(f"Deadline: {deadline.astimezone().isoformat(timespec='seconds')}")
    say("Using permission mode 'auto' (not dangerous permission bypass).")
    say(f"Logs and session state: {logs}")

    for cycle in range(1, a.max_cycles + 1):
        if now() >= deadline:
            break
        result_file = logs / f"cycle-{cycle:02d}.json"
        error_file = logs / f"cycle-{cycle:02d}.stderr.log"
        if session_id:
            instruction = (
                "Resume the BETTERDESK 9 AM TRANSFORMATION in this exact repository. "
                "Read docs/redesign/STATUS.md and HANDOFF.md if they exist, inspect current git/build "
                "and preview state, and implement the highest-impact remaining verified improvements. "
                "Keep the original mission's deadline, safety and deploy/QA contract. "
                "Do not just write a summary; do the work, checkpoint, and finish when "
                "the site is verified or further changes are risky."
            )
        else:
            instruction = initial_prompt

        cmd = ["claude", "-p", instruction,
               "--model", a.model,
               "--effort", "high",
               "--permission-mode", "auto",
               "--max-turns", str(a.max_turns),
               "--output-format", "json"]
        if session_id:
            cmd += ["--resume", session_id]
        else:
            cmd += ["--name", "betterdesk-9am-redesign"]

        say(f"Cycle {cycle}/{a.max_cycles} starting ({'resume' if session_id else 'initial'}).")
        with result_file.open("w", encoding="utf-8") as out, error_file.open("w", encoding="utf-8") as err:
            process = subprocess.Popen(cmd, cwd=repo, stdout=out, stderr=err,
                                       start_new_session=True)
            stopped_at_deadline = False
            while process.poll() is None:
                if now() >= deadline:
                    say("Deadline reached; asking Claude to end the current turn gracefully.")
                    try:
                        process.send_signal(signal.SIGINT)
                    except ProcessLookupError:
                        pass
                    stopped_at_deadline = True
                    try:
                        process.wait(timeout=45)
                    except subprocess.TimeoutExpired:
                        say("Graceful exit timed out; stopping the runner's Claude process.")
                        process.terminate()
                        try:
                            process.wait(timeout=10)
                        except subprocess.TimeoutExpired:
                            process.kill()
                            process.wait()
                    break
                time.sleep(5)
            rc = process.wait()

        last_id = read_session_id(result_file)
        if last_id:
            session_id = last_id
        state_file.write_text(json.dumps({
            "repo": str(repo), "prompt": str(prompt_file),
            "session_id": session_id, "cycle": cycle,
            "exit_code": rc, "last_finished": datetime.now().astimezone().isoformat(),
            "result": str(result_file), "stderr": str(error_file)
        }, indent=2), encoding="utf-8")
        say(f"Cycle {cycle} exited={rc}; session={'saved' if session_id else 'unknown'}.")
        if stopped_at_deadline:
            break

        # A manually written marker indicates that further passes would only churn the site.
        done = logs / "FINISHED.txt"
        if done.exists():
            say(f"Mission marked complete in {done}. Exiting early rather than wasting tokens.")
            break

        if rc != 0:
            say("A cycle failed; check stderr. Retrying after a cool-off if time remains.")
            time.sleep(min(120, max(0, (deadline - now()).total_seconds())))
        else:
            # Give filesystem watchers and deploy webhooks a moment to settle.
            time.sleep(min(10, max(0, (deadline - now()).total_seconds())))

    say("Overnight supervisor finished. Check docs/redesign/HANDOFF.md and the latest logs.")
    say("No deployment success is implied by the runner exiting; verify the URLs directly.")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        say("Runner interrupted. Work and logs remain in the repository.")
        sys.exit(130)
