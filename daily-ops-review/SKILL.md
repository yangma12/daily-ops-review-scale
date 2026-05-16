---
name: daily-ops-review
description: Use when the user manages personal daily plans, daily reviews, task progress, goal tracking, Feishu/Lark robot messages, morning planning, evening retrospectives, ad-hoc records, plan adjustments, or periodic personal reports.
---

# Daily Ops Review

## Overview

This skill runs a personal daily operating system through a Feishu/Lark robot and a Feishu Base. It turns lightweight chat messages into structured plans, task progress, event logs, reviews, and periodic reports.

The first version is single-user, but every stored record must include actor and source fields so the system can later support a group robot with multiple people.

## Hard Rules

- Source of truth is Feishu Base. Use `references/base-schema.md` for schema and write rules.
- Do not create automations, create Base tables, or install this skill unless the user explicitly asks.
- Trigger only on fixed schedules or exact message-start keywords. Do not infer triggers from casual text.
- Supported manual trigger prefixes: `早计划`, `晚复盘`, `记录:`, `记录：`, `完成:`, `完成：`, `调整:`, `调整：`, `汇报:`, `汇报：`.
- Fixed morning and evening triggers call the same flows as `早计划` and `晚复盘`.
- If a manual flow for today already completed, the later fixed trigger should not duplicate it.
- Ask at most one follow-up question at a time.
- Preserve original user wording in the relevant raw/source field.
- For reports and lookups, never default to full-table traversal. Use date/user/status filters, field projection, views, or Base data query as described in `references/reporting.md`.
- Use Chinese by default and keep robot replies short.

## Routing

1. Classify the trigger using `references/command-routing.md`.
2. If `references/local-config.md` exists, read it before any Feishu Base read/write.
3. Load only the needed reference:
   - Morning plan: `references/interaction-flows.md`
   - Evening review: `references/interaction-flows.md`
   - Ad-hoc record, completion, or adjustment: `references/command-routing.md`
   - Periodic reports: `references/reporting.md`
   - Base creation or schema updates: `references/base-schema.md`
4. For Feishu Base operations, use the `lark-base` skill. Read real table and field structure before writes. Prefer `--as user`.
5. If Base token, table IDs, or robot context are missing, ask for the minimum missing setup item.

## Data Model Summary

The Base should contain six tables:

- `目标库`
- `周期计划`
- `每日计划`
- `任务执行`
- `事件日志`
- `复盘报告`

Each table should include `用户 ID`, `用户名称`, `来源类型`, `来源 chat_id`, `来源 message_id`, and `原始消息` when applicable.

## Operating Loop

- Morning: first pull yesterday's carry-over tasks and concrete next parts, then collect today's Top 1-3, constraints, energy, and explicit non-goals; create/update one daily plan and task records.
- Daytime: handle `记录`, `完成`, and `调整` messages; update event logs and task execution without requiring a full review.
- Evening: retrieve today's plan and tasks; ask for statuses; generate a review covering completion, deviation causes, patterns, and tomorrow's adjustment.
- Reporting: summarize recent days, weeks, months, goals, recurring blockers, and energy/execution trends from Base records.

## Setup and Rollout

Use `references/rollout-checklist.md` after the user approves the skill spec.
