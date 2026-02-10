import { Command } from "commander";
import { PackageManagerExecutor } from "@/core/pm/executor.ts";
import { logger } from "@/utils/logger.ts";

export function installCommand(program: Command) {
  program
    .command("install [package...]")
    .alias("i")
    .description("Install packages")
    .option("-D, --save-dev", "Install as dev dependency")
    .option("-g, --global", "Install globally")
    .action(
      async (
        packages: string[],
        options: { saveDev?: boolean; global?: boolean }
      ) => {
        try {
          const executor = new PackageManagerExecutor();

          if (packages.length === 0) {
            // Just run install with no packages
            await executor.execute("install");
          } else {
            let command: "install" | "installDev" | "installGlobal";
            if (options.global) {
              command = "installGlobal";
            } else if (options.saveDev) {
              command = "installDev";
            } else {
              command = "install";
            }
            await executor.execute(command, packages);
          }

          logger.success("Installation complete!");
        } catch {
          logger.error("Installation failed.");
          process.exit(1);
        }
      }
    );
}
