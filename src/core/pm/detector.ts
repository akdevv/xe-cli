import * as path from "path";
import { promises as fs } from "fs";
import { pathExists } from "fs-extra";
import { execa } from "execa";
import { logger } from "@/utils/logger.ts";
import { LOCK_FILES, type PackageManager } from "./types.ts";

export class PackageManagerDetector {
  private static detectedPM: PackageManager | null = null;

  static async detect(): Promise<PackageManager> {
    if (this.detectedPM) return this.detectedPM;

    // Startergy 1: Check for lock files
    const pmFromLockFile = await this.detectFromLockFile();
    if (pmFromLockFile) {
      this.detectedPM = pmFromLockFile;
      logger.debug(`Detected ${pmFromLockFile} from lock file`);
      return pmFromLockFile;
    }

    // Strategy 2: Check package.json packageManager field
    const pmFromPackageJson = await this.detectFromPackageJson();
    if (pmFromPackageJson) {
      this.detectedPM = pmFromPackageJson;
      logger.debug(`Detected ${pmFromPackageJson} from package.json`);
      return pmFromPackageJson;
    }

    // Strategy 3: Check which PM binaries are available
    const pmFromBinary = await this.detectFromBinary();
    if (pmFromBinary) {
      this.detectedPM = pmFromBinary;
      logger.debug(`Detected ${pmFromBinary} from available binary`);
      return pmFromBinary;
    }

    // Default to npm
    this.detectedPM = "npm";
    logger.debug("Defaulting to npm");
    return "npm";
  }

  private static async detectFromLockFile(): Promise<PackageManager | null> {
    const cwd = process.cwd();

    for (const [pm, lockFile] of Object.entries(LOCK_FILES)) {
      const lockFilePath = path.join(cwd, lockFile);
      if (await pathExists(lockFilePath)) {
        return pm as PackageManager;
      }
    }

    return null;
  }

  private static async detectFromPackageJson(): Promise<PackageManager | null> {
    const packageJsonPath = path.join(process.cwd(), "package.json");

    if (!(await pathExists(packageJsonPath))) {
      return null;
    }

    try {
      const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");
      const packageJson = JSON.parse(packageJsonContent);
      const packageManager = packageJson.packageManager;

      if (packageManager) {
        // Format: "pnpm@8.0.0" or "npm@9.0.0"
        const pmName = packageManager.split("@")[0];
        if (["npm", "pnpm", "yarn", "bun"].includes(pmName)) {
          return pmName as PackageManager;
        }
      }
    } catch (error) {
      logger.debug("Error reading package.json:", error);
    }

    return null;
  }

  private static async detectFromBinary(): Promise<PackageManager | null> {
    const managers: PackageManager[] = ["bun", "pnpm", "yarn", "npm"];

    for (const pm of managers) {
      try {
        await execa(pm, ["--version"]);
        return pm;
      } catch {
        // Binary not available
      }
    }

    return null;
  }

  static reset(): void {
    this.detectedPM = null;
  }
}
