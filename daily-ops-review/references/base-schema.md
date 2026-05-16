# Base Schema

## Base

Recommended Base name: `个人日程复盘系统`

The schema is optimized for one user first, with lightweight multi-user readiness. Keep field names stable because robot flows and reports depend on them.

## Common Fields

Add these fields to every table unless explicitly unnecessary:

| Field | Type | Notes |
| --- | --- | --- |
| 用户 ID | text | Feishu sender/user id. First version can default to primary user. |
| 用户名称 | text | Display name at message time. |
| 来源类型 | single select | `定时触发`, `手动触发`, `私聊`, `群聊`, `系统生成`. |
| 来源 chat_id | text | Robot chat id when available. |
| 来源 message_id | text | Original message id when available. |
| 原始消息 | long text | User's raw wording. Preserve for audit and later reinterpretation. |
| 创建时间 | created time | System field. |
| 更新时间 | modified time | System field. |

## Table: 目标库

Stores long-term and short-term goals.

| Field | Type | Notes |
| --- | --- | --- |
| 目标名称 | text | Primary field. |
| 目标类型 | single select | `长期`, `季度`, `月度`, `周`, `项目`, `习惯`. |
| 状态 | single select | `未开始`, `进行中`, `暂停`, `完成`, `取消`. |
| 优先级 | single select | `P0`, `P1`, `P2`, `P3`. |
| 成功标准 | long text | What done means. |
| 关键指标 | long text | Measurable or observable signals. |
| 开始日期 | date | Optional. |
| 结束日期 | date | Optional. |
| 相关领域 | multi select | Example: work, health, learning, relationship, finance. |
| 备注 | long text | Freeform context. |

## Table: 周期计划

Stores weekly, monthly, and phase plans.

| Field | Type | Notes |
| --- | --- | --- |
| 周期名称 | text | Primary field, e.g. `2026-05 第三周`. |
| 周期类型 | single select | `周计划`, `月计划`, `阶段计划`. |
| 开始日期 | date | Required. |
| 结束日期 | date | Required. |
| 本周期重点 | long text | Top priorities. |
| 预期成果 | long text | Expected outcomes. |
| 关联目标 | link to 目标库 | Multiple allowed. |
| 当前状态 | single select | `计划中`, `执行中`, `已复盘`, `暂停`. |
| 复盘摘要 | long text | Filled after period review. |

## Table: 每日计划

One main record per user per date.

| Field | Type | Notes |
| --- | --- | --- |
| 日期 | text | Human-readable key such as `2026-05-16`. Unique per user per day. |
| 日期值 | date | Date field for filtering and reporting. |
| 今日 Top 3 | long text | Top 1-3 priorities. |
| 预计时间块 | long text | Meetings, focus windows, known constraints. |
| 今日约束 | long text | Limits, risks, dependencies, things not to do. |
| 能量状态 | single select | `高`, `中`, `低`, `未知`. |
| 计划置信度 | number | 1-5 if user provides enough signal; otherwise blank. |
| 早计划状态 | single select | `未开始`, `已完成`, `已跳过`. |
| 晚复盘状态 | single select | `未开始`, `已完成`, `已跳过`. |
| 实际完成摘要 | long text | Filled after evening review. |
| 明日建议 | long text | Generated during review. |

## Table: 任务执行

Each concrete task is one record.

| Field | Type | Notes |
| --- | --- | --- |
| 任务名称 | text | Primary field. |
| 所属日期 | link to 每日计划 | Required. |
| 关联目标 | link to 目标库 | Optional, multiple allowed. |
| 优先级 | single select | `P0`, `P1`, `P2`, `P3`. |
| 预计耗时 | number | Minutes or hours; keep unit consistent in field description. |
| 实际耗时 | number | Same unit as estimated duration. |
| 状态 | single select | `计划中`, `进行中`, `完成`, `部分完成`, `未完成`, `取消`, `滚动`. |
| 完成度 | number | 0-100. |
| 未完成原因 | single select | `时间估计错误`, `外部打断`, `目标不清`, `精力不足`, `依赖他人`, `临时高优先级`, `主动取消`, `其他`. |
| 下一步动作 | long text | Specific next action, not vague intent. |
| 是否滚动到明天 | checkbox | True when it should be proposed tomorrow. |

## Table: 事件日志

Stores important events during the day.

| Field | Type | Notes |
| --- | --- | --- |
| 事件标题 | text | Short generated title. |
| 日期 | link to 每日计划 | Required when date is known. |
| 发生时间 | date/time | Optional if user gives time. |
| 事件类型 | single select | `进展`, `阻碍`, `情绪`, `机会`, `决策`, `外部反馈`, `想法`, `其他`. |
| 内容 | long text | Clean summary. |
| 影响程度 | single select | `低`, `中`, `高`. |
| 情绪 | single select | `积极`, `平稳`, `焦虑`, `疲惫`, `沮丧`, `兴奋`, `未知`. |
| 关联任务 | link to 任务执行 | Optional. |
| 关联目标 | link to 目标库 | Optional. |
| 标签 | multi select | Flexible tags. |

## Table: 复盘报告

Stores daily, weekly, monthly, and goal reports.

| Field | Type | Notes |
| --- | --- | --- |
| 报告标题 | text | Primary field. |
| 复盘类型 | single select | `每日`, `每周`, `每月`, `目标`, `自定义`. |
| 开始日期 | date | Required. |
| 结束日期 | date | Required. |
| 完成情况 | long text | What happened. |
| 偏差原因 | long text | Why reality differed from plan. |
| 关键模式 | long text | Repeated patterns and signals. |
| 经验教训 | long text | Reusable learning. |
| 下周期建议 | long text | Concrete next changes. |
| 关联目标 | link to 目标库 | Optional. |

## Write Rules

- Never overwrite `原始消息`; append a new event or update structured fields.
- Before writing records, read current table/field structure with `lark-base`.
- Use exact field names from Base. Do not guess renamed fields.
- For each day and user, upsert one `每日计划` record by `日期 + 用户 ID`.
- For task updates, prefer matching by same-day task name. If ambiguous, ask one clarifying question.
- Store generated summaries in summary fields and user wording in raw/source fields.
- If a group robot is later enabled, use sender `用户 ID` to partition all records.
