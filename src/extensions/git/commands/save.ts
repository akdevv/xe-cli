import { Command } from "commander";
import { execa } from "execa";
import { logger } from "@/utils/logger.ts";

async function hasChanges(): Promise<boolean> {
  try {
    // Check if there are any changes (staged or unstaged)
    const { stdout: statusOutput } = await execa("git", [
      "status",
      "--porcelain",
    ]);
    return statusOutput.trim().length > 0;
  } catch {
    return false;
  }
}

export function saveCommand(git: Command): void {
  git
    .command("save")
    .description("Add, commit, and push in one command")
    .argument("[message]", 'Commit message (default: "WIP: auto-save")')
    .action(async (message?: string) => {
      try {
        // Check if there are any changes first
        const changesExist = await hasChanges();

        if (!changesExist) {
          logger.info("No changes to save. Working tree is clean.");
          return;
        }

        const commitMessage = message || "WIP: auto-save";

        // Step 1: Add all files
        logger.info("Adding files...");
        await execa("xe", ["git", "add"], {
          stdio: "inherit",
        });

        // Step 2: Commit with message
        logger.info(`Committing with message: "${commitMessage}"`);
        await execa("xe", ["git", "commit", "-m", commitMessage], {
          stdio: "inherit",
        });

        // Step 3: Push to remote
        logger.info("Pushing changes...");
        await execa("xe", ["git", "push"], {
          stdio: "inherit",
        });

        logger.success("Saved successfully! 🎉");
      } catch {
        logger.error("Save failed.");
        process.exit(1);
      }
    });
}
