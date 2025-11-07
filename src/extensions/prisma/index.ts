import { Command } from "commander";
import { execa } from "execa";
import { logger } from "@/utils/logger.ts";

export function registerPrismaCommands(program: Command): void {
  const prisma = program
    .command("prisma [subcommand...]")
    .description("Prisma commands")
    .allowUnknownOption(true);

  // Default action when no subcommand is provided
  // Runs: generate, db pull, db push
  prisma.action(async (subcommand?: string[]) => {
    // If a subcommand is provided, it means we're in the catch-all case
    if (subcommand && subcommand.length > 0) {
      return; // Let the catch-all handle it
    }

    try {
      logger.info("Running Prisma workflow (generate → pull → push)...");

      logger.info("Step 1/3: Generating Prisma Client...");
      await execa("npx", ["prisma", "generate"], { stdio: "inherit" });
      logger.success("✓ Prisma Client generated!");

      logger.info("Step 2/3: Pulling schema from database...");
      await execa("npx", ["prisma", "db", "pull"], { stdio: "inherit" });
      logger.success("✓ Schema pulled!");

      logger.info("Step 3/3: Pushing schema to database...");
      await execa("npx", ["prisma", "db", "push"], { stdio: "inherit" });
      logger.success("✓ Schema pushed!");

      logger.success("Prisma workflow completed!");
    } catch (error) {
      logger.error("Prisma workflow failed:", error);
      process.exit(1);
    }
  });

  prisma
    .command("generate")
    .alias("gen")
    .description("Generate Prisma Client")
    .action(async () => {
      try {
        logger.info("Generating Prisma Client...");
        await execa("npx", ["prisma", "generate"], { stdio: "inherit" });
        logger.success("Prisma Client generated!");
      } catch (error) {
        logger.error("Prisma generate failed:", error);
        process.exit(1);
      }
    });

  prisma
    .command("migrate [subcommand...]")
    .description("Run database migrations")
    .option("-n, --name <name>", "Migration name")
    .allowUnknownOption(true)
    .action(async (subcommand: string[] | undefined, options: { name?: string }) => {
      try {
        // If subcommand is provided, pass it through
        if (subcommand && subcommand.length > 0) {
          const args = ["prisma", "migrate", ...subcommand];
          logger.debug(`Executing: npx ${args.join(" ")}`);
          await execa("npx", args, { stdio: "inherit" });
        } else {
          // Default: run migrate dev
          logger.info("Running migrations...");
          const args = ["prisma", "migrate", "dev"];
          if (options.name) {
            args.push("--name", options.name);
          }
          await execa("npx", args, { stdio: "inherit" });
          logger.success("Migrations completed!");
        }
      } catch (error) {
        logger.error("Prisma migrate failed:", error);
        process.exit(1);
      }
    });

  prisma
    .command("studio")
    .description("Open Prisma Studio")
    .action(async () => {
      try {
        logger.info("Opening Prisma Studio...");
        await execa("npx", ["prisma", "studio"], { stdio: "inherit" });
      } catch (error) {
        logger.error("Prisma studio failed:", error);
        process.exit(1);
      }
    });

  prisma
    .command("push")
    .description("Push schema changes to database (db push)")
    .action(async () => {
      try {
        logger.info("Pushing schema...");
        await execa("npx", ["prisma", "db", "push"], { stdio: "inherit" });
        logger.success("Schema pushed!");
      } catch (error) {
        logger.error("Prisma push failed:", error);
        process.exit(1);
      }
    });

  prisma
    .command("pull")
    .description("Pull schema from database (db pull / introspection)")
    .action(async () => {
      try {
        logger.info("Pulling schema from database...");
        await execa("npx", ["prisma", "db", "pull"], { stdio: "inherit" });
        logger.success("Schema pulled!");
      } catch (error) {
        logger.error("Prisma pull failed:", error);
        process.exit(1);
      }
    });

  // Catch-all for any other prisma commands (passthrough)
  prisma
    .command("* [args...]", { hidden: true })
    .allowUnknownOption(true)
    .action(async (commandName: string, args: string[] = []) => {
      try {
        // Pass through to npx prisma
        const prismaArgs = ["prisma", commandName, ...args];
        logger.debug(`Executing: npx ${prismaArgs.join(" ")}`);

        await execa("npx", prismaArgs, {
          stdio: "inherit",
        });
      } catch (error) {
        logger.error("Prisma command failed:", error);
        process.exit(1);
      }
    });
}
