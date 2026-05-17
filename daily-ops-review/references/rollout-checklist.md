# Rollout Checklist

Use this only after the user approves the skill spec.

## Phase 1: Prepare Base

1. Create or identify the Feishu Base.
2. Create the six tables from `base-schema.md`.
3. Confirm exact field names and field types.
4. Store the Base token and table ids in the local project notes or approved configuration location.

## Phase 2: Install Skill

1. Copy the `daily-ops-review` folder to the Codex skill directory after user approval.
2. Verify the skill is discoverable by its description.
3. Keep references in the skill folder; do not inline all reference content into `SKILL.md`.

## Phase 3: Robot Integration

1. Confirm the robot chat id and whether messages arrive through private chat or group chat.
2. Configure fixed morning trigger to send the `早计划` flow.
3. Configure fixed evening trigger to send the `晚复盘` flow.
4. Route user messages starting with supported prefixes to Codex.
5. Preserve message metadata: sender id, sender name, chat id, message id, timestamp.

## Phase 4: Smoke Tests

Run these scenarios before relying on the system:

1. Manual `早计划` with three tasks creates one daily plan and three task records.
2. Fixed morning trigger after manual morning plan does not duplicate prompts.
3. `记录：...` creates an event log linked to today.
4. `完成：...` updates a matching task.
5. `调整：...` marks a task as rolled to tomorrow.
6. Manual `晚复盘` creates a daily review and updates task statuses.
7. Fixed evening trigger after manual review does not duplicate prompts.
8. `汇报：最近三天` reads Base records and returns a concise summary.
9. A task marked `是否滚动到明天` with `下一步动作` appears in the next morning `早计划` prompt.
10. If the user sends `早计划` with new tasks but omits yesterday's unfinished carry-over, the reply merges both sources into one draft and asks for confirmation.
11. If no manual morning plan is completed before the fixed 09:00 trigger, the robot proactively sends the morning planning prompt.

## Phase 5: First Week Calibration

After one week, review:

- Are the triggers easy to remember?
- Are morning and evening prompts short enough?
- Are deviation categories useful?
- Are reports answering real questions?
- Should weekly or monthly automatic reports be added?
