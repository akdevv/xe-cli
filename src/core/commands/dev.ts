import { Command } from "commander";
import { PackageManagerExecutor } from "@/core/pm/executor.ts";
import { logger } from "@/utils/logger.ts";

export function devCommand(program: Command) {
  program
    .command("dev")
    .description("Run dev script")
    .action(async () => {
      try {
        const executor = new PackageManagerExecutor();
        await executor.execute("dev");
        logger.success("Dev server started!");
      } catch (error) {
        logger.error("Dev failed:", error);
        process.exit(1);
      }
    });
}
