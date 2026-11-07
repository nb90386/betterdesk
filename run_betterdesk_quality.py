#!/usr/bin/env python3
"""Bounded autonomous Claude Code visual-quality passes for BetterDesk.

Preserves old .betterdesk-overnight logs, never reads its FINISHED.txt marker,
and never disables Claude Code permission checks.
"""
import argparse
import json
import os
import signal
import subprocess
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path


def stamp():
    return datetime.now().astimezone().isoformat(timespec='seconds')


def out(msg):
    print(f'[{stamp()}] {msg}', flush=True)


def load_json(path):
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except (ValueError, OSError):
        return {}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--repo', default='.')
    parser.add_argument('--prompt', default='BETTERDESK_SAYABLE_LEVEL_MASTER_PROMPT.md')
    parser.add_argument('--hours', type=float, default=3.0)
    parser.add_argument('--max-cycles', type=int, default=4)
    parser.add_argument('--max-turns', type=int, default=70)
    parser.add_argument('--model', default='opus')
    a = parser.parse_args()

    repo = Path(a.repo).expanduser().resolve()
    prompt = Path(a.prompt).expanduser()
    if not prompt.is_absolute():
        prompt = repo / prompt
    prompt = prompt.resolve()
    if not repo.is_dir() or not (repo / '.git').is_dir() or not (repo / 'package.json').exists():
        parser.error('Run from the actual BetterDesk redesign Git/Next.js workspace.')
    if repo.name != 'betterdesk-redesign':
        parser.error(f'Repository name not recognized as BetterDesk redesign: {repo}')
    if not prompt.is_file():
        parser.error(f'Missing quality prompt: {prompt}')
    if a.hours <= 0 or a.max_cycles < 1 or a.max_turns < 1:
        parser.error('Hours, max-cycles and max-turns must be positive')
    check = subprocess.run(['claude', 'auth', 'status'], cwd=repo, capture_output=True, text=True, timeout=25)
    if check.returncode != 0:
        parser.error('Claude Code is not authenticated. Run claude auth login first.')

    logs = repo / '.betterdesk-sayable'
    logs.mkdir(exist_ok=True, mode=0o700)
    os.chmod(logs, 0o700)
    state_path = logs / 'state.json'
    state = load_json(state_path)
    deadline = datetime.now(timezone.utc) + timedelta(hours=a.hours)
    prior_session = state.get('session_id') if state.get('prompt') == str(prompt) and state.get('repo') == str(repo) else None
    starting_cycle = int(state.get('cycle', 0)) + 1 if prior_session else 1

    out(f'Redesign repository: {repo}')
    out(f'Quality prompt: {prompt.name}')
    out(f'Runs until {deadline.astimezone().isoformat(timespec="seconds")} or {a.max_cycles} cycles, whichever comes first.')
    out('New mission logs: .betterdesk-sayable/  |  Old FINISHED.txt is intentionally ignored.')
    out('Only Vercel PREVIEW deployments are authorized by the prompt. Do not self-approve aesthetics.')

    for cycle in range(starting_cycle, starting_cycle + a.max_cycles):
        if datetime.now(timezone.utc) >= deadline:
            break
        if prior_session:
            instruction = (
                'Continue the NEW BETTERDESK SAYABLE-LEVEL CREATIVE REBUILD, not the old 9 AM mission. '
                'Read BETTERDESK_SAYABLE_LEVEL_MASTER_PROMPT.md and docs/quality-v2/PROGRESS.md; '
                'look at actual recent screenshots and code, and implement the most consequential remaining visual improvements. '
                'The previous FINISHED.txt is invalid as approval. Do not merely summarize; change code, screenshot, critique, test, '
                'and deploy the updated Vercel PREVIEW only. Never publish production or modify Sayable. '
                'Conclude with an honest checkpoint even if more work remains.'
            )
        else:
            instruction = prompt.read_text(encoding='utf-8')
        command = ['claude', '-p', instruction, '--model', a.model, '--effort', 'high',
                   '--permission-mode', 'auto', '--max-turns', str(a.max_turns),
                   '--output-format', 'json']
        if prior_session:
            command.extend(['--resume', prior_session])
        else:
            command.extend(['--name', 'betterdesk-sayable-quality-v2'])
        result_path = logs / f'cycle-{cycle:02d}.json'
        stderr_path = logs / f'cycle-{cycle:02d}.stderr.log'
        out(f'Starting cycle {cycle} ({"resume" if prior_session else "new"}), max turns {a.max_turns}')
        with result_path.open('w', encoding='utf-8') as stdout, stderr_path.open('w', encoding='utf-8') as stderr:
            proc = subprocess.Popen(command, cwd=repo, stdout=stdout, stderr=stderr, start_new_session=True)
            while proc.poll() is None:
                if datetime.now(timezone.utc) >= deadline:
                    out('Time budget reached, requesting graceful stop')
                    proc.send_signal(signal.SIGINT)
                    try:
                        proc.wait(timeout=50)
                    except subprocess.TimeoutExpired:
                        proc.terminate()
                        try:
                            proc.wait(timeout=10)
                        except subprocess.TimeoutExpired:
                            proc.kill()
                    break
                time.sleep(5)
            rc = proc.wait()
        result = load_json(result_path)
        prior_session = result.get('session_id') or result.get('sessionId') or prior_session
        state_path.write_text(json.dumps({
            'repo': str(repo), 'prompt': str(prompt), 'session_id': prior_session,
            'cycle': cycle, 'exit_code': rc, 'subtype': result.get('subtype'),
            'num_turns': result.get('num_turns'), 'last_finished': stamp(),
            'result': str(result_path), 'stderr': str(stderr_path)
        }, indent=2), encoding='utf-8')
        out(f'Cycle {cycle} finished: exit={rc}, subtype={result.get("subtype", "unknown")}, '
            f'turns={result.get("num_turns", "unknown")}.')
        if datetime.now(timezone.utc) >= deadline:
            break
        if rc != 0 and result.get('subtype') != 'error_max_turns':
            out('Cycle failed for another reason; inspect JSON and stderr before rerunning if repeated.')
            time.sleep(min(30, (deadline - datetime.now(timezone.utc)).total_seconds()))
        else:
            time.sleep(min(6, max(0, (deadline - datetime.now(timezone.utc)).total_seconds())))
    out('Quality-pass supervisor stopped. Review docs/quality-v2/FINAL_REVIEW.md, screenshots and Vercel preview.')
    out('This does NOT certify design approval or production deployment.')


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        out('Interrupted; code and previous logs preserved.')
        sys.exit(130)
