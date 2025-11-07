import { Command } from "commander";
import { execa } from "execa";
import { logger } from "@/utils/logger.ts";

export function registerDockerCommands(program: Command): void {
  const docker = program
    .command("docker")
    .alias("dk")
    .description("Docker commands")
    .allowUnknownOption(true);

  docker
    .command("up")
    .description("Start docker containers (docker-compose up -d)")
    .action(async () => {
      try {
        logger.info("Starting containers...");
        await execa("docker-compose", ["up", "-d"], { stdio: "inherit" });
        logger.success("Containers started!");
      } catch (error) {
        logger.error("Docker up failed:", error);
        process.exit(1);
      }
    });

  docker
    .command("down")
    .description("Stop docker containers")
    .action(async () => {
      try {
        logger.info("Stopping containers...");
        await execa("docker-compose", ["down"], { stdio: "inherit" });
        logger.success("Containers stopped!");
      } catch (error) {
        logger.error("Docker down failed:", error);
        process.exit(1);
      }
    });

  docker
    .command("restart")
    .description("Restart docker containers")
    .action(async () => {
      try {
        logger.info("Restarting containers...");
        await execa("docker-compose", ["restart"], { stdio: "inherit" });
        logger.success("Containers restarted!");
      } catch (error) {
        logger.error("Docker restart failed:", error);
        process.exit(1);
      }
    });

  docker
    .command("logs [service]")
    .description("Show container logs")
    .option("-f, --follow", "Follow log output")
    .action(
      async (service: string | undefined, options: { follow?: boolean }) => {
        try {
          const args = ["logs"];
          if (options.follow) args.push("-f");
          if (service) args.push(service);

          await execa("docker-compose", args, { stdio: "inherit" });
        } catch (error) {
          logger.error("Docker logs failed:", error);
          process.exit(1);
        }
      }
    );

  docker
    .command("ps")
    .description("List running containers")
    .action(async () => {
      try {
        await execa("docker", ["ps"], { stdio: "inherit" });
      } catch (error) {
        logger.error("Docker ps failed:", error);
        process.exit(1);
      }
    });

  docker
    .command("build")
    .description("Build docker images")
    .action(async () => {
      try {
        logger.info("Building images...");
        await execa("docker-compose", ["build"], { stdio: "inherit" });
        logger.success("Images built!");
      } catch (error) {
        logger.error("Docker build failed:", error);
        process.exit(1);
      }
    });

  docker
    .command("stop [service]")
    .description("Stop containers without removing them")
    .action(async (service: string | undefined) => {
      try {
        logger.info("Stopping containers...");
        const args = ["stop"];
        if (service) args.push(service);
        await execa("docker-compose", args, { stdio: "inherit" });
        logger.success("Containers stopped!");
      } catch (error) {
        logger.error("Docker stop failed:", error);
        process.exit(1);
      }
    });

  docker
    .command("start [service]")
    .description("Start stopped containers")
    .action(async (service: string | undefined) => {
      try {
        logger.info("Starting containers...");
        const args = ["start"];
        if (service) args.push(service);
        await execa("docker-compose", args, { stdio: "inherit" });
        logger.success("Containers started!");
      } catch (error) {
        logger.error("Docker start failed:", error);
        process.exit(1);
      }
    });

  docker
    .command("exec <service> <command...>")
    .description("Execute a command in a running container")
    .option("--no-it", "Disable interactive terminal (default: enabled)")
    .action(
      async (
        service: string,
        command: string[],
        options: { it?: boolean }
      ) => {
        try {
          const args = ["exec"];
          // Add -it by default for interactive sessions
          if (options.it !== false) {
            args.push("-it");
          }
          args.push(service, ...command);

          await execa("docker-compose", args, { stdio: "inherit" });
        } catch (error) {
          logger.error("Docker exec failed:", error);
          process.exit(1);
        }
      }
    );

  docker
    .command("prune")
    .description("Remove unused docker resources")
    .option("-a, --all", "Remove all unused images, not just dangling ones")
    .option("-v, --volumes", "Prune volumes as well")
    .action(async (options: { all?: boolean; volumes?: boolean }) => {
      try {
        logger.info("Pruning docker resources...");

        // Prune containers, networks, images
        const systemArgs = ["system", "prune", "-f"];
        if (options.all) systemArgs.push("-a");
        if (options.volumes) systemArgs.push("--volumes");

        await execa("docker", systemArgs, { stdio: "inherit" });
        logger.success("Docker resources pruned!");
      } catch (error) {
        logger.error("Docker prune failed:", error);
        process.exit(1);
      }
    });

  // Catch-all for any other docker commands (passthrough)
  docker
    .command("* [args...]", { hidden: true })
    .allowUnknownOption(true)
    .action(async (commandName: string, args: string[] = []) => {
      try {
        // Pass through to native docker command
        const dockerArgs = [commandName, ...args];
        logger.debug(`Executing: docker ${dockerArgs.join(" ")}`);

        await execa("docker", dockerArgs, {
          stdio: "inherit",
        });
      } catch (error) {
        logger.error("Docker command failed:", error);
        process.exit(1);
      }
    });
}
