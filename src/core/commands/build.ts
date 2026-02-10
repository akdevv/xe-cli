import { Command } from "commander";
import { PackageManagerExecutor } from "@/core/pm/executor.ts";
import { logger } from "@/utils/logger.ts";

export function buildCommand(program: Command) {
  program
    .command("build")
    .description("Run build script")
    .action(async () => {
      try {
        const executor = new PackageManagerExecutor();
        await executor.execute("build");
        logger.success("Build complete!");
      } catch {
        logger.error("Build failed.");
        process.exit(1);
      }
    });
}
