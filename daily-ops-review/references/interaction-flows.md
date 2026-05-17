# Interaction Flows

## Morning Planning

Trigger: fixed morning schedule or `早计划`.

Goal: create a realistic daily plan with low friction.

### Entry Modes

Morning planning has two valid entry modes:

1. Empty trigger: fixed 09:00 schedule or a bare `早计划` message. Start by prompting the user.
2. Trigger with user plan: `早计划 ...` or the user's direct reply to the morning prompt. Parse the supplied plan, but still fetch carry-over tasks first.

Never skip carry-over retrieval just because the user already supplied today's new plan.

### Carry-over First

Before asking for or finalizing today's new plan, read yesterday's and recent unfinished task records for the same user:

- `是否滚动到明天 = true`
- or `状态` is `未完成`, `部分完成`, or `滚动`
- or `下一步动作` is not empty and the task is not `完成` or `取消`

Prefer yesterday's tasks first. Include older tasks only when they are explicitly marked `是否滚动到明天` or still have a concrete `下一步动作`.

For each carry-over task, use:

- `任务名称`
- prior `完成度`
- `未完成原因`
- `下一步动作`
- linked goal if available

If carry-over tasks exist, the morning prompt should lead with them:

```text
早上好。昨天复盘后有这些可延续事项：
1. ...（昨天进度 ...，下一步 ...）
2. ...

你可以直接回复：
- 保留哪些
- 哪些今天不做
- 每项今天具体做到哪一 part
- 今天新增的 1-3 件重要事项
```

If no carry-over tasks exist, use the normal morning prompt.

### Scheduled Morning Behavior

For the fixed 09:00 trigger:

- First check whether today's `每日计划.早计划状态` is already `已完成`.
- If already completed by a manual `早计划`, do not ask the user to fill the morning plan again. A short "今天早计划已记录" confirmation is enough, and silence is also acceptable if the integration supports it.
- If not completed, send the morning prompt. Include carry-over tasks at the top when they exist.
- The scheduled trigger asks the user to fill today's plan; it should not create a finished daily plan from an empty trigger alone.

### Prompt

Use a short prompt:

```text
早上好，今天先定一下节奏。

你可以直接说：
1. 今天最重要的 1-3 件事
2. 今天有哪些固定安排或限制
3. 今天大概精力如何
4. 今天明确不做什么
```

### Parse

Extract:

- Top 1-3 priorities
- Concrete tasks
- Time constraints
- Energy state
- Risks, dependencies, and non-goals
- Tasks rolled over from yesterday
- For each carry-over task: keep, modify, split, drop, or postpone
- Today's concrete part for each kept carry-over task

When the user provides today's plan but omits carry-over tasks, do not assume those carry-over tasks are cancelled. Treat them as pending confirmation and include them in the merged draft.

If no Top 1-3 can be identified, ask:

```text
今天最重要的 1-3 件事是什么？先不用排很细。
```

### Merge and Confirm

Before writing the final morning plan, merge two sources:

1. Carry-over tasks from yesterday or recent unfinished records.
2. New tasks from the user's morning input.

If carry-over tasks exist and the user did not explicitly keep, change, postpone, or drop each one, reply with a merged draft and ask for confirmation instead of silently marking the morning plan complete:

```text
我把昨晚延续事项和你今天新增的计划合并成这个草案，你确认一下：

昨晚延续：
1. ... -> 今天建议先做 ...

今天新增：
1. ...
2. ...

你回复「确认」即可；也可以直接说删掉/推迟/改成哪一 part。
```

After the user confirms or edits the draft, write the final plan and mark `早计划状态 = 已完成`.

### Write

- Upsert today's `每日计划`.
- Create or update `任务执行` records for concrete tasks.
- For kept carry-over tasks, create today's task record with:
  - the same task name unless the user renames it
  - status `计划中`
  - previous progress noted in `原始消息` or `下一步动作`
  - today's specific part in `下一步动作`
  - linked goal copied when available
- For carry-over tasks the user drops or postpones, update the previous task's `是否滚动到明天` accordingly and record the decision.
- Mark `早计划状态 = 已完成` only after the user confirms or clearly accepts the merged plan.
- Keep raw user wording in `原始消息`.

### Reply

Return a concise plan confirmation:

```text
收到。今天我先按这三个重点帮你追踪：
1. ...
2. ...
3. ...

主要风险是 ...。晚上复盘时我会按这几项对照。
```

When carry-over tasks were included, explicitly show which were kept or changed:

```text
已确认，今天计划里已包含昨天延续事项：
1. ... -> 今天做到 ...
2. ... -> 今天先不做

今天新增重点：
1. ...
```

## Evening Review

Trigger: fixed evening schedule or `晚复盘`.

Goal: review the day against the morning plan and create tomorrow-ready adjustments.

### Prompt With Morning Plan

Fetch today's `每日计划` and `任务执行`, then ask:

```text
今天早上定的重点是：
1. ...
2. ...
3. ...

你直接回复每项状态就行：完成 / 部分完成 / 没完成 + 简短原因。
也可以顺便说今天最大的变化或感受。
```

### Prompt Without Morning Plan

If there is no morning plan:

```text
今天没有早计划，我帮你做一个补复盘。

你简单说三件事就行：
1. 今天主要做了什么
2. 哪件事最影响节奏
3. 明天最该调整什么
```

### Parse

Extract:

- Completion state for each task
- Completion percent when provided
- Deviation cause
- Key events
- Energy/emotion signal
- Tomorrow carry-over candidates
- If the user says "明天继续", "明天做某一 part", or similar, extract the exact next part into `下一步动作`

Use these deviation categories:

- 时间估计错误
- 外部打断
- 目标不清
- 精力不足
- 依赖他人
- 临时高优先级
- 主动取消
- 其他

### Review Method

The review should cover five dimensions:

1. Plan quality: was the plan realistic and important?
2. Execution result: what was completed, partial, or missed?
3. Deviation cause: why did reality differ from plan?
4. Behavior pattern: what repeated signal appeared?
5. Next adjustment: continue, split, postpone, cancel, or delegate.

### Write

- Update `任务执行` statuses and reasons.
- Update `每日计划.实际完成摘要`, `明日建议`, and `晚复盘状态 = 已完成`.
- Create one `复盘报告` record with `复盘类型 = 每日`.
- Create event logs for important unplanned events or emotional signals.
- Mark carry-over tasks with `是否滚动到明天`.
- For each carry-over task, write a concrete `下一步动作`. If the user only says "明天继续" without a part, ask one follow-up question: `明天这件事具体先做哪一 part？`

### Reply

Keep the robot reply compact:

```text
今日复盘：
- 完成：...
- 偏差：...
- 看到的模式：...
- 明天建议：1. ... 2. ... 3. ...

我已把需要滚动的任务标记到明天。
```

## Question Discipline

- Ask one follow-up question at a time.
- Prefer defaults over interrogating the user.
- Do not ask the user to fill a form.
- If the user gives a messy narrative, structure it silently and confirm the extracted essentials.
