import { Command } from "commander";
import { ConfigManager } from "@/config/config.manager.ts";
import { handleUnknownCommand } from "@/core/runner.ts";
import { AliasResolver } from "@/core/alias.resolver.ts";
import {
  registerCoreCommands,
  registerConfigCommands,
} from "@/core/commands/index.ts";
import { ExtensionLoader } from "@/extensions/index.ts";
import { logger } from "@/utils/logger.ts";

const program = new Command();

program
  .name("xe")
  .description("A lightweight, universal package manager.")
  .version("1.0.0");

// Initialize configuration
export async function initializeCLI() {
  try {
    const configManager = ConfigManager.getInstance();
    await configManager.ensureConfig();

    // Register core commands
    registerCoreCommands(program);

    // Register config commands
    registerConfigCommands(program);

    // Load and register extensions
    const extensionLoader = new ExtensionLoader();
    await extensionLoader.loadExtensions(program);

    // Handle unknown commands
    program.on("command:*", async (operands) => {
      await handleUnknownCommand(operands);
    });
  } catch (error) {
    logger.error("Failed to initialize CLI:", error);
    throw error;
  }
}

// Resolve aliases before parsing
async function preprocessArgs(): Promise<string[]> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    return args;
  }

  const firstArg = args[0];

  if (!firstArg) {
    return args;
  }

  // Don't resolve if it's a flag
  if (firstArg.startsWith("-")) {
    return args;
  }

  // Check if it's an alias or custom command
  const resolvedType = AliasResolver.getType(firstArg);

  if (resolvedType !== "none") {
    const resolvedParts = AliasResolver.resolveAndSplit(firstArg);
    const remainingArgs = args.slice(1);

    logger.debug(
      `Resolved ${resolvedType}: ${firstArg} -> ${resolvedParts.join(" ")}`
    );

    return [...resolvedParts, ...remainingArgs];
  }

  return args;
}

export { program, preprocessArgs };
