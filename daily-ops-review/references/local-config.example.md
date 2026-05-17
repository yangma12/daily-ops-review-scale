# Local Config Example

Copy this file to `local-config.md` during installation. Do not commit the real `local-config.md`.

## Base

- Name: `个人日程复盘系统`
- URL: `<YOUR_FEISHU_BASE_URL>`
- Base token: `<YOUR_BASE_TOKEN>`
- Identity: use `--as bot` for normal robot runtime reads/writes when the bot has Base permission; use `--as user` only for user-only setup operations.

## Tables

| Table | Table ID |
| --- | --- |
| 目标库 | `<TABLE_ID>` |
| 周期计划 | `<TABLE_ID>` |
| 每日计划 | `<TABLE_ID>` |
| 任务执行 | `<TABLE_ID>` |
| 事件日志 | `<TABLE_ID>` |
| 复盘报告 | `<TABLE_ID>` |

## Notes

- Some tables may include a default Feishu `ID` auto-number field. Ignore it unless the user asks for record IDs.
- `每日计划` has both `日期` as a text field for human-readable keys and `日期值` as a datetime field for date filtering.
- Reporting should use bounded retrieval: date range + user/status filters, `+data-query` for aggregation, and filtered views for raw details.
- Always read the live field structure before writing because Feishu may reorder fields or the user may rename them.
