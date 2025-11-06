import { execa } from "execa";
import { type PackageManager, PM_COMMANDS } from "./types.ts";
import { PackageManagerDetector } from "./detector.ts";
import { logger } from "@/utils/logger.ts";
import { createSpinner } from "@/utils/spinner.ts";

export class PackageManagerExecutor {
  private pm: PackageManager | null = null;

  async execute(
    command: keyof typeof PM_COMMANDS.npm,
    args: string[] = [],
    options: { silent?: boolean } = {}
  ): Promise<void> {
    if (!this.pm) {
      this.pm = await PackageManagerDetector.detect();
    }

    const commandTemplate = PM_COMMANDS[this.pm][command];
    const fullCommand = `${commandTemplate} ${args.join(" ")}`.trim();

    logger.info(`Running: ${fullCommand}`);

    const spinner = createSpinner("Executing...");

    try {
      spinner.start();

      const [cmd, ...cmdArgs] = fullCommand.split(" ") as [string, ...string[]];
      const result = await execa(cmd, cmdArgs, {
        stdio: options.silent ? "pipe" : "inherit",
        cwd: process.cwd(),
      });

      spinner.succeed("Done!");

      if (options.silent && result.stdout) {
        console.log(result.stdout);
      }
    } catch (error: unknown) {
      spinner.fail("Command failed");
      throw error;
    }
  }

  async executeRaw(command: string, args: string[] = []): Promise<void> {
    logger.info(`Running: ${command} ${args.join(" ")}`);

    try {
      await execa(command, args, {
        stdio: "inherit",
        cwd: process.cwd(),
      });
    } catch (error) {
      throw error;
    }
  }

  getPackageManager(): string {
    return this.pm || "npm";
  }
}
