import { Command } from "commander";
import { ConfigManager } from "@/config/config.manager.ts";
import { handleUnknownCommand } from "@/core/runner.ts";
import {
  registerCoreCommands,
  registerConfigCommands,
} from "@/core/commands/index.ts";

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
    // const extensionLoader = new ExtensionLoader();
    // await extensionLoader.loadExtensions(program);

    // Handle unknown commands
    program.on("command:*", async (operands) => {
      await handleUnknownCommand(operands);
    });
  } catch (error) {
    logger.error("Failed to initialize CLI:", error);
    throw error;
  }
}

export { program };
