import { Command } from "commander";
import { execa } from "execa";
import { logger } from "@/utils/logger.ts";
import { PackageManagerDetector } from "@/core/pm/detector.ts";

export function addCommand(shadcn: Command): void {
  shadcn
    .command("add <components...>")
    .description("Add shadcn-ui components")
    .action(async (components: string[]) => {
      try {
        logger.info(`Adding components: ${components.join(", ")}...`);

        const pm = await PackageManagerDetector.detect();

        let cmd: string;
        let args: string[];

        switch (pm) {
          case "pnpm":
            cmd = "pnpm";
            args = ["dlx", "shadcn@latest", "add", ...components];
            break;
          case "yarn":
            cmd = "yarn";
            args = ["dlx", "shadcn@latest", "add", ...components];
            break;
          case "bun":
            cmd = "bunx";
            args = ["--bun", "shadcn@latest", "add", ...components];
            break;
          case "npm":
          default:
            cmd = "npx";
            args = ["shadcn@latest", "add", ...components];
            break;
        }

        await execa(cmd, args, {
          stdio: "inherit",
        });
        logger.success("Components added!");
      } catch {
        logger.error("Failed to add components.");
        process.exit(1);
      }
    });
}
