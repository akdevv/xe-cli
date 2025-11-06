import { Command } from "commander";
import { PackageManagerExecutor } from "@/core/pm/executor.ts";
import { logger } from "@/utils/logger.ts";
import * as path from "path";
import { promises as fs } from "fs";
import { pathExists } from "fs-extra";
import chalk from "chalk";

export function runCommand(program: Command): void {
  program
    .command("run <script>")
    .description("Run a package.json script")
    .allowUnknownOption()
    .action(async (script: string, options: any, command: Command) => {
      try {
        // Check if script exists in package.json
        const packageJsonPath = path.join(process.cwd(), "package.json");

        if (await pathExists(packageJsonPath)) {
          const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");
          const packageJson = JSON.parse(packageJsonContent);

          if (!packageJson.scripts || !packageJson.scripts[script]) {
            logger.error(`Script "${script}" not found in package.json`);

            if (
              packageJson.scripts &&
              Object.keys(packageJson.scripts).length > 0
            ) {
              console.log("\n" + chalk.cyan("Available scripts:"));
              Object.keys(packageJson.scripts).forEach((name) => {
                console.log(`  ${chalk.green(name)}`);
              });
              console.log("");
            }

            process.exit(1);
          }
        }

        const executor = new PackageManagerExecutor();
        const extraArgs = command.args.slice(1);
        await executor.execute("run", [script, ...extraArgs]);
      } catch (error) {
        logger.error("Script execution failed:", error);
        process.exit(1);
      }
    });
}
