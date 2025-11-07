import { Command } from "commander";
import { initCommand } from "./commands/init.ts";
import { addCommand } from "./commands/add.ts";
import { removeCommand } from "./commands/remove.ts";

export function registerShadcnCommands(program: Command): void {
  const shadcn = program.command("shadcn").description("Shadcn UI commands");
  initCommand(shadcn);
  addCommand(shadcn);
  removeCommand(shadcn);
}
