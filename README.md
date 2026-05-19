# Daily Ops Review Scale

**语言 / Language:** **中文** | [English](#english-version)

`daily-ops-review` 是一个面向个人日程管理、每日计划、事件记录、情绪沉淀、晚间复盘和周期汇报的 Codex Skill。它通过飞书多维表格保存结构化记忆，并通过 cc-connect 让飞书机器人在每天合适的时间自然接住你的计划和复盘。

这个仓库的目标是：把一套可复用的「每日复盘 Skill」做成别人可以交给 AI 自动安装、配置和使用的开源项目。

## 中文版本

### 它真正想解决什么

这不是一个普通待办清单。它更像一个通过机器人陪跑的「日程记忆系统」：

- 昨晚没有做完的事，不会在第二天消失。
- 早上新写的计划，会和昨天遗留任务合并成今天的计划草案。
- 白天发生的值得复盘的事件，可以连同它带来的情绪、想法、判断、经验和后续影响一起记录。
- 晚上复盘时，它会把计划、执行、偏差、感受和明日动作沉淀下来。
- 过几天、几周或一个月后，你可以让它按时间、目标、任务状态、情绪和阻塞模式做汇报。

所以它沉淀的不只是“做没做完”，也包括：为什么没做完、发生了什么、当时的感受、反复出现的模式，以及下一步应该怎么调整。

### 每天的自然闭环

1. **前一晚复盘**
   你告诉机器人哪些完成了、哪些没完成、为什么没完成、明天继续做哪一 part。机器人把需要继续的任务标记为 `是否滚动到明天`，并写入具体 `下一步动作`。

2. **第二天早计划**
   机器人先读取昨晚滚动过来的任务，再合并你今天新增的计划。如果你只写了今天新计划、没有提昨天没做完的事，它也不能默认丢掉昨天遗留项，而是要合并成一版草案让你确认。

3. **白天随手记录**
   你可以记录那些值得复盘的事件：发生了什么，它让你产生了什么情绪、想法、判断或经验，以及它可能怎样影响后续行动。这些会进入 `事件日志`，成为晚上复盘和月度总结的素材。

4. **晚上复盘**
   机器人拉取今天早计划和任务执行情况，帮你按完成、部分完成、未完成、取消来复盘，并提取偏差原因、行为模式和明天建议。

5. **周期汇报**
   当你问 `汇报：最近三天`、`汇报：本月目标进展`、`汇报：最近我主要焦虑在哪里` 时，它会从飞书多维表格里检索结构化记录，而不是只依赖聊天上下文。

### 固定触发

- 每天 07:30：`早计划`
- 每天 23:30：`晚复盘`

如果你在 07:30 前已经手动完成早计划，07:30 的固定触发不应重复追问；如果你没有提前完成，机器人会主动发起早计划提示。

### 手动触发关键词

```text
早计划
晚复盘
记录：...
完成：...
调整：...
汇报：...
```

触发词需要放在消息开头，避免机器人从普通聊天里误判。

### 使用示例：第二天自动承接昨晚没做完的事

前一晚你复盘：

```text
晚复盘
客户方案只完成了 70%，定价页还没写。明天继续，先补定价页和报价逻辑。
招聘 JD 没做，今天被临时会议打断了，明天只改岗位亮点。
```

第二天早上你只发了新增计划：

```text
早计划 今天主要做产品周报和一个客户电话。
```

机器人应该先读取昨晚滚动事项，然后回复类似：

```text
我把昨晚延续事项和你今天新增的计划合并成这个草案，你确认一下：

昨晚延续：
1. 客户方案 -> 今天先补定价页和报价逻辑
2. 招聘 JD -> 今天只改岗位亮点

今天新增：
1. 产品周报
2. 客户电话

你回复「确认」即可；也可以直接说删掉、推迟或改成哪一 part。
```

### 使用示例：白天记录值得复盘的事件

`记录：` 的重点不是普通任务进度，而是“发生了一件值得留下来的事”。它要沉淀的是事件本身，以及这件事对你的情绪、想法、判断、经验或后续行动产生的影响。

你可以随时给机器人发：

```text
记录：上午客户会后有点焦虑，主要担心方案范围太大，下午需要先收敛到报价和交付边界。
```

```text
记录：下午被一个临时需求打断，原本写方案的时间被占用，感觉节奏有点乱。
```

```text
记录：今天发现自己在不确定报价时会拖延，可能需要先列一个最小报价模板。
```

```text
记录：写完周报后发现自己没有讲清楚结论，经验是以后先写一句核心判断再补细节。
```

这些内容会沉淀为 `事件日志`。其中事件类型、影响程度、情绪、情绪影响、想法判断、经验教训、后续动作、关联任务、标签和原始消息都会尽量保留下来，后面可以用于复盘：

```text
汇报：最近我主要被什么事情打断？
汇报：最近我主要焦虑在哪里？
汇报：最近三天哪些任务反复滚动？
```

### 使用示例：进展、调整和完成

纯任务进度更适合用 `完成：`，计划变化更适合用 `调整：`。它们可以和事件有关，但不是 `记录：` 的主要用途。

```text
完成：客户方案完成 70%，明天继续补竞品分析和定价页。
```

```text
调整：招聘 JD 今天不做，明天只改岗位亮点。
```

```text
完成：产品周报写完初版，晚上复盘时提醒我看一下是不是太散。
```

这些消息会更新 `任务执行`，必要时标记 `是否滚动到明天`，并保存下一步动作。

### 使用示例：晚复盘

```text
晚复盘
客户方案部分完成，定价页写完了，但竞品分析没做，因为下午被临时需求打断。
产品周报完成了，不过写得有点散。
今天整体有点焦虑，主要是任务切换太多。
明天客户方案继续补竞品分析，产品周报只做结构调整。
```

机器人应该沉淀：

- 哪些任务完成、部分完成、未完成或取消。
- 偏差原因，例如外部打断、时间估计错误、目标不清、精力不足。
- 关键事件和情绪信号。
- 明天要继续的任务和具体下一步。
- 一条 `复盘报告`，供后续周报、月报和目标汇报使用。

### 会沉淀到哪里

安装脚本会创建或配置一个飞书多维表格，包含 6 张表：

| 表 | 用途 |
| --- | --- |
| `目标库` | 长期、月度、项目、习惯等目标。 |
| `周期计划` | 周计划、月计划、阶段计划和阶段复盘。 |
| `每日计划` | 每天的 Top 1-3、约束、能量、早计划状态、晚复盘状态。 |
| `任务执行` | 每个具体任务的状态、完成度、未完成原因、下一步动作、是否滚动。 |
| `事件日志` | 值得复盘的事件，以及它带来的情绪影响、想法判断、经验教训和后续动作。 |
| `复盘报告` | 每日、每周、每月、目标维度的复盘摘要和建议。 |

所有关键记录都会保留 `原始消息`，同时写入结构化字段，方便之后按日期、状态、目标、事件类型、情绪和影响程度检索。

### 当前 Scope

当前版本已经支持：

- 单人日程管理和复盘。
- 早计划、晚复盘、日间记录、任务完成、计划调整和周期汇报。
- 昨晚未完成任务滚动到第二天早计划。
- 值得复盘的事件、情绪影响、想法判断、经验教训和后续动作沉淀。
- 通过飞书多维表格做长期检索和汇总。
- 为未来群聊多人使用保留用户和来源字段。

当前版本不默认做这些事：

- 不从普通闲聊里自动推断触发，必须使用固定关键词或处于活跃流程回复中。
- 不替代专业项目管理系统，只做个人日程和执行记忆。
- 不默认支持多人混合统计，除非后续明确开启群聊多人模式。

### 依赖

你需要准备：

- Node.js
- Git
- Codex，或其他能使用 Codex 风格 Skill 的本地 AI Agent
- [lark-cli](https://github.com/larksuite/cli)
- [cc-connect](https://github.com/chenhg5/cc-connect)
- 一个有权限创建飞书多维表格和配置机器人的飞书账号

推荐先阅读：

- lark-cli 仓库：<https://github.com/larksuite/cli>
- cc-connect 中文说明：<https://github.com/chenhg5/cc-connect/blob/main/README.zh-CN.md>

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

- <https://github.com/chenhg5/cc-connect/blob/main/README.zh-CN.md>

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
cc-connect cron add -p PROJECT -s SESSION_KEY --cron "30 7 * * *" --prompt "早计划" --desc "每日早计划" --session-mode new-per-run --timeout-mins 30
cc-connect cron add -p PROJECT -s SESSION_KEY --cron "30 23 * * *" --prompt "晚复盘" --desc "每日晚复盘" --session-mode new-per-run --timeout-mins 30
cc-connect daemon restart
```

之后你也可以随时给机器人发送 `早计划` 或 `晚复盘` 手动触发。

如果已经过了凌晨，需要补前一天复盘，建议显式写日期，避免机器人按今天理解：

```text
晚复盘：补 2026-05-17
```

机器人读写飞书多维表格时，默认可以使用机器人/bot 权限。只要机器人对这个 Base 有读写权限，就不需要依赖个人 user 授权；只有创建 Base 或 bot 权限不足时才需要切换到 user 授权。

### 定时没有发送怎么办

如果过了时间机器人没有发消息，先查定时任务和 daemon：

```bash
cc-connect cron list
cc-connect daemon status
cc-connect daemon logs -n 80
```

再看具体任务错误：

```bash
cc-connect cron info <JOB_ID>
```

如果看到类似 `platform "" not found for session "..."`，通常不是用户名问题，而是 cron 的会话参数填错了。cc-connect 定时任务依赖具体会话，`session_key` 需要指向当前机器人聊天的 active session key，通常是 `feishu:<chat_id>:<user_id>` 这种形式；不要把短会话 ID 或项目名误填进去。

如果看到类似 `project "... " not found`，说明定时任务里的 `project` 不是 cc-connect 当前加载的项目名。用 `cc-connect daemon status` 和 daemon 启动日志确认实际项目名；单用户本地安装通常是 `default`，除非你在 `cc-connect feishu setup --project ...` 时显式使用了别的项目名。

修复方式：

```bash
cc-connect cron edit <JOB_ID> project <PROJECT>
cc-connect cron edit <JOB_ID> session_key '<ACTIVE_SESSION_KEY>'
cc-connect daemon restart
```

修复后可以先用一个临时近期开启的 cron 测试任务验证链路，看到 `cron: job completed` 后再删除临时任务。

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

`daily-ops-review` is a Codex Skill for personal daily planning, event logging, emotional signal capture, evening retrospectives, and periodic reporting. It stores structured memory in Feishu/Lark Base and uses cc-connect to make a Feishu/Lark robot naturally pick up the daily planning and review loop.

The goal of this repository is to package a reusable daily review Skill that another user can hand to an AI agent for guided installation.

### What It Is For

This is not just a todo list. It is a lightweight personal memory system for daily execution:

- Unfinished work from last night should not disappear the next morning.
- New morning plans should be merged with yesterday's carried-over tasks.
- Noteworthy daytime events can be recorded together with their emotional impact, thoughts, judgments, lessons, and follow-up implications.
- Evening review turns plans, execution, deviations, emotions, and tomorrow actions into structured records.
- Later, the user can request reports by date range, goal, task status, emotion, blocker, or repeated pattern.

It stores not only what was done, but also why something was missed, what happened, how it felt, what pattern is emerging, and what should change next.

### Daily Loop

1. **Evening review**
   The user reports what was completed, what was missed, why it was missed, and which exact part should continue tomorrow. The robot marks carry-over tasks and writes concrete next actions.

2. **Next morning plan**
   The robot reads carried-over work first, then merges it with the user's new plan. If the user only mentions new tasks, yesterday's unfinished work still appears in the merged draft for confirmation.

3. **Daytime records**
   The user can log noteworthy events: what happened, what emotion, thought, judgment, or lesson it created, and how it may affect later action. These become event logs for evening review and monthly reporting.

4. **Evening synthesis**
   The robot fetches the morning plan and task records, reviews completed, partial, unfinished, or cancelled items, then extracts deviation causes, patterns, and tomorrow suggestions.

5. **Periodic reports**
   Queries such as `汇报：最近三天`, `汇报：本月目标进展`, or `汇报：最近我主要焦虑在哪里` retrieve structured records from Feishu/Lark Base instead of relying on chat memory.

### Scheduled Triggers

- 07:30 every day: `早计划`
- 23:30 every day: `晚复盘`

If the morning plan is already completed manually before 07:30, the fixed trigger should not ask again. If it is not completed, the 07:30 trigger proactively starts the morning planning flow.

### Manual Triggers

```text
早计划
晚复盘
记录：...
完成：...
调整：...
汇报：...
```

The trigger keyword must be at the beginning of the message to avoid accidental activation from casual chat.

### Example: Carry Over Yesterday's Unfinished Work

Evening review:

```text
晚复盘
The client proposal is 70% done. The pricing page is still missing.
Tomorrow continue with the pricing page and quote logic first.
The hiring JD was not started because of an urgent meeting. Tomorrow only improve the role highlights.
```

Next morning, the user only sends new tasks:

```text
早计划 今天主要做产品周报和一个客户电话。
```

Expected robot behavior:

```text
我把昨晚延续事项和你今天新增的计划合并成这个草案，你确认一下：

昨晚延续：
1. 客户方案 -> 今天先补定价页和报价逻辑
2. 招聘 JD -> 今天只改岗位亮点

今天新增：
1. 产品周报
2. 客户电话

你回复「确认」即可；也可以直接说删掉、推迟或改成哪一 part。
```

### Example: Record Noteworthy Events, Feelings, And Reflections

`记录：` is not the generic task-progress route. It is for an event worth preserving because it affected the user's emotion, thinking, judgment, experience, or later behavior.

```text
记录：上午客户会后有点焦虑，主要担心方案范围太大，下午需要先收敛到报价和交付边界。
```

```text
记录：下午被一个临时需求打断，原本写方案的时间被占用，感觉节奏有点乱。
```

```text
记录：今天发现自己在不确定报价时会拖延，可能需要先列一个最小报价模板。
```

```text
记录：写完周报后发现自己没有讲清楚结论，经验是以后先写一句核心判断再补细节。
```

These entries become `事件日志` records with event type, impact level, emotion, emotional impact, thought or judgment, lesson learned, follow-up action, linked task or goal when obvious, tags, and the original wording. They can later support reports such as:

```text
汇报：最近我主要被什么事情打断？
汇报：最近我主要焦虑在哪里？
汇报：最近三天哪些任务反复滚动？
```

### Example: Progress And Adjustment

Routine task progress should use `完成：`. Plan or priority changes should use `调整：`. They can be related to an event, but they are not the main purpose of `记录：`.

```text
完成：客户方案完成 70%，明天继续补竞品分析和定价页。
```

```text
调整：招聘 JD 今天不做，明天只改岗位亮点。
```

These update task records and, when needed, mark tasks for tomorrow with concrete next actions.

### Data Storage

The installer creates or configures a Feishu/Lark Base with six tables:

| Table | Purpose |
| --- | --- |
| `目标库` | Long-term, monthly, project, or habit goals. |
| `周期计划` | Weekly, monthly, and phase plans. |
| `每日计划` | Daily priorities, constraints, energy, morning status, evening status. |
| `任务执行` | Task status, completion, reasons, next actions, carry-over state. |
| `事件日志` | Noteworthy events plus emotional impact, thoughts or judgments, lessons, and follow-up actions. |
| `复盘报告` | Daily, weekly, monthly, and goal-level review summaries. |

Important records preserve the user's `原始消息` while also storing structured fields for filtering and reporting.

### Current Scope

Supported:

- Single-user daily planning and review.
- Morning planning, evening review, daytime logs, task completion, plan adjustment, and periodic reports.
- Carry-over from unfinished work into the next morning plan.
- Noteworthy event capture with emotional impact, thoughts or judgments, lessons, and follow-up actions.
- Long-term retrieval and summaries through Feishu/Lark Base.
- User/source fields for future group use.

Not supported by default:

- Inferring triggers from casual chat without exact keywords.
- Replacing a full project management system.
- Mixed multi-user reporting unless group mode is explicitly added later.

### Requirements

- Node.js
- Git
- Codex, or another local AI agent that can use Codex-style skills
- [lark-cli](https://github.com/larksuite/cli)
- [cc-connect](https://github.com/chenhg5/cc-connect)
- A Feishu/Lark account that can create Base documents and configure a robot

Recommended references:

- lark-cli repository: <https://github.com/larksuite/cli>
- cc-connect Chinese README: <https://github.com/chenhg5/cc-connect/blob/main/README.zh-CN.md>

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

- <https://github.com/chenhg5/cc-connect/blob/main/README.zh-CN.md>

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
cc-connect cron add -p PROJECT -s SESSION_KEY --cron "30 7 * * *" --prompt "早计划" --desc "每日早计划" --session-mode new-per-run --timeout-mins 30
cc-connect cron add -p PROJECT -s SESSION_KEY --cron "30 23 * * *" --prompt "晚复盘" --desc "每日晚复盘" --session-mode new-per-run --timeout-mins 30
cc-connect daemon restart
```

You can also send `早计划` or `晚复盘` to the robot manually at any time.

If it is already after midnight and you need to catch up on the previous day, include the exact date to avoid ambiguity:

```text
晚复盘：补 2026-05-17
```

For Feishu/Lark Base reads and writes, the default runtime identity can be the robot/bot identity. As long as the bot has access to the Base, personal user authorization is not required; use user authorization only for Base creation or when bot permissions are insufficient.

### Troubleshooting Scheduled Messages

If the scheduled time passed but no robot message arrived, check cron and daemon status first:

```bash
cc-connect cron list
cc-connect daemon status
cc-connect daemon logs -n 80
```

Then inspect the job:

```bash
cc-connect cron info <JOB_ID>
```

If you see an error such as `platform "" not found for session "..."`, the issue is usually not the user name. It means the cron job points to the wrong session. The `session_key` should point to the active robot chat session, usually in the form `feishu:<chat_id>:<user_id>`; do not use the short session id or project name as the session key.

If you see an error such as `project "... " not found`, the cron job points to a project name that cc-connect is not currently running. Use `cc-connect daemon status` and the daemon startup logs to confirm the actual project name. For a single-user local setup this is often `default`, unless you explicitly used another project with `cc-connect feishu setup --project ...`.

Fix it with:

```bash
cc-connect cron edit <JOB_ID> project <PROJECT>
cc-connect cron edit <JOB_ID> session_key '<ACTIVE_SESSION_KEY>'
cc-connect daemon restart
```

After fixing it, create a temporary near-future cron job to test the full path, then delete that temporary job after you see `cron: job completed`.

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
