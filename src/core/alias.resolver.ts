import { ConfigManager } from "@/config/config.manager.ts";
import { logger } from "@/utils/logger.ts";

export class AliasResolver {
  static resolve(input: string): string {
    const configManager = ConfigManager.getInstance();
    const config = configManager.getConfig();

    // Check aliases
    const alias = config.aliases[input];
    if (alias) {
      logger.debug(`Resolved alias '${input}' to '${alias}'`);
      return alias;
    }

    // Check custom commands
    const customCommand = config.customCommands[input];
    if (customCommand) {
      logger.debug(`Resolved custom command '${input}' to '${customCommand}'`);
      return customCommand;
    }

    return input;
  }

  static resolveAndSplit(input: string): string[] {
    const resolved = this.resolve(input);
    return resolved.split(" ").filter((part) => part.length > 0);
  }

  static getType(input: string): "alias" | "custom" | "none" {
    const configManager = ConfigManager.getInstance();
    const config = configManager.getConfig();

    if (config.aliases[input]) return "alias";
    if (config.customCommands[input]) return "custom";
    return "none";
  }
}
