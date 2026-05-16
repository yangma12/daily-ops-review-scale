import { execFileSync } from "node:child_process";

const baseToken = process.argv[2];
if (!baseToken) {
  console.error("Usage: node bootstrap-base.mjs <base-token>");
  process.exit(2);
}

const colors = ["Blue", "Green", "Orange", "Red", "Purple", "Wathet", "Gray", "Yellow", "Turquoise"];

function run(args) {
  const out = execFileSync("lark-cli", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  const jsonStart = out.indexOf("{");
  if (jsonStart < 0) return {};
  return JSON.parse(out.slice(jsonStart));
}

function option(name, i = 0) {
  return { name, hue: colors[i % colors.length], lightness: i % 2 ? "Light" : "Lighter" };
}

function text(name, description) {
  return { type: "text", name, ...(description ? { description } : {}) };
}

function select(name, names, multiple = false) {
  return { type: "select", name, multiple, options: names.map(option) };
}

function number(name, precision = 0) {
  return { type: "number", name, style: { type: "plain", precision, percentage: false, thousands_separator: false } };
}

function date(name) {
  return { type: "datetime", name, style: { format: "yyyy-MM-dd" } };
}

function dateTime(name) {
  return { type: "datetime", name, style: { format: "yyyy-MM-dd HH:mm" } };
}

function checkbox(name) {
  return { type: "checkbox", name };
}

function createdAt() {
  return { type: "created_at", name: "创建时间", style: { format: "yyyy-MM-dd HH:mm" } };
}

function updatedAt() {
  return { type: "updated_at", name: "更新时间", style: { format: "yyyy-MM-dd HH:mm" } };
}

function link(name, linkTable) {
  return { type: "link", name, link_table: linkTable, bidirectional: false };
}

const commonFields = [
  text("用户 ID"),
  text("用户名称"),
  select("来源类型", ["定时触发", "手动触发", "私聊", "群聊", "系统生成"]),
  text("来源 chat_id"),
  text("来源 message_id"),
  text("原始消息"),
  createdAt(),
  updatedAt(),
];

const tableSpecs = {
  "目标库": {
    primary: text("目标名称"),
    fields: [
      select("目标类型", ["长期", "季度", "月度", "周", "项目", "习惯"]),
      select("状态", ["未开始", "进行中", "暂停", "完成", "取消"]),
      select("优先级", ["P0", "P1", "P2", "P3"]),
      text("成功标准"),
      text("关键指标"),
      date("开始日期"),
      date("结束日期"),
      select("相关领域", ["工作", "健康", "学习", "关系", "财务", "其他"], true),
      text("备注"),
      ...commonFields,
    ],
  },
  "周期计划": {
    primary: text("周期名称"),
    fields: [
      select("周期类型", ["周计划", "月计划", "阶段计划"]),
      date("开始日期"),
      date("结束日期"),
      text("本周期重点"),
      text("预期成果"),
      select("当前状态", ["计划中", "执行中", "已复盘", "暂停"]),
      text("复盘摘要"),
      ...commonFields,
    ],
    links: [link("关联目标", "目标库")],
  },
  "每日计划": {
    primary: text("日期"),
    fields: [
      date("日期值"),
      text("今日 Top 3"),
      text("预计时间块"),
      text("今日约束"),
      select("能量状态", ["高", "中", "低", "未知"]),
      number("计划置信度", 0),
      select("早计划状态", ["未开始", "已完成", "已跳过"]),
      select("晚复盘状态", ["未开始", "已完成", "已跳过"]),
      text("实际完成摘要"),
      text("明日建议"),
      ...commonFields,
    ],
  },
  "任务执行": {
    primary: text("任务名称"),
    fields: [
      select("优先级", ["P0", "P1", "P2", "P3"]),
      number("预计耗时", 0),
      number("实际耗时", 0),
      select("状态", ["计划中", "进行中", "完成", "部分完成", "未完成", "取消", "滚动"]),
      number("完成度", 0),
      select("未完成原因", ["时间估计错误", "外部打断", "目标不清", "精力不足", "依赖他人", "临时高优先级", "主动取消", "其他"]),
      text("下一步动作"),
      checkbox("是否滚动到明天"),
      ...commonFields,
    ],
    links: [link("所属日期", "每日计划"), link("关联目标", "目标库")],
  },
  "事件日志": {
    primary: text("事件标题"),
    fields: [
      dateTime("发生时间"),
      select("事件类型", ["进展", "阻碍", "情绪", "机会", "决策", "外部反馈", "想法", "其他"]),
      text("内容"),
      select("影响程度", ["低", "中", "高"]),
      select("情绪", ["积极", "平稳", "焦虑", "疲惫", "沮丧", "兴奋", "未知"]),
      select("标签", ["工作", "健康", "学习", "关系", "财务", "其他"], true),
      ...commonFields,
    ],
    links: [link("日期", "每日计划"), link("关联任务", "任务执行"), link("关联目标", "目标库")],
  },
  "复盘报告": {
    primary: text("报告标题"),
    fields: [
      select("复盘类型", ["每日", "每周", "每月", "目标", "自定义"]),
      date("开始日期"),
      date("结束日期"),
      text("完成情况"),
      text("偏差原因"),
      text("关键模式"),
      text("经验教训"),
      text("下周期建议"),
      ...commonFields,
    ],
    links: [link("关联目标", "目标库")],
  },
};

function tableList() {
  return run(["base", "+table-list", "--as", "user", "--base-token", baseToken, "--offset", "0", "--limit", "50"]).data.tables;
}

function fieldList(tableId) {
  return run(["base", "+field-list", "--as", "user", "--base-token", baseToken, "--table-id", tableId, "--offset", "0", "--limit", "200"]).data.fields;
}

function updateTable(tableId, name) {
  run(["base", "+table-update", "--as", "user", "--base-token", baseToken, "--table-id", tableId, "--name", name]);
}

function createTable(name) {
  const result = run(["base", "+table-create", "--as", "user", "--base-token", baseToken, "--name", name]);
  return result.data.table.id || result.data.table.table_id;
}

function updateField(tableId, fieldId, spec) {
  run(["base", "+field-update", "--as", "user", "--base-token", baseToken, "--table-id", tableId, "--field-id", fieldId, "--json", JSON.stringify(spec)]);
}

function createField(tableId, spec) {
  run(["base", "+field-create", "--as", "user", "--base-token", baseToken, "--table-id", tableId, "--json", JSON.stringify(spec)]);
}

let tables = tableList();
const defaultTable = tables.find((table) => table.name === "数据表");
if (defaultTable && !tables.some((table) => table.name === "目标库")) {
  updateTable(defaultTable.id, "目标库");
}

tables = tableList();
const tableIds = Object.fromEntries(tables.map((table) => [table.name, table.id]));

for (const name of Object.keys(tableSpecs)) {
  if (!tableIds[name]) {
    tableIds[name] = createTable(name);
  }
}

for (const [name, spec] of Object.entries(tableSpecs)) {
  const tableId = tableIds[name];
  let fields = fieldList(tableId);
  const textField = fields.find((field) => field.name === "文本" && field.type === "text") || fields.find((field) => field.type === "text");
  if (textField && !fields.some((field) => field.name === spec.primary.name)) {
    updateField(tableId, textField.id, spec.primary);
  } else if (!fields.some((field) => field.name === spec.primary.name)) {
    createField(tableId, spec.primary);
  }

  fields = fieldList(tableId);
  for (const fieldSpec of [...spec.fields, ...(spec.links || [])]) {
    if (fields.some((field) => field.name === fieldSpec.name)) continue;
    createField(tableId, fieldSpec);
    fields = fieldList(tableId);
  }
}

const summary = {};
for (const [name, id] of Object.entries(tableIds)) {
  summary[name] = {
    table_id: id,
    fields: fieldList(id).map((field) => ({ id: field.id, name: field.name, type: field.type })),
  };
}

console.log(JSON.stringify({ base_token: baseToken, tables: summary }, null, 2));
