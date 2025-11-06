import { Command } from "commander";
import { PackageManagerExecutor } from "@/core/pm/executor.ts";
import { logger } from "@/utils/logger.ts";

export function updateCommand(program: Command) {
  program
    .command("update [package...]")
    .alias("up")
    .description("Update packages to their latest versions")
    .action(async (packages: string[]) => {
      try {
        const executor = new PackageManagerExecutor();

        if (packages.length === 0) {
          // Update all packages
          logger.info("Updating all packages...");
          await executor.execute("update");
        } else {
          // Update specific packages
          logger.info(`Updating packages: ${packages.join(", ")}`);
          await executor.execute("update", packages);
        }

        logger.success("Update complete!");
      } catch (error) {
        logger.error("Update failed:", error);
        process.exit(1);
      }
    });
}
