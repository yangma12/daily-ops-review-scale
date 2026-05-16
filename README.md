# Daily Ops Review Scale

`daily-ops-review` is a Codex skill for personal daily planning, progress logging, evening retrospectives, and long-horizon reporting through Feishu/Lark Base and cc-connect.

It is designed for a lightweight robot workflow:

- Morning: `早计划`
- Evening: `晚复盘`
- Daytime updates: `记录：...`, `完成：...`, `调整：...`
- Reports: `汇报：最近三天`, `汇报：本月目标进展`

## What It Creates

The installer creates or configures a Feishu Base with six tables:

- `目标库`
- `周期计划`
- `每日计划`
- `任务执行`
- `事件日志`
- `复盘报告`

The skill stores structured records while preserving original user wording. It also carries unfinished work into the next morning plan through `是否滚动到明天` and `下一步动作`.

## Requirements

- Node.js
- Git
- Codex or another local AI agent that can use Codex-style skills
- [lark-cli](https://github.com/larksuite/cli)
- [cc-connect](https://github.com/chenhg5/cc-connect)
- A Feishu/Lark account with permission to create Base documents and configure a bot

## Install Dependencies

Install Lark CLI:

```bash
npm install -g @larksuite/cli
npx skills add larksuite/cli -y -g
```

Configure and authorize Lark CLI:

```bash
lark-cli config init --new
lark-cli auth login --recommend
```

Install cc-connect:

```bash
npm install -g cc-connect
```

Configure a Feishu robot:

```bash
cc-connect feishu setup --project daily-ops-review
```

For cc-connect's complete setup guide, see:

- https://github.com/chenhg5/cc-connect/blob/main/INSTALL.md

## Install This Skill

Clone this repository:

```bash
git clone <THIS_REPO_URL>
cd daily-ops-review-scale
```

Create a new Feishu Base, build the schema, install the skill into `~/.agents/skills`, and generate local config:

```bash
node scripts/install.mjs --create-base --install-skill
```

If you already have a Base token:

```bash
node scripts/install.mjs --base-token <YOUR_BASE_TOKEN> --install-skill
```

The installer writes:

```text
~/.agents/skills/daily-ops-review/
```

and generates:

```text
~/.agents/skills/daily-ops-review/references/local-config.md
```

`local-config.md` contains your private Base token and table IDs. Do not commit it.

## Configure Scheduled Prompts

After cc-connect has an active Feishu session, list sessions:

```bash
cc-connect sessions list
```

Then add scheduled prompts. Replace `PROJECT` and `SESSION_KEY` with your values:

```bash
cc-connect cron add -p PROJECT -s SESSION_KEY --cron "0 9 * * *" --prompt "早计划" --desc "每日早计划" --session-mode new-per-run --timeout-mins 30
cc-connect cron add -p PROJECT -s SESSION_KEY --cron "30 22 * * *" --prompt "晚复盘" --desc "每日晚复盘" --session-mode new-per-run --timeout-mins 30
cc-connect daemon restart
```

## Use It

Send these messages to your cc-connect Feishu robot:

```text
早计划
记录：今天客户反馈方案方向需要调整
完成：客户方案完成 70%，明天继续补定价页
调整：招聘 JD 挪到明天，先改岗位亮点
晚复盘
汇报：最近三天
```

The next `早计划` should automatically show unfinished or rolled-over work from the previous review.

## Verify

Run:

```bash
node scripts/verify.mjs
```

This checks that the skill files are installed, `local-config.md` exists, and the Feishu Base has the expected six tables.

## Give This To An AI Agent

Send the repository URL to your AI agent and say:

```text
请按照这个仓库的 README 安装 daily-ops-review-scale。
请帮我安装 lark-cli、cc-connect，配置飞书机器人，创建飞书 Base，安装 Skill，并添加早计划/晚复盘定时任务。
```

Some steps require user confirmation, browser authorization, or scanning a QR code. The AI agent should run commands and guide you through those confirmations.

## Safety

- Do not publish `daily-ops-review/references/local-config.md`.
- Review Feishu app scopes before authorizing.
- Start with a private GitHub repository if you are still iterating.
- The skill is designed for one primary user first, but records include user/source fields for future group use.

## License

MIT
