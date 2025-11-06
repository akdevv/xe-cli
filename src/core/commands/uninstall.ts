import { Command } from "commander";
import { PackageManagerExecutor } from "@/core/pm/executor.ts";
import { logger } from "@/utils/logger.ts";

export function uninstallCommand(program: Command): void {
  program
    .command("uninstall <packages...>")
    .alias("un")
    .description("Uninstall packages")
    .action(async (packages: string[]) => {
      try {
        const executor = new PackageManagerExecutor();
        await executor.execute("uninstall", packages);
        logger.success("Uninstallation complete!");
      } catch (error) {
        logger.error("Uninstallation failed:", error);
        process.exit(1);
      }
    });
}
