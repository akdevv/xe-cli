import { Command } from "commander";
import { ConfigManager } from "@/config/config.manager.ts";
import { registerGitCommands } from "./git/index.ts";
import { registerGithubCommands } from "./github/index.ts";
import { registerPrismaCommands } from "./prisma/index.ts";
import { registerDockerCommands } from "./docker/index.ts";
import { registerShadcnCommands } from "./shadcn/index.ts";
import { logger } from "@/utils/logger.ts";

export class ExtensionLoader {
  async loadExtensions(program: Command): Promise<void> {
    const configManager = ConfigManager.getInstance();
    const config = configManager.getConfig();

    if (config.extensions.git) {
      registerGitCommands(program);
      logger.debug("Git extension loaded");
    }

    if (config.extensions.github) {
      registerGithubCommands(program);
      logger.debug("Github extension loaded");
    }

    if (config.extensions.prisma) {
      registerPrismaCommands(program);
      logger.debug("Prisma extension loaded");
    }

    if (config.extensions.docker) {
      registerDockerCommands(program);
      logger.debug("Docker extension loaded");
    }

    if (config.extensions.shadcn) {
      registerShadcnCommands(program);
      logger.debug("Shadcn extension loaded");
    }
  }
}
