import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skillSource = join(repoRoot, "daily-ops-review");

const args = new Map();
for (let i = 2; i < process.argv.length; i += 1) {
  const arg = process.argv[i];
  if (!arg.startsWith("--")) continue;
  const key = arg.slice(2);
  const next = process.argv[i + 1];
  if (!next || next.startsWith("--")) {
    args.set(key, true);
  } else {
    args.set(key, next);
    i += 1;
  }
}

function help() {
  console.log(`Usage:
  node scripts/install.mjs --create-base --install-skill
  node scripts/install.mjs --base-token <TOKEN> --install-skill

Options:
  --create-base          Create a new Feishu Base named 个人日程复盘系统
  --base-token <TOKEN>   Use an existing Feishu Base token
  --install-skill        Copy the skill to ~/.agents/skills/daily-ops-review
  --skill-dir <PATH>     Override the install target
  --base-name <NAME>     Override the created Base name
`);
}

if (args.has("help") || args.has("h")) {
  help();
  process.exit(0);
}

function run(command, argsList) {
  const out = execFileSync(command, argsList, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  const jsonStart = out.indexOf("{");
  if (jsonStart < 0) return out.trim();
  return JSON.parse(out.slice(jsonStart));
}

function assertCommand(command, installHint) {
  try {
    execFileSync(command, ["--version"], { stdio: "ignore" });
  } catch {
    throw new Error(`${command} is not available. ${installHint}`);
  }
}

assertCommand("lark-cli", "Install it with: npm install -g @larksuite/cli");

let baseToken = args.get("base-token");
let baseUrl = "";
let baseName = args.get("base-name") || "个人日程复盘系统";

if (!baseToken && args.has("create-base")) {
  const created = run("lark-cli", [
    "base",
    "+base-create",
    "--as",
    "user",
    "--name",
    baseName,
    "--time-zone",
    "Asia/Shanghai",
  ]);
  baseToken = created?.data?.base?.base_token || created?.data?.base?.app_token;
  baseUrl = created?.data?.base?.url || "";
  baseName = created?.data?.base?.name || baseName;
}

if (!baseToken) {
  help();
  throw new Error("Missing Base token. Pass --create-base or --base-token <TOKEN>.");
}

const bootstrap = run("node", [join(repoRoot, "daily-ops-review", "scripts", "bootstrap-base.mjs"), baseToken]);
const tables = bootstrap.tables || {};

const installDir = args.get("skill-dir") || join(homedir(), ".agents", "skills", "daily-ops-review");
if (args.has("install-skill")) {
  mkdirSync(dirname(installDir), { recursive: true });
  cpSync(skillSource, installDir, { recursive: true, force: true });
}

const configTarget = args.has("install-skill")
  ? join(installDir, "references", "local-config.md")
  : join(skillSource, "references", "local-config.md");

mkdirSync(dirname(configTarget), { recursive: true });
writeFileSync(
  configTarget,
  `# Local Config

This local installation is configured for the user's personal Feishu Base.

## Base

- Name: \`${baseName}\`
- URL: \`${baseUrl || "<OPEN YOUR BASE IN FEISHU TO GET THE URL>"}\`
- Base token: \`${baseToken}\`
- Identity: use \`--as user\`

## Tables

| Table | Table ID |
| --- | --- |
| 目标库 | \`${tables["目标库"]?.table_id || ""}\` |
| 周期计划 | \`${tables["周期计划"]?.table_id || ""}\` |
| 每日计划 | \`${tables["每日计划"]?.table_id || ""}\` |
| 任务执行 | \`${tables["任务执行"]?.table_id || ""}\` |
| 事件日志 | \`${tables["事件日志"]?.table_id || ""}\` |
| 复盘报告 | \`${tables["复盘报告"]?.table_id || ""}\` |

## Notes

- Some tables may include a default Feishu \`ID\` auto-number field. Ignore it unless the user asks for record IDs.
- \`每日计划\` has both \`日期\` as a text field for human-readable keys and \`日期值\` as a datetime field for date filtering.
- Reporting should use bounded retrieval: date range + user/status filters, \`+data-query\` for aggregation, and filtered views for raw details.
- Always read the live field structure before writing because Feishu may reorder fields or the user may rename them.
`,
  "utf8",
);

console.log(JSON.stringify({
  ok: true,
  skill_dir: args.has("install-skill") ? installDir : null,
  local_config: configTarget,
  base_token: baseToken,
  base_url: baseUrl,
  tables: Object.fromEntries(Object.entries(tables).map(([name, value]) => [name, value.table_id])),
}, null, 2));
