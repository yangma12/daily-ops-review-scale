# Reporting

## Supported Queries

Triggered by `汇报:` or `汇报：`.

Common requests:

- `最近三天`
- `本周`
- `本月`
- `本月目标进展`
- `最近我主要卡在哪里`
- `某个目标的进展`
- `最近能量状态`

## Retrieval Strategy

Use Feishu Base as the source of truth:

1. Identify date range and user id.
2. Read matching `每日计划`, `任务执行`, `事件日志`, and `复盘报告`.
3. If the query mentions goals, also read `目标库` and linked task/review records.
4. Summarize from structured fields first; use `原始消息` only to clarify nuance.

Do not scan full tables by default. Retrieval must be bounded by date range, user id, and relevant status or goal whenever possible.

## Query Paths

Use the narrowest available path:

1. **Exact day or small date range**: read `每日计划` by `日期` / `日期值`, then read linked or same-date tasks, events, and reviews. Request only needed fields with `+record-list --field-id`.
2. **Current week/month or recent N days**: use `lark-base +data-query` when the question is aggregate, such as counts by status, common deviation causes, completion rate, or energy trend.
3. **Narrative reports**: first use aggregate results to find the important dates/statuses/categories, then fetch only those matching detail records.
4. **Raw detail lists**: use a filtered Base view and `+record-list --view-id`. If the needed view does not exist, create or update a temporary/reporting view only when necessary.
5. **Goal-specific reports**: start from `目标库`, then fetch linked task/review records. If link filtering is insufficient, narrow by date range and goal name/status before reading details.

## Filter Rules

- Always filter by `用户 ID` once multi-user data exists; first version may use the configured primary user id.
- For `每日计划`, use `日期值` for date filtering and `日期` as the human-readable key.
- For `任务执行`, prefer filters on `状态`, `是否滚动到明天`, `完成度`, and linked `所属日期`.
- For `事件日志`, filter by `发生时间`, `事件类型`, `影响程度`, `情绪`, and tags. Use `情绪影响`, `想法判断`, `经验教训`, and `后续动作` to explain why the event mattered.
- For `复盘报告`, filter by `复盘类型`, `开始日期`, and `结束日期`.
- Use `--limit 200` maximum and continue pagination only when the requested report truly needs more records.

## Long-Horizon Strategy

After data grows beyond a few months, use staged summaries:

- Daily reports stay in `复盘报告` as the atomic narrative summary.
- Weekly/monthly reports should summarize prior daily reports first, then inspect raw tasks/events only for unclear or high-impact patterns.
- Yearly reports should summarize monthly reports first, then drill into selected months or goals.

This keeps annual reporting fast and prevents the agent from rereading every raw event.

For aggregation, prefer `lark-base +data-query` when suitable. For narrative synthesis, list only the relevant filtered records and summarize.

## Report Shape

Default report:

```text
这段时间的整体情况：
1. 主要完成了什么
2. 主要偏差在哪里
3. 反复出现的模式
4. 对目标的影响
5. 接下来最值得调整的 1-3 件事
```

## Analysis Dimensions

Track these patterns:

- Task completion by priority
- Tasks repeatedly rolled over
- Common deviation causes
- Energy state versus completion
- External interruptions
- Events that changed emotion, thinking, judgment, or later behavior
- Goals with progress, stagnation, or unclear next action
- Plans that were too large or too vague

## Monthly Report

For monthly reports, produce:

- Executive summary
- Goal progress
- Finished outcomes
- Unfinished but important work
- Recurring blockers
- Energy and rhythm observations
- Recommended next month focus

Do not overstate causality. Label uncertain conclusions as signals, not facts.
