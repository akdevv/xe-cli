import { Command } from "commander";
import { execa } from "execa";
import { logger } from "@/utils/logger.ts";

export function addCommand(git: Command): void {
  git
    .command("add")
    .description("Add files to git (git add .)")
    .argument("[files...]", "files to add (default: all files)")
    .action(async (files: string[] = []) => {
      try {
        // If no files provided or only '.' is provided, add all files
        const shouldAddAll =
          files.length === 0 || (files.length === 1 && files[0] === ".");

        if (shouldAddAll) {
          logger.info("Adding all files...");
          await execa("git", ["add", "."], { stdio: "inherit" });
          logger.success("All files added!");
        } else {
          logger.info(`Adding files: ${files.join(", ")}`);
          await execa("git", ["add", ...files], { stdio: "inherit" });
          logger.success("Files added!");
        }
      } catch (error) {
        logger.error("Git add failed:", error);
        process.exit(1);
      }
    });
}
