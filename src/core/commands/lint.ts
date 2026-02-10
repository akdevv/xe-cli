import { Command } from "commander";
import { PackageManagerExecutor } from "@/core/pm/executor.ts";
import { logger } from "@/utils/logger.ts";

export function lintCommand(program: Command): void {
  program
    .command("lint")
    .description("Run lint script")
    .action(async () => {
      try {
        const executor = new PackageManagerExecutor();
        await executor.execute("lint");
        logger.success("Linting complete!");
      } catch {
        logger.error("Linting failed.");
        process.exit(1);
      }
    });
}
