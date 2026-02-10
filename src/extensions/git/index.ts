import { Command } from "commander";
import { execa } from "execa";
import { logger } from "@/utils/logger.ts";
import { addCommand } from "./commands/add.ts";
import { pushCommand } from "./commands/push.ts";
import { saveCommand } from "./commands/save.ts";
import { syncCommand } from "./commands/sync.ts";

export function registerGitCommands(program: Command): void {
  const git = program
    .command("git")
    .alias("g")
    .description("Git commands")
    .allowUnknownOption(true);

  addCommand(git);
  pushCommand(git);
  saveCommand(git);
  syncCommand(git);

  // Catch-all for any other git commands (passthrough to native git)
  git
    .command("* [args...]", { hidden: true })
    .allowUnknownOption(true)
    .action(async (...args: any[]) => {
      try {
        const gitArgs = args
          .filter((arg) => Array.isArray(arg) || typeof arg === "string")
          .flat();

        // Pass through to native git command
        await execa("git", gitArgs, {
          stdio: "inherit",
        });
      } catch {
        logger.error("Git command failed.");
        process.exit(1);
      }
    });
}
