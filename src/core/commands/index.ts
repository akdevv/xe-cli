import { Command } from "commander";
import { installCommand } from "./install.ts";
import { uninstallCommand } from "./uninstall.ts";
import { initCommand } from "./init.ts";
import { updateCommand } from "./update.ts";
import { nukeCommand } from "./nuke.ts";

import { startCommand } from "./start.ts";
import { devCommand } from "./dev.ts";
import { buildCommand } from "./build.ts";
import { lintCommand } from "./lint.ts";
import { runCommand } from "./run.ts";
import { listScriptsCommand } from "./list-scripts.ts";

export function registerCoreCommands(program: Command) {
  installCommand(program);
  uninstallCommand(program);
  initCommand(program);
  updateCommand(program);
  nukeCommand(program);
  runCommand(program);
  startCommand(program);
  devCommand(program);
  buildCommand(program);
  lintCommand(program);
  listScriptsCommand(program);
}

export { registerConfigCommands } from "./config.ts";
