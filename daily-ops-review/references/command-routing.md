# Command Routing

## Trigger Policy

Only exact message-start keywords trigger the skill. Normalize leading whitespace and full-width/half-width colon, but do not infer intent from casual text.

Supported prefixes:

| Prefix | Route |
| --- | --- |
| `早计划` | Morning planning flow. Optional content after keyword can be parsed as the plan. |
| `晚复盘` | Evening review flow. Optional content after keyword can be parsed as review input. |
| `记录:` / `记录：` | Create an event log. |
| `完成:` / `完成：` | Update task progress or completion. |
| `调整:` / `调整：` | Modify plan, task status, schedule, priority, or rollover. |
| `汇报:` / `汇报：` | Generate a report from Base records. |

Non-trigger messages should be ignored unless they are direct replies in an active morning/evening flow.

## Manual and Fixed Trigger Interaction

- Manual `早计划` before the fixed morning trigger completes the morning flow for that date.
- Manual `晚复盘` before the fixed evening trigger completes the evening flow for that date.
- Fixed triggers should check today's `每日计划` status first before asking the user anything.
- If the relevant status is already complete, do not ask the full prompt again. Send a short confirmation only if appropriate.
- If the fixed 07:30 morning trigger fires and today's morning plan is not complete, send the `早计划` prompt proactively so the user can fill today's plan.
- If the user sends `早计划` with today's tasks before 07:30, run the same morning flow immediately. The later fixed 07:30 trigger must not duplicate the prompt after the plan is confirmed.
- Optional content after `早计划` is today's new plan, not a reason to ignore yesterday's unfinished work. The morning flow must still merge carry-over tasks with the new plan and ask for confirmation when carry-over decisions are ambiguous.

## Active Flow Replies

When the robot asked a question, the next user reply in the same chat/thread can continue that flow even if it has no prefix. Store the reply with the current flow context.

If there is no active flow, require one of the exact prefixes.

## Ad-hoc Routes

### `记录`

Use for noteworthy events that are worth reviewing later because they changed the user's emotion, thinking, judgment, experience, or next behavior.

Do not treat `记录` as a generic task-progress route. Routine progress such as "方案完成 70%" should use `完成`. Plan or priority changes should use `调整`.

Completion can still appear inside an event log when the user frames it as reflective context, such as "写完初版后发现自己其实卡在报价判断上，有点焦虑". In that case, create the event log and update the related task only when the task signal is explicit.

Output:
- Create `事件日志`.
- Link to today's `每日计划` when possible.
- Link to a task or goal only when obvious; otherwise leave blank.
- Capture the event itself, emotional impact, new thought or judgment, reusable lesson, and possible follow-up action when present.
- Fill `事件类型`, `影响程度`, `情绪`, `情绪影响`, `想法判断`, `经验教训`, `后续动作`, and `标签` when the signal is clear. Preserve uncertain details in `内容` instead of over-classifying.

Reply briefly with what was recorded and any one useful follow-up question if needed.

Examples:
- `记录：上午客户会后有点焦虑，主要担心方案范围太大，下午需要先收敛到报价和交付边界`
- `记录：下午被临时需求打断，原本写方案的时间被占用，感觉节奏有点乱`
- `记录：今天发现自己在不确定报价时会拖延，可能需要先列一个最小报价模板`
- `记录：写完周报后发现自己没有讲清楚结论，经验是以后先写一句核心判断再补细节`

### `完成`

Use for task completion or progress.

Output:
- Find today's matching `任务执行`.
- Update status, completion percent, actual duration, and next action when provided.
- If the user says the task will continue tomorrow, set `是否滚动到明天 = true` and capture the tomorrow part in `下一步动作`.
- If no matching task exists, create a task only when the user's wording is clearly a task; otherwise ask one clarification.

Examples:
- `完成：客户方案 70%，明天继续补竞品分析`
- `完成：招聘 JD 写完初版，明天改标题和卖点`

### `调整`

Use for rescheduling, cancellation, priority changes, task splitting, or rollover.

Output:
- Update `每日计划` or `任务执行`.
- For rollovers, set `是否滚动到明天` and write `下一步动作`.
- If the user mentions a specific part for tomorrow, use that part as `下一步动作` instead of copying the old task name.
- If adjustment affects a goal or period plan, add an `事件日志` record.

Examples:
- `调整：客户方案明天继续，先做定价页`
- `调整：招聘 JD 今天不做，明天只改岗位亮点`

### `汇报`

Use `references/reporting.md`.

Examples:
- `汇报：最近三天`
- `汇报：本周`
- `汇报：本月目标进展`
- `汇报：最近我主要卡在哪里`

## Multi-user Readiness

First version serves one primary user. Still capture sender id and chat id for every robot-originated message. If a group chat is later enabled, never mix records across users unless the user explicitly asks for a team report.
