import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const skillDir = process.argv[2] || join(homedir(), ".agents", "skills", "daily-ops-review");
const requiredFiles = [
  "SKILL.md",
  "agents/openai.yaml",
  "references/base-schema.md",
  "references/command-routing.md",
  "references/interaction-flows.md",
  "references/reporting.md",
  "references/local-config.md",
  "scripts/bootstrap-base.mjs",
];

const failures = [];
for (const file of requiredFiles) {
  if (!existsSync(join(skillDir, file))) failures.push(`Missing ${file}`);
}

const configPath = join(skillDir, "references", "local-config.md");
let baseToken = "";
if (existsSync(configPath)) {
  const config = readFileSync(configPath, "utf8");
  baseToken = config.match(/Base token: `([^`]+)`/)?.[1] || "";
  if (!baseToken || baseToken.includes("<")) failures.push("local-config.md does not contain a real Base token");
}

function run(command, args) {
  const out = execFileSync(command, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  const jsonStart = out.indexOf("{");
  if (jsonStart < 0) return null;
  return JSON.parse(out.slice(jsonStart));
}

if (baseToken) {
  try {
    const tables = run("lark-cli", ["base", "+table-list", "--as", "user", "--base-token", baseToken, "--offset", "0", "--limit", "50"])?.data?.tables || [];
    const names = new Set(tables.map((table) => table.name));
    for (const expected of ["目标库", "周期计划", "每日计划", "任务执行", "事件日志", "复盘报告"]) {
      if (!names.has(expected)) failures.push(`Missing Base table ${expected}`);
    }
  } catch (error) {
    failures.push(`Unable to read Feishu Base: ${error.message}`);
  }
}

if (failures.length) {
  console.error(JSON.stringify({ ok: false, skill_dir: skillDir, failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, skill_dir: skillDir }, null, 2));
