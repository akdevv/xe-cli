import * as path from "path";
import * as fs from "fs-extra";
import * as os from "os";
import type { XeConfig } from "./config.types.ts";
import { getDefaultConfig } from "./default.config.ts";
import { logger } from "@/utils/logger.ts";

export class ConfigManager {
  private static instance: ConfigManager;
  private config: XeConfig | null = null;
  private configPath: string = "";

  private constructor() {}

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * Get the config file path based on the platform
   * - Linux/Mac: ~/.xerc
   * - Windows: %USERPROFILE%\.xerc
   */
  private getConfigPath(): string {
    const homeDir = os.homedir();
    return path.join(homeDir, ".xerc");
  }

  async ensureConfig(): Promise<XeConfig> {
    if (this.config) return this.config;

    this.configPath = this.getConfigPath();

    // Check if config file exists
    if (await fs.pathExists(this.configPath)) {
      try {
        const fileContent = await fs.readFile(this.configPath, "utf8");
        const userConfig = JSON.parse(fileContent);
        this.config = { ...getDefaultConfig(), ...userConfig };
        logger.debug(`Config loaded from: ${this.configPath}`);
      } catch (error) {
        logger.warn(`Failed to parse config file, using defaults: ${error}`);
        this.config = getDefaultConfig();
        await this.saveConfig();
      }
    } else {
      // Create default config
      this.config = getDefaultConfig();
      await this.saveConfig();
      logger.success(`Created default config at: ${this.configPath}`);
      logger.info(`You can customize your config at: ${this.configPath}`);
    }

    return this.config!;
  }

  async saveConfig(): Promise<void> {
    if (!this.config) {
      throw new Error("No config to save");
    }

    try {
      await fs.writeJSON(this.configPath, this.config, { spaces: 2 });
      logger.debug(`Config saved to: ${this.configPath}`);
    } catch (error) {
      logger.error(`Failed to save config: ${error}`);
      throw error;
    }
  }

  getConfig(): XeConfig {
    if (!this.config) {
      throw new Error("No config available");
    }
    return this.config;
  }

  updateConfig(updates: Partial<XeConfig>): void {
    if (!this.config) {
      throw new Error("Config not initialized");
    }
    this.config = { ...this.config, ...updates };
    logger.debug(`Config updated: ${JSON.stringify(updates)}`);
  }

  async setExtension(
    extensionName: keyof XeConfig["extensions"],
    enabled: boolean
  ): Promise<void> {
    if (!this.config) {
      throw new Error("Config not initialized");
    }
    this.config.extensions[extensionName] = enabled;
    await this.saveConfig();
    logger.success(
      `Extension '${extensionName}' ${enabled ? "enabled" : "disabled"}`
    );
  }

  isExtensionEnabled(extensionName: keyof XeConfig["extensions"]): boolean {
    return this.config?.extensions[extensionName] ?? false;
  }

  getAlias(alias: string): string | undefined {
    return this.config?.aliases[alias];
  }

  getCustomCommand(commandName: string): string | undefined {
    return this.config?.customCommands[commandName];
  }

  async addAlias(alias: string, command: string): Promise<void> {
    if (!this.config) {
      throw new Error("Config not initialized");
    }
    this.config.aliases[alias] = command;
    await this.saveConfig();
    logger.success(`Alias '${alias}' -> '${command}' added`);
  }

  async removeAlias(alias: string): Promise<void> {
    if (!this.config) {
      throw new Error("Config not initialized");
    }
    if (this.config.aliases[alias]) {
      delete this.config.aliases[alias];
      await this.saveConfig();
      logger.success(`Alias '${alias}' removed`);
    } else {
      logger.warn(`Alias '${alias}' not found`);
    }
  }

  async addCustomCommand(name: string, command: string): Promise<void> {
    if (!this.config) {
      throw new Error("Config not initialized");
    }
    this.config.customCommands[name] = command;
    await this.saveConfig();
    logger.success(`Custom command '${name}' added`);
  }

  async removeCustomCommand(name: string): Promise<void> {
    if (!this.config) {
      throw new Error("Config not initialized");
    }
    if (this.config.customCommands[name]) {
      delete this.config.customCommands[name];
      await this.saveConfig();
      logger.success(`Custom command '${name}' removed`);
    } else {
      logger.warn(`Custom command '${name}' not found`);
    }
  }

  listAliases(): void {
    if (!this.config) {
      throw new Error("Config not initialized");
    }

    const aliases = this.config.aliases;
    if (Object.keys(aliases).length === 0) {
      logger.info("No aliases configured");
      return;
    }

    logger.info("Configured aliases:");
    Object.entries(aliases).forEach(([alias, command]) => {
      console.log(`  ${alias} -> ${command}`);
    });
  }

  listCustomCommands(): void {
    if (!this.config) {
      throw new Error("Config not initialized");
    }

    const commands = this.config.customCommands;
    if (Object.keys(commands).length === 0) {
      logger.info("No custom commands configured");
      return;
    }

    logger.info("Configured custom commands:");
    Object.entries(commands).forEach(([name, command]) => {
      console.log(`  ${name} -> ${command}`);
    });
  }

  listExtensions(): void {
    if (!this.config) {
      throw new Error("Config not initialized");
    }

    logger.info("Extensions status:");
    Object.entries(this.config.extensions).forEach(([name, enabled]) => {
      const status = enabled ? "✓ enabled" : "✗ disabled";
      console.log(`  ${name}: ${status}`);
    });
  }
}
