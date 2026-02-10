import { Command } from "commander";
import inquirer from "inquirer";
import { execa } from "execa";
import * as path from "path";
import { promises as fs } from "fs";
import { pathExists } from "fs-extra";
import { type PackageManager, PM_COMMANDS } from "@/core/pm/types.ts";
import { verifyPackageManagerInstalled } from "@/core/pm/executor.ts";
import { logger } from "@/utils/logger.ts";

export function initCommand(program: Command): void {
  program
    .command("init")
    .description("Initialize a new project")
    .option("-y, --yes", "Skip prompts and use defaults")
    .action(async (options) => {
      try {
        // Always show package manager selection
        const { packageManager } = await inquirer.prompt([
          {
            type: "list",
            name: "packageManager",
            message: "Select a package manager:",
            choices: [
              { name: "npm", value: "npm" },
              { name: "pnpm", value: "pnpm" },
              { name: "yarn", value: "yarn" },
              { name: "bun", value: "bun" },
            ],
          },
        ]);

        const selectedPM = packageManager as PackageManager;

        // Verify the selected package manager is installed
        await verifyPackageManagerInstalled(selectedPM);

        const initCommand = PM_COMMANDS[selectedPM].init;

        // Only npm, yarn, and bun support -y flag
        // pnpm init automatically uses defaults without needing a flag
        const supportsYesFlag = ["npm", "yarn", "bun"].includes(selectedPM);
        const args = options.yes && supportsYesFlag ? ["-y"] : [];

        logger.info(`Initializing project with ${selectedPM}...`);
        logger.info(`Running: ${initCommand} ${args.join(" ")}`.trim());

        const [cmd, ...cmdArgs] = initCommand.split(" ") as [
          string,
          ...string[],
        ];
        const fullArgs = [...cmdArgs, ...args];

        await execa(cmd, fullArgs, {
          stdio: "inherit",
          cwd: process.cwd(),
        });

        // Save the selected package manager to package.json
        await savePackageManagerToPackageJson(selectedPM);

        logger.success("Project initialized!");
      } catch {
        logger.error("Initialization failed.");
        process.exit(1);
      }
    });
}

/**
 * Save the selected package manager to package.json's packageManager field
 */
async function savePackageManagerToPackageJson(
  pm: PackageManager
): Promise<void> {
  try {
    const packageJsonPath = path.join(process.cwd(), "package.json");

    // Check if package.json exists
    if (!(await pathExists(packageJsonPath))) {
      logger.debug(
        "package.json not found, skipping packageManager field update"
      );
      return;
    }

    // Read package.json
    const content = await fs.readFile(packageJsonPath, "utf8");
    const packageJson = JSON.parse(content);

    // Get the version of the package manager
    try {
      const result = await execa(pm, ["--version"], { stdio: "pipe" });
      const version = result.stdout.trim();
      packageJson.packageManager = `${pm}@${version}`;
    } catch {
      // If we can't get version, just set the name
      packageJson.packageManager = pm;
    }

    // Write back to package.json
    await fs.writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + "\n",
      "utf8"
    );

    logger.debug(`Saved packageManager field: ${packageJson.packageManager}`);
  } catch (error) {
    // Don't fail the init if we can't save packageManager
    logger.debug("Failed to save packageManager to package.json:", error);
  }
}
