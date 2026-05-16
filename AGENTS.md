# Agent Install Instructions

This repository contains a Codex skill for daily planning and review through Feishu/Lark Base and cc-connect.

When a user asks you to install it:

1. Read `README.md`.
2. Verify `git`, `node`, `lark-cli`, and `cc-connect`.
3. Install Lark CLI and cc-connect if the user approves.
4. Ensure the user completes Feishu/Lark auth:
   - `lark-cli config init --new`
   - `lark-cli auth login --recommend`
   - `cc-connect feishu setup --project daily-ops-review`
5. Run:
   - `node scripts/install.mjs --create-base --install-skill`
6. If the user wants scheduled prompts, add cc-connect cron jobs after you know the target project and session key.
7. Run `node scripts/verify.mjs`.

Never commit or publish `daily-ops-review/references/local-config.md`.
