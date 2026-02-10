import { Command } from "commander";
import { PackageManagerExecutor } from "@/core/pm/executor.ts";
import { logger } from "@/utils/logger.ts";

export function startCommand(program: Command): void {
  program
    .command("start")
    .description("Run start script")
    .action(async () => {
      try {
        const executor = new PackageManagerExecutor();
        await executor.execute("start");
        logger.success("Started!");
      } catch {
        logger.error("Start failed.");
        process.exit(1);
      }
    });
}
