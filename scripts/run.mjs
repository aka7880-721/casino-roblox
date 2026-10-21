#!/usr/bin/env node
/**
 * Portable AdoptLuck launcher — run from repo root via run.bat / run.sh / node scripts/run.mjs
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
const prod = args.includes("--prod") || args.includes("-p");
const skipInstall = args.includes("--no-install");

function log(msg) {
  console.log(`[AdoptLuck] ${msg}`);
}

function fail(msg) {
  console.error(`[AdoptLuck] ERROR: ${msg}`);
  process.exit(1);
}

function parseNodeMajor(version) {
  const m = /^v?(\d+)/.exec(version.trim());
  return m ? Number(m[1]) : 0;
}

/** Spawn a process; on Windows npm must run via cmd.exe (spawn EINVAL on .cmd without shell). */
function runCommand(command, commandArgs, opts = {}) {
  return new Promise((resolve, reject) => {
    const isWin = process.platform === "win32";
    let file = command;
    let spawnArgs = commandArgs;

    if (isWin && command === "npm") {
      file = process.env.ComSpec || "cmd.exe";
      spawnArgs = ["/d", "/s", "/c", "npm", ...commandArgs];
    }

    const child = spawn(file, spawnArgs, {
      cwd: ROOT,
      stdio: "inherit",
      shell: false,
      windowsHide: true,
      env: { ...process.env, ...opts.env },
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

async function main() {
  process.chdir(ROOT);
  log(`Project: ${ROOT}`);

  let nodeV;
  try {
    nodeV = await new Promise((res, rej) => {
      const c = spawn(process.execPath, ["-v"], { shell: false, windowsHide: true });
      let out = "";
      c.stdout.on("data", (d) => (out += d));
      c.on("close", (code) => (code === 0 ? res(out) : rej(new Error("node not found"))));
      c.on("error", rej);
    });
  } catch {
    fail("Node.js is not installed. Install Node 18+ from https://nodejs.org/ then run again.");
  }

  if (parseNodeMajor(nodeV) < 18) {
    fail(`Node 18+ required (found ${nodeV.trim()}). Upgrade Node and retry.`);
  }
  log(`Node ${nodeV.trim()}`);

  const envLocal = path.join(ROOT, ".env.local");
  const envExample = path.join(ROOT, ".env.example");
  if (!fs.existsSync(envLocal) && fs.existsSync(envExample)) {
    fs.copyFileSync(envExample, envLocal);
    log("Created .env.local from .env.example — edit it with your Supabase keys.");
  } else if (!fs.existsSync(envLocal)) {
    log("Warning: no .env.local — copy .env.example and set Supabase env vars.");
  }

  const nm = path.join(ROOT, "node_modules");
  if (!skipInstall && !fs.existsSync(nm)) {
    log("Installing dependencies (first run)…");
    await runCommand("npm", ["install"]);
  } else if (!fs.existsSync(nm)) {
    fail("node_modules missing. Run without --no-install or run: npm install");
  }

  if (prod) {
    log("Production mode: build then start on http://localhost:3000");
    await runCommand("npm", ["run", "build"]);
    await runCommand("npm", ["run", "start"]);
  } else {
    log("Dev server: http://localhost:3000 (Ctrl+C to stop)");
    await runCommand("npm", ["run", "dev"]);
  }
}

main().catch((e) => {
  fail(e.message ?? String(e));
});
