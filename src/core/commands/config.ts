import { Command } from "commander";
import { ConfigManager } from "@/config/config.manager.ts";
import { logger } from "@/utils/logger.ts";
import { promises as fs } from "fs";
import { execa } from "execa";
import inquirer from "inquirer";
import { DEFAULT_CONFIG } from "@/config/config.types.ts";

export function registerConfigCommands(program: Command) {
  const config = program
    .command("config")
    .description("Manage xe configuration");

  // Show config location
  config
    .command("path")
    .description("Show config file path")
    .action(() => {
      const configManager = ConfigManager.getInstance();
      const configPath = configManager.getConfigPathName();
      logger.info("Config file location:");
      console.log(configPath);
    });

  // Open config in default editor
  config
    .command("edit")
    .description("Open config file in default editor")
    .action(async () => {
      const configManager = ConfigManager.getInstance();
      const configPath = configManager.getConfigPathName();
      logger.info("Opening config file...");

      try {
        // Detect platform and use appropriate editor
        const platform = process.platform;

        if (platform === "win32") {
          await execa("notepad", [configPath], { stdio: "inherit" });
        } else if (platform === "darwin") {
          await execa("open", ["-t", configPath], { stdio: "inherit" });
        } else {
          // Linux - try common editors
          const editors = ["nano", "vim", "vi", "gedit"];
          let editorFound = false;

          for (const editor of editors) {
            try {
              await execa(editor, [configPath], { stdio: "inherit" });
              editorFound = true;
              break;
            } catch {
              continue;
            }
          }

          if (!editorFound) {
            logger.error("No text editor found. Please edit manually:");
            console.log(configPath);
          }
        }
      } catch {
        logger.error("Failed to open editor.");
        logger.info("Please edit manually:");
        console.log(configPath);
      }
    });

  // Show current config
  config
    .command("show")
    .description("Show current configuration")
    .action(async () => {
      const configManager = ConfigManager.getInstance();
      const currentConfig = configManager.getConfig();

      logger.info("Current configuration:");
      console.log(JSON.stringify(currentConfig, null, 2));
    });

  // Reset config to defaults
  config
    .command("reset")
    .description("Reset configuration to defaults")
    .action(async () => {
      const configManager = ConfigManager.getInstance();
      const configPath = configManager.getConfigPathName();

      const { confirm } = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirm",
          message: "Are you sure you want to reset the config to defaults?",
          default: false,
        },
      ]);

      if (confirm) {
        await fs.unlink(configPath);
        await configManager.ensureConfig();
        logger.success("Config reset to defaults!");
      } else {
        logger.info("Cancelled");
      }
    });

  // Extension management
  config
    .command("ext-enable <extension>")
    .description("Enable an extension")
    .action(async (extension: string) => {
      const configManager = ConfigManager.getInstance();
      const validExtensions = Object.keys(DEFAULT_CONFIG.extensions);

      if (!validExtensions.includes(extension)) {
        logger.error(
          `Invalid extension. Valid extensions: ${validExtensions.join(", ")}`
        );
        process.exit(1);
      }

      await configManager.setExtension(extension as any, true);
    });

  config
    .command("ext-disable <extension>")
    .description("Disable an extension")
    .action(async (extension: string) => {
      const configManager = ConfigManager.getInstance();
      const validExtensions = Object.keys(DEFAULT_CONFIG.extensions);

      if (!validExtensions.includes(extension)) {
        logger.error(
          `Invalid extension. Valid extensions: ${validExtensions.join(", ")}`
        );
        process.exit(1);
      }

      await configManager.setExtension(extension as any, false);
    });

  config
    .command("ext-list")
    .description("List all extensions and their status")
    .action(() => {
      const configManager = ConfigManager.getInstance();
      configManager.listExtensions();
    });

  // Alias management
  config
    .command("alias-add <alias> <command>")
    .description("Add a command alias")
    .action(async (alias: string, command: string) => {
      const configManager = ConfigManager.getInstance();
      await configManager.addAlias(alias, command);
    });

  config
    .command("alias-remove <alias>")
    .description("Remove a command alias")
    .action(async (alias: string) => {
      const configManager = ConfigManager.getInstance();
      await configManager.removeAlias(alias);
    });

  config
    .command("alias-list")
    .description("List all configured aliases")
    .action(() => {
      const configManager = ConfigManager.getInstance();
      configManager.listAliases();
    });

  // Custom command management
  config
    .command("cmd-add <name> <command>")
    .description("Add a custom command")
    .action(async (name: string, command: string) => {
      const configManager = ConfigManager.getInstance();
      await configManager.addCustomCommand(name, command);
    });

  config
    .command("cmd-remove <name>")
    .description("Remove a custom command")
    .action(async (name: string) => {
      const configManager = ConfigManager.getInstance();
      await configManager.removeCustomCommand(name);
    });

  config
    .command("cmd-list")
    .description("List all custom commands")
    .action(() => {
      const configManager = ConfigManager.getInstance();
      configManager.listCustomCommands();
    });

  // Set package manager
  config
    .command("set-pm <manager>")
    .description("Set preferred package manager (npm, pnpm, yarn, bun, auto)")
    .action(async (manager: string) => {
      const validManagers = ["npm", "pnpm", "yarn", "bun", "auto"];

      if (!validManagers.includes(manager)) {
        logger.error(
          `Invalid package manager. Valid options: ${validManagers.join(", ")}`
        );
        process.exit(1);
      }

      const configManager = ConfigManager.getInstance();
      configManager.updateConfig({
        pm: manager as "auto" | "npm" | "pnpm" | "yarn" | "bun",
      });
      await configManager.saveConfig();
      logger.success(`Package manager set to: ${manager}`);
    });
}
