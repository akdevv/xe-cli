import { Command } from "commander";
import { logger } from "@/utils/logger.ts";
import chalk from "chalk";
import * as path from "path";
import * as fs from "fs";
import * as readline from "readline";

async function findNodeModules(dir: string): Promise<string[]> {
  const nodeModulesDirs: string[] = [];

  async function search(currentDir: string, depth: number = 0): Promise<void> {
    // Limit search depth to avoid going too deep
    if (depth > 10) return;

    try {
      const entries = await fs.promises.readdir(currentDir, {
        withFileTypes: true,
      });

      for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const fullPath = path.join(currentDir, entry.name);

        if (entry.name === "node_modules") {
          nodeModulesDirs.push(fullPath);
          // Don't search inside node_modules
          continue;
        }

        // Skip common directories that shouldn't be searched
        if (
          entry.name.startsWith(".") ||
          entry.name === "dist" ||
          entry.name === "build" ||
          entry.name === "coverage"
        ) {
          continue;
        }

        await search(fullPath, depth + 1);
      }
    } catch (error: any) {
      // Skip directories we can't read (permission issues, etc.)
      if (error.code !== "EACCES" && error.code !== "EPERM") {
        // Only log unexpected errors
        logger.debug(`Error reading ${currentDir}: ${error.message}`);
      }
    }
  }

  await search(dir);
  return nodeModulesDirs;
}

async function getDirectorySize(dir: string): Promise<number> {
  let totalSize = 0;

  async function calculateSize(currentPath: string): Promise<void> {
    try {
      const stats = await fs.promises.stat(currentPath);

      if (stats.isFile()) {
        totalSize += stats.size;
      } else if (stats.isDirectory()) {
        const entries = await fs.promises.readdir(currentPath, {
          withFileTypes: true,
        });

        // Process all entries in parallel for better performance
        await Promise.all(
          entries.map((entry) =>
            calculateSize(path.join(currentPath, entry.name))
          )
        );
      }
    } catch (error: any) {
      // Skip files/directories we can't read (permission issues, symlinks, etc.)
      // Common errors: EACCES (permission denied), EPERM (operation not permitted),
      // ENOENT (no such file), ELOOP (too many symbolic links)
      if (
        error.code !== "EACCES" &&
        error.code !== "EPERM" &&
        error.code !== "ENOENT" &&
        error.code !== "ELOOP"
      ) {
        // Only log unexpected errors
        logger.debug(`Error reading ${currentPath}: ${error.message}`);
      }
    }
  }

  try {
    await calculateSize(dir);
  } catch (error) {
    // Return 0 if we can't calculate the size
    return 0;
  }

  return totalSize;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

async function deleteDirectory(dir: string): Promise<void> {
  await fs.promises.rm(dir, { recursive: true, force: true });
}

export function nukeCommand(program: Command) {
  program
    .command("nuke")
    .description("Delete all node_modules directories in the current directory and subdirectories")
    .option("-y, --yes", "Skip confirmation prompt")
    .option("--dry-run", "Show what would be deleted without actually deleting")
    .action(async (options: { yes?: boolean; dryRun?: boolean }) => {
      try {
        const cwd = process.cwd();
        
        logger.info("Searching for node_modules directories...");
        const nodeModulesDirs = await findNodeModules(cwd);

        if (nodeModulesDirs.length === 0) {
          logger.info("No node_modules directories found.");
          return;
        }

        console.log(chalk.yellow(`\nFound ${nodeModulesDirs.length} node_modules director${nodeModulesDirs.length === 1 ? "y" : "ies"}:\n`));

        let totalSize = 0;
        for (const dir of nodeModulesDirs) {
          const relativePath = path.relative(cwd, dir);
          const size = await getDirectorySize(dir);
          totalSize += size;
          console.log(`  ${chalk.cyan(relativePath)} ${chalk.gray(`(${formatBytes(size)})`)}`);
        }

        console.log(chalk.yellow(`\nTotal size: ${formatBytes(totalSize)}\n`));

        if (options.dryRun) {
          logger.info("Dry run - no directories were deleted.");
          return;
        }

        if (!options.yes) {
          // Ask for confirmation
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });

          const answer = await new Promise<string>((resolve) => {
            rl.question(
              chalk.red("Are you sure you want to delete all these directories? (y/N) "),
              resolve
            );
          });
          rl.close();

          if (answer.toLowerCase() !== "y" && answer.toLowerCase() !== "yes") {
            logger.info("Operation cancelled.");
            return;
          }
        }

        logger.info("Deleting node_modules directories...");
        
        let deletedCount = 0;
        for (const dir of nodeModulesDirs) {
          try {
            await deleteDirectory(dir);
            const relativePath = path.relative(cwd, dir);
            console.log(chalk.green(`  ✓ Deleted ${relativePath}`));
            deletedCount++;
          } catch (error: any) {
            const relativePath = path.relative(cwd, dir);
            logger.error(`Failed to delete ${relativePath}: ${error.message}`);
          }
        }

        logger.success(`\nDeleted ${deletedCount} of ${nodeModulesDirs.length} node_modules directories, freed ${formatBytes(totalSize)}`);
      } catch (error) {
        logger.error("Nuke failed:", error);
        process.exit(1);
      }
    });
}

