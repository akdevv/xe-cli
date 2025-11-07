import { Command } from "commander";
import { logger } from "@/utils/logger.ts";
import * as path from "path";
import { pathExists, remove } from "fs-extra";
import inquirer from "inquirer";

export function removeCommand(shadcn: Command): void {
  shadcn
    .command("remove <component>")
    .alias("rm")
    .description("Remove a shadcn-ui component")
    .action(async (component: string) => {
      try {
        const componentsDir = path.join(process.cwd(), "components", "ui");
        const componentPath = path.join(componentsDir, `${component}.tsx`);

        if (!(await pathExists(componentPath))) {
          logger.error(`Component '${component}' not found`);
          process.exit(1);
        }

        const { confirm } = await inquirer.prompt([
          {
            type: "confirm",
            name: "confirm",
            message: `Are you sure you want to remove ${component}?`,
            default: false,
          },
        ]);

        if (confirm) {
          await remove(componentPath);
          logger.success(`Component '${component}' removed!`);
        } else {
          logger.info("Cancelled");
        }
      } catch (error) {
        logger.error("Failed to remove component:", error);
        process.exit(1);
      }
    });
}
