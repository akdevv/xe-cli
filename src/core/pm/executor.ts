import { execa } from "execa";
import inquirer from "inquirer";
import { type PackageManager, PM_COMMANDS } from "./types.ts";
import { PackageManagerDetector } from "./detector.ts";
import { logger } from "@/utils/logger.ts";

const PM_INSTALL_COMMANDS: Record<PackageManager, string | null> = {
  npm: null, // npm cannot be installed via npm
  pnpm: "npm install -g pnpm",
  yarn: "npm install -g yarn",
  bun: "npm install -g bun",
};

const PM_ALTERNATIVE_INSTALL: Record<PackageManager, string> = {
  npm: "Visit: https://nodejs.org/",
  pnpm: "Visit: https://pnpm.io/installation",
  yarn: "Visit: https://yarnpkg.com/getting-started/install",
  bun: "Or use: curl -fsSL https://bun.sh/install | bash",
};

/**
 * Check if a package manager is installed
 */
export async function isPackageManagerInstalled(
  pm: PackageManager
): Promise<boolean> {
  try {
    await execa(pm, ["--version"], { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Install a package manager globally using npm
 */
async function installPackageManager(pm: PackageManager): Promise<boolean> {
  const installCommand = PM_INSTALL_COMMANDS[pm];

  if (!installCommand) {
    return false;
  }

  logger.info(`\nInstalling ${pm} globally...`);

  try {
    const parts = installCommand.split(" ");
    const cmd = parts[0];
    const args = parts.slice(1);

    if (!cmd) {
      throw new Error("Invalid install command");
    }

    await execa(cmd, args, {
      stdio: "inherit",
      cwd: process.cwd(),
    });
    logger.success(`${pm} installed successfully!`);
    return true;
  } catch {
    logger.error(`Failed to install ${pm}`);
    logger.error("Installation failed.");
    return false;
  }
}

/**
 * Verify package manager is installed, offer to install if not
 */
export async function verifyPackageManagerInstalled(
  pm: PackageManager
): Promise<void> {
  const isInstalled = await isPackageManagerInstalled(pm);

  if (isInstalled) {
    return; // All good!
  }

  // Package manager is not installed
  logger.error(`Package manager '${pm}' is not installed on your system.`);

  // Special case: if npm is not installed, we can't help much
  if (pm === "npm") {
    logger.info("\nNode.js and npm are required to use xe-cli.");
    logger.info("Please install Node.js from: https://nodejs.org/");
    logger.info("npm is included with Node.js installation.");
    throw new Error("npm is not installed");
  }

  // Check if npm is available for installation
  const npmAvailable = await isPackageManagerInstalled("npm");

  if (!npmAvailable) {
    logger.error("\nnpm is also not installed on your system.");
    logger.info("Please install Node.js first: https://nodejs.org/");
    logger.info(`Then you can install ${pm} with: ${PM_INSTALL_COMMANDS[pm]}`);
    throw new Error("npm is required to install package managers");
  }

  // npm is available, offer to install the package manager
  logger.info(`\nWe can install ${pm} for you using npm.`);

  const { shouldInstall } = await inquirer.prompt([
    {
      type: "confirm",
      name: "shouldInstall",
      message: `Would you like to install ${pm} globally now?`,
      default: true,
    },
  ]);

  if (shouldInstall) {
    const installed = await installPackageManager(pm);

    if (!installed) {
      logger.info(`\nAlternatively: ${PM_ALTERNATIVE_INSTALL[pm]}`);
      throw new Error(`Failed to install ${pm}`);
    }
  } else {
    logger.info(
      `\nYou can install ${pm} later with: ${PM_INSTALL_COMMANDS[pm]}`
    );
    logger.info(PM_ALTERNATIVE_INSTALL[pm]);
    throw new Error(`${pm} is not installed`);
  }
}

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

    // Verify the package manager is installed
    await verifyPackageManagerInstalled(this.pm);

    const commandTemplate = PM_COMMANDS[this.pm][command];
    const fullCommand = `${commandTemplate} ${args.join(" ")}`.trim();

    logger.info(`Running: ${fullCommand}`);

    try {
      const [cmd, ...cmdArgs] = fullCommand.split(" ") as [string, ...string[]];
      const result = await execa(cmd, cmdArgs, {
        stdio: options.silent ? "pipe" : "inherit",
        cwd: process.cwd(),
      });
      logger.success("Done!");

      if (options.silent && result.stdout) {
        console.log(result.stdout);
      }
    } catch (error: unknown) {
      throw error;
    }
  }
}
