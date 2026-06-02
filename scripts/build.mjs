import { spawnSync } from "node:child_process";
import { rmSync } from "node:fs";
import { join } from "node:path";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const projectRoot = process.cwd();
const generatedAdminPaths = [
  join(projectRoot, "public", "admin"),
  join(projectRoot, "dist", "admin"),
];
const hasTinaCloudConfig = Boolean(
  process.env.NEXT_PUBLIC_TINA_CLIENT_ID && process.env.TINA_TOKEN,
);

function runScript(scriptName) {
  const result = spawnSync(npmCommand, ["run", scriptName], {
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function removeGeneratedAdmin() {
  for (const adminPath of generatedAdminPaths) {
    // 无 TinaCloud 凭据时清掉开发版 admin，避免 localhost 后台入口被复制到构建产物。
    rmSync(adminPath, { force: true, recursive: true });
  }
}

if (hasTinaCloudConfig) {
  runScript("build:cms");
} else {
  removeGeneratedAdmin();
  console.warn(
    "[TinaCMS] 未检测到 NEXT_PUBLIC_TINA_CLIENT_ID/TINA_TOKEN，已清理并跳过 /admin 后台构建。",
  );
}

runScript("build:site");

if (!hasTinaCloudConfig) {
  removeGeneratedAdmin();
}
