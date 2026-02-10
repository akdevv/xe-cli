import { Command } from "commander";
import { execa } from "execa";
import { logger } from "@/utils/logger.ts";

export function syncCommand(git: Command): void {
  git
    .command("sync")
    .description(
      "Pull with rebase and push changes (git pull --rebase && push)"
    )
    .action(async () => {
      try {
        // Pull with rebase
        logger.info("Pulling latest changes with rebase...");
        await execa("git", ["pull", "--rebase"], {
          stdio: "inherit",
        });
        logger.success("Pulled successfully!");

        // Push using the smart push command
        logger.info("Pushing changes...");
        await execa("xe", ["git", "push"], {
          stdio: "inherit",
        });

        logger.success("Sync complete! 🚀");
      } catch {
        logger.error("Sync failed.");
        process.exit(1);
      }
    });
}
