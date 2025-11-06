import { Command } from "commander";
import { listAvailableScripts } from "../runner.ts";

export function listScriptsCommand(program: Command): void {
  program
    .command("scripts")
    .alias("ls")
    .description("List all available scripts from package.json")
    .action(async () => {
      await listAvailableScripts();
    });
}
