import * as path from "path";
import { promises as fs } from "fs";
import { pathExists } from "fs-extra";
import { PackageManagerExecutor } from "@/core/pm/executor.ts";
import { logger } from "@/utils/logger.ts";
import chalk from "chalk";
import { AliasResolver } from "./alias.resolver.ts";
import { execa } from "execa";

interface PackageJson {
  scripts?: Record<string, string>;
}

export async function handleUnknownCommand(operands: string[]): Promise<void> {
  const commandName = operands[0];
  const args = operands.slice(1);

  // Validate that commandName exists
  if (!commandName) {
    logger.error("No command specified");
    logger.info('Run "xe --help" to see available commands');
    process.exit(1);
  }

  // First, try to resolve as alias or custom command
  const resolvedType = AliasResolver.getType(commandName);

  if (resolvedType === "custom") {
    // Execute custom command
    await executeCustomCommand(commandName, args);
    return;
  }

  // If it's an alias, it should have been resolved in cli.ts already
  // So if we're here, it's not an alias or custom command

  try {
    // Check if package.json exists
    const packageJsonPath = path.join(process.cwd(), "package.json");

    if (!(await pathExists(packageJsonPath))) {
      logger.error(`Unknown command: ${commandName}`);
      logger.info('Run "xe --help" to see available commands');
      process.exit(1);
    }

    // Read package.json
    const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");
    const packageJson: PackageJson = JSON.parse(packageJsonContent);

    if (!packageJson.scripts) {
      logger.error(`Unknown command: ${commandName}`);
      logger.info("No scripts found in package.json");
      process.exit(1);
    }

    if (!packageJson.scripts) {
      logger.error(`Unknown command: ${commandName}`);
      logger.info("No scripts found in package.json");
      process.exit(1);
    }

    // Check if the command exists in scripts
    if (packageJson.scripts[commandName]) {
      logger.info(`Running script: ${commandName}`);
      const executor = new PackageManagerExecutor();
      await executor.execute("run", [commandName, ...args]);
      return;
    }

    // Command not found - show helpful error
    await showScriptNotFoundError(commandName, packageJson.scripts);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      logger.error(`Unknown command: ${commandName}`);
      logger.info('Run "xe --help" to see available commands');
    } else {
      logger.error("Failed to execute command:", error.message);
    }
    process.exit(1);
  }
}

async function executeCustomCommand(
  commandName: string,
  args: string[]
): Promise<void> {
  const customCommand = AliasResolver.resolve(commandName);

  logger.info(`Executing custom command: ${commandName}`);
  logger.debug(`Full command: ${customCommand}`);

  // Parse the custom command and execute it
  // Custom commands can be chained with && or complex

  try {
    // Execute the full command string in shell mode
    await execa(customCommand, args, {
      shell: true,
      stdio: "inherit",
      cwd: process.cwd(),
    });

    logger.success("Custom command completed!");
  } catch (error: any) {
    logger.error("Custom command failed:", error.message);
    process.exit(1);
  }
}

async function showScriptNotFoundError(
  commandName: string,
  scripts: Record<string, string>
): Promise<void> {
  logger.error(`Script "${commandName}" not found in package.json`);

  const scriptNames = Object.keys(scripts);

  if (scriptNames.length === 0) {
    logger.info("No scripts defined in package.json");
    process.exit(1);
  }

  // Show available scripts
  console.log("\n" + chalk.cyan("Available scripts:"));
  scriptNames.forEach((name) => {
    console.log(`  ${chalk.green(name)}: ${chalk.gray(scripts[name])}`);
  });

  // Suggest similar scripts
  const similarScripts = findSimilarScripts(commandName, scriptNames);
  if (similarScripts.length > 0) {
    console.log("\n" + chalk.yellow("Did you mean one of these?"));
    similarScripts.forEach((name) => {
      console.log(`  ${chalk.green("xe " + name)}`);
    });
  }

  console.log("");
  process.exit(1);
}

function findSimilarScripts(input: string, scriptNames: string[]): string[] {
  // Simple similarity check - scripts that start with the same prefix or contain the input
  return scriptNames
    .filter((name) => {
      const lowerName = name.toLowerCase();
      const lowerInput = input.toLowerCase();
      return (
        lowerName.startsWith(lowerInput) ||
        lowerName.includes(lowerInput) ||
        lowerInput.includes(lowerName)
      );
    })
    .slice(0, 5); // Limit to 5 suggestions
}

export async function listAvailableScripts(): Promise<void> {
  try {
    const packageJsonPath = path.join(process.cwd(), "package.json");

    if (!(await pathExists(packageJsonPath))) {
      logger.warn("No package.json found in current directory");
      return;
    }

    const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");
    const packageJson: PackageJson = JSON.parse(packageJsonContent);

    if (!packageJson.scripts || Object.keys(packageJson.scripts).length === 0) {
      logger.info("No scripts defined in package.json");
      return;
    }

    console.log(chalk.cyan("\nAvailable scripts:"));
    Object.entries(packageJson.scripts).forEach(([name, command]) => {
      console.log(`  ${chalk.green(name)}`);
      console.log(`    ${chalk.gray(command)}`);
    });
    console.log("");
  } catch (error) {
    logger.error("Failed to read package.json:", error);
  }
}
