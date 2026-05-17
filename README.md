# Daily Ops Review Scale

**语言 / Language:** **中文** | [English](#english-version)

`daily-ops-review` 是一个面向个人日程管理、每日计划、晚间复盘、进度沉淀和周期汇报的 Codex Skill。它通过飞书多维表格沉淀结构化数据，并通过 cc-connect 让飞书机器人触发早计划、晚复盘、日间记录和阶段汇报。

这个仓库的目标是：把一套可复用的「每日复盘 Skill」做成别人可以交给 AI 自动安装、配置和使用的开源项目。

## 中文版本

### 它解决什么问题

很多每日复盘工具的问题是：记录太散、计划和复盘断开、长期回顾时很难重新检索。这个 Skill 的设计重点是把每天的信息沉淀成可查询的数据，而不是只留在聊天上下文里。

它支持这些核心场景：

- 早上规划当天要做什么。
- 晚上复盘计划完成情况、阻塞、情绪和明日动作。
- 白天随时记录事件、完成进展和计划调整。
- 自动把未完成且需要继续推进的事项滚动到第二天早计划。
- 从飞书多维表格里按日期、状态、目标、周期做阶段汇报。

### 工作流

固定触发：

- 每天 09:00：`早计划`
- 每天 22:30：`晚复盘`

手动触发：

```text
早计划
晚复盘
记录：今天客户反馈方案方向需要调整
完成：客户方案完成 70%，明天继续补定价页
调整：招聘 JD 挪到明天，先改岗位亮点
汇报：最近三天
汇报：本月目标进展
```

早计划会优先读取昨天复盘里标记为「滚动到明天」的任务。即使你手动触发 `早计划` 时只写了今天新增事项，机器人也应该把昨晚未完成事项和今天新增事项合并成一版草案，再让你确认、修改或删减。晚复盘会把当天计划拆成完成、部分完成、未完成和取消，并提取下一步动作。

### 数据会沉淀到哪里

安装脚本会创建或配置一个飞书多维表格，包含 6 张表：

- `目标库`
- `周期计划`
- `每日计划`
- `任务执行`
- `事件日志`
- `复盘报告`

这些表会保留原始表达，也会生成适合筛选和汇总的结构化字段，例如日期、用户、状态、优先级、所属目标、是否滚动到明天、下一步动作等。

长期数据量变大后，汇报不应该全量遍历所有记录。Skill 会要求 AI 优先使用飞书多维表格的筛选、视图和字段投影能力，按日期范围、状态、用户、目标等条件检索，再做阶段总结。

### 依赖

你需要准备：

- Node.js
- Git
- Codex，或其他能使用 Codex 风格 Skill 的本地 AI Agent
- [lark-cli](https://github.com/larksuite/cli)
- [cc-connect](https://github.com/chenhg5/cc-connect)
- 一个有权限创建飞书多维表格和配置机器人的飞书账号

### 安装 lark-cli

```bash
npm install -g @larksuite/cli
npx skills add larksuite/cli -y -g
```

初始化并授权：

```bash
lark-cli config init --new
lark-cli auth login --recommend
```

授权过程中可能需要浏览器确认。

### 安装 cc-connect

```bash
npm install -g cc-connect
```

配置飞书机器人：

```bash
cc-connect feishu setup --project daily-ops-review
```

cc-connect 的完整安装说明见：

- <https://github.com/chenhg5/cc-connect/blob/main/INSTALL.md>

### 安装这个 Skill

克隆仓库：

```bash
git clone https://github.com/yangma12/daily-ops-review-scale.git
cd daily-ops-review-scale
```

如果你希望安装脚本创建新的飞书多维表格、创建表结构、安装 Skill，并生成本地配置：

```bash
node scripts/install.mjs --create-base --install-skill
```

如果你已经有飞书多维表格 token：

```bash
node scripts/install.mjs --base-token <YOUR_BASE_TOKEN> --install-skill
```

安装完成后，Skill 会写入：

```text
~/.agents/skills/daily-ops-review/
```

并生成本地私有配置：

```text
~/.agents/skills/daily-ops-review/references/local-config.md
```

`local-config.md` 会包含你的 Base token 和表 ID，不要提交到 GitHub。

### 配置定时触发

cc-connect 有可用飞书会话后，先查看 session：

```bash
cc-connect sessions list
```

然后添加两个定时任务。把 `PROJECT` 和 `SESSION_KEY` 替换成你的实际值：

```bash
cc-connect cron add -p PROJECT -s SESSION_KEY --cron "0 9 * * *" --prompt "早计划" --desc "每日早计划" --session-mode new-per-run --timeout-mins 30
cc-connect cron add -p PROJECT -s SESSION_KEY --cron "30 22 * * *" --prompt "晚复盘" --desc "每日晚复盘" --session-mode new-per-run --timeout-mins 30
cc-connect daemon restart
```

之后你也可以随时给机器人发送 `早计划` 或 `晚复盘` 手动触发。如果你在 09:00 前已经手动完成早计划，09:00 的固定触发不应重复追问；如果你没有提前完成，09:00 固定触发会主动发起早计划提示，让你填写今天安排。

### 验证安装

```bash
node scripts/verify.mjs
```

它会检查 Skill 是否安装、本地配置是否存在，以及飞书多维表格是否包含预期的 6 张表。

### 交给 AI 自动安装时怎么说

你可以把这个 GitHub 链接发给 AI，然后说：

```text
请按照这个仓库的 README 安装 daily-ops-review-scale。
请帮我安装 lark-cli、cc-connect，配置飞书机器人，创建飞书多维表格，安装 Skill，并添加早计划和晚复盘两个定时任务。
过程中如果需要我扫码、浏览器授权或确认权限，请停下来提示我操作。
```

有些步骤需要你本人确认，例如飞书授权、GitHub/浏览器授权、扫码登录或机器人配置。

### 安全提醒

- 不要发布 `daily-ops-review/references/local-config.md`。
- 不要把飞书 Base token、机器人 webhook、open_id、chat_id、app secret 提交到仓库。
- 第一次给别人复用时，建议先用测试飞书空间和测试机器人跑通。
- 当前默认面向单人使用；表结构里保留了用户和来源字段，方便以后扩展到群聊多人场景。

### License

MIT

## English Version

**Language:** [中文](#daily-ops-review-scale) | **English**

`daily-ops-review` is a Codex Skill for personal daily planning, progress logging, evening retrospectives, and periodic reporting. It stores structured records in Feishu/Lark Base and uses cc-connect to trigger the workflow through a Feishu/Lark robot.

The goal of this repository is to package a reusable daily review scale that another user can hand to an AI agent for guided installation.

### What It Solves

Daily planning systems often fail because notes stay scattered, plans and reviews are disconnected, and long-term reporting requires manually rereading old chats. This Skill stores daily information as queryable records instead of relying on conversation history.

It supports:

- Morning planning.
- Evening review of completion, blockers, mood, and next actions.
- Ad-hoc daytime logging, progress updates, and plan adjustments.
- Automatic carry-over of unfinished work into the next morning plan.
- Periodic reporting by date range, status, goal, and planning cycle.

### Workflow

Scheduled triggers:

- 09:00 every day: `早计划`
- 22:30 every day: `晚复盘`

Manual triggers:

```text
早计划
晚复盘
记录：今天客户反馈方案方向需要调整
完成：客户方案完成 70%，明天继续补定价页
调整：招聘 JD 挪到明天，先改岗位亮点
汇报：最近三天
汇报：本月目标进展
```

The morning plan first loads tasks marked as carried over from the previous review. Even if the user manually sends `早计划` with only new tasks, the robot should merge yesterday's unfinished carry-over with today's new tasks into one draft and ask for confirmation. The evening review classifies each planned item as completed, partially completed, unfinished, or cancelled, then extracts next actions.

### Data Storage

The installer creates or configures a Feishu/Lark Base with six tables:

- `目标库`
- `周期计划`
- `每日计划`
- `任务执行`
- `事件日志`
- `复盘报告`

The tables preserve the user's original wording while also storing structured fields for filtering and reporting, such as date, user, status, priority, related goal, carry-over flag, and next action.

As the dataset grows, reports should not scan every record. The Skill instructs the AI agent to use Base filters, views, and field projection first, then summarize only the relevant records.

### Requirements

- Node.js
- Git
- Codex, or another local AI agent that can use Codex-style skills
- [lark-cli](https://github.com/larksuite/cli)
- [cc-connect](https://github.com/chenhg5/cc-connect)
- A Feishu/Lark account that can create Base documents and configure a robot

### Install lark-cli

```bash
npm install -g @larksuite/cli
npx skills add larksuite/cli -y -g
```

Initialize and authorize it:

```bash
lark-cli config init --new
lark-cli auth login --recommend
```

Browser confirmation may be required.

### Install cc-connect

```bash
npm install -g cc-connect
```

Configure a Feishu/Lark robot:

```bash
cc-connect feishu setup --project daily-ops-review
```

For the full cc-connect guide, see:

- <https://github.com/chenhg5/cc-connect/blob/main/INSTALL.md>

### Install This Skill

Clone the repository:

```bash
git clone https://github.com/yangma12/daily-ops-review-scale.git
cd daily-ops-review-scale
```

Create a new Feishu/Lark Base, build the schema, install the Skill, and generate local config:

```bash
node scripts/install.mjs --create-base --install-skill
```

If you already have a Base token:

```bash
node scripts/install.mjs --base-token <YOUR_BASE_TOKEN> --install-skill
```

The installer writes the Skill to:

```text
~/.agents/skills/daily-ops-review/
```

and generates private local config at:

```text
~/.agents/skills/daily-ops-review/references/local-config.md
```

`local-config.md` contains your private Base token and table IDs. Do not commit it.

### Configure Scheduled Prompts

After cc-connect has an active Feishu/Lark session, list sessions:

```bash
cc-connect sessions list
```

Then add scheduled prompts. Replace `PROJECT` and `SESSION_KEY` with your actual values:

```bash
cc-connect cron add -p PROJECT -s SESSION_KEY --cron "0 9 * * *" --prompt "早计划" --desc "每日早计划" --session-mode new-per-run --timeout-mins 30
cc-connect cron add -p PROJECT -s SESSION_KEY --cron "30 22 * * *" --prompt "晚复盘" --desc "每日晚复盘" --session-mode new-per-run --timeout-mins 30
cc-connect daemon restart
```

You can also send `早计划` or `晚复盘` to the robot manually at any time. If the morning plan is already completed manually before 09:00, the fixed 09:00 trigger should not ask again. If it is not completed, the 09:00 trigger proactively asks the user to fill today's plan.

### Verify

```bash
node scripts/verify.mjs
```

This checks that the Skill is installed, local config exists, and the Feishu/Lark Base contains the expected six tables.

### Prompt For AI-Assisted Installation

Send this GitHub URL to your AI agent and say:

```text
Please install daily-ops-review-scale according to this repository's README.
Help me install lark-cli and cc-connect, configure the Feishu/Lark robot, create the Feishu/Lark Base, install the Skill, and add the morning planning and evening review scheduled prompts.
Pause and ask me whenever browser authorization, QR-code scanning, or permission confirmation is required.
```

Some steps require user confirmation, browser authorization, or QR-code scanning.

### Safety

- Do not publish `daily-ops-review/references/local-config.md`.
- Do not commit Feishu/Lark Base tokens, robot webhooks, open IDs, chat IDs, or app secrets.
- Use a test Feishu/Lark workspace and robot when validating this with another user for the first time.
- The default workflow is designed for one primary user, but the schema includes user and source fields for future group use.

### License

MIT
