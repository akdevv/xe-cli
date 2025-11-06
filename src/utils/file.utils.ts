import * as path from "path";
import * as fs from "fs-extra";

export async function fileExists(filePath: string): Promise<boolean> {
  return fs.pathExists(filePath);
}

export async function readJsonFile<T>(filePath: string): Promise<T> {
  return fs.readJson(filePath);
}

export async function writeJsonFile(
  filePath: string,
  data: any
): Promise<void> {
  await fs.writeJSON(filePath, data, { spaces: 2 });
}

export async function findFileUpwards(
  fileName: string,
  startDir: string = process.cwd()
): Promise<string | null> {
  let currentDir = startDir;

  while (true) {
    const filePath = path.join(currentDir, fileName);

    if (await fileExists(filePath)) {
      return filePath;
    }

    const parentDir = path.dirname(currentDir);

    // Reached root
    if (parentDir === currentDir) {
      return null;
    }

    currentDir = parentDir;
  }
}

export async function ensureDir(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath);
}

export async function copyFile(src: string, dest: string): Promise<void> {
  await fs.copy(src, dest);
}

export async function removeFile(filePath: string): Promise<void> {
  await fs.remove(filePath);
}
