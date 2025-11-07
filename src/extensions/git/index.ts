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
    .action(async (commandName: string, args: string[] = []) => {
      try {
        // Pass through to native git command
        const gitArgs = [commandName, ...args];
        logger.debug(`Executing: git ${gitArgs.join(" ")}`);

        await execa("git", gitArgs, {
          stdio: "inherit",
        });
      } catch (error) {
        logger.error("Git command failed:", error);
        process.exit(1);
      }
    });
}
