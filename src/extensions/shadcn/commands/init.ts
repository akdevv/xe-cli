import { Command } from "commander";
import { execa } from "execa";
import { logger } from "@/utils/logger.ts";
import { PackageManagerDetector } from "@/core/pm/detector.ts";

export function initCommand(shadcn: Command): void {
  shadcn
    .command("init")
    .description("Initialize shadcn-ui with default settings")
    .action(async () => {
      try {
        logger.info("Initializing shadcn-ui...");

        const pm = await PackageManagerDetector.detect();

        let cmd: string;
        let args: string[];

        switch (pm) {
          case "pnpm":
            cmd = "pnpm";
            args = ["dlx", "shadcn@latest", "init", "-y"];
            break;
          case "yarn":
            cmd = "yarn";
            args = ["dlx", "shadcn@latest", "init", "-y"];
            break;
          case "bun":
            cmd = "bunx";
            args = ["--bun", "shadcn@latest", "init", "-y"];
            break;
          case "npm":
          default:
            cmd = "npx";
            args = ["shadcn@latest", "init", "-y"];
            break;
        }

        await execa(cmd, args, {
          stdio: "inherit",
        });
        logger.success("Shadcn-ui initialized!");
      } catch (error) {
        logger.error("Shadcn init failed:", error);
        process.exit(1);
      }
    });
}
